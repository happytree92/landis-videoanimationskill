// Shared timing math for the storyboard. Imported by the Remotion Timeline
// (TypeScript) AND by the skill's Node scripts (script.md / .srt / chapters),
// so video, captions and voiceover script can never drift apart.

/** Default cross-scene transition length in seconds. */
export const DEFAULT_TRANSITION_SEC = 0.5;

/**
 * @param {{fps?: number, transitionSec?: number, scenes: Array<{id: string, durationSec: number, transition?: string}>}} storyboard
 * @returns {{fps: number, totalFrames: number, scenes: Array<{id: string, index: number, from: number, durationInFrames: number, transitionFrames: number}>}}
 *
 * A scene's `transition` describes how it enters (from the previous scene).
 * TransitionSeries overlaps the two scenes for the transition length, so each
 * scene starts `transitionFrames` before the previous one ends.
 */
export function computeTimeline(storyboard) {
  const fps = storyboard.fps ?? 30;
  const tSec = storyboard.transitionSec ?? DEFAULT_TRANSITION_SEC;
  let cursor = 0;
  const scenes = storyboard.scenes.map((s, index) => {
    const durationInFrames = Math.round(s.durationSec * fps);
    const kind = s.transition ?? 'fade';
    const transitionFrames = index === 0 || kind === 'cut' ? 0 : Math.round(tSec * fps);
    const from = index === 0 ? 0 : cursor - transitionFrames;
    cursor = from + durationInFrames;
    return {id: s.id, index, from, durationInFrames, transitionFrames};
  });
  return {fps, totalFrames: cursor, scenes};
}

/** Frames -> "HH:MM:SS,mmm" (SRT) */
export function toSrtTime(frames, fps) {
  const ms = Math.round((frames / fps) * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
}

/** Frames -> "M:SS" (chapters, script) */
export function toClock(frames, fps) {
  const total = Math.floor(frames / fps);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
