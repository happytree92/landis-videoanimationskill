# Set up Microsoft Authenticator (Video 1 of the MFA series)

Status: **awaiting reference footage + design guide.** Nothing below is approved yet.

## Intent (from the requester)
A fully animated, customer-facing how-to. The reference recordings are only a
guide; the final video is 100% animation. A realistic phone on screen goes
to the app store, downloads Microsoft Authenticator, opens it, and adds an
account, with every step instruction-correct. Professional and modern; clean,
neat transitions; nothing cartoonish or bubbly.

- Format: 16:9, drafts 1080p, final 3840×2160
- Voiceover: added after the animation is approved; `script.md` is written
  alongside the build and becomes the VO script
- Series: this video pairs with `passkeys` (Video 2)

## Audience
Landis IT customers' end users: non-technical staff setting up MFA for a work
account, likely on their own phone, often while following along.

## Scope
- In: install from App Store / Google Play (verify publisher), first launch
  screens, add work or school account via QR from Security info, permission
  prompts (camera, notifications), test approval with number matching, App Lock mention.
- Out: personal Microsoft accounts, restoring from backup, admin/tenant setup.

## Environment assumptions (confirm)
- Work or school account (Microsoft Entra ID), registered via https://aka.ms/mysecurityinfo
- Tenant enforces number matching
- Platform shown: iPhone (iOS) primary, with Android differences called out? **(confirm)**

## Proposed outline (draft for GATE 1/2; ~2:00–2:30)
1. Title card
2. What you need (phone, computer, work account); 3 icons, ~6 s
3. On the computer: Security info → Add sign-in method → Microsoft Authenticator (desk shot)
4. On the phone: App Store → search → verify publisher → Get → Open (phone shot)
5. First launch: privacy notice, usage data, start screen
6. Add work or school account → allow camera → scan the QR code on the laptop (two-device shot)
7. Allow notifications
8. Test notification: number matching on laptop ↔ phone approval + biometric
9. Success on both devices
10. Safety habit: only approve sign-ins you started
11. End card (Landis support)

## Reference clips
| File | What it shows | Notes |
|---|---|---|

## Demo identity (fictional)
- User: Alex Morgan, alex.morgan@contoso.com **(or a Landis demo tenant?)**
- Org shown in app: Contoso

## Open questions
- iOS only, Android only, or both?
- Official Microsoft Authenticator icon file for the store/app scenes?
- Hands-free product style vs photographic hands (see scene-realism.md)?
