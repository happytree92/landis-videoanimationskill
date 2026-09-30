import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../brand/tokens';
import {ease} from '../motion/tokens';

/**
 * Shows where the viewer should tap. Place it inside the coordinate space of
 * what is being tapped (e.g. inside <Phone> screen content, in points).
 *
 * Sequence: ring converges on the target (approach), a press dot appears,
 * one ripple expands and fades. Total ~0.9 s at 30 fps. No bounce.
 */
export const TapIndicator: React.FC<{
  x: number;
  y: number;
  /** Frame (scene-local) at which the press happens. */
  at: number;
  /** Diameter of the press dot in local units. */
  size?: number;
  color?: string;
  /** 'tap' (default) or 'hold' (dot stays for holdFrames). */
  kind?: 'tap' | 'hold';
  holdFrames?: number;
}> = ({x, y, at, size = 44, color = brand.colors.white, kind = 'tap', holdFrames = 24}) => {
  const frame = useCurrentFrame();
  const approachStart = at - 10;
  const releaseAt = kind === 'hold' ? at + holdFrames : at + 4;
  if (frame < approachStart || frame > releaseAt + 20) return null;

  const approach = interpolate(frame, [approachStart, at], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringScale = interpolate(approach, [0, 1], [1.8, 1]);
  const ringOpacity = interpolate(frame, [approachStart, at - 4, releaseAt, releaseAt + 8], [0, 0.9, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dot = interpolate(frame, [at - 2, at + 2, releaseAt, releaseAt + 8], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ripple = interpolate(frame, [releaseAt - 2, releaseAt + 18], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const base: React.CSSProperties = {
    position: 'absolute',
    left: x - size / 2,
    top: y - size / 2,
    width: size,
    height: size,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 50,
  };

  return (
    <>
      <div
        style={{
          ...base,
          border: `2.5px solid ${color}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
          boxShadow: '0 0 12px rgba(0,0,0,0.35)',
        }}
      />
      <div
        style={{
          ...base,
          background: color,
          opacity: dot * 0.55,
          transform: `scale(${0.6 + 0.2 * dot})`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
        }}
      />
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            ...base,
            border: `2px solid ${color}`,
            opacity: (1 - ripple) * 0.7,
            transform: `scale(${1 + ripple * 1.2})`,
          }}
        />
      ) : null}
    </>
  );
};
