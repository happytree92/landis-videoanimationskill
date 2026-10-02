---
name: "it-howto-animation"
description: "Turn reference screen/camera recordings of an IT procedure into a fully animated, customer-facing 16:9 how-to video (realistic phone, laptop and security-key scenes), with a timed script, AI voiceover (ElevenLabs or local Kokoro), captions and a 4K final. Use when the user drops in how-to footage or asks for an animated tutorial video."
---

# IT How-To Animation

Produce professional, fully animated how-to videos for customers of a managed services provider (Landis Technologies). The user's recordings are **reference only**: they show which screens appear, in what order, with what labels. Nothing from the footage appears in the final video. Every frame is rebuilt as a clean, code-drawn animation.

Proven end to end on a 3-video passkey/MFA series (Authenticator setup, QR cross-device sign-in, FIDO2 security key). `assets/examples/` holds working scenes and documents from that series. Copy patterns from them rather than starting blank.

## Non-negotiables

- **16:9 only.** Drafts 1920×1080, final 3840×2160 at 30 fps.
- **Instruction-correct.** Every screen, label, menu path and step order matches the reference footage and current vendor docs. Never invent UI. If footage and docs disagree, **ask the user**.
- **Professional, never cartoonish.** Restrained motion: no bounce, overshoot, confetti, emoji, mascots or drawn hands.
- **No real identities.** Replace every real name, email, tenant, phone number, QR code, code and serial (see Redaction).
- **Script alongside.** Every video ships with `script.md`, kept in sync with the actual timing.
- **Approval gates.** Storyboard → style frames → 1080p draft → voiced draft → 4K. Never skip ahead.
- **Ask decisions early.** As soon as intake surfaces them, ask (batched, ≤4 per round) about platforms, device type, entry path, first-time verification, identity and branding. Don't storyboard on assumptions.

## Project layout

```
<project>/
  reference/           CATALOG.md, sheets/, detail/            (footage review)
  shared/              lib.js lib.css screens.* laptop.* securitykey.*   (copied from assets/core)
    brand/logo.png     marks/  (app icons and logos cropped from the user's footage)
  scripts/             copied from this skill's scripts/
  video1/  flow.md storyboard.md script.md CHANGELOG.md shots.json
           scenes/*.html  out/  out4k/  qa/  voiceover/
  video2/ …
  package.json (playwright)   .venv/ (Kokoro, optional)
```

Scenes link `../../shared/…`. Set up a new project by copying `assets/core/*` → `shared/`, `assets/brand/logo.png` → `shared/brand/`, and `scripts/*` → `scripts/`.

## Setup (Windows; first time on a machine)

```
winget install Git.Git ; winget install OpenJS.NodeJS.LTS ; winget install Gyan.FFmpeg
# refresh PATH in the same shell:
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
npm init -y ; npm install playwright ; npx playwright install chromium
```

Optional local voice: see `VOICE_SETUP.md` (Python 3.12 + Kokoro in `.venv`).
**Never edit UTF-8 files through PowerShell `Get-Content`/`Set-Content`** without `-Encoding utf8`, because it corrupts `…` `→` `–`. Use the editor tools, or `[IO.File]::ReadAllText/WriteAllText` with UTF-8.

## Workflow

### 1. Intake and catalog
1. Ask for one screen recording **per platform** shown (e.g. Android *and* iPhone) and per **entry point** (fresh install *and* "already have the app"). Screen recordings beat camera footage for labels. Also ask for the brand kit and the support phone and email.
2. `ffprobe` each file. Build timestamped contact sheets (1 frame / 2 s, 4×3):
   `ffmpeg -i in.mp4 -vf "fps=0.5,scale=640:-2,drawtext=fontfile='C\:/Windows/Fonts/segoeuib.ttf':text='ID %{pts\:hms\:0}':x=8:y=8:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.7,tile=4x3" -fps_mode vfr sheets/ID_%02d.jpg`
   (`-vsync` was removed in ffmpeg 7+; use `-fps_mode vfr`.) For labels, crop to the device before tiling (`tile=3x1`); portrait recordings use `scale=-2:720,tile=6x1`; fast taps use `-ss t -t 4 -vf fps=2,…,tile=8x1`.
3. Write `reference/CATALOG.md` (format: `assets/examples/docs/CATALOG.example.md`): a short **ID per clip** (C1 camera, R1 screen, I1 iPhone…), an index, per-clip tables `Time | Screen | Exact labels | Action`, and a **list of every piece of real data seen** for redaction. Refer to footage as `C1 @ 0:34`.

### 2. Accuracy check
- Check current vendor docs (Microsoft Learn/Support, Apple, Google) for each procedure. Record URLs, dates and OS minimums in `flow.md`.
- Watch for footage that shows **one person's environment**: work profile tabs, an account already present, MFA going to the same app, tenant branding, a laptop that already has its own passkey (Windows Hello prompt first). Ask how customers will actually see it.
- **Footage vs docs:** prefer the newer recording but ask, and log the decision in `flow.md`. Put alternative paths in a **tip card** (e.g. "Tapped Not Now? Settings › …"). Show other entry points as a short **fork card** near the start. Put fallbacks (e.g. "Can't verify? Ask IT for a Temporary Access Pass") in a side note card.
- Mark every label not seen in footage with ⚑ and list them under "To verify before final".

### 3. Storyboard and script (gate)
- 1.5–4 min per video; split prerequisites into separate videos in a series.
- `storyboard.md`: shot ID, layout, camera, action, step badge, duration. `script.md`: table rows `| S01 | 0:00–0:05 | On screen | "Narration" | On-screen text |`. `voiceover.py` reads the ID, Time and Narration columns. IDs may be `S01`, `S11b` or `S14–S15`. Narration in quotes, no `|`.
- **Size shots for speech now:** slot ≥ 0.3 s + words ÷ 2.5 + 1.5 s hold. Run `voiceover.py check` at this stage, not after the draft.
- Narration: second person, present tense, one action per sentence, button names exactly as on screen. No "simply" or "just".

### 4. Style frames (gate)
3–5 stills (title, phone, laptop, key, end card): `node scripts/render.mjs --scene=… --still=3.5 --out=frames/x.png`. Settle the look before animating.

### 5. 1080p draft
- One HTML scene per **section**, not per shot. Group shots sharing a device layout (e.g. `secC` = store → install → merge) so devices move continuously. Hard cuts between sections whose device positions match; 0.6 s crossfades only into and out of cards.
- `videoN/shots.json`: `[["s01",5,""],["s02",8,"x"],["secC",28,"x"],["secD",58,"c"]]`. Build: `powershell -File scripts/build.ps1 -Video video1` → `video1/draft.mp4` (≈0.025 s per frame; a 2:40 video renders in about 2 min). `-Only secD` re-renders one scene; `-AssembleOnly` re-joins.
- **QA before sending** (see QA). Keep `CHANGELOG.md` per draft and re-sync `script.md` times after every build.

### 6. Voiceover (gate)
Ask which engine and voice. **ElevenLabs** (preferred by Landis) or **Kokoro** (local, free). Audition 2–5 voices on one real line that includes the support phone and email, and send the mp3s.
- **ElevenLabs (connector):** see the ElevenLabs section. Clips go to `voiceover/elevenlabs/clips/<video>/<scene>.mp3`. Set `<video>/voiceover/voice.json` → `{"engine":"clips","clips_dir":"voiceover/elevenlabs/clips/<video>","speed":1.0,"max_speed":1.0,…}`.
- **Kokoro:** `voice.json` `engine:"kokoro"`, e.g. `af_heart`, `speed 0.9`, `max_speed 0.9` (never speed up to fit).
- Fit: `python scripts/voiceover.py --project video1 --script video1/script.md generate --allow-overrun`. If anything is OVERRUN or TIGHT, **don't edit scenes**: `python scripts/retime.py --project video1 --video video1/draft.mp4 --out video1/draft_vo_timed.mp4 [--hold S08=48.0]`. It adds freeze-frame holds, rewrites the script times and saves `voiceover/holds.json`. Choose hold points on **settled frames**: no tap ring, spinner, badge or caption mid-fade, or scene boundary. Check a still of each hold. Retime only from the silent draft.
- Then `generate` (must be all OK) → `mux --video … --out video1/final_draft_1080p.mp4`. Verify AAC audio, unchanged duration and about −16 LUFS. You can't hear audio, so send it with `captions.srt` and ask the user to list mispronounced words; fix them in `lexicon.json`.

### 7. 4K final (gate: voiced draft approved)
`powershell -File scripts/build.ps1 -Video video1 -Final` renders at `--scale=2` (JPEG frames, ≈0.15 s per frame), joins, re-applies `holds.json`, muxes the narration and verifies the output. A 3-video series takes about 25 min. **Check free disk first** (needs a few GB); `render.mjs` always deletes its temp frames. Deliverables: `final_4k.mp4`, `final_4k.srt`, `script.md`, `storyboard.md`, `narration.wav` and, on request, a 4K `thumbnail.png`.

## ElevenLabs (connector) — go slow

- Voice list: `creative_list_voices`. Library ("professional") voices may need a paid tier (error: "creator tier or above"). Test with `estimate_only: true` first; it's free and fails fast. Built-in voices (Bella, Brian, Eric…) always work.
- **Landis series voice: Zuko – Global Modern Narrator `7PbNGDB5sJCFnOZuMPNL`, model `eleven_multilingual_v2`, `generations_count: 1`.**
- **Generate ONE line at a time.** Wait about 15 s, confirm it completed, then send the next. Parallel bursts caused 429s and then *"Unusual activity… Free Tier access has been disabled"* on an account with plenty of credits. It cleared after a few minutes of pacing. Never fire batches.
- Before generating: `python scripts/el_lines.py video1 video2` writes `voiceover/elevenlabs/lines.json` with lexicon respellings applied (e.g. the phone as "7 1 7, 7 3 3, 0 7 9 3", the email as "support at Landis I T dot com"). Generate shared lines (end card) once and reuse them.
- Download: call `creative_get_flow_run_status` with the flow_id and the new session_id **padded with ~19 older session ids**, so the result is saved to a file instead of flooding context. Then `powershell -File scripts/el_check.ps1 -File <that file>`, which reports failures and downloads new clips, matched to scenes by text.
- Flows are created in the connector's workspace, which may not be the account the user is looking at. Always download and send the mp3s directly.
- About 1 credit per character; a 3-video series is about 3,500 credits.

## Scene architecture

Each scene is one HTML file at 1920×1080 CSS px; 4K uses deviceScaleFactor 2. Everything is a **pure function of t**: `window.__seek(t)` sets every transform and opacity; `window.__ready` resolves after fonts and images. No CSS transitions, rAF or Date.

`shared/lib.js` components and runtime:
- `Backdrop`, `Grain`, `Phone(stage,'android'|'ios',{label})`, `StepBadge`, `Caption`, `TapRipple`, `Highlight`, `rise()`, `readyAll()`
- `Flow(layer, [{at, v, tr}])` shows which `[data-v]` view is visible; `tr` = `cut|fade|push|pop|sheet|alert`.
- `Taps(layer, [[t,x,y]…])`, `Seq(items, apply)` for badges and captions (fades out before the next), `typed(str,t,a,b)`, `focusCenter()` (ZoomTo).
- `shared/laptop.js`: `Laptop(stage)` (generic Windows 11 laptop, content 1440×885), `Cursor(layer, waypoints, clicks)`, `browserChrome`, Entra pages, Windows Security dialogs, My Sign-Ins page, `qrSVG(seed)` (random non-functional QR), phone scan/approve sheets.
- `shared/securitykey.js`: Security info modals, InPrivate chrome, key dialogs, `KeyPanel` (USB-A port, slide-in, gold contact with LED blink, touch ring; no hands).
- `shared/screens.js`: Play Store / App Store, Authenticator (Android dark, iOS light), Microsoft sign-in, Samsung and iOS Settings, iOS alerts. Use it as the example screen library.

### Layout patterns that worked
- **Two platforms:** split Android | iPhone only where they differ; merge to one phone where the app is identical. Do the split and merge **inside one scene**. Build each platform from its own footage (Authenticator is dark on Android, light with a blue bar on iPhone).
- **Synchronised phones:** drive both phones from **one shared beat sheet** (`const B = {tapQR, scan, conn, appr, verify, ok, done}`), so each stage starts and ends together. One platform's extra step fits inside the shared beat.
- **Laptop + phones:** the laptop zooms on the dialog, then slides left and shrinks to 0.6 while the phones rise in at the right.
- **Emphasise a key control:** a gentle push-in, a pulsing orange ring (Highlight with radius 50%) on the control in both apps, a simultaneous tap, and a short tip card explaining it.
- **Cards:** title and end (white slanted logo panel), "Before you start", a fork card, a section card ("Now sign in with your key"), and a recap with checkmarks plus "Next: Part N".

### Interaction rules (from QA failures)
- **Never hand-compute tap or click targets.** `node scripts/measure.mjs --scene=… --t=10 --root=".lap .content" --sel=".l-next"` (phones: `--root=".dev.android .screen"`) prints the real centres. Hand-computed targets missed by 30–100 px.
- **Cursor holds through each click:** waypoints `[arrive,x,y],[click+0.4,x,y]`, otherwise the click lands while the cursor is gliding away.
- Tap ring: white ring with a blue outer edge, visible on blue buttons.
- Highlights hug their target. Make links `display:table` with padding, never full-width. Prefix screen classes; generic names (`.body`, `.hl`) collided with device and lib classes.
- OS dialogs over web pages must fully cover the card beneath them.
- One message at a time: fade the caption out while a note card is up.

## QA (every draft, before sending)
- `node scripts/qa.mjs --scene=… --times=… --cols=3 --out=qa/x.png`, plus **a still about 0.15 s after every tap and click**, to check each ring sits on its element.
- Full-draft sheet: `ffmpeg -i draft.mp4 -vf "fps=1/5,scale=480:-1,drawtext=…,tile=6x6" -frames:v 1 qa.jpg`. Check order, labels against `flow.md`, clipping, overlaps and leftover real data.
- After retiming, check a still at every hold.

## Motion language
Cubic in-out, with quint-out entrances. UI changes 300–450 ms; device and camera moves 900–1600 ms; crossfades 500–700 ms; hold each completed step ≥ 1.5 s. Camera pushes ≤ 0.26× extra scale on a 0.92 base for web pages. Text fades in with a 12–16 px rise. One badge and one caption at a time; captions ≤ 7 words. Keep the 5% title-safe margin.

## Redaction and sample data
Identity: Alex Morgan, alex.morgan@contoso.com, tenant "Contoso", phone `+X XXXXXXXX12`. QR codes come from `qrSVG()` (random, non-functional). Number match "42"; PINs as dots. **Third-party marks** (app icons, Microsoft logo) are cropped from the user's own **screen recordings**, not camera footage (`colorkey` removes a dark background). Flag them for official files before 4K; store icons can use neutral placeholder tiles.

## Brand — Landis Technologies
- Colors: **Landis Blue `#273786`** dominant; accents **Orange `#F7931E`** and **Blue `#3366FF`**. Backdrop is a radial gradient `#3a4fa8 → #2a3b8c → #1b2766 → #121a45`, with faint slant shapes and 4–5% grain. Tokens are in `shared/lib.css`.
- Fonts: Segoe UI Semibold for headings, Regular for body. Phone UI uses Roboto (Android) or Inter (iOS stand-in).
- Motif: the **slant** from the logo's "L", used on the white logo panel, the orange stripe, the step-badge tab and the note-card edge.
- Logo `shared/brand/logo.png` always sits on white.
- Title card: series line in orange caps ("Passwordless sign-in · Part N of M"), title in white. End card: "Need help? Contact Landis support · **717-733-0793** · **support@landisit.com**".
- Step badge at lower left: orange slant tab plus navy glass card. Caption: navy pill with button names in `#ffc27a`.
- Voice: ElevenLabs **Zuko** (`7PbNGDB5sJCFnOZuMPNL`). Fallback: Kokoro `af_heart` at 0.9.

## Scripts (in `scripts/`)
| Script | Purpose |
|---|---|
| `render.mjs` | Scene → MP4 (`--scale=1|2`, JPEG q95 frames, a browser per worker, `--still=t`; temp frames always deleted) |
| `build.ps1` | Builds a video from `shots.json`: draft, `-Only`, `-AssembleOnly`, `-Final` (4K + holds + narration) |
| `qa.mjs` / `measure.mjs` | Labelled contact sheet of stills; real element centres for taps and clicks |
| `voiceover.py` | `doctor` / `check` / `audition` / `generate` / `mux`; engines `kokoro`, `clips` (pre-rendered, e.g. ElevenLabs), `dummy` |
| `retime.py` / `apply_holds.py` | Fit the draft to real narration with freeze-frame holds, and re-apply them to 4K |
| `el_lines.py` / `el_fetch.py` / `el_check.ps1` | ElevenLabs line list; download clips by text; failure check plus download |
