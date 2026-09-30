# Procedure accuracy and script writing

## Accuracy rules

1. **Source every step.** Each scene's `source` names the reference clip and
   timestamp (`auth-setup.mov @ 00:41`) or, for steps not in the footage, the
   vendor doc URL + date the user confirmed. No source, no scene.
2. **Footage vs knowledge.** `procedures/*.md` are domain notes written from
   general knowledge and may be out of date. Vendor UI changes often. Use them
   to spot gaps (e.g. "footage skips the camera permission prompt") and to ask
   questions, not to override what the footage shows.
3. **Show prerequisites up front**, in the first 20 seconds: what the viewer
   needs (phone, computer, work account, security key, Bluetooth on…).
4. **Every system prompt the viewer will hit is shown**: permission dialogs,
   notification prompts, biometric prompts, "allow"/"don't allow" choices.
   Say which option to pick and why, briefly.
5. **Platform differences are explicit.** If iOS and Android differ, say so on
   screen. If the video only shows one platform, the script says where the
   other differs (or links to the KB article).
6. **Safety beats brevity.** For MFA content, include the security habits
   customers must learn: only approve sign-ins you started; never share codes;
   what to do if a prompt looks wrong (call Landis support).
7. **Admin-side assumptions are stated in the brief**, not in the video: e.g.
   "tenant has number matching and passkeys (FIDO2) enabled". The video says
   "if you don't see this option, contact your IT team".
8. When unsure, **ask the user**; don't guess. Record open questions in the brief.

## Script (narration) style

Narration is written for the ear and read against moving pictures.

- Second person, present tense, imperative: "Tap **Add account**."
- One action per sentence. Action first, then the result: "Tap **Continue**.
  The app asks to send you notifications."
- UI labels in bold in `script.md`, spelled exactly as on screen. Don't
  paraphrase a button ("hit the plus" ✗ → "tap the **+** button" ✓).
- Narration never gets ahead of the picture: the line describing a tap
  starts ≤ 0.3 s before the tap indicator lands.
- 140 wpm target, 155 wpm max (`build-docs.mjs` warns). Contractions are
  fine; jargon isn't. Define a term the first time ("a passkey, a sign-in
  that replaces your password").
- No filler ("simply", "just", "easy"). It sounds dismissive when the viewer is stuck.
- Numbers: "six-digit code", "two-digit number". Spell out what's read aloud.
- End every chapter with a one-line result ("Your account is now protected
  by Microsoft Authenticator.").
- Tone of voice follows the design guide's voice section once ingested.

## `action` vs `narration` in the storyboard

- `action`: the terse, literal instruction for the KB-article procedure list
  ("Tap **Allow** on the notification permission prompt.").
- `narration`: the spoken line; may add context or reassurance.
