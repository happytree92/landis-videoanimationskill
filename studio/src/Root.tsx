import React from 'react';
import {Composition} from 'remotion';
import './brand/fonts';
import {projects} from './projects/registry';
import {storyboardDuration, Timeline} from './timeline/Timeline';
import type {SceneMap, Storyboard} from './timeline/types';

/** Composition ids: letters, numbers and hyphens only. */
export const compositionId = (slug: string) => slug.replace(/^_+/, '').replace(/[^a-zA-Z0-9-]/g, '-');

// Scene components can't travel through (JSON-serialized) composition props,
// so each project gets its own component with its scene map bound in.
const bound = projects.map(({storyboard, scenes}) => {
  const Project: React.FC<{storyboard: Storyboard}> = (props) => (
    <Timeline storyboard={props.storyboard} scenes={scenes as SceneMap} />
  );
  return {storyboard, Project};
});

export const RemotionRoot: React.FC = () => (
  <>
    {bound.map(({storyboard, Project}) => (
      <Composition
        key={storyboard.slug}
        id={compositionId(storyboard.slug)}
        component={Project}
        durationInFrames={storyboardDuration(storyboard)}
        fps={storyboard.fps ?? 30}
        width={1920}
        height={1080}
        defaultProps={{storyboard}}
      />
    ))}
  </>
);
