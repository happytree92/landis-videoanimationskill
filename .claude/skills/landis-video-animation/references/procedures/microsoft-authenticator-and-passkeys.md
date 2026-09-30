# Domain notes: Microsoft Authenticator, passkeys, FIDO2 security keys

> **Status:** written from general knowledge as of late 2026, **not** checked
> against live Microsoft documentation (unreachable from the authoring
> environment). Treat every UI string here as *verify against the reference
> footage*. Before GATE 1, if network access allows, re-check against:
> - learn.microsoft.com/entra/identity/authentication/how-to-register-passkey-authenticator
> - learn.microsoft.com/entra/identity/authentication/how-to-enable-passkey-fido2
> - support.microsoft.com "Set up the Microsoft Authenticator app as your verification method"
> - support.microsoft.com "Register a passkey / security key" for work or school accounts
> Update this file (and its date) when you do.

## Scope assumption (confirm with the user)

Landis customers are business users, so these notes assume a **work or school
account (Microsoft Entra ID)** managed by the customer's tenant, registered
through **Security info** (`https://aka.ms/mysecurityinfo`, which lands on
`mysignins.microsoft.com/security-info`). Personal Microsoft accounts use
different screens; don't mix them.

## Part 1: Install Authenticator and add a work account (push MFA)

Prerequisites: smartphone (iOS or Android, current-ish OS), a computer to
open Security info, and the work account password.

Typical flow:
1. **Computer:** open Security info (or get the "More information required" /
   "Let's keep your account secure" interrupt at sign-in) → **Add sign-in
   method** → **Microsoft Authenticator** → wizard: "Start by getting the app"
   → **Next** → "Set up your account" → **Next** → shows a **QR code**.
2. **Phone:** App Store / Google Play → search "Microsoft Authenticator" →
   verify publisher **Microsoft Corporation** → Get/Install → Open.
3. First launch screens (verify wording): privacy notice ("Microsoft respects
   your privacy") → **Accept**; usage data screen → **Continue**; then a start
   screen with options such as **Sign in with Microsoft**, **Add work or
   school account**, **Scan a QR code**, **Restore from backup**.
4. **Add work or school account** (or **+** → **Work or school account**) →
   **Scan QR code**. OS prompts: camera access → allow. Notifications → allow
   (required for push approvals).
5. Scan the QR code on the computer. The account appears in the app.
6. **Computer:** **Next** → the test notification. With **number matching**
   (default for Entra push), the computer shows a two-digit number; the
   phone shows "Are you trying to sign in?" with a field to enter it → enter
   → **Yes**. The phone may require Face ID / fingerprint / PIN.
7. Computer: "Notification approved" → **Next** → success → **Done**.

Worth including: turn on **App Lock** (on by default on many builds);
"Only approve requests you started. If you get one you didn't, tap **No,
it's not me** and contact support" (verify label).

## Part 2a: Passkey in Microsoft Authenticator (device-bound)

Facts to state accurately:
- A passkey in Authenticator is **device-bound**: it lives only on that
  phone, isn't synced, and must be re-created on a new phone.
- Requires the tenant to allow passkeys (FIDO2) including Authenticator.
- Phone OS minimums (verify current): iOS 17+, Android 14+.
- **Bluetooth on both devices** for cross-device registration/sign-in (the
  QR flow uses Bluetooth proximity, not just the camera). Internet on both.
- Authenticator must be enabled as a **passkey provider**:
  - iOS 18 (verify): **Settings → General → AutoFill & Passwords** →
    enable **Authenticator**. iOS 17: **Settings → Passwords → Password Options**.
  - Android 14+ (verify, varies by manufacturer): **Settings → Passwords,
    passkeys & accounts** (or **Passwords & autofill**) → enable **Authenticator**.
  The app usually prompts for this and deep-links into Settings.

Registration (two common routes, confirm which the footage uses):
- **From the app:** open Authenticator → tap the work account → **Create
  passkey** → sign in / MFA → follow prompts → verify with Face ID/fingerprint → done.
- **From Security info on the computer:** **Add sign-in method** →
  **Passkey in Microsoft Authenticator** → MFA → prompts about getting the app
  and choosing iOS/Android → QR code → scan with the **phone's camera** →
  phone offers to save the passkey in Authenticator → biometric → computer
  confirms → name the passkey → **Done**.

Cross-device sign-in (the QR scene):
1. Computer: sign-in page → **Sign-in options** → **Face, fingerprint, PIN
   or security key** (verify label), or pick passkey when prompted.
2. Windows Security dialog → choose **iPhone, iPad, or Android device** (verify) → QR code appears.
3. Phone: open the Camera app (iOS) or camera/QR scanner (Android) → scan →
   tap the prompt to sign in with a passkey.
4. Phones connect over Bluetooth ("Connecting to your device…").
5. Authenticator asks for Face ID / fingerprint / PIN → approve.
6. Computer signs in.
Same-device sign-in (on the phone itself): choose passkey → Authenticator
biometric → done. Probably a short optional beat.

## Part 2b: FIDO2 security key

Facts:
- A security key holds a **device-bound passkey** in hardware. Needs a
  **security key PIN** (set on the key, not the Windows PIN), minimum 4
  characters (verify for the key model), then a **touch** to prove presence.
- Too many wrong PINs locks the key; the reset wipes it (attempt count varies
  by vendor). Mention "contact support" rather than giving a number.
- Connection: USB-A, USB-C, or NFC. The footage decides which we show.

Registration (Security info; verify labels, since Microsoft has been merging
"Security key" into "Passkey" in the picker):
**Add sign-in method** → **Passkey** / **Security key** → MFA → choose
**USB device** (or NFC) → **Next** → Windows Security: insert key → create or
enter the security key PIN → **touch the key** → back in the browser, **name
the key** → **Done**.

Sign-in on the web: **Sign-in options** → **Face, fingerprint, PIN or
security key** → Windows Security → insert key → enter PIN → touch → signed in.

⚠️ **Clarify with the user:** "access to the computer after the PIN is
entered" could mean *web sign-in* (above) **or** *Windows sign-in on an
Entra-joined PC* (lock screen → **Sign-in options** → security key icon →
insert key → PIN → touch). They're different procedures and screens.

## Security messaging to include

- Only approve sign-ins you started.
- Passkeys can't be phished: they only work on the real Microsoft sign-in site.
- Keep the security key on your keyring; if lost, tell IT immediately so it can be removed.
- New phone? Passkeys in Authenticator don't move; set up again.
