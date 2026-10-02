#!/usr/bin/env python3
"""
voiceover.py - local text-to-speech for the it-howto-animation skill (Kokoro).

Reads the Time + Narration columns of script.md, generates one clip per scene,
fits each clip to its scene slot, builds a timed narration track, writes captions,
and muxes the audio into a rendered video. Runs entirely on this machine.

Commands (run from the project folder; work files go in ./voiceover/):
  doctor                       check Python, Kokoro, ffmpeg; print exact fixes
  check                        no-audio pre-flight: estimate which scenes will not fit
  audition --text "..."        render one sentence in several voices to compare
  generate                     synthesize, fit, build narration.wav + captions.srt + report.json
  mux --video in.mp4 --out out.mp4   add narration (loudness-normalized) to a video, video stream copied

Exit codes: 0 ok, 1 setup/usage error, 2 one or more scenes do not fit their slot.
Needs: Python 3.10+, numpy, ffmpeg/ffprobe on PATH; for speech: `pip install "kokoro>=0.9.4"`.
"""
import argparse
import hashlib
import json
import math
import platform
import re
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 24000  # Kokoro output sample rate
SENT_SPLIT = r"(?<=[.!?])\s+"

DEFAULT_CFG = {
    "engine": "kokoro",       # "kokoro" (speech) or "dummy" (tones, for testing the pipeline only)
    "voice": "af_heart",      # Kokoro voice id; first letter picks the accent: a = American, b = British
    "speed": 1.0,             # base speaking speed
    "max_speed": 1.08,        # never speed a line up beyond this to make it fit
    "lead_in": 0.3,           # seconds of silence before narration starts in each scene
    "min_tail": 0.4,          # narration must end at least this long before the scene ends (hard limit)
    "target_hold": 1.5,       # preferred still time after narration (skill rule: 1.5 s hold)
    "sentence_gap": 0.25,     # pause between sentences inside one scene
    "loudness_lufs": -16,
    "true_peak": -1.5,
}

# Starting points only. Verify each by ear with `audition`, then edit voiceover/lexicon.json.
DEFAULT_LEXICON = {
    "_note": "word -> how to spell it so the voice says it right. Keys starting with _ are ignored.",
    "FIDO": "Fie-doh",
    "Entra": "En-truh",
    "MFA": "M F A",
    "SSO": "S S O",
}


# ---------------------------------------------------------------- helpers
def die(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def need_tool(name):
    if not shutil.which(name):
        die(f"`{name}` not found on PATH. {install_hint('ffmpeg')}")


def install_hint(what):
    os_name = platform.system()
    if what == "ffmpeg":
        return {
            "Windows": "Install: winget install Gyan.FFmpeg  (then open a new terminal)",
            "Darwin": "Install: brew install ffmpeg",
        }.get(os_name, "Install: sudo apt install ffmpeg")
    if what == "espeak":
        return {
            "Windows": "Install: winget install eSpeak-NG.eSpeak-NG",
            "Darwin": "Install: brew install espeak-ng",
        }.get(os_name, "Install: sudo apt install espeak-ng")
    return ""


def fmt_srt(t):
    t = max(0.0, t)
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def to_sec(m, s, frac):
    return int(m) * 60 + int(s) + (float("0." + frac) if frac else 0.0)


def paths(project):
    base = Path(project).resolve() / "voiceover"
    return {
        "base": base,
        "cache": base / "cache",
        "cfg": base / "voice.json",
        "lex": base / "lexicon.json",
        "wav": base / "narration.wav",
        "srt": base / "captions.srt",
        "report": base / "report.json",
        "audition": base / "audition",
    }


def load_cfg(p, engine_override=None):
    p["base"].mkdir(parents=True, exist_ok=True)
    if not p["cfg"].exists():
        p["cfg"].write_text(json.dumps(DEFAULT_CFG, indent=2), encoding="utf-8")
        print(f"Created {p['cfg']} with defaults.")
    if not p["lex"].exists():
        p["lex"].write_text(json.dumps(DEFAULT_LEXICON, indent=2), encoding="utf-8")
        print(f"Created {p['lex']} with starter pronunciations (verify by ear).")
    cfg = dict(DEFAULT_CFG)
    cfg.update(json.loads(p["cfg"].read_text(encoding="utf-8")))
    if engine_override:
        cfg["engine"] = engine_override
    lex = json.loads(p["lex"].read_text(encoding="utf-8"))
    lex = {k: v for k, v in lex.items() if not k.startswith("_")}
    return cfg, lex


# ---------------------------------------------------------------- script.md parsing
TIME_RE = re.compile(
    r"(\d+):(\d{2})(?:\.(\d+))?\s*[\u2013\u2014-]\s*(\d+):(\d{2})(?:\.(\d+))?"
)


SCENE_ID_RE = re.compile(r"S?\d+[a-z]?(?:\s*[–—-]\s*S?\d+[a-z]?)?", re.I)


def safe_id(sid):
    """Scene id for file names: 'S14–S15' -> 'S14-S15', '3' -> '03'."""
    s = re.sub(r"[^A-Za-z0-9]+", "-", str(sid)).strip("-")
    return s.zfill(2) if s.isdigit() else s


def clean_narration(cell):
    t = re.sub(r"<br\s*/?>", " ", cell, flags=re.I)
    t = re.sub(r"\*+|`", "", t)  # drop markdown bold/italic/code marks
    t = " ".join(t.split())
    if t.lower() in {"", "-", "\u2014", "\u2013", "(none)", "none", "n/a"}:
        return ""
    pairs = [('"', '"'), ("\u201c", "\u201d")]
    for a, b in pairs:
        if len(t) >= 2 and t.startswith(a) and t.endswith(b):
            t = t[1:-1].strip()
            break
    return t


def parse_script(path):
    if not Path(path).exists():
        die(f"{path} not found. Run from the project folder or pass --script.")
    scenes = []
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s.startswith("|"):
            continue
        cells = [c.strip() for c in s.strip("|").split("|")]
        # scene id: plain number (1, 2) or storyboard shot id (S01, S11b, S14-S15 / S14–S15)
        if len(cells) < 4 or not SCENE_ID_RE.fullmatch(cells[0]):
            continue  # header, separator, or non-scene row
        m = TIME_RE.search(cells[1])
        if not m:
            die(f"Row {cells[0]}: cannot read time range '{cells[1]}' (expected m:ss\u2013m:ss).")
        start = to_sec(*m.group(1, 2, 3))
        end = to_sec(*m.group(4, 5, 6))
        if end <= start:
            die(f"Row {cells[0]}: end time is not after start time.")
        scenes.append({
            "id": cells[0], "start": start, "end": end, "slot": end - start,
            "on_screen": cells[2], "text": clean_narration(cells[3]),
        })
    if not scenes:
        die("No scene rows found in script.md (expected the table format from the skill).")
    return scenes


def apply_lexicon(text, lex):
    for word in sorted(lex, key=len, reverse=True):
        text = re.sub(rf"\b{re.escape(word)}\b", lex[word], text, flags=re.I)
    return text


# ---------------------------------------------------------------- engines
class DummyEngine:
    """Tones, not speech. Only for testing the pipeline."""
    def synth(self, text, voice, speed):
        segs = []
        for sent in re.split(SENT_SPLIT, text.strip()):
            if not sent:
                continue
            dur = max(0.4, len(sent.split()) / (2.6 * speed))
            t = np.arange(int(dur * SR)) / SR
            segs.append((sent, (0.08 * np.sin(2 * np.pi * 220 * t)).astype(np.float32)))
        return segs


class KokoroEngine:
    def __init__(self):
        try:
            from kokoro import KPipeline  # noqa
        except Exception as e:  # ImportError or a broken torch install
            die(
                f"Kokoro is not available ({e.__class__.__name__}: {e}).\n"
                '  Fix:  pip install "kokoro>=0.9.4"   (inside a Python 3.10-3.12 venv)\n'
                "  Then run:  python scripts/voiceover.py doctor\n"
                "  Not falling back to another voice engine."
            )
        self._KPipeline = KPipeline
        self._pipes = {}

    def _pipe(self, voice):
        lang = voice[0]
        if lang not in self._pipes:
            self._pipes[lang] = self._KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
        return self._pipes[lang]

    def synth(self, text, voice, speed):
        segs = []
        for gs, _ps, audio in self._pipe(voice)(text, voice=voice, speed=speed, split_pattern=SENT_SPLIT):
            if audio is None:
                continue
            a = audio.detach().cpu().numpy() if hasattr(audio, "detach") else np.asarray(audio)
            segs.append((gs, a.astype(np.float32)))
        if not segs:
            die(f"Kokoro returned no audio for: {text[:60]!r}")
        return segs


class ClipsEngine:
    """Pre-rendered clips (e.g. ElevenLabs), one mp3/wav per scene in cfg['clips_dir'] named by safe_id(scene).
    The scene id is passed through make_clip; text is ignored. Returns the whole clip as one segment
    (captions then split sentences by character count)."""
    def __init__(self, cfg):
        self.dir = Path(cfg["clips_dir"])
        self.sid = None

    def synth(self, text, voice, speed):
        for ext in (".mp3", ".wav"):
            f = self.dir / f"{safe_id(self.sid)}{ext}"
            if f.exists():
                r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                                   capture_output=True)
                a = np.frombuffer(r.stdout, dtype=np.int16).astype(np.float32) / 32767
                return [(text, a)]
        die(f"No clip for scene {self.sid} in {self.dir}")


def get_engine(cfg):
    if cfg["engine"] == "clips":
        return ClipsEngine(cfg)
    if cfg["engine"] == "dummy":
        return DummyEngine()
    if cfg["engine"] == "kokoro":
        return KokoroEngine()
    die(f"Unknown engine '{cfg['engine']}' in voice.json (use 'kokoro').")


# ---------------------------------------------------------------- wav io + clips
def write_wav(path, audio):
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def read_wav(path):
    with wave.open(str(path), "rb") as w:
        pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return pcm.astype(np.float32) / 32767


def make_clip(engine, spoken, voice, speed, cfg, cache, sid, force=False):
    if isinstance(engine, ClipsEngine):
        engine.sid = sid
    key = hashlib.sha1(json.dumps([cfg["engine"], voice, round(speed, 3), cfg["sentence_gap"], spoken, cfg.get("clips_dir")]).encode()).hexdigest()[:12]
    wav, meta = cache / f"{safe_id(sid)}_{key}.wav", cache / f"{safe_id(sid)}_{key}.json"
    if wav.exists() and meta.exists() and not force:
        m = json.loads(meta.read_text(encoding="utf-8"))
        return wav, m["dur"], m["segs"], True
    cache.mkdir(parents=True, exist_ok=True)
    gap = np.zeros(int(cfg["sentence_gap"] * SR), np.float32)
    parts, segs, t = [], [], 0.0
    for i, (stext, a) in enumerate(engine.synth(spoken, voice, speed)):
        if i:
            parts.append(gap)
            t += len(gap) / SR
        parts.append(a)
        segs.append({"start": t, "end": t + len(a) / SR})
        t += len(a) / SR
    audio = np.concatenate(parts)
    ramp = int(0.008 * SR)  # 8 ms fades remove clicks at clip edges
    audio[:ramp] *= np.linspace(0, 1, ramp)
    audio[-ramp:] *= np.linspace(1, 0, ramp)
    write_wav(wav, audio)
    dur = len(audio) / SR
    meta.write_text(json.dumps({"dur": dur, "segs": segs}), encoding="utf-8")
    return wav, dur, segs, False


# ---------------------------------------------------------------- fitting
def classify(slot, clip, cfg):
    avail = slot - cfg["lead_in"] - cfg["min_tail"]
    hold = slot - cfg["lead_in"] - clip
    if clip > avail:
        return "overrun", hold
    if hold < cfg["target_hold"]:
        return "tight", hold
    return "ok", hold


def needed_slot(clip, cfg):
    return math.ceil((cfg["lead_in"] + clip + cfg["target_hold"]) * 10) / 10


def print_report(rows, cfg):
    print(f"\n{'#':>7} {'slot':>6} {'voice':>6} {'hold':>6} {'speed':>5}  status")
    for r in rows:
        if r["status"] == "silent":
            print(f"{r['id']:>7} {r['slot']:>5.1f}s {'-':>6} {'-':>6} {'-':>5}  silent (no narration)")
            continue
        extra = ""
        if r["status"] in ("overrun", "tight"):
            extra = f"  -> give this scene >= {r['needed_slot']:.1f}s (now {r['slot']:.1f}s)"
        print(f"{r['id']:>7} {r['slot']:>5.1f}s {r['clip']:>5.1f}s {r['hold']:>5.1f}s {r['speed']:>5.2f}  {r['status'].upper()}{extra}")
    n = lambda s: sum(r["status"] == s for r in rows)
    print(f"\n{n('ok')} ok, {n('tight')} tight (hold < {cfg['target_hold']}s), {n('overrun')} overrun, {n('silent')} silent")


# ---------------------------------------------------------------- commands
def cmd_doctor(a):
    ok = True
    v = sys.version_info
    print(f"Python {v.major}.{v.minor}.{v.micro} on {platform.system()}")
    if not (3, 10) <= (v.major, v.minor) <= (3, 12):
        print("  WARN: Kokoro currently targets Python 3.10-3.12. If install fails, make a venv with one of those.")
    for tool in ("ffmpeg", "ffprobe"):
        if shutil.which(tool):
            print(f"  ok   {tool}")
        else:
            ok = False
            print(f"  FAIL {tool} missing. {install_hint('ffmpeg')}")
    try:
        import kokoro  # noqa
        print("  ok   kokoro importable")
    except Exception as e:
        ok = False
        print(f'  FAIL kokoro not importable ({e.__class__.__name__}). Fix: pip install "kokoro>=0.9.4"')
    if shutil.which("espeak-ng"):
        print("  ok   espeak-ng")
    else:
        print(f"  note espeak-ng not on PATH. Often not needed with current Kokoro; if synthesis errors mention espeak: {install_hint('espeak')}")
    print("\nFirst synthesis downloads the model (~330 MB) from Hugging Face once; after that it runs offline.")
    sys.exit(0 if ok else 1)


def cmd_check(a):
    p = paths(a.project)
    cfg, _ = load_cfg(p, a.engine)
    rows = []
    for s in parse_script(a.script):
        if not s["text"]:
            rows.append({**s, "status": "silent"})
            continue
        clip = len(s["text"].split()) / 150 * 60  # skill's pacing rule: ~150 wpm
        status, hold = classify(s["slot"], clip, cfg)
        rows.append({**s, "clip": clip, "hold": hold, "speed": cfg["speed"], "status": status, "needed_slot": needed_slot(clip, cfg)})
    print("Estimate from word count at 150 wpm (not real audio):")
    print_report(rows, cfg)
    sys.exit(2 if any(r["status"] == "overrun" for r in rows) else 0)


def cmd_audition(a):
    p = paths(a.project)
    cfg, lex = load_cfg(p, a.engine)
    eng = get_engine(cfg)
    p["audition"].mkdir(parents=True, exist_ok=True)
    text = apply_lexicon(a.text, lex)
    for v in a.voices.split(","):
        v = v.strip()
        audio = np.concatenate([x for _, x in eng.synth(text, v, cfg["speed"])])
        out = p["audition"] / f"{v}.wav"
        write_wav(out, audio)
        print(f"wrote {out}")


def cmd_generate(a):
    p = paths(a.project)
    cfg, lex = load_cfg(p, a.engine)
    scenes = parse_script(a.script)
    eng = get_engine(cfg)
    voice = a.voice or cfg["voice"]
    rows = []
    for s in scenes:
        if not s["text"]:
            rows.append({**s, "status": "silent"})
            continue
        spoken = apply_lexicon(s["text"], lex)
        speed = cfg["speed"]
        wav, dur, segs, cached = make_clip(eng, spoken, voice, speed, cfg, p["cache"], s["id"], a.force)
        avail = s["slot"] - cfg["lead_in"] - cfg["min_tail"]
        for _ in range(3):  # gently speed up only if the line does not fit
            if dur <= avail:
                break
            target = min(cfg["max_speed"], math.ceil(speed * dur / avail * 100) / 100)
            if target <= speed + 1e-9:
                break
            speed = target
            wav, dur, segs, cached = make_clip(eng, spoken, voice, speed, cfg, p["cache"], s["id"], a.force)
        status, hold = classify(s["slot"], dur, cfg)
        rows.append({**s, "clip": dur, "hold": hold, "speed": speed, "status": status, "wav": str(wav),
                     "segs": segs, "needed_slot": needed_slot(dur, cfg), "cached": cached})
        print(f"  scene {s['id']:>2}: {dur:4.1f}s {'(cached)' if cached else ''}")
    print_report(rows, cfg)

    p["report"].write_text(json.dumps({"voice": voice, "config": cfg,
        "scenes": [{k: v for k, v in r.items() if k != "segs"} for r in rows]}, indent=2), encoding="utf-8")
    over = [r for r in rows if r["status"] == "overrun"]
    if over and not a.allow_overrun:
        print("\nNot building narration.wav / captions.srt: some lines do not fit. "
              "Lengthen those scenes (and update script.md times) or get approval to trim the lines, then rerun. "
              "Use --allow-overrun only for a rough listen.")
        sys.exit(2)

    # timeline: place each clip at slot start + lead_in; never overlap the previous clip
    end_of_all = max(r["end"] for r in rows)
    buf = np.zeros(int((end_of_all + 2) * SR), np.float32)
    cues, cursor = [], 0.0
    for r in rows:
        if r["status"] == "silent":
            continue
        t0 = max(r["start"] + cfg["lead_in"], cursor)
        if t0 > r["start"] + cfg["lead_in"] + 0.01:
            print(f"  WARN scene {r['id']}: pushed {t0 - r['start'] - cfg['lead_in']:.1f}s late by the previous line")
        audio = read_wav(r["wav"])
        i0 = int(t0 * SR)
        if i0 + len(audio) > len(buf):
            buf = np.concatenate([buf, np.zeros(i0 + len(audio) - len(buf), np.float32)])
        buf[i0:i0 + len(audio)] += audio
        cursor = t0 + len(audio) / SR + 0.15
        # captions use the ORIGINAL text (not respelled), timed from the engine's sentence segments
        sents = [x for x in re.split(SENT_SPLIT, r["text"].strip()) if x]
        segs = r["segs"]
        if len(segs) != len(sents):  # engine split differently: spread by character count
            tot = sum(len(x) for x in sents)
            acc, segs = 0.0, []
            for x in sents:
                d = r["clip"] * len(x) / tot
                segs.append({"start": acc, "end": acc + d})
                acc += d
        for sent, sg in zip(sents, segs):
            cues.append((t0 + sg["start"], t0 + sg["end"], sent))
    write_wav(p["wav"], buf[: int(math.ceil(cursor + 0.5) * SR)])

    out_cues = []
    for s0, s1, txt in cues:
        wrapped, line = [], ""
        for w in txt.split():
            if len(line) + len(w) + 1 > 42 and line:
                wrapped.append(line)
                line = w
            else:
                line = f"{line} {w}".strip()
        wrapped.append(line)
        groups = [wrapped[i:i + 2] for i in range(0, len(wrapped), 2)]  # max 2 lines per cue
        total_chars = sum(len(" ".join(g)) for g in groups)
        t = s0
        for g in groups:
            d = (s1 - s0) * len(" ".join(g)) / total_chars
            out_cues.append((t, t + d, "\n".join(g)))
            t += d
    lines = [f"{n}\n{fmt_srt(c0)} --> {fmt_srt(c1)}\n{body}\n" for n, (c0, c1, body) in enumerate(out_cues, 1)]
    p["srt"].write_text("\n".join(lines), encoding="utf-8")
    print(f"\nwrote {p['wav']}\nwrote {p['srt']}\nwrote {p['report']}")
    sys.exit(0)


def probe_duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def cmd_mux(a):
    need_tool("ffmpeg")
    need_tool("ffprobe")
    p = paths(a.project)
    cfg, _ = load_cfg(p, a.engine)
    if not p["wav"].exists():
        die("voiceover/narration.wav not found. Run `generate` first (it must finish without overruns).")
    if not Path(a.video).exists():
        die(f"{a.video} not found.")
    vd, ad = probe_duration(a.video), probe_duration(p["wav"])
    if ad > vd + 0.5:
        print(f"WARN: narration track ({ad:.1f}s) runs past the end of the video ({vd:.1f}s) and will be cut off. "
              "Check that script.md times match this video.")
    af = f"loudnorm=I={cfg['loudness_lufs']}:TP={cfg['true_peak']}:LRA=11,apad"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", a.video, "-i", str(p["wav"]),
           "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-af", af, "-ar", "48000", "-ac", "2",
           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", a.out]
    if subprocess.run(cmd).returncode != 0:
        die("ffmpeg failed (see message above).")
    print(f"wrote {a.out}  (video {vd:.2f}s -> output {probe_duration(a.out):.2f}s)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", default=".", help="project folder (default: current)")
    ap.add_argument("--script", default="script.md")
    ap.add_argument("--engine", help="override engine in voice.json (kokoro | dummy)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("doctor").set_defaults(fn=cmd_doctor)
    sub.add_parser("check").set_defaults(fn=cmd_check)
    s = sub.add_parser("audition")
    s.add_argument("--text", required=True)
    s.add_argument("--voices", default="af_heart,af_bella,am_michael,bf_emma,bm_george")
    s.set_defaults(fn=cmd_audition)
    s = sub.add_parser("generate")
    s.add_argument("--voice")
    s.add_argument("--force", action="store_true", help="ignore cached clips")
    s.add_argument("--allow-overrun", action="store_true", help="build the track even if lines overrun (rough listen only)")
    s.set_defaults(fn=cmd_generate)
    s = sub.add_parser("mux")
    s.add_argument("--video", required=True)
    s.add_argument("--out", required=True)
    s.set_defaults(fn=cmd_mux)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
