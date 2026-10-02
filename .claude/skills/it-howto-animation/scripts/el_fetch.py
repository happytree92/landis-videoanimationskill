#!/usr/bin/env python3
"""
el_fetch.py - download ElevenLabs clips listed in creative_get_flow_run_status result files, named by scene.

Matches media to scenes by prompt text (lines.json), so session ordering doesn't matter.
Usage: python scripts/el_fetch.py <status_result.txt> [more ...]
Writes voiceover/elevenlabs/clips/<video>/<scene>.mp3 and reports what is still missing.
"""
import json, re, sys, urllib.request
from pathlib import Path

ROOT = Path("voiceover/elevenlabs")
lines = json.loads((ROOT / "lines.json").read_text(encoding="utf-8"))
norm = lambda s: re.sub(r"\s+", " ", s).strip().lower()
by_text = {}
for video, rows in lines.items():
    for r in rows:
        by_text.setdefault(norm(r["text"]), []).append((video, r["id"]))

got = 0
for f in sys.argv[1:]:
    data = json.loads(Path(f).read_text(encoding="utf-8"))
    for m in data.get("media", []):
        targets = by_text.get(norm(m.get("prompt", "")))
        if not targets or not m.get("url"):
            continue
        for video, sid in targets:
            safe = re.sub(r"[^A-Za-z0-9]+", "-", sid).strip("-")
            out = ROOT / "clips" / video / f"{safe}.mp3"
            if out.exists():
                continue
            out.parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(m["url"], out)
            got += 1
            print(f"  {video} {sid}: {m.get('duration_secs', 0):.1f}s")

missing = [(v, r["id"]) for v, rows in lines.items() for r in rows
           if not (ROOT / "clips" / v / (re.sub(r"[^A-Za-z0-9]+", "-", r["id"]).strip("-") + ".mp3")).exists()]
print(f"downloaded {got}; missing {len(missing)}: " + ", ".join(f"{v}:{s}" for v, s in missing))
