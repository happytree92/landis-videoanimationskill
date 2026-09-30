# Brand: ingesting the Landis IT design guide

**Status: pending.** `studio/src/brand/tokens.ts` holds PLACEHOLDER values.
Final renders are blocked until they're replaced.

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

_(fill in from the design guide)_
