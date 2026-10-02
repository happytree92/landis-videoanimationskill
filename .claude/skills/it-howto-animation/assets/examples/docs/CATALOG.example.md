<!-- Repo copy: the real employee name/email and the five customer organization names in the original were replaced
     with placeholders. Everything else is unchanged. -->
# Reference footage catalog

Reference only — nothing here appears in the final videos. Refer to clips as `ID @ m:ss` (e.g. `C1 @ 0:34`).
Contact sheets: `reference/sheets/<ID>_NN.jpg` (1 frame / 2 s, 4×3 grid = 24 s per sheet).
Phone close-ups (Video 1 clips): `reference/detail/<ID>_dNN.jpg` (1 frame / 2 s, 3 per sheet).

Real data seen in footage that MUST be replaced: user name "<real user name>", email `<real.user>@landisit.com`,
account label "Landisit", tenant branding "Welcome to Landis Technologies!" + Landis logo on sign-in pages,
number-match code "90", location "Pennsylvania, United States" + map, browser bookmarks/tabs (Time Matrix, Keeper, HaloPSA,
SentinelOne, DNS Filter, ThreatLocker), profile photos, taskbar/weather, RecForth watermark.

## Index

| ID | File | Length | Type | Device / OS | Used for |
|----|------|--------|------|-------------|----------|
| C2 | usingtheauthapp.MP4 | 0:41 | Camera, hands + phone | Samsung Galaxy, Android (One UI), dark mode, Work profile | **Video 1** – download, install, first run |
| C1 | configuringauthapp.MP4 | 1:10 | Camera, hands + phone | same phone | **Video 1** – sign in, create passkey |
| C3 | signinginwithmobilepasskey.MP4 | 0:29 | Camera, laptop + phone | ThinkPad, Windows 11 + Android phone | **Video 2** – QR cross-device sign-in |
| R1 | 20260930114528.mp4 | 0:38 | Screen recording | Windows 11, Edge InPrivate | **Video 2** – laptop screen side of C3 |
| C4 | addingafido2keytomsaccount.MP4 | 1:02 | Camera, laptop + USB key | ThinkPad, Windows 11, USB-A FIDO2 key | **Video 3a** – register security key |
| R2 | 20260930115613.mp4 | 1:08 | Screen recording | Windows 11, Edge | **Video 3a** – laptop screen side of C4 |
| C5 | signingintomsaccountwithfido2.MP4 | 0:32 | Camera, laptop + USB key | same | **Video 3b** – sign in with key |
| R3 | 20260930115800.mp4 | 0:39 | Screen recording | Windows 11, Edge InPrivate | **Video 3b** – laptop screen side of C5 |

Camera clips: 1920×1080 59.94 fps, ambient audio only (no narration). Screen recordings: 1920×1080, no audio.

| I1 | iphone recording.mp4 | 0:55 | Screen recording (portrait 1180×2556, 60 fps) | iPhone, iOS (Liquid Glass UI), Settings in dark mode | **Video 1** – iPhone: existing account → **Create a passkey** |

| I2 | iphonescanningpasskey.mp4 | 1:08 | Screen recording (portrait 1180×2556, 60 fps) | iPhone, iOS | **Video 2** – iPhone scans laptop QR with Authenticator |

---

## I2 — iPhone: sign in on a computer by scanning its QR code (Authenticator QR button)
Sheets: `reference/detail/I2_dNN.jpg` (1 frame/s, 6 per sheet). Redact: tenant/customer account list, personal Messages app-switcher
at 1:07 (contacts, message previews), email in the passkey prompt, location map.

| Time | Screen | Exact labels | Action |
|------|--------|--------------|--------|
| 0:00–0:20 | Home screen (idle) | — | — |
| 0:21–0:22 | Authenticator locked → Face ID | "Authenticator locked" / Unlock | Face ID |
| 0:23–0:25 | Push notification alert (unrelated, from the laptop's earlier sign-in) | "Are you trying to sign in?" Enter the number… App: OfficeHome · **No, it's not me** / Yes | User taps No → banner "Denied." — **omit from video** |
| 0:27 | Authenticator home | QR FAB (bottom-right, blue circle) | Tap **QR button** |
| 0:28–0:31 | In-app scanner | blue bar "‹ **Scan QR code**", viewfinder with corner brackets, "Your account provider will display a QR code", **Enter code manually** | Aim at laptop QR |
| 0:32–0:35 | iOS system sheet | person-key icon · **Your iPhone needs to connect to this device in order to sign in with a passkey.** · "You should only connect to the other device if you scanned a QR code in order to sign in with a passkey." · **Continue** · ✕ | Tap **Continue** |
| 0:36–0:58 | iOS system sheet | spinner "**Connecting...**" · footer "Make sure both devices are connected to the internet and have Bluetooth turned on." | Wait (22 s in footage — compress) |
| 0:59–1:01 | iOS system sheet | Face ID glyph · **Sign In** · 'Sign in to "login.microsoft.com" on the other device with your passkey for "<email>" saved in "Authenticator"?' · **Use Passkey** / More Options | Tap **Use Passkey** |
| 1:02–1:04 | Face ID | Face ID ✓ | — |
| 1:04–1:06 | Back to scanner → home | — | Done |

Key finding: Authenticator's in-app QR scanner **does** handle the passkey QR on iOS (Microsoft Learn says to use the system camera).

---

## I1 — iPhone: create a passkey from an existing Authenticator account
Detail sheets: `reference/detail/I1_dNN.jpg` (1 frame / 2 s, 6 per sheet). Extra real data to redact: account list with other
tenants/customers (<Customer A>, <Customer B>, <Customer C>, <Customer D>, <Customer E>),
emails, a live one-time password code, Keeper as a third-party AutoFill provider.

| Time | Screen | Exact labels | Action |
|------|--------|--------------|--------|
| 0:00–0:02 | Home → app opens locked | Authenticator icon; "Authenticator locked" + Face ID glyph, "Unlock" | Face ID unlocks |
| 0:04–0:06 | Authenticator home (light, blue title bar) | ☰ **Authenticator** 🔍 ＋; warning banner "**Passkeys are turned off** / Allow using passkeys from this app." [**Turn on**]; account rows (org name / email); QR FAB; tabs Authenticator / Verified IDs | Tap the work account |
| 0:08 | Account detail | blue header: org name + email; "WAYS TO SIGN IN OR VERIFY": Passwordless sign-in requests ("Sign in without a password."), One-time password code; "OTHER WAYS TO SIGN IN": **Create a passkey** ›; "MANAGE": Change password, Update security info, Review recent activity ↗ | Tap **Create a passkey** |
| 0:09–0:10 | Authenticator (light) | passkey illustration · **Let's create your passkey** · "It takes less than a minute to help secure your account with a passkey. Once set up, you can sign in faster and more securely with your face, fingerprint, or PIN. First, sign in with your <email> account to verify your identity." · **Sign in** | Tap **Sign in** |
| 0:10.5 | Authenticator | spinner "Checking organization policies..." | — |
| 0:11 | Loading | blue bar with **Cancel** | — |
| 0:12 | Entra sign-in (in-app) | tenant logo, email, **Sign in**, "We'll send a sign-in request to your phone to sign in with <email>." · Sign in another way · Sign in with another account · **Send notification** · bottom "Get codes" | Tap **Send notification** |
| 0:16 | Approve + iOS alert | "Approve sign in" page under alert "**Are you trying to sign in?**" org/email, App: Microsoft Authenticator App, Location + Apple Maps · **Yes** / No, it's not me / Cancel | Tap **Yes** |
| 0:18 | Face ID check | spinner + Face ID ✓ | — |
| 0:20 | Authenticator | illustration · **Turn on AutoFill in Authenticator on the next screen** · "This is required to use a passkey with Microsoft Authenticator and sign in with your face, fingerprint, or PIN." · **Continue** | Tap **Continue** |
| 0:22 | iOS system alert | **Turn on AutoFill from "Authenticator"?** "When AutoFill is enabled, credentials from "Authenticator" will be suggested for filling in apps. You can change this later in Settings." **Not Now** / **Turn On** | Tap **Turn On** |
| 0:24–0:28 | Authenticator | spinner "Creating passkey" (appears right after Turn On — no extra Face ID prompt) | — |
| 0:30 | Authenticator home | banner gone | (passkey created) |
| 0:32–0:44 | Settings › General › **AutoFill & Passwords** (verification only) | "AutoFill Passwords and Passkeys" on · "AutoFill from:" **toggles**: Passwords (Passkeys, passwords, and codes), Keeper, **Authenticator** (Passkeys) — all on | User confirms Authenticator is on |
| 0:46–0:48 | Authenticator sheet over Settings | Cancel · **Authenticator** · ✓ illustration · **You're all set** · "You can now use Microsoft Authenticator to access your Entra passkeys." · **Go to Authenticator** / Go to Settings | Tap **Go to Authenticator** |
| 0:50–0:54 | Locked → home | Face ID → Authenticator home | End |

Key findings: on iPhone the provider is enabled by an **in-app system prompt ("Turn On")**, not by navigating Settings; the
Settings visit is optional verification. Entry point for an existing account is **account → Create a passkey** (also the
"Passkeys are turned off → Turn on" banner).

---

## C2 — Download & install Authenticator (Android)

| Time | Screen | Exact labels | Action |
|------|--------|--------------|--------|
| 0:00 | Home screen | Play Store icon in dock | Tap **Play Store** (personal profile) |
| 0:02 | App drawer, Personal / **Work** tabs | Work apps: Company Portal, Contacts, Creative studio, Edge, Hudu, My Files, Outlook, **Play Store**, Starlink, Teams, UniFi | Opens Work-profile Play Store |
| 0:04 | Play Store home | "Search or ask Play"; Microsoft Authenticator tile already suggested | Tap search |
| 0:06 | Search | "Search apps & games" → suggestion "microsoft authenticator" | Tap suggestion |
| 0:08 | Results | "Apps" row: Microsoft Authenticator, Microsoft Outlook (Installed), Microsoft Edge (Installed) | Tap **Microsoft Authenticator** (install starts) |
| 0:10–0:12 | App page, downloading | "Microsoft Authentica…", "Verified by Play Protect", progress "1% of 39.89 MB", **Cancel**, "Auto-open when ready / Jump into the app after it installs" toggle, "Similar apps" | Wait |
| 0:14 | Installed | "Microsoft Authenticator", "Installed", **Uninstall** / **Open** | Tap **Open** |
| 0:16 | Splash | Authenticator logo on dark | — |
| 0:18 | System dialog | "Allow **Authenticator** to send you notifications?" **Allow** / **Don't allow** | Tap **Allow** |
| 0:20 | Privacy | "Microsoft respects your privacy" / "We collect required diagnostics data to keep the app secure and updated. This does not include any personal data." **Accept**, "Microsoft privacy statement" | Tap **Accept** |
| 0:22 | Telemetry | "Help us improve Microsoft Authenticator" … checkbox "Help improve the app by sharing your app usage data" (unchecked) **Continue** | Tap **Continue** |
| 0:24 | Battery | "Stay signed in to your accounts by keeping Microsoft Authenticator running in the background" / "Turn off battery optimization to stay signed in with single sign-on and get important work notifications." / "This is required to use the Authenticator app." Button "Turn off battery optimization" | Tap button |
| 0:26 | First run | **Skip** (top-right), "Peace of mind for your digital life", **Sign in with Microsoft** (filled), **Add work or school account**, **Scan a QR code**, "You can get a QR code from your organization or account provider, such as Microsoft, Google, or Facebook.", "Restore from backup" | — |
| 0:28 | | | Tap **Scan a QR code** |
| 0:30 | System dialog | "Allow **Authenticator** to take pictures and record video?" **While using the app** / Only this time / Don't allow | Tap **While using the app** |
| 0:32–0:40 | Scanner | Header "Scan QR Code", "Your account provider will display a QR code.", **Enter code manually** | Camera pointed at desk – **no QR shown; clip ends** |

⚠ Gap: the account is added off-camera between C2 (11:20) and C1 (11:34).

## C1 — Sign in & create passkey in Authenticator (Android)

| Time | Screen | Exact labels | Action |
|------|--------|--------------|--------|
| 0:00 | Authenticator home | "Authenticator" + ＋ 🔍 ⋮; account row "Landisit / <user>…@landisit.com"; "Already have a backup? Sign in to your recovery account." "Begin recovery"; QR FAB; bottom tabs **Authenticator** / **Verified IDs** | Tap account row |
| 0:04 | Authenticator | "Let's create your passkey" + passkey illustration; "Passkeys are a fast and secure way to sign in with your face, fingerprint or PIN. We'll help you create yours. First, sign in with your <email> account to verify your identity." **Sign in** | Tap **Sign in** |
| 0:06 | Loading | blank page | — |
| 0:08–0:20 | Entra sign-in (light) | tenant logo, "← <email>", **Enter password**, "Your organizational policy requires you to sign in again after a certain time period.", "Password", "Forgot my password", **Sign in**, banner "Welcome to Landis Technologies!" | Type password (masked), tap **Sign in** |
| 0:22 | Progress bar | | — |
| 0:24 | Entra | "<email>", **Approve sign in request**, "Open your Authenticator app and approve the request. Enter the number if prompted." big number **90**, "Didn't receive a sign-in request? **Swipe down** to refresh the content in your app.", "I can't use my Microsoft Authenticator app right now" | Notification drops in: "Approve sign-in? …" – tap it |
| 0:28 | Authenticator prompt (dark) | "Are you trying to sign in?" "Landis Technologies / <email>", "App: Microsoft Authenticator App", "Location: Pennsylvania, United States" + map, "Enter the number shown to sign in.", field "Enter number here" = 90, numeric keypad | Enter 90, tap **Yes** (off-screen) |
| 0:30 | Biometric sheet | "Authenticator / Approve sign-in? / You need to confirm your sign in with biometrics or passcode. / Scan your fingerprint." **Use pattern** | Fingerprint |
| 0:32 | Spinner | toast "Approved" | — |
| 0:34–0:36 | Authenticator | "Step 1 of 1", **Allow Authenticator to use passkeys**, illustration; 1 "Open Settings and go to **Passwords & accounts**" 2 "Select the **Work** tab" 3 "Turn on **Authenticator** as a passkey provider" 4 "Come back here to continue"; **Skip** / **Settings** | Tap **Settings** |
| 0:38–0:40 | Samsung Settings | "Passwords, passkeys, and a…" tabs Personal / **Work**; "Manage services for passkeys and for automatically entering passwords and other information…"; "Preferred service" = **None** ⚙ | Tap **Preferred service** |
| 0:42–0:44 | Samsung Settings | "Preferred service" / "Set a preferred service for saving and entering passwords, passkeys, and autofill information." radio list: Hudu, **Microsoft Authenticator**, Google, Edge, None, + Add service | Select **Microsoft Authenticator** |
| 0:46 | | | Back to Authenticator |
| 0:48 | Authenticator | "Step 1 of 1", **You can now use passkeys with Authenticator**, "To use passkeys with Authenticator, make sure to keep it turned on as a passkey provider." ✓ "Authenticator is now a passkey provider." **Continue** | Tap **Continue** |
| 0:50–0:52 | System | 🔒 "Use your screen lock to create a passkey" / "Draw your current pattern." 3×3 dots | Draw pattern |
| 0:54–0:58 | Authenticator | spinner "Creating passkey" | — |
| 1:00 | Authenticator | **Passkey created for this profile**, shield ✓, "You can now use your passkey with Authenticator. Your passkey is called: **Authenticator - Android**"; "To sign in with your passkey": "Use the Android profile where your passkey was created." / "Make sure Authenticator is turned on as a passkey provider." / "Select **Face, fingerprint, or PIN.**"; "How to use your passkey"; **Done** | Tap **Done** |
| 1:02 | Authenticator home | account row | Tap account |
| 1:04–1:09 | Account detail | "Ways to sign in or verify": **Passkey**; "Other ways to sign in": Set up 2-step verification, Set up Passwordless sign-in requests; "Manage": Change password, Update security info, Review recent activity, Reset device notifications | End |

---

## C3 — QR cross-device passkey sign-in (camera)

| Time | What |
|------|------|
| 0:00–0:04 | Laptop: Windows Security "Sign in with a passkey" (Windows Hello fingerprint prompt) → user picks "Choose a different passkey" |
| 0:06 | Browser: "Face, fingerprint, PIN or security key" page |
| 0:08 | Windows Security "Choose a passkey": <email> / **iPhone, iPad, or Android device** / Security key |
| 0:10 | QR code: "Scan this QR code with your phone or tablet" |
| 0:12–0:14 | Phone camera app frames QR on laptop screen |
| 0:16–0:18 | Phone: passkey sign-in prompt for login.microsoft.com account → screen-lock / biometric prompt |
| 0:20–0:28 | Laptop: loading → My Sign-Ins "Security info" page |
(Needs close-up pass before Video 2.)

## R1 — QR cross-device sign-in (laptop screen)
0:00–0:10 "Sign in with a passkey" fingerprint prompt · 0:12 "Choose a passkey" · 0:14 "Face, fingerprint, PIN or security key" · 0:16–0:20 QR "Scan this QR code with your phone or tablet" · 0:22–0:24 "Device connected! Continue on your device" · 0:26–0:28 loading · 0:30–0:38 Security info page.

## C4 / R2 — Register a FIDO2 security key (Security info)
R2: 0:00 Security info → **+ Add sign-in method** · 0:06 "Add a sign-in method": Passkey in Microsoft Authenticator / **Security key** / Microsoft Authenticator / Hardware token / Email · 0:08 "Security key — Choose the type of security key that you have." **USB device** / NFC device · 0:10–0:14 "Have your key ready" … **Next** · 0:16–0:18 "Your device will redirect you to a new window to finish setup." · 0:22–0:24 Windows Security "Save your passkey" → "Insert your security key into the USB port." · 0:26–0:38 "Enter your security key PIN" (masked) **OK** · 0:40 "Touch your security key." · 0:42 "Setting up your passkey…" **Next** · 0:46–0:56 "Name your security key…" → "Security Key" **Next** · 0:58 "You're all set!" **Done** · 1:00 list shows "Passkey (Device-bound) – Security Key".
C4 (camera): 0:22–0:26 key inserted into left USB-A port · 0:28–0:33 black/blurry (camera fumble) · 0:36–0:38 touch prompt · 0:48–0:52 typing key name.

## C5 / R3 — Sign in with the security key (InPrivate)
R3: 0:00–0:08 fingerprint prompt → "Choose a different passkey" · 0:10 "Choose a passkey" → **Security key** · 0:12–0:22 "Enter your security key PIN" **OK** · 0:24–0:26 "Touch your security key." · 0:28–0:38 signed in → Security info.
C5 (camera): 0:02–0:06 key inserted · 0:12–0:16 black/white flash (camera fumble) · 0:22 touch.
