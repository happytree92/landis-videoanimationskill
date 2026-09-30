import type {SceneMap, Storyboard} from '../timeline/types';
import demoStoryboard from './_demo/storyboard.json';
import {demoScenes} from './_demo/scenes';
import authenticatorSetupStoryboard from './authenticator-setup/storyboard.json';
import {authenticatorSetupScenes} from './authenticator-setup/scenes';
import passkeysStoryboard from './passkeys/storyboard.json';
import {passkeysScenes} from './passkeys/scenes';
// @new-project-imports (new-project.mjs inserts imports above this line)

/**
 * Every video project. Root.tsx registers a composition for each
 * (id = slug with leading underscores stripped).
 */
export const projects: {storyboard: Storyboard; scenes: SceneMap}[] = [
  {storyboard: demoStoryboard as Storyboard, scenes: demoScenes},
  {storyboard: authenticatorSetupStoryboard as Storyboard, scenes: authenticatorSetupScenes},
  {storyboard: passkeysStoryboard as Storyboard, scenes: passkeysScenes},
  // @new-project-entries (new-project.mjs inserts entries above this line)
];
