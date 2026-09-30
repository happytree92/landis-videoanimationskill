import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {durations, ease, travel} from './tokens';

type EasingFn = (t: number) => number;

/** Frame count for a time in seconds at the composition fps. */
export const useSec = () => {
  const {fps} = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};

/** 0 -> 1 progress between two frames, clamped and eased. */
export const useProgress = (from: number, duration: number, easing: EasingFn = ease.out) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + Math.max(1, duration)], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/**
 * Standard enter/exit: fade + short rise. Returns a style object.
 * `exitAt` is optional; when set, the element fades out starting at that frame.
 */
export const useEnterExit = (opts: {
  at: number;
  exitAt?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}) => {
  const {at, exitAt, distance = travel.medium, direction = 'up', duration = durations.short} = opts;
  const enter = useProgress(at, duration, ease.out);
  const exit = useProgress(exitAt ?? Number.MAX_SAFE_INTEGER, durations.short, ease.in);
  // Enter travels toward rest; exit keeps moving the same way.
  const offset = (1 - enter) * distance - exit * (distance / 2);
  const sign = direction === 'up' || direction === 'left' ? 1 : -1;
  const axis = direction === 'up' || direction === 'down' ? 'Y' : 'X';
  return {
    opacity: enter * (1 - exit),
    transform: `translate${axis}(${sign * offset}px)`,
  } as const;
};
