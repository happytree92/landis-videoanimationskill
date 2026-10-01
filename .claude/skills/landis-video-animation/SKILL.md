---
name: landis-video-animation
description: Produce fully animated, customer-facing Landis IT how-to videos (16:9, 4K final, 1080p drafts) from reference recordings of an IT procedure. Rebuilds the procedure as clean, realistic animation (phone, laptop-on-desk, security key scenes) in the repo's Remotion studio, and ships a technically accurate voiceover script, captions and chapters with it. Use when the user drops in reference footage (screen recordings or camera video) of an IT task, asks for an animated tutorial/how-to/explainer video, or asks to storyboard, revise, render, script or voice an existing video project in this repo.
---

# Landis IT animated how-to videos

The reference footage is **evidence, not material**. Nothing from it appears in
the final video. Every frame is rebuilt as animation: a realistic phone, laptop
or desk scene whose on-screen UI is recreated from the reference so each step is
instruction-correct. The output should look like a polished product explainer:
clean, calm, modern. Never cartoonish, never bouncy.

## Non-negotiables

1. **Accuracy beats polish.** Every screen, label, button and step order comes
   from the reference footage (cite it in the scene's `source`). If footage and
   `references/procedures/*` disagree, the footage wins for UI and the question
   goes to the user. Never invent a step, a button label, or a setting path.
2. **Fictional data only.** No real names, emails, tenants, phone numbers, QR
   payloads, number-match codes, serials or IPs. Use the demo identity in the
   project brief. QR codes are rendered with `DemoQrCode` (harmless payload).
3. **The motion language is fixed.** Read `references/motion-language.md`
   before animating. No springs with bounce, no elastic/back easing, no scale-pops.
4. **Brand comes only from `studio/src/brand/tokens.ts`.** Never hard-code a
   brand color or font in a scene. Final renders refuse to run while tokens
   contain `PLACEHOLDER`.
5. **The storyboard is the single source of truth.** Timing, steps, on-screen
   text and narration all live in `storyboard.json`; the video, `script.md`,
   `captions.srt` and `chapters.txt` are all generated from it.
6. **Approval gates are real.** Stop and get the user's sign-off at each gate
   below. Don't build animation on an unapproved procedure or storyboard.

## Repo map

```
.claude/skills/landis-video-animation/   this skill (instructions, references, scripts)
studio/                                  Remotion project (run `npm install` once)
  src/brand/        tokens.ts (colors/type/contact), fonts.ts
  src/motion/       easing/duration tokens, hooks
  src/devices/      Phone, Laptop (CSS 3D), SecurityKey
  src/scene/        Stage (studio/light/desk backdrops, plates), Camera, ContactShadow
  src/overlays/     TapIndicator, Callout, Spotlight, StepLabel, Title/Chapter/End cards
  src/ui/ios|windows/  primitives for recreating phone and desktop screens
  src/timeline/     storyboard types, Timeline renderer, shared timing math
  src/projects/     one folder per video (storyboard.json, scenes.tsx, screens/) + registry.ts
  src/projects/_demo/  pattern library: every component used once. Copy from it.
  public/           fonts/, brand/ (logos, brand fonts), plates/, hands/, audio/
projects/<slug>/    brief.md, reference/ (footage, git-ignored), analysis/, output/
```

Scripts (run from anywhere, Node 18+):

| Script | Purpose |
|---|---|
| `scripts/new-project.mjs --slug s --title "T"` | Scaffold code + folders, register the composition |
| `scripts/analyze-reference.mjs --project s --input clip.mov` | Metadata, scene-change frames, interval frames, contact sheets, audio |
| `scripts/build-docs.mjs --project s` | `script.md`, `captions.srt`, `chapters.txt` + pacing warnings |
| `scripts/render.mjs --project s --quality draft` | 1080p draft + a review still per scene |
| `scripts/render.mjs --project s --quality final` | 3840x2160 master, thumbnail, docs (refuses on placeholders) |

Live preview for the user: `cd studio && npm run studio`.

## Workflow

### 0. Environment check (first run on a machine)
`cd studio && npm install`. Then run `npx tsc --noEmit` and a draft of `_demo`
to prove rendering works. If Remotion can't download its browser (locked-down
network), set `REMOTION_BROWSER` to a local Chrome/Chromium headless shell.

### 1. Intake
Read `references/intake-and-catalog.md`: ask for one recording per platform and per entry point, and write
`reference/CATALOG.md` with clip IDs and a list of real data to replace.
- Create the project (`new-project.mjs`) unless it exists. Copy each reference
  clip into `projects/<slug>/reference/` and run `analyze-reference.mjs` on each.
- Read the contact sheets first, then every scene-change frame. You cannot
  hear audio. If the clip has narration, ask for a transcript or transcribe
  `audio.wav` with an available speech-to-text tool.
- Fill `brief.md`: audience, platform(s) shown, account type, tenant
  assumptions, demo identity, and a **reference log**: every distinct step
  with clip + timestamp, the exact on-screen wording, and what the user tapped.

### 2. Accuracy pass → GATE 1
Cross-check the reference log against `references/procedures/` (domain notes)
and `references/accuracy-and-script.md`. Produce a short list for the user:
the procedure as you understand it (numbered), every discrepancy or gap
(missing permission prompt, iOS vs Android differences, prerequisites the
footage skips), and open questions. **Wait for confirmation.**

### 3. Storyboard + script → GATE 2
- Write `storyboard.json`: one scene per visual beat (typically 3–8 s), with
  `step`, `action`, `narration`, `source`, `transition`. Size each scene for
  its narration at ~140 wpm plus ~0.5 s of breathing room.
- Plan shots with `references/scene-realism.md` (which device, which angle,
  where the camera pushes in).
- Run `build-docs.mjs`; fix every pacing warning.
- Show the user `script.md` (it doubles as the storyboard review) and a
  one-line shot description per scene. **Wait for approval.**

### 4. Build
- Recreate each app/OS screen as a component in `projects/<slug>/screens/`
  following `references/screen-recreation.md`. Compare side-by-side with the
  reference frame before moving on.
- Compose scenes in `scenes.tsx` using devices, Stage, Camera and overlays.
  Derive tap coordinates from layout constants, never eyeballed numbers.
- Check your work with stills while building:
  `npx remotion still src/index.ts <id> out/check.png --frame=N` (from studio/)
  and **look at them**. Check at least the first frame, every tap, and every
  state change.

### 5. Draft review → GATE 3 (picture lock)
- `render.mjs --quality draft`. Review every still it writes against
  `references/qa-checklist.md` and fix what fails before showing the user.
- Send the draft MP4 and `script.md`. Iterate until the user approves picture.

### 6. Voiceover (only after picture lock)
Follow `references/voiceover.md`: finalize narration wording, produce the VO
(human read or TTS the user chooses), drop clips in `studio/public/audio/<slug>/`,
attach them per scene (`scene.voiceover`), and retime scenes to the real
audio. Re-run `build-docs.mjs` so captions match the recorded read.

### 7. Final
`render.mjs --quality final` (add `--prores` if they want an edit master).
Deliver the package listed in `references/deliverables.md` and report file
paths, runtime and anything still open.

## References (read when the phase calls for them)

- `references/brand.md`: Landis brand values (colors, motif, cards) and how to ingest the design guide (status: **partial; logo, Segoe UI files and guide PDF pending**)
- `references/motion-language.md`: curves, durations, transitions, what's banned
- `references/scene-realism.md`: devices, camera angles, desk plates, hands, shot recipes
- `references/screen-recreation.md`: rebuilding app/OS UI from reference frames
- `references/intake-and-catalog.md`: what to ask for, catalog format, ffmpeg review commands
- `references/accuracy-and-script.md`: procedure accuracy rules, environment checks, VO writing style
- `references/procedures/microsoft-authenticator-and-passkeys.md`: domain notes for the MFA/passkey series
- `references/qa-checklist.md`: pre-delivery checks
- `references/voiceover.md`: VO production and retiming
- `references/deliverables.md`: output specs and package contents
