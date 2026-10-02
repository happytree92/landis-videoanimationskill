# Intake: recordings, catalog, review commands

## 1. Ask for the right recordings up front
One recording **per platform shown in the video** (e.g. Android *and* iPhone). Screens built from docs alone are
often wrong (iPhone uses a different provider-enable flow and a light Authenticator theme). Screen recordings beat
camera footage for reading labels; camera footage is still useful for device and hand context.

Send the user this checklist:
- A screen recording of each platform, from app install to finish, on a device matching what customers have
  (personal vs work-profile Android).
- A recording of each **entry point** the procedure has (a fresh install *and* "already have the app -> Create a passkey").
- Brand kit, logo, and the support contact line (phone and email) for the end card.

## 2. Catalog every clip with an ID
Write `projects/<slug>/reference/CATALOG.md` (committed; the footage itself is not):
- A short ID per clip (`C1` camera, `R1` screen recording, `I1` iPhone...), and an index: file, length, type, device
  and OS, which video it feeds.
- Per clip a table: `Time | Screen | Exact labels | Action`. Then everyone refers to footage as `C1 @ 0:34`
  (use the same form in storyboard `source` fields).
- A list of **every piece of real data seen** (names, emails, tenants, other customers' accounts, codes,
  locations, bookmarks, recorder watermarks) so it can be replaced with the demo identity.

## 3. Review commands (analyze-reference.mjs covers the common case)
`analyze-reference.mjs` already writes timestamped scene-change frames, interval frames, and 4x3 contact sheets.
For finer work use ffmpeg directly (the studio's `ffmpeg-static` binary is at `studio/node_modules/ffmpeg-static/ffmpeg`):
- Burned-in timestamps on a sheet: add `drawtext=text='%{pts\:hms\:0}':x=8:y=8:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.7`
  (on Windows add `fontfile='C\:/Windows/Fonts/segoeuib.ttf'`).
- Label-reading close-ups: crop to the phone before tiling (`crop=900:1080:470:0,...,tile=3x1`); ~3 per sheet keeps UI text legible.
- Portrait screen recordings: `scale=-2:720,tile=6x1`.
- Timing around fast taps: `-ss <t> -t 4 -vf fps=2,...,tile=8x1`.
- Audio check (camera clips usually have only room tone): `ffmpeg -i in.mp4 -af volumedetect -vn -f null -`.
- ffmpeg 7+ removed `-vsync`; use `-fps_mode vfr`.

## 4. Ask decision questions early
As soon as intake surfaces them (platform, device type, entry path, first MFA, identity), ask in batches of four
**before** writing the storyboard. Keep a project memory note of the decisions (in `brief.md`) so later videos in
the series (QR cross-device sign-in, FIDO2 key) reuse them. Re-sync `script.md` after every build and keep a
`CHANGELOG.md` per draft in `projects/<slug>/output/`.
