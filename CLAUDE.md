# Landis IT video studio

This repo produces animated, customer-facing how-to videos. For any video work (new footage,
storyboards, renders, scripts, voiceover), follow the `it-howto-animation` skill in
`.claude/skills/it-howto-animation/SKILL.md`. It is an HTML + Playwright + ffmpeg pipeline
(see its README for the project layout and setup).

- `studio/` is the earlier, experimental Remotion pipeline. The skill does not use it. See `studio/README.md`.
- `projects/<slug>/` holds briefs from the Remotion pipeline; new-pipeline projects live in their own folder (see the skill).
