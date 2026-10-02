# Landis IT: animated how-to video studio

A Claude Code skill that turns reference recordings of an IT procedure into a fully animated, branded,
voiced 16:9 how-to video (1080p drafts, 4K finals): realistic phone, laptop and security-key scenes, a timed
script, captions and an ElevenLabs voiceover. The footage you record is reference only; every frame is rebuilt
as clean animation so the steps are instruction-correct.

The skill lives in `.claude/skills/it-howto-animation/`:

```
SKILL.md          workflow, rules, brand, ElevenLabs pacing, component reference
README.md         layout and new-project quick start
VOICE_SETUP.md    ElevenLabs and Kokoro setup
scripts/          render.mjs build.ps1 qa.mjs measure.mjs voiceover.py retime.py apply_holds.py el_*.{py,ps1}
assets/           core/ (shared components), brand/logo.png, examples/ (scenes and doc templates)
```

## Using it

Open this folder in Claude Code (desktop app or CLI); the skill loads from `.claude/skills/`. Then, for example:

> Here are the reference recordings for the VPN setup video.

Claude follows `SKILL.md`: intake and catalog, accuracy check, storyboard and script, style frames, 1080p
draft, voiceover, 4K final, with your approval at each gate. Set up a new video project as described in
`.claude/skills/it-howto-animation/README.md` (Windows/PowerShell first; see the notes there and in `SKILL.md`).

## Other folders

- `studio/`: an earlier, experimental Remotion pipeline. Not used by the skill; kept for reference (`studio/README.md`).
- `projects/`: briefs written for that pipeline.
- `brand/source/`: put the Landis design guide PDF here when available.
