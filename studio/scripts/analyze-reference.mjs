#!/usr/bin/env node
// Break a reference recording into things Claude can read: metadata, frames at
// every scene change, a frame every N seconds, contact sheets, and the audio
// track (for transcription). Output goes to projects/<slug>/analysis/<clip>/.
//
//   node analyze-reference.mjs --project ms-authenticator --input path/to/clip.mov
//   options: --every 2 (seconds between interval frames) --threshold 0.2 (scene sensitivity; lower = more frames)
import {mkdirSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {args, projectDir, tool, toolStderr} from './lib.mjs';

/** 12.5 -> "t0012.50s" so filenames sort and map back to the reference timeline. */
const stamp = (t) => `t${t.toFixed(2).padStart(7, '0')}s`;

const a = args();
if (!a.project || !a.input) {
  console.error('Usage: analyze-reference.mjs --project <slug> --input <video> [--every 2] [--threshold 0.25]');
  process.exit(1);
}
const every = Number(a.every ?? 2);
const threshold = Number(a.threshold ?? 0.2);
const clip = path.basename(a.input).replace(/\.[^.]+$/, '');
const out = path.join(projectDir(a.project), 'analysis', clip);
for (const d of ['scenes', 'interval', 'sheets']) mkdirSync(path.join(out, d), {recursive: true});

const ffprobe = tool('ffprobe');
const ffmpeg = tool('ffmpeg');

// 1. Metadata
const probe = JSON.parse(
  ffprobe(['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', a.input], {capture: true}),
);
const v = probe.streams.find((s) => s.codec_type === 'video');
const hasAudio = probe.streams.some((s) => s.codec_type === 'audio');
const [num, den] = (v?.avg_frame_rate ?? '30/1').split('/').map(Number);
const meta = {
  file: a.input,
  durationSec: Number(probe.format.duration),
  width: v?.width,
  height: v?.height,
  rotation: v?.side_data_list?.find((s) => s.rotation !== undefined)?.rotation ?? v?.tags?.rotate ?? 0,
  fps: den ? num / den : num,
  hasAudio,
};
writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 2));
console.log('Metadata:', meta);

// Frames are timestamped in their filenames (t0012.50s) so they map straight
// back to the reference timeline in the storyboard's "source" fields.
const scale = 'scale=960:-2';

// 2. Scene-change frames (+ the first frame). showinfo logs each selected
// frame's pts_time, which we use to stamp the filenames.
const select = `select=eq(n\\,0)+gt(scene\\,${threshold})`; // no shell, so no quoting; commas escaped for the filter parser
const log = toolStderr('ffmpeg', ['-hide_banner', '-i', a.input, '-vf', `${select},showinfo,${scale}`, '-vsync', 'vfr', '-q:v', '3', path.join(out, 'scenes', 'raw_%04d.jpg')]);
const times = [...log.matchAll(/pts_time:([\d.]+)/g)].map((m) => Number(m[1]));
const raws = readdirSync(path.join(out, 'scenes')).filter((f) => f.startsWith('raw_')).sort();
raws.forEach((f, i) => {
  const t = times[i] ?? 0;
  renameSync(path.join(out, 'scenes', f), path.join(out, 'scenes', `scene_${String(i + 1).padStart(3, '0')}_${stamp(t)}.jpg`));
});
console.log(`Scene-change frames: ${raws.length}`);

// 3. Interval frames
ffmpeg(['-hide_banner', '-loglevel', 'error', '-i', a.input, '-vf', `fps=1/${every},${scale}`, '-q:v', '3', path.join(out, 'interval', 'raw_%04d.jpg')]);
readdirSync(path.join(out, 'interval'))
  .filter((f) => f.startsWith('raw_'))
  .sort()
  .forEach((f, i) => {
    const t = i * every;
    renameSync(path.join(out, 'interval', f), path.join(out, 'interval', `${stamp(t)}.jpg`));
  });

// 4. Contact sheets: 4x3 grids of the interval frames, read left-to-right,
// top-to-bottom. Sheet N, cell C (0-based) = time (N-1)*12*every + C*every.
ffmpeg([
  '-hide_banner', '-loglevel', 'error', '-i', a.input,
  '-vf', `fps=1/${every},scale=480:-2,tile=4x3:padding=6:margin=6`,
  '-q:v', '3', path.join(out, 'sheets', 'sheet_%03d.jpg'),
]);

// 5. Audio for transcription (16 kHz mono WAV is what speech-to-text tools expect).
if (hasAudio) {
  ffmpeg(['-hide_banner', '-loglevel', 'error', '-y', '-i', a.input, '-vn', '-ac', '1', '-ar', '16000', path.join(out, 'audio.wav')]);
}

console.log(`\nDone. Review in this order:\n  ${path.join(out, 'sheets')}  (overview)\n  ${path.join(out, 'scenes')}  (every UI change, timestamped)\n  ${path.join(out, 'interval')}  (every ${every}s)`);
if (hasAudio) console.log(`  ${path.join(out, 'audio.wav')}  (transcribe if narration was recorded)`);
