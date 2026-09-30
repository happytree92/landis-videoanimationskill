# Sign in with a passkey (Video 2 of the MFA series)

Status: **awaiting reference footage + design guide.** Nothing below is approved yet.

## Intent (from the requester)
Fully animated, instruction-correct how-to covering:
1. Setting up a passkey in the Microsoft Authenticator app
2. Adding a FIDO2 security key to the Microsoft account
3. Using them: (a) scanning the QR code with the phone to sign in on a
   computer; (b) plugging a FIDO2 key into a laptop/desktop, entering the
   PIN, and touching the key to get access

Visual direction: a realistic laptop on a realistic desk, seen from an
over-the-shoulder-style angle; the phone scans the QR code on the laptop and
authenticates the session; then the same with the FIDO2 key and a hand
touching it after the PIN is entered. Professional, modern, clean
transitions, nothing cartoonish.

- Format: 16:9, drafts 1080p, final 3840×2160; VO after picture lock

## Audience
Same as Video 1. Assumes Authenticator is already set up (Video 1).

## Proposed structure (~3:30–4:30, three chapters)
- **Part 1: Passkey in Authenticator.** Prereqs (iOS 17+/Android 14+,
  Bluetooth on), enable Authenticator as passkey provider in phone Settings,
  create the passkey (app route or Security info route, matching the footage).
- **Part 2: Add a security key.** Security info → add security key → USB →
  insert → set PIN → touch → name it.
- **Part 3: Sign in.** (a) QR + phone over Bluetooth → biometric → signed in;
  (b) security key → PIN → touch → signed in.
- Safety wrap-up: phishing-resistant, keep the key safe, new phone = new passkey.
- End card.

Alternative: split into 2a (passkey in Authenticator + QR sign-in) and 2b
(security key register + sign-in) if runtime exceeds ~4 min. Many customers
will only ever use one method.

## Scope decisions to confirm
- "Access to the computer" with the key: **web sign-in** (browser) or
  **Windows sign-in on an Entra-joined PC** (lock screen)? Different screens.
- Security key model/connector in the footage (USB-A, USB-C, NFC)? Brand shown or generic?
- Windows 11 dialogs assumed on the laptop. Confirm OS/browser in footage.
- Hands: photographic hand plates (need assets) or hands-free product style?

## Reference clips
| File | What it shows | Notes |
|---|---|---|

## Demo identity (fictional)
- User: Alex Morgan, alex.morgan@contoso.com
- Laptop name: CONTOSO-LT-0421
- Key name shown in Security info: "Alex's security key"
