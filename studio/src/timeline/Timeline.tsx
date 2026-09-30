import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import type {TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {ease} from '../motion/tokens';
import {StepLabel} from '../overlays/StepLabel';
import {CaptionBar} from '../overlays/Cards';
import {computeTimeline} from './compute.mjs';
import type {SceneMap, Storyboard, StoryboardScene} from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentationFor = (t: StoryboardScene['transition']): TransitionPresentation<any> => {
  switch (t) {
    case 'slide-left':
      return slide({direction: 'from-right'});
    case 'slide-up':
      return slide({direction: 'from-bottom'});
    case 'wipe':
      return wipe({direction: 'from-left'});
    default:
      return fade();
  }
};

/**
 * Renders a storyboard: scenes in a TransitionSeries, plus persistent overlay
 * layers (step labels, optional captions) computed from the same timing.
 */
export const Timeline: React.FC<{storyboard: Storyboard; scenes: SceneMap}> = ({storyboard, scenes}) => {
  const timing = computeTimeline(storyboard);

  const missing = storyboard.scenes.filter((s) => !scenes[s.component]).map((s) => s.component);
  if (missing.length) {
    throw new Error(`Storyboard "${storyboard.slug}" references unknown scene components: ${missing.join(', ')}`);
  }

  // Group consecutive scenes that share a step so the label persists across cuts.
  const stepRuns: {from: number; to: number; scene: StoryboardScene}[] = [];
  storyboard.scenes.forEach((s, i) => {
    const t = timing.scenes[i];
    const prev = stepRuns[stepRuns.length - 1];
    const sameStep = prev && s.step && prev.scene.step && prev.scene.step.index === s.step.index && prev.scene.chapter === s.chapter;
    if (s.step && sameStep) {
      prev.to = t.from + t.durationInFrames;
    } else if (s.step) {
      stepRuns.push({from: t.from + t.transitionFrames, to: t.from + t.durationInFrames, scene: s});
    }
  });

  const chapterTitle = (id?: string) => storyboard.chapters?.find((c) => c.id === id)?.title;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <TransitionSeries>
        {storyboard.scenes.map((s, i) => {
          const Scene = scenes[s.component];
          const t = timing.scenes[i];
          const nodes = [];
          if (i > 0 && t.transitionFrames > 0) {
            nodes.push(
              <TransitionSeries.Transition
                key={`${s.id}-t`}
                presentation={presentationFor(s.transition)}
                timing={linearTiming({durationInFrames: t.transitionFrames, easing: ease.inOut})}
              />,
            );
          }
          nodes.push(
            <TransitionSeries.Sequence key={s.id} durationInFrames={t.durationInFrames} name={s.id}>
              <Scene scene={s} storyboard={storyboard} {...(s.props ?? {})} />
            </TransitionSeries.Sequence>,
          );
          return nodes;
        })}
      </TransitionSeries>

      {stepRuns.map((run) => (
        <Sequence key={`step-${run.from}`} from={run.from} durationInFrames={run.to - run.from} name={`Step ${run.scene.step!.index}`}>
          <StepLabel
            index={run.scene.step!.index}
            total={run.scene.step!.total}
            title={run.scene.step!.title}
            chapter={chapterTitle(run.scene.chapter)}
          />
        </Sequence>
      ))}

      {storyboard.audio?.voiceover ? <Audio src={staticFile(storyboard.audio.voiceover)} /> : null}
      {storyboard.audio?.music ? (
        <Audio src={staticFile(storyboard.audio.music)} volume={storyboard.audio.musicVolume ?? 0.12} />
      ) : null}
      {storyboard.scenes.map((s, i) =>
        s.voiceover ? (
          <Sequence key={`vo-${s.id}`} from={timing.scenes[i].from + timing.scenes[i].transitionFrames} name={`VO ${s.id}`}>
            <Audio src={staticFile(s.voiceover)} />
          </Sequence>
        ) : null,
      )}

      {storyboard.burnCaptions
        ? storyboard.scenes.map((s, i) =>
            s.narration ? (
              <Sequence key={`cap-${s.id}`} from={timing.scenes[i].from} durationInFrames={timing.scenes[i].durationInFrames}>
                <CaptionBar text={s.narration} />
              </Sequence>
            ) : null,
          )
        : null}
    </AbsoluteFill>
  );
};

export const storyboardDuration = (storyboard: Storyboard) => computeTimeline(storyboard).totalFrames;
