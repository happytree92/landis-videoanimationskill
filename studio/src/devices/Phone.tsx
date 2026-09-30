import React from 'react';

/**
 * Photoreal-leaning smartphone built in CSS. Screen content is authored in the
 * platform's logical points (iOS 393x852, Android 412x915) and scaled to fit,
 * so screens can be rebuilt 1:1 from reference screenshots.
 *
 * The device is deliberately unbranded (no logo, generic button layout) so it
 * reads as "a phone", not a specific model.
 */

export type PhonePlatform = 'ios' | 'android';
export type PhoneFinish = 'graphite' | 'silver' | 'black';

export const PHONE_SCREEN = {
  ios: {width: 393, height: 852, radius: 55},
  android: {width: 412, height: 915, radius: 38},
} as const;

const FRAME = 6; // metal band thickness, pt
const BEZEL = 10; // black glass border, pt

const finishes: Record<PhoneFinish, string> = {
  graphite:
    'linear-gradient(135deg, #5b5f66 0%, #a9adb3 14%, #3c4046 32%, #8a8f96 55%, #2e3136 78%, #74787f 100%)',
  silver:
    'linear-gradient(135deg, #b9bdc3 0%, #f1f3f5 16%, #9ea3aa 34%, #e3e6ea 58%, #8d9299 80%, #d4d8dc 100%)',
  black:
    'linear-gradient(135deg, #1b1c1f 0%, #4a4d52 14%, #111214 34%, #3a3d42 58%, #0d0e10 80%, #2c2e32 100%)',
};

export const Phone: React.FC<{
  /** Screen content, laid out in logical points (see PHONE_SCREEN). */
  children?: React.ReactNode;
  /** Rendered height of the whole device in canvas px. */
  height?: number;
  platform?: PhonePlatform;
  finish?: PhoneFinish;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  /** 0..1 strength of the moving glass reflection. */
  glare?: number;
  /** Shift the glare band (-1..1), e.g. tie it to rotateY for realism. */
  glareOffset?: number;
  /** Screen brightness 0..1 (0 = off/black). */
  screenOn?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  height = 860,
  platform = 'ios',
  finish = 'graphite',
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  glare = 0.6,
  glareOffset = 0,
  screenOn = 1,
  shadow = true,
  style,
}) => {
  const screen = PHONE_SCREEN[platform];
  const bodyW = screen.width + 2 * (FRAME + BEZEL);
  const bodyH = screen.height + 2 * (FRAME + BEZEL);
  const outerR = screen.radius + FRAME + BEZEL;
  const k = height / bodyH;

  return (
    <div style={{width: bodyW * k, height, perspective: 2600, ...style}}>
      <div
        style={{
          width: bodyW,
          height: bodyH,
          transformOrigin: 'top left',
          transform: `scale(${k})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: bodyW,
            height: bodyH,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          }}
        >
          <SideButtons platform={platform} bodyH={bodyH} finish={finish} />

          {/* Metal band */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: outerR,
              background: finishes[finish],
              boxShadow: shadow
                ? '0 60px 120px rgba(0,0,0,0.45), 0 18px 36px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.18)'
                : 'inset 0 0 0 1px rgba(255,255,255,0.18)',
            }}
          />
          {/* Black glass bezel */}
          <div
            style={{
              position: 'absolute',
              inset: FRAME,
              borderRadius: outerR - FRAME,
              background: '#030304',
              boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.06)',
            }}
          />
          {/* Display */}
          <div
            style={{
              position: 'absolute',
              left: FRAME + BEZEL,
              top: FRAME + BEZEL,
              width: screen.width,
              height: screen.height,
              borderRadius: screen.radius,
              overflow: 'hidden',
              background: '#000',
              // Keeps the rounded clip crisp when the parent is 3D-transformed.
              isolation: 'isolate',
            }}
          >
            <div style={{position: 'absolute', inset: 0, opacity: screenOn}}>{children}</div>
            {platform === 'ios' ? <DynamicIsland width={screen.width} /> : <PunchHole width={screen.width} />}
          </div>
          {/* Glass reflection over the whole face */}
          {glare > 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: FRAME,
                borderRadius: outerR - FRAME,
                pointerEvents: 'none',
                opacity: glare,
                background: `linear-gradient(115deg, rgba(255,255,255,0) ${18 + glareOffset * 30}%, rgba(255,255,255,0.10) ${30 + glareOffset * 30}%, rgba(255,255,255,0.02) ${44 + glareOffset * 30}%, rgba(255,255,255,0) ${60 + glareOffset * 30}%)`,
                mixBlendMode: 'screen',
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const DynamicIsland: React.FC<{width: number}> = ({width}) => (
  <div
    style={{
      position: 'absolute',
      top: 11,
      left: (width - 126) / 2,
      width: 126,
      height: 37,
      borderRadius: 20,
      background: '#000',
      zIndex: 10,
    }}
  >
    <div
      style={{
        position: 'absolute',
        right: 22,
        top: 12,
        width: 13,
        height: 13,
        borderRadius: 7,
        background: 'radial-gradient(circle at 40% 35%, #2a3550 0%, #0b0f1a 55%, #000 100%)',
      }}
    />
  </div>
);

const PunchHole: React.FC<{width: number}> = ({width}) => (
  <div
    style={{
      position: 'absolute',
      top: 12,
      left: width / 2 - 7,
      width: 14,
      height: 14,
      borderRadius: 7,
      background: 'radial-gradient(circle at 40% 35%, #26304a 0%, #07090f 60%, #000 100%)',
      zIndex: 10,
    }}
  />
);

const SideButtons: React.FC<{platform: PhonePlatform; bodyH: number; finish: PhoneFinish}> = ({
  platform,
  bodyH,
  finish,
}) => {
  const btn = (side: 'left' | 'right', top: number, length: number) => (
    <div
      key={`${side}-${top}`}
      style={{
        position: 'absolute',
        [side]: -2.5,
        top: bodyH * top,
        width: 4,
        height: length,
        borderRadius: 2,
        background: finishes[finish],
      }}
    />
  );
  return platform === 'ios' ? (
    <>
      {btn('left', 0.17, 30)}
      {btn('left', 0.25, 60)}
      {btn('left', 0.34, 60)}
      {btn('right', 0.28, 96)}
    </>
  ) : (
    <>
      {btn('right', 0.22, 80)}
      {btn('right', 0.36, 50)}
    </>
  );
};
