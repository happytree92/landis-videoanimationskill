import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Phone} from '../../devices/Phone';
import {Laptop} from '../../devices/Laptop';
import {SecurityKey} from '../../devices/SecurityKey';
import {Stage, ContactShadow} from '../../scene/Stage';
import {Camera} from '../../scene/Camera';
import {TapIndicator} from '../../overlays/TapIndicator';
import {Callout} from '../../overlays/Callout';
import {ChapterCard, EndCard, TitleCard} from '../../overlays/Cards';
import {Button, IOS, Screen} from '../../ui/ios/primitives';
import {BrowserWindow, Desktop, SecurityDialog} from '../../ui/windows/primitives';
import {useProgress, useSec} from '../../motion/hooks';
import {ease} from '../../motion/tokens';
import type {SceneMap, SceneProps} from '../../timeline/types';

/*
 * Demo scenes: exercise every component once. Use as a pattern library when
 * building real projects; do not ship.
 */

const Title: React.FC<SceneProps> = (p) => (
  <TitleCard eyebrow={p.eyebrow as string} title={p.title as string} subtitle={p.subtitle as string} />
);

const End: React.FC<SceneProps> = () => <EndCard />;

const Chapter: React.FC<SceneProps> = (p) => (
  <ChapterCard number={p.number as number} title={p.title as string} subtitle={p.subtitle as string} />
);

/** Layout constants so tap targets can be computed, not guessed. */
const LISTING = {top: 70, icon: 118, gap: 16, left: 20, buttonTop: 70 + 84, buttonW: 86, buttonH: 30};
const GET_BUTTON = {x: LISTING.left + LISTING.icon + LISTING.gap + LISTING.buttonW / 2, y: LISTING.buttonTop + LISTING.buttonH / 2};

/** Fictional store listing: never a real app's name or icon in demo content. */
const StoreListing: React.FC<{state: 'get' | 'loading' | 'open'; progress: number; pressed: boolean}> = ({
  state,
  progress,
  pressed,
}) => (
  <Screen>
    <div style={{position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', gap: 16}}>
      <div
        style={{
          width: 118,
          height: 118,
          borderRadius: 27,
          background: 'linear-gradient(145deg, #3b82f6, #1e3a8a)',
          boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.1)',
        }}
      />
      <div style={{flex: 1, position: 'relative'}}>
        <div style={{fontSize: 22, fontWeight: 700, lineHeight: '28px', marginTop: 4}}>Sample App</div>
        <div style={{fontSize: 15, color: IOS.secondary, lineHeight: '20px'}}>Example Publisher</div>
        <div style={{position: 'absolute', top: LISTING.buttonTop - LISTING.top, width: LISTING.buttonW}}>
          {state === 'get' ? (
            <Button pressed={pressed} style={{height: 30, borderRadius: 15, fontSize: 15, fontWeight: 700}}>
              Get
            </Button>
          ) : state === 'loading' ? (
            <svg width="30" height="30" viewBox="0 0 30 30" style={{marginLeft: (LISTING.buttonW - 30) / 2}}>
              <circle cx="15" cy="15" r="12" fill="none" stroke="#E5E5EA" strokeWidth="3" />
              <circle
                cx="15"
                cy="15"
                r="12"
                fill="none"
                stroke={IOS.blueLight}
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={2 * Math.PI * 12 * (1 - progress)}
                transform="rotate(-90 15 15)"
                strokeLinecap="round"
              />
              <rect x="11" y="11" width="8" height="8" rx="1.5" fill={IOS.blueLight} />
            </svg>
          ) : (
            <Button variant="tinted" style={{height: 30, borderRadius: 15, fontSize: 15, fontWeight: 700}}>
              Open
            </Button>
          )}
        </div>
      </div>
    </div>
    <div style={{position: 'absolute', top: 222, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', color: IOS.secondary, fontSize: 12, textAlign: 'center'}}>
      {['4.8 ★', 'Utilities', '4+', 'English'].map((t) => (
        <div key={t} style={{flex: 1}}>
          <div style={{fontSize: 18, fontWeight: 700, color: '#8E8E93'}}>{t}</div>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', top: 280, left: 20, right: 20, display: 'flex', gap: 12}}>
      {[0, 1].map((i) => (
        <div key={i} style={{flex: 1, height: 420, borderRadius: 18, background: i ? '#EEF2F7' : '#E6ECF5'}} />
      ))}
    </div>
  </Screen>
);

const PhoneInstall: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const sec = useSec();
  const tapAt = sec(1.6);
  const doneAt = sec(3.8);
  const state = frame < tapAt + 3 ? 'get' : frame < doneAt ? 'loading' : 'open';
  const dl = interpolate(frame, [tapAt + 3, doneAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut});
  const settle = useProgress(0, sec(1.2), ease.out);

  // Phone sits left of center; callout lives inside the camera so it tracks the push-in.
  return (
    <Stage look="studio">
      <Camera keys={[{frame: 0, zoom: 1}, {frame: sec(1.0), zoom: 1}, {frame: sec(2.4), zoom: 1.18, x: 900, y: 480}]}>
        <div style={{position: 'absolute', left: 520, top: 90}}>
          <Phone height={900} rotateY={interpolate(settle, [0, 1], [-14, -6])} rotateX={3} glareOffset={settle * 0.4} style={{transform: `translateY(${(1 - settle) * 30}px)`, opacity: settle}}>
            <StoreListing state={state} progress={dl} pressed={frame >= tapAt && frame < tapAt + 3} />
            <TapIndicator x={GET_BUTTON.x} y={GET_BUTTON.y} at={tapAt} size={40} color={IOS.blueLight} />
          </Phone>
        </div>
        <Callout target={{x: 1004, y: 280}} label={{x: 1130, y: 330}} text="Tap Get" sub="The download starts right away" at={sec(1.2)} exitAt={sec(5.2)} />
      </Camera>
    </Stage>
  );
};

const LaptopKey: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const sec = useSec();
  const plugIn = useProgress(sec(0.6), sec(0.8), ease.out);
  const touchAt = sec(3.6);
  const pressed = interpolate(frame, [touchAt, touchAt + 4, touchAt + 16, touchAt + 22], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const success = frame > touchAt + 20;

  return (
    <Stage look="desk">
      <ContactShadow x={760} y={800} width={1000} height={80} opacity={0.6} />
      <div style={{position: 'absolute', left: 260, top: 130}}>
        <Laptop width={960} yaw={-16} pitch={14} lidAngle={106}>
          <Desktop>
            <BrowserWindow url="login.example.com" tabTitle="Sign in">
              <div style={{position: 'absolute', inset: 0, background: '#f5f6f8'}} />
            </BrowserWindow>
            <SecurityDialog
              heading="Windows Security"
              title={success ? 'Verified' : 'Touch your security key'}
              body={success ? 'You can remove your security key.' : 'Touch the button or gold contact on your security key.'}
              buttons={[{label: 'Cancel'}]}
              at={sec(0.4)}
              exitAt={sec(6.2)}
            />
          </Desktop>
        </Laptop>
      </div>
      {/* Detail inset: the key itself, large and readable. */}
      <ContactShadow x={1540} y={868} width={420} height={40} opacity={0.5 * plugIn} />
      <div style={{position: 'absolute', left: 1310, top: 790, transform: `translateX(${(1 - plugIn) * 80}px)`, opacity: plugIn}}>
        <SecurityKey width={460} awaitingTouch={frame > sec(1.2) && !success} pressed={pressed} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 460, height: 460 * (92 / 358)}}>
          <TapIndicator x={460 * ((58 + 118) / 358)} y={(460 * (92 / 358)) / 2} at={touchAt} size={70} kind="hold" holdFrames={14} />
        </div>
      </div>
      <Callout target={{x: 1536, y: 850}} label={{x: 1480, y: 660}} text="Touch the gold contact" sub="When the light blinks" at={sec(1.6)} exitAt={sec(5.6)} />
    </Stage>
  );
};

export const demoScenes: SceneMap = {Title, End, Chapter, PhoneInstall, LaptopKey};
