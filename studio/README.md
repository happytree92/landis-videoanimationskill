# Remotion studio (experimental, not used by the skill)

An earlier take on the same job: Remotion (React) components rendered to MP4, with CSS 3D phone, laptop and
security-key models and a storyboard-driven timeline. It typechecks and renders (`npm install`, `npx tsc --noEmit`,
`npm run studio`), but it was never run against real footage.

The `it-howto-animation` skill (`.claude/skills/it-howto-animation/`) replaced it as the supported pipeline: it uses
HTML scenes rendered with Playwright, was proven on a 3-video Landis MFA series, and includes ElevenLabs voiceover,
retiming and a 4K path. The two pipelines are not compatible, so nothing in the skill drives this folder.

Kept here, unchanged apart from their location:

| Path | What it is |
|---|---|
| `src/` | Components, devices, timeline, `_demo` project |
| `scripts/` | `new-project.mjs`, `analyze-reference.mjs`, `build-docs.mjs`, `render.mjs`, `lib.mjs` (moved here from the old skill folder) |
| `docs/references/` | The old skill's reference notes (motion language, scene realism, accuracy rules, MS Authenticator/passkey domain notes, QA checklist, deliverables) |
| `../projects/<slug>/` | Briefs for the two planned videos, written for this pipeline |

Run the scripts from the repo root, e.g. `node studio/scripts/render.mjs --project _demo --quality draft`
(`npm run draft` / `npm run final` in this folder pass the flags through).
