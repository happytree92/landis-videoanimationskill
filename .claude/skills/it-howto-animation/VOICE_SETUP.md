# Voiceover setup

Two engines. Both feed the same pipeline (`scripts/voiceover.py generate` → `retime.py` if needed → `mux`).

## A. ElevenLabs (Landis default)

1. Connect the **ElevenLabs** connector in claude.ai (Connectors). No install is needed on the PC.
2. Series voice: **Zuko – Global Modern Narrator** `7PbNGDB5sJCFnOZuMPNL`, model `eleven_multilingual_v2`.
   Library voices may require a paid tier. Test any voice with `estimate_only: true` first.
3. Generate **one line at a time, about 15 s apart**, and confirm each before the next. Bursts trigger
   "Unusual activity… Free Tier access has been disabled", even with credits left.
4. Per video, `voiceover/voice.json`:
   ```json
   {"engine":"clips","clips_dir":"voiceover/elevenlabs/clips/video1","voice":"zuko-elevenlabs","speed":1.0,"max_speed":1.0,
    "lead_in":0.3,"min_tail":0.4,"target_hold":1.5,"sentence_gap":0.3,"loudness_lufs":-16,"true_peak":-1.5}
   ```
   Still requires Python 3.10+ with numpy (for `voiceover.py`) and ffmpeg.

## B. Kokoro (local, free)

| | Windows (PowerShell) | Mac (Terminal) |
|---|---|---|
| Python 3.12 | `winget install Python.Python.3.12` | `brew install python@3.12` |
| ffmpeg | `winget install Gyan.FFmpeg` | `brew install ffmpeg` |

```
py -3.12 -m venv .venv            # Mac: python3.12 -m venv .venv
.venv\Scripts\python -m pip install "kokoro>=0.9.4" numpy
.venv\Scripts\python scripts/voiceover.py doctor
```
- The first synthesis downloads the model (~330 MB) and spaCy `en_core_web_sm`. A Hugging Face "symlinks" warning on Windows is harmless. espeak-ng is usually not needed.
- Audition: `voiceover.py audition --text "…"` writes `voiceover/audition/*.wav`. Landis's fallback is `af_heart` at `speed 0.9`, `max_speed 0.9`.
- Check the model license (hexgrad/Kokoro-82M) before publishing.

## Pronunciation
`<video>/voiceover/lexicon.json` maps words to respellings (captions keep the original text):
```json
{"support@landisit.com":"support at Landis I T dot com","717-733-0793":"7 1 7, 7 3 3, 0 7 9 3","QR":"Q R","FIDO":"Fie-doh","MFA":"M F A"}
```
For ElevenLabs, `scripts/el_lines.py` applies the lexicon before you send each line.
