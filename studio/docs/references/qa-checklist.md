# QA checklist (run before every draft handoff and the final)

Go through the review stills from `render.mjs`, then scrub the MP4 at every
step boundary. Fix failures before showing the user; list anything you
intentionally left open.

## Accuracy
- [ ] Every scene has a `source`; every step matches the approved procedure (GATE 1)
- [ ] All on-screen UI text matches the reference exactly (labels, case, punctuation)
- [ ] Every permission/system prompt from the footage appears, with the right choice tapped
- [ ] Tap indicators land on the correct element (check the still at each tap frame)
- [ ] Platform shown matches what's narrated (no iOS screen during an Android line)
- [ ] Prerequisites stated in the first 20 s

## Privacy
- [ ] No real names, emails, tenants, phone numbers, serials, IPs, codes
- [ ] All QR codes are `DemoQrCode`; number-match codes are fictional
- [ ] No notification previews, wallpapers or recents leaking personal content

## Brand
- [ ] No hard-coded colors or fonts in scenes (grep `#[0-9a-fA-F]{3,6}` in projects/<slug>/ and check they're app-UI colors only)
- [ ] Title and end card use tokens; end card contact details are real (final)
- [ ] Logo usage follows clear-space and minimum size rules

## Motion
- [ ] No bounce/overshoot/scale-pop anywhere
- [ ] Every state change is held ≥ 1 s (readable)
- [ ] At most two transition types per chapter
- [ ] Camera moves ease inOut; no simultaneous competing motion in focus area

## Legibility and layout
- [ ] Smallest meaningful text ≥ 22 px on the 1080 canvas (push in if not)
- [ ] Step label never covers the element being explained
- [ ] Everything important inside the safe area
- [ ] Text contrast ≥ 4.5:1 (overlays over plates especially)

## Timing and docs
- [ ] `build-docs.mjs` reports no pacing warnings
- [ ] Narration starts ≤ 0.3 s before the action it describes
- [ ] `script.md` procedure list reads correctly as a standalone KB article
- [ ] Captions: ≤ 42 chars/line, ≤ 2 lines, no cue shorter than ~1 s

## Technical (final only)
- [ ] 3840×2160, 30 fps, H.264 High, yuv420p, BT.709
- [ ] Audio (if present) 48 kHz AAC, around −16 LUFS integrated, peaks ≤ −1 dBTP
- [ ] No black/blank frames at head or tail; first frame is a usable poster
