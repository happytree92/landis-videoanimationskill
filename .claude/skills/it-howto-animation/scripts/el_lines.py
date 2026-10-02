#!/usr/bin/env python3
"""el_lines.py - list each scene's narration (with pronunciation respellings applied) for ElevenLabs.
Writes voiceover/elevenlabs/lines.json, used by el_fetch.py to match downloaded clips to scenes by text.
Usage (project root): python scripts/el_lines.py video1 video2 ...
Respellings come from <video>/voiceover/lexicon.json (keys starting with _ ignored). Generate ONE line at a time."""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import voiceover as vo

out, total = {}, 0
for v in sys.argv[1:]:
    lexf = Path(v) / "voiceover" / "lexicon.json"
    lex = {k: x for k, x in json.loads(lexf.read_text(encoding="utf-8")).items() if not k.startswith("_")} if lexf.exists() else {}
    out[v] = [{"id": s["id"], "slot": round(s["slot"], 1), "text": vo.apply_lexicon(s["text"], lex)}
              for s in vo.parse_script(f"{v}/script.md") if s["text"]]
    total += sum(len(r["text"]) for r in out[v])
d = Path("voiceover/elevenlabs"); d.mkdir(parents=True, exist_ok=True)
(d / "lines.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
for v, rows in out.items():
    print(f"{v}: {len(rows)} lines")
    for r in rows: print(f"  {r['id']}: {r['text']}")
print(f"total {total} characters (~{total} ElevenLabs credits)")
