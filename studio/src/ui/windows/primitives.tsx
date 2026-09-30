import React, {useMemo} from 'react';
import QRCode from 'qrcode';
import {interpolate, useCurrentFrame} from 'remotion';
import {systemUiFamily} from '../../brand/fonts';
import {durations, ease} from '../../motion/tokens';
import {LAPTOP_SCREEN} from '../../devices/Laptop';

/**
 * Building blocks for recreating desktop screens inside <Laptop> (1440x900).
 * Browser chrome and dialogs are generic look-alikes: faithful in layout and
 * wording to the reference footage, without copying vendor logos unless the
 * official asset is supplied in public/brand/third-party/.
 */

export const Desktop: React.FC<{children?: React.ReactNode; wallpaper?: string}> = ({children, wallpaper}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        wallpaper ?? 'radial-gradient(ellipse 90% 80% at 30% 20%, #3a6ea5 0%, #1e3c66 45%, #0d1b33 100%)',
      fontFamily: systemUiFamily,
    }}
  >
    {children}
    <Taskbar />
  </div>
);

const Taskbar: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 48,
      background: 'rgba(32,32,36,0.85)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    }}
  >
    {Array.from({length: 6}).map((_, i) => (
      <div key={i} style={{width: 30, height: 30, borderRadius: 6, background: i === 0 ? '#4aa3ff' : 'rgba(255,255,255,0.18)'}} />
    ))}
  </div>
);

/** A generic browser window with an address bar. Content area is children. */
export const BrowserWindow: React.FC<{
  url: string;
  tabTitle?: string;
  children?: React.ReactNode;
  bg?: string;
}> = ({url, tabTitle = '', children, bg = '#fff'}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: LAPTOP_SCREEN.width,
      height: LAPTOP_SCREEN.height - 48,
      background: '#f3f3f3',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{height: 40, display: 'flex', alignItems: 'flex-end', padding: '0 12px', gap: 8}}>
      <div
        style={{
          height: 32,
          minWidth: 240,
          padding: '0 14px',
          borderRadius: '8px 8px 0 0',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          fontSize: 13,
          color: '#222',
        }}
      >
        {tabTitle}
      </div>
    </div>
    <div style={{height: 44, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px'}}>
      {['‹', '›', '↻'].map((g) => (
        <span key={g} style={{fontSize: 18, color: '#555', width: 18, textAlign: 'center'}}>
          {g}
        </span>
      ))}
      <div
        style={{
          flex: 1,
          height: 32,
          borderRadius: 16,
          background: '#f1f3f4',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 14px',
          fontSize: 14,
          color: '#1f1f1f',
        }}
      >
        <svg width="12" height="14" viewBox="0 0 12 14">
          <rect x="1" y="6" width="10" height="7" rx="1.5" fill="#5f6368" />
          <path d="M3.5 6V4.2a2.5 2.5 0 0 1 5 0V6" stroke="#5f6368" strokeWidth="1.5" fill="none" />
        </svg>
        {url}
      </div>
    </div>
    <div style={{flex: 1, position: 'relative', background: bg, overflow: 'hidden', borderTop: '1px solid #e5e5e5'}}>
      {children}
    </div>
  </div>
);

/**
 * OS-level security dialog (e.g. Windows Security passkey / security key prompt).
 * Recreate the exact title, body copy and buttons from the reference footage.
 */
export const SecurityDialog: React.FC<{
  heading: string;
  title: string;
  body?: React.ReactNode;
  buttons?: {label: string; primary?: boolean}[];
  width?: number;
  at: number;
  exitAt?: number;
  dark?: boolean;
  children?: React.ReactNode;
}> = ({heading, title, body, buttons = [], width = 460, at, exitAt, dark = true, children}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [at, at + durations.short], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outP =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + durations.short], [0, 1], {easing: ease.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = inP * (1 - outP);
  if (o <= 0) return null;
  const fg = dark ? '#fff' : '#1a1a1a';
  return (
    <div
      style={{
        position: 'absolute',
        left: (LAPTOP_SCREEN.width - width) / 2,
        top: 150,
        width,
        borderRadius: 8,
        background: dark ? '#2b2b2b' : '#f9f9f9',
        color: fg,
        boxShadow: '0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
        opacity: o,
        transform: `translateY(${(1 - inP) * 16}px)`,
        fontFamily: systemUiFamily,
        overflow: 'hidden',
      }}
    >
      <div style={{padding: '20px 24px 8px', fontSize: 13, opacity: 0.8}}>{heading}</div>
      <div style={{padding: '4px 24px 12px', fontSize: 22, fontWeight: 600}}>{title}</div>
      {body ? <div style={{padding: '0 24px 16px', fontSize: 14, lineHeight: 1.5, opacity: 0.9}}>{body}</div> : null}
      {children ? <div style={{padding: '0 24px 20px'}}>{children}</div> : null}
      {buttons.length ? (
        <div style={{display: 'flex', gap: 8, padding: '16px 24px 20px', background: dark ? '#202020' : '#f0f0f0'}}>
          {buttons.map((b) => (
            <div
              key={b.label}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                background: b.primary ? '#4cc2ff' : dark ? '#3a3a3a' : '#fff',
                color: b.primary ? '#000' : fg,
                border: b.primary ? 'none' : `1px solid ${dark ? '#4a4a4a' : '#ccc'}`,
              }}
            >
              {b.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/**
 * A real, scannable QR code rendered as SVG. It must always encode a harmless
 * demo string, never a live enrollment or sign-in payload.
 */
export const DemoQrCode: React.FC<{size: number; value?: string; dark?: string; light?: string}> = ({
  size,
  value = 'DEMO ONLY - this QR code is part of an instructional video',
  dark = '#000',
  light = '#fff',
}) => {
  const path = useMemo(() => {
    const qr = QRCode.create(value, {errorCorrectionLevel: 'M'});
    const n = qr.modules.size;
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.modules.get(r, c)) d += `M${c + 4},${r + 4}h1v1h-1z`;
      }
    }
    return {d, n: n + 8};
  }, [value]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${path.n} ${path.n}`} shapeRendering="crispEdges">
      <rect width={path.n} height={path.n} fill={light} />
      <path d={path.d} fill={dark} />
    </svg>
  );
};
