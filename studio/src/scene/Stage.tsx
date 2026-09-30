import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../brand/tokens';

/**
 * Backdrops. Three looks:
 *  - 'studio': dark seamless sweep with a soft key light (default for phone scenes)
 *  - 'light':  bright neutral seamless (for lighter brand palettes)
 *  - 'desk':   tabletop. Uses a photographic plate from public/ when `plate` is
 *              given; otherwise a clean matte surface with a light pool.
 *
 * A photographic desk plate is the recommended route for "realistic desk" shots.
 * Code-drawn wood grain looks fake; see references/scene-realism.md.
 */
export const Stage: React.FC<{
  look?: 'studio' | 'light' | 'desk';
  /** Path under public/, e.g. 'plates/desk-oak-01.jpg'. */
  plate?: string;
  /** Slow push on the plate over the scene (1 = none). */
  plateDrift?: number;
  children?: React.ReactNode;
}> = ({look = 'studio', plate, plateDrift = 1.04, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  if (look === 'desk' && plate) {
    const s = interpolate(frame, [0, durationInFrames], [1, plateDrift]);
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Img src={staticFile(plate)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`}} />
        <Vignette strength={0.35} />
        {children}
      </AbsoluteFill>
    );
  }

  if (look === 'desk') {
    return (
      <AbsoluteFill style={{background: '#101216'}}>
        {/* Back wall */}
        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 20%, #2a2f38 0%, #15181d 60%, #0c0e11 100%)',
          }}
        />
        {/* Tabletop plane, horizon at 58% of frame height */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '58%',
            bottom: 0,
            background:
              'radial-gradient(ellipse 55% 70% at 50% 10%, #3b3f46 0%, #2a2d33 45%, #1a1c20 100%)',
            // Soft falloff at the far edge instead of a hard horizon line.
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 12%)',
          }}
        />
        <Grain />
        <Vignette strength={0.5} />
        {children}
      </AbsoluteFill>
    );
  }

  const isLight = look === 'light';
  return (
    <AbsoluteFill
      style={{
        background: isLight
          ? 'radial-gradient(ellipse 80% 70% at 50% 35%, #ffffff 0%, #eef0f3 55%, #dfe3e8 100%)'
          : `radial-gradient(ellipse 75% 65% at 50% 35%, ${brand.colors.stageTop} 0%, ${brand.colors.stageBottom} 100%)`,
      }}
    >
      {isLight ? null : <Grain />}
      <Vignette strength={isLight ? 0.12 : 0.45} />
      {children}
    </AbsoluteFill>
  );
};

const Vignette: React.FC<{strength: number}> = ({strength}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 85% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Very fine static noise to prevent gradient banding in H.264. */
const Grain: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'overlay'}}>
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

/** Soft elliptical shadow to seat an object on a surface. */
export const ContactShadow: React.FC<{x: number; y: number; width: number; height?: number; opacity?: number}> = ({
  x,
  y,
  width,
  height = width * 0.12,
  opacity = 0.55,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - width / 2,
      top: y - height / 2,
      width,
      height,
      borderRadius: '50%',
      background: `radial-gradient(ellipse at center, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
      filter: 'blur(6px)',
    }}
  />
);
