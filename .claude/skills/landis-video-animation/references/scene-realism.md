# Scene realism: devices, angles, environments

Goal: a viewer should read every shot as "a real phone / a real laptop on a
real desk", rendered cleanly, like a high-end product explainer. Not a cartoon,
and not a screen recording.

## What's built in code (always available)

| Asset | Component | Notes |
|---|---|---|
| Smartphone | `devices/Phone` | Unbranded. iOS (393×852 pt) or Android (412×915). Finishes: graphite, silver, black. 3D tilt, moving glass glare, side buttons, island/punch-hole. |
| Laptop | `devices/Laptop` | Real CSS 3D object: lid + keyboard deck + trackpad + front edge. `yaw`, `pitch`, `lidAngle`. Screen 1440×900. Unbranded, Windows-neutral. |
| FIDO2 key | `devices/SecurityKey` | Unbranded, USB-C or USB-A, gold touch contact, LED that blinks while awaiting touch (as real keys do), `pressed` state. |
| Backdrops | `scene/Stage` | `studio` (dark seamless), `light`, `desk` (matte tabletop fallback or photo plate). |
| Grounding | `ContactShadow` | Always seat devices resting on a surface with one. |

## What needs real imagery (ask the user)

Code can't produce convincing **wood grain, room environments or human hands**.
Those look fake when drawn. Two options; confirm which with the user per project:

1. **Photographic plates (recommended).** Stills the user shoots or licenses:
   - Desk plate: empty desk, 3/4 over-the-shoulder angle, laptop-sized clear
     area, soft daylight, 16:9, ≥ 3840 px wide. Put in `studio/public/plates/`.
     Shoot a matching version *with* the laptop for reference so screen corners
     can be matched, then composite our `Laptop` or corner-pin the screen.
   - Hand cutouts (PNG with alpha, ≥ 2000 px): hand holding a phone upright
     (screen area empty/green), index finger touching a key, fingertip tapping.
     Put in `studio/public/hands/`. Keep the same person/skin tone/sleeve across a series.
   Plates must be the company's own or licensed stock. Record the license in
   `studio/public/plates/LICENSES.md`.
2. **Hands-free product style.** Devices float/rest on the stage, touches are
   shown with `TapIndicator`, and the key touch uses the LED + press glow.
   This is how most premium explainers work (Apple, Microsoft, Yubico). It
   looks clean and needs no assets.

Never mix the two styles within one video.

## Camera and framing recipes

**Phone UI steps (most of the video).**
`Stage look="studio"`. Phone ~860–900 px tall, left-of-center (x ≈ 520–700),
rotateY −6°, rotateX 3°. Right third is free for callouts or a secondary
element. Push in (`Camera`, zoom 1.15–1.4) when the text being tapped is
small. Keep the phone's top edge ≥ 60 px from frame top at rest.

**App Store / Play Store.** Same framing. Recreate the store page for the
real app from reference (see screen-recreation.md for logo rules). Show:
search → result list with the correct publisher visible → Get/Install →
progress → Open. Spotlight the publisher name once ("published by Microsoft
Corporation") because lookalike apps exist.

**Over-the-shoulder desk (sign-in on a computer).**
`Stage look="desk"` (or plate). Laptop width 900–1000, `yaw` −14 to −18°,
`pitch` 12–16°, `lidAngle` ~106°, positioned left-of-center, ContactShadow
under the deck. Push in on the dialog when it appears (zoom ≈ 1.6–1.9
centered on the dialog). Step label bottom-left must not cover the dialog.

**Scanning a QR code on the laptop with the phone.**
Two-beat shot: (1) desk shot, QR dialog appears on the laptop; push in.
(2) Phone rises into the foreground at right, large (≈ 1000 px tall, partly
cropped by frame bottom is fine), rotateY +10° facing the laptop, screen showing the
camera viewfinder with the *same* QR (rendered with `DemoQrCode`) in a
scan frame, slightly perspective-skewed. On scan: viewfinder highlight →
the OS's "use passkey" / sign-in prompt → biometric prompt → success. Then
cut back to the laptop, which signs in. If Bluetooth proximity matters to
the procedure, mention it on screen with a small Bluetooth callout.

**Plugging in a FIDO2 key and touching it.**
Detail shot: laptop side edge close-up (or the key on the desk beside the
laptop, per the chosen style). Key slides in along its axis over ~0.8 s with
`ease.out` and seats with no bounce. PIN is entered in the OS dialog on the
laptop first (dots appear one at a time, ~4 frames apart). *Then* the LED
blinks; the touch happens (hand plate or `TapIndicator kind="hold"`); LED
goes solid; dialog completes. Callout: "Touch the gold contact". Adjust the
wording to the real key model shown in the footage.

## Lighting consistency

Light comes from upper-left in every shot: glare bands, shadows falling
down-right, highlights on top-left edges. When adding plates, pick ones lit
the same way, or flip them.
