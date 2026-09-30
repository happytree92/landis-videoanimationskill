import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, safeArea} from '../brand/tokens';
import {interFamily} from '../brand/fonts';
import {durations, ease} from '../motion/tokens';
import {Stage} from '../scene/Stage';

/** Text that rises out of a mask line: the standard title reveal. */
export const MaskReveal: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + durations.medium + 6], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`, opacity: p}}>{children}</div>
    </div>
  );
};

export const Logo: React.FC<{height?: number; onDark?: boolean}> = ({height = 56, onDark = true}) => {
  const src = onDark ? brand.logo.light : brand.logo.dark;
  if (src) return <Img src={staticFile(src)} style={{height}} />;
  return (
    <div
      style={{
        fontFamily: interFamily,
        fontWeight: 700,
        fontSize: height * 0.72,
        letterSpacing: '-0.02em',
        color: onDark ? brand.colors.white : brand.colors.ink,
      }}
    >
      {brand.company}
    </div>
  );
};

/** Fade the whole card out over its final frames (Timeline transitions may also apply). */
const useCardOut = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(frame, [durationInFrames - durations.short, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const TitleCard: React.FC<{eyebrow?: string; title: string; subtitle?: string}> = ({
  eyebrow,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [6, 6 + durations.long], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const out = useCardOut();
  return (
    <Stage look="studio">
      <AbsoluteFill style={{padding: `${safeArea.y}px ${safeArea.x * 1.5}px`, justifyContent: 'center', opacity: out}}>
        <div style={{position: 'absolute', top: safeArea.y, left: safeArea.x * 1.5}}>
          <Logo height={48} />
        </div>
        <div style={{fontFamily: interFamily, color: brand.colors.white, maxWidth: 1400}}>
          {eyebrow ? (
            <MaskReveal at={4}>
              <div
                style={{
                  fontSize: brand.type.scale.eyebrow + 4,
                  fontWeight: 600,
                  letterSpacing: brand.type.tracking.eyebrow,
                  textTransform: 'uppercase',
                  color: brand.colors.accent,
                }}
              >
                {eyebrow}
              </div>
            </MaskReveal>
          ) : null}
          <div
            style={{
              height: 3,
              width: 120,
              margin: '26px 0 30px',
              background: brand.colors.accent,
              transformOrigin: 'left',
              transform: `scaleX(${rule})`,
            }}
          />
          <MaskReveal at={10}>
            <div style={{fontSize: brand.type.scale.hero, fontWeight: 700, letterSpacing: brand.type.tracking.title, lineHeight: 1.05}}>
              {title}
            </div>
          </MaskReveal>
          {subtitle ? (
            <MaskReveal at={18} style={{marginTop: 22}}>
              <div style={{fontSize: 40, fontWeight: 400, opacity: 0.78}}>{subtitle}</div>
            </MaskReveal>
          ) : null}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

export const ChapterCard: React.FC<{number: number; title: string; subtitle?: string}> = ({number, title, subtitle}) => {
  const out = useCardOut();
  return (
    <Stage look="studio">
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out, fontFamily: interFamily}}>
        <MaskReveal at={2}>
          <div
            style={{
              fontSize: brand.type.scale.eyebrow + 2,
              letterSpacing: brand.type.tracking.eyebrow,
              textTransform: 'uppercase',
              fontWeight: 600,
              color: brand.colors.accent,
              textAlign: 'center',
            }}
          >
            Part {number}
          </div>
        </MaskReveal>
        <MaskReveal at={8} style={{marginTop: 18}}>
          <div style={{fontSize: 84, fontWeight: 700, color: brand.colors.white, letterSpacing: brand.type.tracking.title, textAlign: 'center'}}>
            {title}
          </div>
        </MaskReveal>
        {subtitle ? (
          <MaskReveal at={16} style={{marginTop: 14}}>
            <div style={{fontSize: 36, color: brand.colors.white, opacity: 0.75, textAlign: 'center'}}>{subtitle}</div>
          </MaskReveal>
        ) : null}
      </AbsoluteFill>
    </Stage>
  );
};

export const EndCard: React.FC<{headline?: string}> = ({headline = 'Need a hand? We’re here to help.'}) => (
  <Stage look="studio">
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: interFamily, color: brand.colors.white}}>
      <MaskReveal at={2}>
        <Logo height={72} />
      </MaskReveal>
      <MaskReveal at={10} style={{marginTop: 40}}>
        <div style={{fontSize: 52, fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'center'}}>{headline}</div>
      </MaskReveal>
      <MaskReveal at={18} style={{marginTop: 28}}>
        <div style={{display: 'flex', gap: 48, fontSize: 34, opacity: 0.85}}>
          <span>{brand.support.phone}</span>
          <span style={{opacity: 0.4}}>|</span>
          <span>{brand.support.email}</span>
          <span style={{opacity: 0.4}}>|</span>
          <span>{brand.support.url}</span>
        </div>
      </MaskReveal>
    </AbsoluteFill>
  </Stage>
);

/** Optional burned-in caption. Captions also ship as a separate .srt. */
export const CaptionBar: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const o = interpolate(frame, [0, 6, durationInFrames - 6, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: safeArea.y + 110}}>
      <div
        style={{
          opacity: o,
          maxWidth: 1300,
          padding: '12px 24px',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.72)',
          color: brand.colors.white,
          fontFamily: interFamily,
          fontSize: brand.type.scale.caption + 4,
          lineHeight: 1.35,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
