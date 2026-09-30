import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {systemUiFamily} from '../../brand/fonts';
import {durations, ease} from '../../motion/tokens';

/**
 * Building blocks for recreating iOS screens at 393x852 pt.
 * Screens are rebuilt from reference frames: match layout, wording and order
 * exactly; use these primitives so spacing and type stay consistent.
 * (Android equivalents follow the same pattern at 412x915.)
 */

export const IOS = {
  width: 393,
  height: 852,
  statusBar: 54,
  blue: '#0A84FF',
  blueLight: '#007AFF',
  label: '#000000',
  secondary: 'rgba(60,60,67,0.6)',
  separator: 'rgba(60,60,67,0.29)',
  groupedBg: '#F2F2F7',
};

export const Screen: React.FC<{bg?: string; dark?: boolean; children?: React.ReactNode; statusTime?: string}> = ({
  bg,
  dark = false,
  children,
  statusTime = '9:41',
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: bg ?? (dark ? '#000' : '#fff'),
      fontFamily: systemUiFamily,
      color: dark ? '#fff' : IOS.label,
      overflow: 'hidden',
    }}
  >
    {children}
    <StatusBar dark={dark} time={statusTime} />
    <HomeIndicator dark={dark} />
  </div>
);

export const StatusBar: React.FC<{dark?: boolean; time?: string}> = ({dark = false, time = '9:41'}) => {
  const c = dark ? '#fff' : '#000';
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: IOS.statusBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 34px 0 50px',
        fontSize: 17,
        fontWeight: 600,
        color: c,
        zIndex: 20,
      }}
    >
      <span>{time}</span>
      <svg width="78" height="14" viewBox="0 0 78 14" fill={c}>
        {/* Cellular */}
        <rect x="0" y="9" width="3.5" height="4" rx="1" />
        <rect x="5" y="6.5" width="3.5" height="6.5" rx="1" />
        <rect x="10" y="4" width="3.5" height="9" rx="1" />
        <rect x="15" y="1" width="3.5" height="12" rx="1" />
        {/* Wi-Fi */}
        <path d="M31 3.2a11 11 0 0 1 14.6 0l-1.3 1.4a9 9 0 0 0-12 0z" />
        <path d="M33.5 6a7 7 0 0 1 9.6 0l-1.4 1.4a5 5 0 0 0-6.8 0z" />
        <path d="M36 8.8a3.3 3.3 0 0 1 4.6 0L38.3 11z" />
        {/* Battery */}
        <rect x="52" y="1" width="22" height="12" rx="3.5" fill="none" stroke={c} strokeOpacity="0.4" />
        <rect x="54" y="3" width="17" height="8" rx="2" />
        <rect x="75" y="4.5" width="1.6" height="5" rx="0.8" fillOpacity="0.45" />
      </svg>
    </div>
  );
};

export const HomeIndicator: React.FC<{dark?: boolean}> = ({dark = false}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 8,
      left: (IOS.width - 139) / 2,
      width: 139,
      height: 5,
      borderRadius: 3,
      background: dark ? '#fff' : '#000',
      zIndex: 20,
    }}
  />
);

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'filled' | 'tinted' | 'plain';
  color?: string;
  pressed?: boolean;
  style?: React.CSSProperties;
}> = ({children, variant = 'filled', color = IOS.blueLight, pressed = false, style}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      borderRadius: 14,
      fontSize: 17,
      fontWeight: 600,
      background: variant === 'filled' ? color : variant === 'tinted' ? `${color}22` : 'transparent',
      color: variant === 'filled' ? '#fff' : color,
      opacity: pressed ? 0.6 : 1,
      ...style,
    }}
  >
    {children}
  </div>
);

export const ListRow: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  chevron?: boolean;
  last?: boolean;
  pressed?: boolean;
}> = ({title, subtitle, icon, chevron = true, last = false, pressed = false}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minHeight: 52,
      padding: '8px 16px',
      background: pressed ? '#D1D1D6' : '#fff',
    }}
  >
    {icon}
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderBottom: last ? 'none' : `0.5px solid ${IOS.separator}`,
        paddingRight: 4,
      }}
    >
      <div style={{flex: 1}}>
        <div style={{fontSize: 17}}>{title}</div>
        {subtitle ? <div style={{fontSize: 14, color: IOS.secondary, marginTop: 2}}>{subtitle}</div> : null}
      </div>
      {chevron ? (
        <svg width="8" height="14" viewBox="0 0 8 14">
          <path d="M1 1l6 6-6 6" stroke="rgba(60,60,67,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  </div>
);

/** iOS system permission alert (notifications, camera...). Fades/scales in like the OS. */
export const SystemAlert: React.FC<{
  title: string;
  message?: string;
  actions: {label: string; bold?: boolean; pressed?: boolean}[];
  at: number;
  exitAt?: number;
}> = ({title, message, actions, at, exitAt}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [at, at + durations.short], [0, 1], {
    easing: ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outP =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + durations.micro], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = inP * (1 - outP);
  if (o <= 0) return null;
  const stacked = actions.length > 2;
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 30}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.2 * o})`}} />
      <div
        style={{
          position: 'absolute',
          left: (IOS.width - 270) / 2,
          top: IOS.height * 0.36,
          width: 270,
          borderRadius: 14,
          overflow: 'hidden',
          background: 'rgba(242,242,242,0.94)',
          backdropFilter: 'blur(20px)',
          opacity: o,
          transform: `scale(${1.08 - 0.08 * inP})`,
          textAlign: 'center',
          color: '#000',
        }}
      >
        <div style={{padding: '19px 16px 16px'}}>
          <div style={{fontSize: 17, fontWeight: 600, lineHeight: 1.3}}>{title}</div>
          {message ? <div style={{fontSize: 13, marginTop: 4, lineHeight: 1.35}}>{message}</div> : null}
        </div>
        <div style={{display: 'flex', flexDirection: stacked ? 'column' : 'row', borderTop: `0.5px solid ${IOS.separator}`}}>
          {actions.map((a, i) => (
            <div
              key={a.label}
              style={{
                flex: 1,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontWeight: a.bold ? 600 : 400,
                color: IOS.blueLight,
                background: a.pressed ? 'rgba(0,0,0,0.08)' : 'transparent',
                borderLeft: !stacked && i > 0 ? `0.5px solid ${IOS.separator}` : 'none',
                borderTop: stacked && i > 0 ? `0.5px solid ${IOS.separator}` : 'none',
              }}
            >
              {a.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Bottom sheet that slides up from the screen edge. */
export const Sheet: React.FC<{at: number; exitAt?: number; height: number; children: React.ReactNode; dark?: boolean}> = ({
  at,
  exitAt,
  height,
  children,
  dark = false,
}) => {
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
  const y = (1 - inP + outP) * height;
  if (inP <= 0) return null;
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 25}}>
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.3 * inP * (1 - outP)})`}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height,
          borderRadius: '12px 12px 0 0',
          background: dark ? '#1C1C1E' : '#fff',
          transform: `translateY(${y}px)`,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.15)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Horizontal push between two app screens (iOS navigation push).
 * `progress` 0 = showing `from`, 1 = showing `to`.
 */
export const PushTransition: React.FC<{progress: number; from: React.ReactNode; to: React.ReactNode}> = ({
  progress,
  from,
  to,
}) => (
  <>
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${-progress * 30}%)`}}>
      {from}
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.12 * progress})`}} />
    </div>
    {progress > 0 ? (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${(1 - progress) * 100}%)`,
          boxShadow: '-10px 0 30px rgba(0,0,0,0.12)',
        }}
      >
        {to}
      </div>
    ) : null}
  </>
);
