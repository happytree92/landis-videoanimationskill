import React from 'react';

/** How a scene enters from the previous one. Keep it calm: fade is the default. */
export type SceneTransition = 'fade' | 'slide-left' | 'slide-up' | 'wipe' | 'cut';

/**
 * One row of storyboard.json. The storyboard is the single source of truth for
 * scene order, timing, step labels, on-screen text and the voiceover script.
 */
export type StoryboardScene = {
  id: string;
  /** Key into the project's scene component map. */
  component: string;
  durationSec: number;
  transition?: SceneTransition;
  /** Chapter id this scene belongs to (for chapter markers + step label eyebrow). */
  chapter?: string;
  /** Step shown in the lower-left label. Consecutive scenes with the same step share one label. */
  step?: {index: number; total: number; title: string} | null;
  /** Voiceover line(s) for this scene. Written for the ear; used in script.md and captions.srt. */
  narration?: string;
  /** What the viewer must do in the real world during this scene (accuracy checklist). */
  action?: string;
  /** Source of truth for the UI shown: reference file + timestamp, or doc link. */
  source?: string;
  /** Per-scene voiceover clip under studio/public/, starts when the scene is fully in. */
  voiceover?: string;
  /** Free-form notes for reviewers. Not rendered. */
  notes?: string;
  /** Arbitrary props passed to the scene component. */
  props?: Record<string, unknown>;
};

export type Storyboard = {
  slug: string;
  title: string;
  subtitle?: string;
  fps?: number;
  transitionSec?: number;
  /** Burn captions into the picture (captions.srt is always produced regardless). */
  burnCaptions?: boolean;
  chapters?: {id: string; title: string}[];
  /**
   * Audio beds, paths under studio/public/. Added after picture lock.
   * Per-scene voiceover clips (scene.voiceover) are preferred over one long
   * file: a scene retime then can't knock later lines out of sync.
   */
  audio?: {voiceover?: string; music?: string; musicVolume?: number};
  scenes: StoryboardScene[];
};

export type SceneProps = {scene: StoryboardScene; storyboard: Storyboard} & Record<string, unknown>;
export type SceneMap = Record<string, React.FC<SceneProps>>;
