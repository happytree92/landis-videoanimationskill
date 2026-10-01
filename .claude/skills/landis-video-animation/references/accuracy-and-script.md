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

## Footage captures one person's environment

Recordings show one person's phone, account and tenant. Before storyboarding, check for and ask about:

| Watch for in footage | Why it matters | Ask the user |
|---|---|---|
| Work profile / "Work" tabs on Android | Customers on personal phones won't see them | Personal device, work profile, or show both? |
| Account already present in the app | Skips the add-account step | Which entry path: add account, scan QR, or existing account? |
| MFA approval going to the same app | Only works if the user already had MFA | What is a *new* user's first verification: an existing method or a Temporary Access Pass? |
| Tenant branding on sign-in pages | Ties the video to one tenant | Contoso sample identity, MSP brand, or the customer's brand? |
| Footage and docs disagree | e.g. docs say iOS Settings > AutoFill, the app shows an in-app "Turn On" prompt | Follow the recording (newer) or the docs? |

Rules:
- **Prefer the newest recording over docs** when they disagree, but always ask, and record the decision in the
  brief under "Footage vs docs". Show the alternative path in a **tip card** (e.g. "Tapped Not Now? Settings >
  General > AutoFill & Passwords").
- Many procedures have **more than one entry point**. Pick the main path and show the others as a short **fork
  card** near the start ("Already have the app? 1 Tap your account - 2 Tap Create a passkey - 3 Follow along from Step 4").
- **Fallbacks** the customer might need ("Can't verify? Ask IT for a Temporary Access Pass") go in a side note
  card, not in the main flow, unless the user says otherwise.
- Mark every label **not seen in footage** with a flag in the storyboard `notes` ("VERIFY") and list them under
  "To verify before final" in the brief. `render.mjs --quality final` refuses while `TODO|TBD|PLACEHOLDER` remain, so
  use "VERIFY" in `notes`, and resolve every one before the final.
- One message at a time: when a note card appears, fade the caption out. Never show a caption and a card saying the same thing.
