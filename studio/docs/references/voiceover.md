# Voiceover (after picture lock only)

## 1. Lock the words
Final pass on every `narration` against the approved picture. Read each line
aloud against its scene. Re-run `build-docs.mjs`; zero pacing warnings.
Send `script.md` to the user for sign-off: it's the recording script.

## 2. Produce the audio (user's choice)
- **Human read (best for customer-facing):** record from `script.md`, one file
  per scene named `<scene-id>.wav` (48 kHz/24-bit, room tone, no music), with
  0.3 s of silence head and tail.
- **TTS:** use the provider the user chooses (they supply the API key via
  environment variable; never commit it). Generate one clip per scene from
  its `narration`. Keep one voice and settings for the whole series; save
  the settings in the brief.
Claude can't hear audio. Verify clips by duration (ffprobe) and, when
available, by transcribing them back and diffing against the narration.

## 3. Attach and retime
- Put clips in `studio/public/audio/<slug>/` and set `scene.voiceover`
  (e.g. `"audio/ms-authenticator/s04-scan.wav"`). Clips start when the
  scene is fully in (after its transition).
- For each scene: `durationSec >= clip duration + transition + 0.5 s`. Update
  the storyboard, then re-check in-scene timings (taps must still line up with
  the words; move `at` frames if needed).
- Optional music bed: `storyboard.audio.music` at `musicVolume` 0.08–0.15,
  licensed track only, license noted in the brief.

## 4. Mix check
Render a draft; measure loudness:
`ffmpeg -i draft.mp4 -af loudnorm=print_format=summary -f null -`
Target around −16 LUFS integrated (web), true peak ≤ −1 dBTP. Normalize the
VO clips, not the final mix, so re-renders stay consistent.

## 5. Captions
Re-run `build-docs.mjs` so `captions.srt` reflects the final words.
If the read deviates from the script, update `narration` to match the read,
since captions must match what's heard.
