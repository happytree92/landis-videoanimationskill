# Motion language

The target feel is a premium product explainer: calm, precise, confident.
The viewer should always know where to look, and nothing should move without a reason.

## Curves (`studio/src/motion/tokens.ts`)

| Token | Bezier | Use |
|---|---|---|
| `ease.out` | 0.16, 1, 0.3, 1 | Anything arriving or settling (default) |
| `ease.inOut` | 0.65, 0, 0.35, 1 | Camera moves, device repositioning, scene transitions |
| `ease.in` | 0.7, 0, 0.84, 0 | Things leaving (keep exits shorter than entrances) |
| `ease.linear` | n/a | Progress bars, loaders, constant rotation only |

**Banned:** bouncy springs, `Easing.elastic`, `Easing.back`, overshoot,
wobble, squash/stretch, confetti, emoji, scale-pop entrances (scale 0 → 1),
spinning entrances, drop-in-from-top with bounce. If you use Remotion's `spring()`, set
`overshootClamping: true` and damping ≥ 200. In practice, prefer `interpolate` + tokens.

## Durations (30 fps)

| Token | Frames | Seconds | Use |
|---|---|---|---|
| micro | 8 | 0.27 | Tap feedback, toggle flip, button press |
| short | 12 | 0.4 | UI element enter/exit, fades, dialogs |
| medium | 18 | 0.6 | App screen push, callouts, spotlight |
| long | 30 | 1.0 | Camera push-in, device move, lid open |
| scene | 15 | 0.5 | Cross-scene transition |

Travel distances: 12 / 24 / 48 px. Elements fade in while travelling ≤ 24 px.

## Transitions between scenes

- `fade` (default): cross-dissolve. Use between most scenes.
- `slide-left`: only for "next step in the same place" sequences.
- `wipe`: chapter changes at most. Use sparingly.
- `cut`: when continuity is obvious (same shot, new state).
Never mix more than two transition types within a chapter.

## Choreography rules

- **One idea at a time.** Stagger related elements 3–6 frames apart; never
  animate more than two things simultaneously in the viewer's focus area.
- **Lead the eye, then act.** Camera push or spotlight lands first, then the
  tap indicator ~10 frames later, then the UI responds.
- **Real UI timing.** In-app transitions mirror the OS: iOS push ≈ 0.5 s,
  alerts fade/scale from 1.08 → 1, sheets slide up. Don't speed up system UI
  to be snappy, and don't slow it down to be dramatic.
- **Hold after every state change** long enough to read it: at least 1 s,
  or 0.3 s per 5 words of on-screen text, whichever is longer.
- **Camera:** max zoom ~2.2x on a phone screen. Only push in when the target
  UI text would be under ~22 px tall on the 1080 canvas. Always ease inOut;
  never zoom and pan in different curves.
- **Devices** enter with a short rise + fade and a small rotation settle
  (e.g. rotateY −14° → −6° over 1.2 s). They never spin or flip.
- **Idle life:** a very slow drift (≤ 1.04x over a scene) or glare shift is
  fine; constant floating/bobbing is not.

## Overlays

- **TapIndicator** for every tap, placed in the tapped element's own coordinate
  space. Use `kind="hold"` for press-and-hold and for touching a security key.
- **Spotlight** to isolate a UI region (dim 0.55). Only one at a time.
- **Callout** (leader line + label) is for hardware and device-level things
  (a key's gold contact, a port, the phone's camera). Don't point
  white leader lines into white app screens; use Spotlight there instead.
- **StepLabel** persists across all scenes of a step (Timeline handles this).
- Keep all text within safe area (96 px × 72 px insets on the 1080 canvas).
