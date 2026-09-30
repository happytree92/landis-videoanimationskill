# Deliverables and output specs

## Drafts (every review round)
- `output/drafts/<slug>_draft_<stamp>.mp4`: 1920×1080, 30 fps, H.264 CRF 23
- `output/drafts/stills_<stamp>/`: one still per scene
- `output/script.md`: current script/storyboard

## Final package (`projects/<slug>/output/final/` + `output/`)
| File | Spec |
|---|---|
| `<slug>_4k.mp4` | 3840×2160, 30 fps, H.264 High, CRF 16, preset slow, yuv420p. Rendered at `--scale 2` from the 1080 composition, so vectors and text re-rasterize crisply. |
| `<slug>_4k_master.mov` | Optional ProRes 422 HQ (`--prores`) for editing/archival |
| `<slug>_thumbnail.png` | 3840×2160 still (default: 2 s into the title) |
| `script.md` | Voiceover script + standalone procedure (KB article basis) |
| `captions.srt` | Captions timed to the video |
| `chapters.txt` | Chapter markers (paste into YouTube/Stream description) |

Raster assets (plates, hands, logos) must be ≥ 3840 px wide where shown
full-frame, or they'll soften at 4K. SVG is preferred for logos.

Render time: 4K takes roughly 3–4× as long as the 1080 draft. Run finals on
the user's machine with plenty of cores, and use `--concurrency` if needed.
