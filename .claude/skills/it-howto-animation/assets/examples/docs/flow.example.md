# Video 2 — Flow: Sign in on a computer with the passkey on your phone

**Decisions (2026-10-01):** Android + iPhone side by side for the phone steps · both phones scan with **Authenticator's QR
button** (I2; docs also list it for Android) · computer = generic Windows 11 laptop, normal Edge window · start by entering
email ("email first") · sign in to **Security info** (My Sign-Ins) and finish on that page, as recorded in R1 · Contoso identity.

**Sources checked 2026-10-01**
- Sign in with passkeys in Authenticator for Android and iOS — https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-sign-in-passkey-authenticator (updated 2026-07-06). Cross-device needs **Bluetooth + internet on both devices**; Windows 11 23H2+ shows "iPhone, iPad, or Android device".
- Footage: R1 (laptop screen), C3 (Android, camera), I2 (iPhone screen recording).

⚑ = label not seen in footage (built from docs / standard Entra pages) — verify before final.

## Computer (laptop)
| # | Screen | Exact labels | Action | Ref |
|---|--------|--------------|--------|-----|
| L1 | Browser → Microsoft sign-in | address mysignins.microsoft.com · Microsoft logo · **Sign in** · field "Email, phone, or Skype" · Can't access your account? · **Next** | type email, Next | DOC (standard page) |
| L2 | Password page | "← alex.morgan@contoso.com" · **Enter password** · Forgot my password · **Other ways to sign in** ⚑ · Sign in | click **Other ways to sign in** | DOC |
| L3 | Sign in another way ⚑ | **Sign in another way** · **Face, fingerprint, PIN or security key** · Approve a request on my Microsoft Authenticator app · Use my password | click **Face, fingerprint, PIN or security key** | DOC |
| L4 | Entra | **Face, fingerprint, PIN or security key** · "Your device will open a security window. Follow the instructions there to sign in." | — (Windows dialog opens) | R1 0:14 |
| L5 | Windows Security | **Choose a passkey** · "Passkey for login.microsoft.com" · **iPhone, iPad, or Android device** · Security key · Cancel | click **iPhone, iPad, or Android device** | R1 0:12 (local Windows Hello entry removed) |
| L6 | Windows Security | **Sign in with a passkey** · "iPhone, iPad, or Android device / Passkey for login.microsoft.com" · QR code · "Scan this QR code with your phone or tablet" · Choose a different passkey · Cancel | — | R1 0:16–0:20 (QR replaced with a random non-functional pattern) |
| L7 | Windows Security | phone glyph · **Device connected!** / **Continue on your device** · Choose a different passkey · Cancel | — | R1 0:22–0:24 |
| L8 | My Sign-Ins | loading → **Security info** · "These are the methods you use to sign into your account or reset your password." · + Add sign-in method · Password · Passkey (Device-bound) Microsoft Authenticator … | — | R1 0:28–0:38 |

## Phone (split: Android | iPhone)
| # | Android (C3 + C1) | iPhone (I2) |
|---|---|---|
| P1 | Authenticator home (dark) → tap **QR button** (FAB) — C1 0:00 FAB | Authenticator home (light) → tap **QR button** — I2 0:27 |
| P2 | Scanner "**Scan QR Code**" / "Your account provider will display a QR code." / Enter code manually (C2 0:32 style) — viewfinder frames the laptop QR | "‹ **Scan QR code**" / "Your account provider will display a QR code" / Enter code manually — I2 0:28 |
| P3 | "**Connecting with another device**" spinner — C3 0:16 | Sheet: **Your iPhone needs to connect to this device in order to sign in with a passkey.** … **Continue** — I2 0:32 |
| P4 | Sheet: Microsoft Authenticator icon · **Sign in to login.microsoft.com with your saved passkey?** · Alex Morgan / alex.morgan@contoso.com · Cancel / **Sign in** — C3 0:17 ⚑ (blurry in footage) | "**Connecting...**" · "Make sure both devices are connected to the internet and have Bluetooth turned on." — I2 0:36 |
| P5 | **Use your screen lock to sign in with your passkey** · Scan your fingerprint · Use pattern · fingerprint glyph — C3 0:18 | **Sign In** · 'Sign in to "login.microsoft.com" on the other device with your passkey for "alex.morgan@contoso.com" saved in "Authenticator"?' · **Use Passkey** / More Options — I2 0:59 |
| P6 | fingerprint ✓ → back | Face ID ✓ → back — I2 1:02 |

## Omitted from footage (by decision)
- R1 0:00–0:10 Windows Hello fingerprint prompt + "Choose a different passkey" (laptop already had a local passkey).
- I2 0:23–0:25 unrelated push notification that was denied.
- C3 system camera scan (replaced by Authenticator QR button on both phones).
- I2 22-second "Connecting..." wait (shown ~2.5 s).
