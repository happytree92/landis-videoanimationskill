import React from 'react';
import {ChapterCard, EndCard, TitleCard} from '../../overlays/Cards';
import type {SceneMap, SceneProps} from '../../timeline/types';

// Scene components for "Sign in with a passkey". One component per storyboard "component" key.
// Recreated app/OS screens live in ./screens/, one file per screen.

const Title: React.FC<SceneProps> = (p) => (
  <TitleCard eyebrow={p.eyebrow as string} title={p.title as string} subtitle={p.subtitle as string} />
);
const Chapter: React.FC<SceneProps> = (p) => (
  <ChapterCard number={p.number as number} title={p.title as string} subtitle={p.subtitle as string} />
);
const End: React.FC<SceneProps> = () => <EndCard />;

export const passkeysScenes: SceneMap = {Title, Chapter, End};
