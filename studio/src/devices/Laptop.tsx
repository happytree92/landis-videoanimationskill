import React from 'react';

/**
 * Generic, unbranded laptop built as a real CSS 3D object (lid + keyboard deck),
 * so it can be shown front-on or from a raised three-quarter angle on a desk.
 *
 * Screen content is authored at 1440x900 logical px (a 16:10 Windows desktop at
 * 150% scaling looks right at this size) and scaled into the lid.
 */

export const LAPTOP_SCREEN = {width: 1440, height: 900} as const;

const BEZEL_SIDE = 22;
const BEZEL_TOP = 26;
const CHIN = 46;
const LID_W = LAPTOP_SCREEN.width + BEZEL_SIDE * 2;
const LID_H = LAPTOP_SCREEN.height + BEZEL_TOP + CHIN;
const DECK_D = Math.round(LID_W * 0.66);
const DECK_THICK = 18;

export type LaptopFinish = 'space' | 'silver';

const shell: Record<LaptopFinish, {lid: string; deck: string; edge: string; keys: string; keyTop: string}> = {
  space: {
    lid: 'linear-gradient(180deg, #2b2e33 0%, #1d1f23 100%)',
    deck: 'linear-gradient(180deg, #34373d 0%, #2a2d32 60%, #25282c 100%)',
    edge: 'linear-gradient(180deg, #4a4e55 0%, #1c1e21 100%)',
    keys: '#0f1012',
    keyTop: 'linear-gradient(180deg, #1c1d20 0%, #141517 100%)',
  },
  silver: {
    lid: 'linear-gradient(180deg, #cfd3d8 0%, #b7bcc2 100%)',
    deck: 'linear-gradient(180deg, #d8dce0 0%, #c9cdd2 60%, #bfc4c9 100%)',
    edge: 'linear-gradient(180deg, #e6e9ec 0%, #9ca1a8 100%)',
    keys: '#2a2c30',
    keyTop: 'linear-gradient(180deg, #2e3034 0%, #232528 100%)',
  },
};

export const Laptop: React.FC<{
  children?: React.ReactNode;
  /** Rendered lid width in canvas px (before perspective). */
  width?: number;
  /** Degrees between lid and deck. 90 = upright, ~110 = typical use. */
  lidAngle?: number;
  /** Camera orbit around the vertical axis, degrees (+ = see the right side). */
  yaw?: number;
  /** Camera elevation, degrees (+ = look down onto the keyboard). */
  pitch?: number;
  finish?: LaptopFinish;
  /** Screen brightness 0..1. */
  screenOn?: number;
  perspective?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  width = 1100,
  lidAngle = 108,
  yaw = 0,
  pitch = 12,
  finish = 'space',
  screenOn = 1,
  perspective = 3200,
  style,
}) => {
  const k = width / LID_W;
  const c = shell[finish];

  return (
    <div
      style={{
        width,
        height: LID_H * k,
        perspective: perspective * k,
        perspectiveOrigin: '50% 30%',
        ...style,
      }}
    >
      <div
        style={{
          width: LID_W,
          height: LID_H,
          transformOrigin: 'top left',
          transform: `scale(${k})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Assembly pivots around the hinge line so orbiting feels natural. */}
        <div
          style={{
            position: 'relative',
            width: LID_W,
            height: LID_H,
            transformStyle: 'preserve-3d',
            transformOrigin: `50% 100%`,
            transform: `rotateX(${-pitch}deg) rotateY(${yaw}deg)`,
          }}
        >
          {/* Keyboard deck, hinged at the lid's bottom edge, lying toward the viewer. */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: LID_H,
              width: LID_W,
              height: DECK_D,
              transformOrigin: 'top center',
              transform: 'rotateX(90deg)',
              transformStyle: 'preserve-3d',
              borderRadius: '6px 6px 22px 22px',
              background: c.deck,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <Keyboard keys={c.keys} keyTop={c.keyTop} />
            {/* Trackpad */}
            <div
              style={{
                position: 'absolute',
                left: LID_W * 0.3,
                width: LID_W * 0.4,
                top: DECK_D * 0.62,
                height: DECK_D * 0.3,
                borderRadius: 14,
                background: 'rgba(0,0,0,0.10)',
                boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            />
            {/* Front edge: gives the base visible thickness. */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: DECK_D,
                width: LID_W,
                height: DECK_THICK,
                transformOrigin: 'top center',
                transform: 'rotateX(-90deg)',
                borderRadius: '0 0 20px 20px',
                background: c.edge,
              }}
            />
          </div>

          {/* Lid, tilted back from vertical around the hinge. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'bottom center',
              transform: `rotateX(${lidAngle - 90}deg)`,
              borderRadius: '22px 22px 8px 8px',
              background: '#060607',
              boxShadow: `0 0 0 3px ${finish === 'space' ? '#3a3d42' : '#b9bec4'}, 0 40px 80px rgba(0,0,0,0.35)`,
            }}
          >
            {/* Webcam */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: LID_W / 2 - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                background: 'radial-gradient(circle at 40% 40%, #2d3446, #07080b)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: BEZEL_SIDE,
                top: BEZEL_TOP,
                width: LAPTOP_SCREEN.width,
                height: LAPTOP_SCREEN.height,
                overflow: 'hidden',
                background: '#000',
                borderRadius: 4,
              }}
            >
              <div style={{position: 'absolute', inset: 0, opacity: screenOn}}>{children}</div>
              {/* Subtle anti-glare sheen */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Keyboard: React.FC<{keys: string; keyTop: string}> = ({keys, keyTop}) => {
  const rows = [14, 14, 13, 12, 11];
  const left = LID_W * 0.08;
  const kbW = LID_W * 0.84;
  const top = DECK_D * 0.1;
  const rowH = DECK_D * 0.085;
  const gap = 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: left - 10,
        top: top - 10,
        width: kbW + 20,
        height: rowH * 6 + 20,
        borderRadius: 12,
        background: keys,
      }}
    >
      {rows.map((count, r) => {
        const keyW = (kbW - gap * (count - 1)) / count;
        return Array.from({length: count}).map((_, i) => (
          <div
            key={`${r}-${i}`}
            style={{
              position: 'absolute',
              left: 10 + i * (keyW + gap),
              top: 10 + r * (rowH + 2),
              width: keyW,
              height: rowH - gap,
              borderRadius: 6,
              background: keyTop,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          />
        ));
      })}
      {/* Space bar row */}
      <div
        style={{
          position: 'absolute',
          left: 10 + kbW * 0.3,
          top: 10 + 5 * (rowH + 2),
          width: kbW * 0.4,
          height: rowH - gap,
          borderRadius: 6,
          background: keyTop,
        }}
      />
    </div>
  );
};
