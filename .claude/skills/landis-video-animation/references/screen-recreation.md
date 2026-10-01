# Recreating app and OS screens from reference frames

Every phone/desktop screen in a video is a React component in
`studio/src/projects/<slug>/screens/`, rebuilt from a reference frame.

## Process per screen

1. Pick the cleanest reference frame (from `analysis/<clip>/scenes/`). Note
   its filename/timestamp in the component's header comment and in the scene's `source`.
2. Work in logical units: iOS 393×852 pt, Android 412×915 dp, desktop
   1440×900 px. Convert from the reference: `pt = px / (refWidth / 393)`.
3. Rebuild the layout with `ui/ios` or `ui/windows` primitives. Extend the
   primitives when a pattern repeats; don't fork one-off styles.
4. Copy all visible text **exactly**: capitalization, punctuation,
   ellipses, straight vs curly apostrophes. These are what the voiceover and
   viewers will match against.
5. Replace personal data with the brief's demo identity (see below).
6. Export named layout constants for anything that will be tapped
   (`export const ADD_BUTTON = {x, y, w, h}`), and derive TapIndicator /
   Spotlight positions from them.
7. Render a still and compare it side by side with the reference frame.
   Layout, hierarchy, wording and state must match; pixel perfection isn't
   the goal, recognisability is.

## Fidelity rules

- **Function over decoration.** Everything the viewer must find, read or tap
  is exact. Background decoration (store screenshots, wallpapers) is simplified.
- **States are separate screens or props:** default, pressed, loading,
  success, error. Show the pressed state for ~3 frames when tapped.
- **System fonts:** use `systemUiFamily` (Inter) for iOS/Windows chrome;
  SF Pro and Segoe UI aren't licensed for video. Match size and weight.
- **Status bar:** 9:41, full signal, full battery on iOS; consistent across the video.
- **Dark/light mode:** match the reference; don't switch mid-video.
- **Platform variants:** if the procedure differs on Android, build the
  Android screens too, or add an explicit "On Android…" beat. Never show
  iOS UI while narrating Android steps.

## Third-party logos and app icons

The viewer needs to recognise the real app (e.g. the Microsoft Authenticator
icon, the App Store). Use the vendor's official asset, supplied by the user
into `studio/public/brand/third-party/` with a note of its source, and show it
unmodified at its intended proportions. Don't redraw a vendor logo by hand. If
the official asset isn't available, use a neutral placeholder tile and flag it
in the draft review; don't ship the placeholder.

## Demo identity (fictional data)

Defined in `projects/<slug>/brief.md`. Default if the user hasn't chosen:
- User: **Alex Morgan**, `alex.morgan@contoso.com` (Contoso is Microsoft's
  own fictitious sample company)
- Organization shown in the app: **Contoso**
- Number-match codes: two digits, different in every occurrence (e.g. 47, 82)
- QR codes: `DemoQrCode` only (payload: "DEMO ONLY…")
- Device names: "Alex's iPhone", "CONTOSO-LT-0421"
Ask whether they'd rather show a Landis-branded demo tenant.

## Practical rules

- **Compute tap coordinates from layout** (element top + half its height), export them as constants, then QA a frame. Never eyeball.
- **Avoid generic names** that collide with device-shell styles (`body`, `label`, `btn`, `screen`). In React,
  scope styles to the component; in any shared CSS, prefix screen classes.
- Keep every app/OS screen in its own component under `projects/<slug>/screens/` and let scenes stack the views they need.
- Never rewrite UTF-8 source files through PowerShell `Get-Content`/`Set-Content` without `-Encoding utf8`;
  it corrupts characters like `...`, arrows and en dashes. Use editor tools for file edits.
