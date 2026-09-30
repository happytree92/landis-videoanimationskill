import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../brand/tokens';
import {durations, ease} from '../motion/tokens';

/**
 * Dims everything except a rounded rectangle and outlines it. Place it in the
 * same coordinate space as the target (inside a device screen, or on canvas).
 */
export const Spotlight: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  at: number;
  exitAt?: number;
  dim?: number;
  /** Size of the coordinate space being dimmed. */
  spaceWidth: number;
  spaceHeight: number;
}> = ({x, y, width, height, radius = 14, at, exitAt, dim = 0.55, spaceWidth, spaceHeight}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [at, at + durations.medium], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outP =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + durations.short], [0, 1], {
          easing: ease.in,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const p = inP * (1 - outP);
  if (p <= 0) return null;
  const pad = (1 - inP) * 16;
  const id = `spot-${x}-${y}-${width}-${height}`;

  return (
    <svg
      width={spaceWidth}
      height={spaceHeight}
      style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 40}}
    >
      <defs>
        <mask id={id}>
          <rect width={spaceWidth} height={spaceHeight} fill="white" />
          <rect x={x - pad} y={y - pad} width={width + pad * 2} height={height + pad * 2} rx={radius} fill="black" />
        </mask>
      </defs>
      <rect width={spaceWidth} height={spaceHeight} fill="black" opacity={dim * p} mask={`url(#${id})`} />
      <rect
        x={x - pad}
        y={y - pad}
        width={width + pad * 2}
        height={height + pad * 2}
        rx={radius}
        fill="none"
        stroke={brand.colors.accent}
        strokeWidth={3}
        opacity={p}
      />
    </svg>
  );
};
