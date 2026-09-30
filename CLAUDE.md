# Landis IT video studio

This repo produces animated, customer-facing how-to videos. For any video
work (new footage, storyboards, renders, scripts, voiceover), follow the
`landis-video-animation` skill in `.claude/skills/landis-video-animation/SKILL.md`.

- Remotion project: `studio/` (`npm install` once; `npx tsc --noEmit` to typecheck)
- Per-video inputs/outputs: `projects/<slug>/` (footage and renders are git-ignored)
- Brand values live only in `studio/src/brand/tokens.ts`
