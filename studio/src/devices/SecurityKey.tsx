import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Generic FIDO2 security key, top-down view, unbranded.
 * Drawn horizontally with the connector on the left.
 *
 * The contact LED blinks while the key is waiting for a touch (as real keys do)
 * and `pressed` (0..1) animates the fingertip contact being touched.
 */
export const SecurityKey: React.FC<{
  width?: number;
  connector?: 'usb-a' | 'usb-c';
  /** Blink the LED to show "waiting for touch". */
  awaitingTouch?: boolean;
  /** 0..1 touch state; drives a soft press glow on the contact. */
  pressed?: number;
  style?: React.CSSProperties;
}> = ({width = 520, connector = 'usb-c', awaitingTouch = false, pressed = 0, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Real keys blink roughly twice a second while waiting.
  const blink = awaitingTouch ? 0.35 + 0.65 * (0.5 + 0.5 * Math.cos((frame / fps) * Math.PI * 4)) : 0;
  const led = Math.max(blink, pressed);

  const bodyW = 300;
  const bodyH = 92;
  const plugW = connector === 'usb-c' ? 58 : 84;
  const plugH = connector === 'usb-c' ? 30 : 56;
  const totalW = bodyW + plugW;
  const k = width / totalW;

  return (
    <div style={{width, height: bodyH * k, ...style}}>
      <div style={{position: 'relative', width: totalW, height: bodyH, transform: `scale(${k})`, transformOrigin: 'top left'}}>
        {/* Connector */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: (bodyH - plugH) / 2,
            width: plugW + 10,
            height: plugH,
            borderRadius: connector === 'usb-c' ? plugH / 2 : 4,
            background: 'linear-gradient(180deg, #e9ecef 0%, #b9bec5 45%, #eef0f2 55%, #a7adb4 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25)',
          }}
        />
        {/* Body */}
        <div
          style={{
            position: 'absolute',
            left: plugW,
            top: 0,
            width: bodyW,
            height: bodyH,
            borderRadius: `18px ${bodyH / 2}px ${bodyH / 2}px 18px`,
            background: 'linear-gradient(180deg, #2a2c30 0%, #151618 55%, #0c0d0e 100%)',
            boxShadow:
              '0 18px 30px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          {/* Keyring hole */}
          <div
            style={{
              position: 'absolute',
              right: 20,
              top: bodyH / 2 - 13,
              width: 26,
              height: 26,
              borderRadius: 13,
              background: '#0a0a0b',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.08)',
            }}
          />
          {/* Touch contact */}
          <div
            style={{
              position: 'absolute',
              left: 118 - 30,
              top: bodyH / 2 - 30,
              width: 60,
              height: 60,
              borderRadius: 30,
              background: 'radial-gradient(circle at 38% 32%, #f7e3a1 0%, #d8b25a 40%, #a9822f 80%, #8a6a24 100%)',
              boxShadow: `0 0 0 3px rgba(0,0,0,0.5), 0 0 ${24 * led}px ${8 * led}px rgba(120,220,160,${0.55 * led})`,
              transform: `scale(${1 - 0.04 * pressed})`,
            }}
          />
          {/* LED ring around the contact */}
          <div
            style={{
              position: 'absolute',
              left: 118 - 36,
              top: bodyH / 2 - 36,
              width: 72,
              height: 72,
              borderRadius: 36,
              border: `2px solid rgba(140,235,175,${interpolate(led, [0, 1], [0.05, 0.95])})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
