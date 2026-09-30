import {Easing} from 'remotion';

/**
 * Motion language: clean, deliberate, no overshoot.
 * See references/motion-language.md for when to use each curve.
 *
 * Rule: no springs with bounce, no elastic/back easings, no scale-pops.
 * Things ease in from a short distance (12-32px) with an opacity fade.
 */
export const ease = {
  /** Default for anything entering or moving to a new resting place. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Symmetric moves: camera pushes, device repositioning. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Things leaving the frame. Short and quick. */
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Near-linear for progress bars and loaders. */
  linear: Easing.linear,
};

/** Durations in frames at 30 fps. Use `dur(...)` if the project fps differs. */
export const durations = {
  micro: 8, // tap feedback, toggle flips
  short: 12, // UI element enter/exit, fades
  medium: 18, // screen-to-screen app navigation, callouts
  long: 30, // camera pushes, device moves
  scene: 15, // cross-scene transition length (0.5 s)
};

/** Travel distances in px (1920x1080 space). */
export const travel = {
  small: 12,
  medium: 24,
  large: 48,
};
