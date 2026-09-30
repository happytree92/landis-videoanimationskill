import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {brand} from '../brand/tokens';
import {interFamily} from '../brand/fonts';
import {durations, ease} from '../motion/tokens';

/**
 * Leader-line callout in canvas px (1920x1080). A dot marks the target, a thin
 * line draws out to the label, then the label fades in. Use for naming a UI
 * element or a hardware part ("Touch the gold contact").
 */
export const Callout: React.FC<{
  target: {x: number; y: number};
  label: {x: number; y: number};
  text: string;
  sub?: string;
  at: number;
  exitAt?: number;
  align?: 'left' | 'right';
}> = ({target, label, text, sub, at, exitAt, align = 'left'}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [at, at + durations.medium], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textIn = interpolate(frame, [at + 8, at + 8 + durations.short], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const out =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + durations.short], [0, 1], {
          easing: ease.in,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  if (frame < at) return null;

  // Elbow line: horizontal from label, then diagonal to target.
  const elbow = {x: label.x + (align === 'left' ? -24 : 24), y: label.y};
  const len =
    Math.hypot(elbow.x - label.x, elbow.y - label.y) + Math.hypot(target.x - elbow.x, target.y - elbow.y);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out, pointerEvents: 'none'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <polyline
          points={`${label.x},${label.y} ${elbow.x},${elbow.y} ${target.x},${target.y}`}
          fill="none"
          stroke={brand.colors.white}
          strokeWidth={2}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={target.x} cy={target.y} r={7 * draw} fill={brand.colors.white} />
        <circle cx={target.x} cy={target.y} r={14 * draw} fill="none" stroke={brand.colors.white} strokeOpacity={0.4} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: label.y - 26,
          ...(align === 'left' ? {left: label.x + 12} : {right: 1920 - label.x + 12}),
          textAlign: align,
          opacity: textIn,
          transform: `translateX(${(1 - textIn) * (align === 'left' ? 12 : -12)}px)`,
          fontFamily: interFamily,
          color: brand.colors.white,
          whiteSpace: 'nowrap',
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{fontSize: 34, fontWeight: 600, letterSpacing: '-0.01em'}}>{text}</div>
        {sub ? <div style={{fontSize: 24, fontWeight: 400, opacity: 0.8, marginTop: 4}}>{sub}</div> : null}
      </div>
    </div>
  );
};
