export declare const DEFAULT_TRANSITION_SEC: number;
export declare function computeTimeline(storyboard: {
  fps?: number;
  transitionSec?: number;
  scenes: Array<{id: string; durationSec: number; transition?: string}>;
}): {
  fps: number;
  totalFrames: number;
  scenes: Array<{id: string; index: number; from: number; durationInFrames: number; transitionFrames: number}>;
};
export declare function toSrtTime(frames: number, fps: number): string;
export declare function toClock(frames: number, fps: number): string;
