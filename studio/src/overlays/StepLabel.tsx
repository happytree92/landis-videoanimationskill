import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, safeArea} from '../brand/tokens';
import {interFamily} from '../brand/fonts';
import {durations, ease} from '../motion/tokens';

/**
 * Lower-left step label: "STEP 3 OF 7" eyebrow + step title.
 * The Timeline renders this as a persistent layer spanning every scene that
 * shares a step, so it doesn't flicker on scene cuts.
 */
export const StepLabel: React.FC<{index: number; total: number; title: string; chapter?: string}> = ({
  index,
  total,
  title,
  chapter,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const inP = interpolate(frame, [0, durations.medium], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outP = interpolate(frame, [durationInFrames - durations.short, durationInFrames], [0, 1], {
    easing: ease.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bar = interpolate(frame, [4, 4 + durations.medium], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: safeArea.x,
        bottom: safeArea.y,
        display: 'flex',
        alignItems: 'stretch',
        gap: 20,
        opacity: inP * (1 - outP),
        transform: `translateX(${(1 - inP) * -24}px)`,
        fontFamily: interFamily,
      }}
    >
      <div
        style={{
          width: 5,
          borderRadius: 3,
          background: brand.colors.accent,
          transformOrigin: 'bottom',
          transform: `scaleY(${bar})`,
        }}
      />
      <div
        style={{
          padding: '14px 26px 16px 22px',
          borderRadius: 14,
          background: 'rgba(12,14,18,0.62)',
          backdropFilter: 'blur(18px)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            fontSize: brand.type.scale.eyebrow,
            fontWeight: 600,
            letterSpacing: brand.type.tracking.eyebrow,
            textTransform: 'uppercase',
            color: brand.colors.accent,
          }}
        >
          {chapter ? `${chapter} · ` : ''}Step {index} of {total}
        </div>
        <div style={{fontSize: 38, fontWeight: 600, color: brand.colors.white, marginTop: 4, letterSpacing: '-0.01em'}}>
          {title}
        </div>
      </div>
    </div>
  );
};
