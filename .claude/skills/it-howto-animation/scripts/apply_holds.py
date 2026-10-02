#!/usr/bin/env python3
"""apply_holds.py - insert freeze-frame holds (written by retime.py) into a silent video, e.g. the 4K join.
Usage: python scripts/apply_holds.py --holds video1/voiceover/holds.json --in joined.mp4 --out final_4k_silent.mp4"""
import argparse, json, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("--holds", required=True)
ap.add_argument("--in", dest="inp", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--crf", default="16")
ap.add_argument("--preset", default="medium")
a = ap.parse_args()
holds = sorted(json.load(open(a.holds, encoding="utf-8")))
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.inp],
                           capture_output=True, text=True).stdout)
cuts = [0.0] + [p for p, _ in holds] + [dur]
fc, labels = "", []
for i in range(len(cuts) - 1):
    pad = f",tpad=stop_mode=clone:stop_duration={holds[i][1]}" if i < len(holds) else ""
    fc += f"[0:v]trim=start={cuts[i]}:end={cuts[i + 1]},setpts=PTS-STARTPTS{pad}[s{i}];"
    labels.append(f"[s{i}]")
fc += "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,format=yuv420p[v]"
r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", a.inp, "-filter_complex", fc, "-map", "[v]", "-c:v", "libx264",
                    "-profile:v", "high", "-crf", a.crf, "-preset", a.preset, "-r", "30", "-movflags", "+faststart", "-an", a.out])
print(f"{len(holds)} holds, +{sum(e for _, e in holds):.1f}s -> {a.out} [exit {r.returncode}]")
sys.exit(r.returncode)
