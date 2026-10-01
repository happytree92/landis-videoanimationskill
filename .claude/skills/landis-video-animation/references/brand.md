# Brand: ingesting the Landis IT design guide

**Status: partial.** Colors and support contacts are filled in from the video 1 production run
(see "Extracted"). Still PLACEHOLDER in `tokens.ts`: logo files and licensed Segoe UI font
files. The design guide PDF has not been ingested yet; check it against the values below.
Final renders are blocked until the remaining placeholders are replaced.

## When the design guide PDF arrives

1. Save it to `brand/source/` at the repo root (committed, so every session sees it).
2. Read it end to end. Extract into a table (add it below under "Extracted"):
   - Company name as written in customer-facing material
   - Color palette: exact hex for primary, secondary, accent, neutrals; which
     colors are allowed on dark vs light; any tints/shades rules
   - Typography: families, weights, sizes/ratios, tracking, casing rules for headings/eyebrows
   - Logo: variants (full, mark, mono), clear-space rule, minimum size, don'ts
   - Tone of voice (affects narration wording)
   - Imagery/iconography rules (line vs solid, corner radius, shadow use)
   - Any motion or video guidance
3. Ask the user for assets the PDF references but doesn't contain:
   logo SVGs (light and dark), licensed font files (.woff2/.otf/.ttf), and
   support contact details for the end card.
4. Update the code:
   - `tokens.ts`: colors, type families, `support`, `logo` paths; remove each
     `PLACEHOLDER` comment as its value becomes real.
   - Fonts: copy to `studio/public/brand/fonts/`, add `loadFont()` calls in
     `brand/fonts.ts`, point `brand.type.display/body` at the new family names.
   - Logos: `studio/public/brand/logo-light.svg` (for dark backgrounds) and
     `logo-dark.svg`.
5. Decide stage look: if the brand is light-first, default scenes to
   `<Stage look="light">` and check that overlays keep contrast (≥ 4.5:1 for text).
6. Re-render the `_demo` title, step label and end card as stills and show
   the user before starting project work.

## Mapping rules

- `accent` is used for step-label eyebrows, the progress rule, spotlights
  and success states. Pick the brand color that stays legible on both the dark
  stage and white app screens; if none does, ask.
- Recreated phone/OS UI never takes brand colors. It must look like the real
  app. Brand lives in the frame around the device: cards, labels, callouts.
- Keep the type scale in tokens; don't size text ad hoc in scenes.

## Extracted

Source: brand notes from the `it-howto-animation` video 1 run (2026-10-01). Verify against the design guide PDF.

- **Colors:** Landis Blue `#273786` dominant (~80% of any frame); accents Orange `#F7931E` and Blue `#3366FF`.
  Backdrop: radial gradient `#3a4fa8 -> #2a3b8c -> #1b2766 -> #121a45`, faint slant shapes, 4-5% grain.
- **Fonts:** Segoe UI Semibold (headings), Segoe UI Regular (text). Phone UI: Roboto (Android) or Inter (iOS stand-in).
  Segoe UI is not bundled; Inter is the stand-in until licensed files arrive.
- **Motif:** the slant from the "L" of the logo. Use it for the title/end-card white logo panel
  (parallelogram `clip-path`), an orange stripe, the step-badge tab and the note-card edge.
- **Logo:** `Landis-Technologies-High-Res-Logo-scaled.png`, always on white (black and blue lettering doesn't read on navy). File not yet in the repo.
- **Title card:** white slanted logo panel left; right side: series line in orange caps
  ("Passwordless sign-in - Part N of M") and the title.
- **End card:** same layout. "Need help?", "Contact Landis support", **717-733-0793**, **support@landisit.com**.
- **Step badge:** lower left; orange slant tab + navy glass card; "STEP N" in orange caps, action in white semibold.
- **Captions:** bottom center, navy pill, button names in light orange `#ffc27a` bold (`brand.colors.captionHighlight`).

**Not yet implemented in the Remotion components:** the slant logo panel on title/end cards, the orange
slant step-badge tab, and navy caption pills with highlighted button names. `TitleCard`, `EndCard`,
`StepLabel` and `CaptionBar` currently use the generic layout. Build these once the logo file is supplied.
