#!/usr/bin/env python3
"""
retime.py - make a silent draft fit its real narration by HOLDING frames (never by speeding the voice).

Reads script.md (scene rows) + voiceover/report.json (real clip lengths from `voiceover.py generate --allow-overrun`).
For every scene whose slot is shorter than lead_in + clip + target_hold, it inserts a freeze-frame of the missing time
at a "hold point" inside that scene (default: 1.2 s before the scene ends; override per scene with --hold S06=29.4 using
ORIGINAL global seconds, chosen where the picture is settled - no spinners, mid-tap rings or crossfades).
Writes the retimed silent video, rewrites the Time column of script.md (m:ss.s) to match (original kept as
script.pre-retime.md), and saves voiceover/holds.json for the 4K final. Always retime from the SILENT draft.

Usage:
  python scripts/retime.py --project video2 --video video2/draft_v3.mp4 --out video2/draft_v4.mp4 \
      --hold S08=48.0 --hold S09=55.8
"""
import argparse, json, math, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import voiceover as vo  # noqa: E402  (reuses its script parser and TIME_RE)


def fmt(t):
    m, s = divmod(round(t, 1), 60)
    return f"{int(m)}:{s:04.1f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--video", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--script", default=None)
    ap.add_argument("--hold", action="append", default=[], help="SCENE=original_global_seconds")
    a = ap.parse_args()
    proj = Path(a.project)
    script = Path(a.script or proj / "script.md")
    cfg = json.loads((proj / "voiceover" / "voice.json").read_text(encoding="utf-8"))
    rep = {r["id"]: r for r in json.loads((proj / "voiceover" / "report.json").read_text(encoding="utf-8"))["scenes"]}
    overrides = {k: float(v) for k, v in (h.split("=") for h in a.hold)}
    rows = vo.parse_script(script)

    holds, prev_end = [], 0.0
    for r in rows:
        start = max(r["start"], prev_end)          # rows overlapping a crossfade start where the previous one ends
        slot = r["end"] - start
        clip = rep.get(r["id"], {}).get("clip", 0.0)
        need = cfg["lead_in"] + clip + cfg["target_hold"] if clip else 0
        extra = math.ceil(max(0.0, need - slot) * 10) / 10
        r.update(start_n=start, extra=extra)
        if extra:
            p = overrides.get(r["id"], r["end"] - 1.2)
            if not (start <= p < r["end"]):
                sys.exit(f"hold point {p} for {r['id']} is outside its scene {start}-{r['end']}")
            holds.append((p, extra, r["id"]))
        prev_end = r["end"]
    holds.sort()
    shift = lambda t, incl: t + sum(e for p, e, _ in holds if (p < t or (incl and p <= t)))
    for r in rows:
        r["ns"], r["ne"] = shift(r["start_n"], False), shift(r["end"], False)

    # ---- video: split at hold points, clone the last frame of each piece for its extra time, concat ----
    if holds:
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.video],
                                   capture_output=True, text=True).stdout)
        cuts = [0.0] + [p for p, _, _ in holds] + [dur]
        fc, labels = "", []
        for i in range(len(cuts) - 1):
            pad = f",tpad=stop_mode=clone:stop_duration={holds[i][1]}" if i < len(holds) else ""
            fc += f"[0:v]trim=start={cuts[i]}:end={cuts[i + 1]},setpts=PTS-STARTPTS{pad}[s{i}];"
            labels.append(f"[s{i}]")
        fc += "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,format=yuv420p[v]"
        r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", a.video, "-filter_complex", fc, "-map", "[v]",
                            "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-r", "30", "-movflags", "+faststart", "-an", a.out])
        if r.returncode:
            sys.exit("ffmpeg failed")
    else:
        Path(a.out).write_bytes(Path(a.video).read_bytes())

    # ---- script.md: rewrite the Time cell of every scene row ----
    by_id = {r["id"]: r for r in rows}
    out_lines = []
    for line in script.read_text(encoding="utf-8").splitlines():
        cells = line.strip().strip("|").split("|") if line.strip().startswith("|") else None
        if cells and len(cells) >= 4 and cells[0].strip() in by_id:
            r = by_id[cells[0].strip()]
            cells[1] = f" {fmt(r['ns'])}–{fmt(r['ne'])} "
            line = "|" + "|".join(cells) + "|"
        out_lines.append(line)
    script.write_text("\n".join(out_lines) + "\n", encoding="utf-8")

    total = sum(e for _, e, _ in holds)
    print(f"{len(holds)} holds, +{total:.1f}s total -> {a.out}")
    for p, e, sid in holds:
        print(f"  {sid:>8}: hold {e:.1f}s at {p:.1f}s (original)")


if __name__ == "__main__":
    main()
