# it-howto-animation (skill)

Turns reference recordings of an IT procedure into animated, branded, voiced 16:9 how-to videos (1080p drafts → 4K finals).
Read `SKILL.md` first. Built and proven on the Landis passkey/MFA series (October 2026).

```
SKILL.md              workflow, rules, brand, ElevenLabs pacing, component reference
VOICE_SETUP.md        ElevenLabs (connector) and Kokoro (local) setup
scripts/              render.mjs build.ps1 qa.mjs measure.mjs voiceover.py retime.py apply_holds.py el_*.{py,ps1}
assets/core/          lib.js/css (brand + runtime), screens.*, laptop.*, securitykey.*  -> copy to <project>/shared/
assets/brand/logo.png Landis logo                                                     -> <project>/shared/brand/
assets/examples/      scenes/ (title, fork card, split/merge, laptop+phones, security key, end card)
                      docs/ (CATALOG, flow, storyboard, script examples)
```

New project quick start (PowerShell, in an empty project folder with the recordings):
```
New-Item -ItemType Directory shared, shared\brand, shared\marks, scripts, video1\scenes
Copy-Item <skill>\assets\core\* shared\ ; Copy-Item <skill>\assets\brand\logo.png shared\brand\
Copy-Item <skill>\scripts\* scripts\
npm init -y ; npm install playwright ; npx playwright install chromium
```
Third-party marks (app icons, vendor logos) go in `shared/marks/`, cropped from the user's own screen recordings.
