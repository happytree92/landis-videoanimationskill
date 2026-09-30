import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ease} from '../motion/tokens';

/**
 * Virtual camera for push-ins and reframes. Keyframes are in scene-local frames.
 * `x`/`y` are the canvas point (1920x1080 space) that should sit at frame center;
 * `zoom` 1 = no zoom. Moves always use the inOut curve; never bounce.
 *
 *   <Camera keys={[{frame: 0, zoom: 1}, {frame: 45, zoom: 1.8, x: 960, y: 420}]}>
 */
export type CameraKey = {frame: number; zoom?: number; x?: number; y?: number};

export const Camera: React.FC<{keys: CameraKey[]; children: React.ReactNode}> = ({keys, children}) => {
  const frame = useCurrentFrame();
  const sorted = [...keys].sort((a, b) => a.frame - b.frame);
  const pick = (prop: 'zoom' | 'x' | 'y', fallback: number) => {
    const pts = sorted.map((k) => ({f: k.frame, v: k[prop] ?? fallback}));
    if (pts.length === 1) return pts[0].v;
    // Piecewise eased interpolation between consecutive keys.
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      if (frame <= b.f || i === pts.length - 2) {
        return interpolate(frame, [a.f, b.f], [a.v, b.v], {
          easing: ease.inOut,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      }
    }
    return fallback;
  };
  const zoom = pick('zoom', 1);
  const x = pick('x', 960);
  const y = pick('y', 540);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: '0 0',
        transform: `translate(960px, 540px) scale(${zoom}) translate(${-x}px, ${-y}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
