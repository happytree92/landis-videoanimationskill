#!/usr/bin/env node
// Render a project.
//   draft: 1920x1080, fast encode, review stills at every scene midpoint
//   final: 3840x2160 (scale 2), high-quality encode, thumbnail, docs
//
//   node render.mjs --project ms-authenticator --quality draft
//   node render.mjs --project ms-authenticator --quality final
//   options: --frames 0-299 (partial draft)  --thumb-frame 45  --prores (also write a ProRes 422 HQ master)
import {mkdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {args, compositionId, loadStoryboard, projectDir, run, studioDir, tool} from './lib.mjs';

const a = args();
const quality = a.quality ?? 'draft';
if (!a.project || !['draft', 'final'].includes(quality)) {
  console.error('Usage: render.mjs --project <slug> --quality draft|final [--frames a-b] [--thumb-frame n] [--prores]');
  process.exit(1);
}
const slug = a.project;
const sb = loadStoryboard(slug);
const id = compositionId(slug);
const {computeTimeline} = await import(pathToFileURL(path.join(studioDir, 'src', 'timeline', 'compute.mjs')).href);
const timeline = computeTimeline(sb);
const outRoot = path.join(projectDir(slug), 'output');
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);

// Final renders must not ship placeholder brand values or unresolved TODOs.
if (quality === 'final') {
  const problems = [];
  const tokens = readFileSync(path.join(studioDir, 'src', 'brand', 'tokens.ts'), 'utf8');
  const ph = tokens.split('\n').filter((l) => /PLACEHOLDER/.test(l) && !/^\s*(\/\/|\*|\/\*)/.test(l));
  if (ph.length) problems.push(`brand/tokens.ts still has ${ph.length} PLACEHOLDER value(s):\n    ${ph.map((l) => l.trim()).join('\n    ')}`);
  const sbText = JSON.stringify(sb);
  if (/TODO|TBD|PLACEHOLDER/.test(sbText)) problems.push('storyboard.json contains TODO/TBD/PLACEHOLDER text.');
  if (problems.length && !a.force) {
    console.error(`Refusing final render:\n  - ${problems.join('\n  - ')}\n(Use --force only for an internal test render.)`);
    process.exit(2);
  }
}

const bundleDir = path.join(studioDir, 'out', 'bundle');
console.log('Bundling...');
run('npx', ['--no-install', 'remotion', 'bundle', 'src/index.ts', '--out-dir', bundleDir], {cwd: studioDir});

const common = ['--no-install', 'remotion', 'render', bundleDir, id];
if (quality === 'draft') {
  const dir = path.join(outRoot, 'drafts');
  mkdirSync(dir, {recursive: true});
  const file = path.join(dir, `${slug}_draft_${stamp}.mp4`);
  const extra = a.frames ? ['--frames', a.frames] : [];
  run('npx', [...common, file, '--scale', '1', '--codec', 'h264', '--crf', '23', '--x264-preset', 'veryfast', ...extra], {cwd: studioDir});

  // Review stills: the middle of every scene, named by scene id.
  if (!a.frames) {
    const stillsDir = path.join(dir, `stills_${stamp}`);
    mkdirSync(stillsDir, {recursive: true});
    const ffmpeg = tool('ffmpeg');
    timeline.scenes.forEach((s) => {
      const mid = (s.from + s.durationInFrames / 2) / timeline.fps;
      ffmpeg(['-hide_banner', '-loglevel', 'error', '-y', '-ss', mid.toFixed(3), '-i', file, '-frames:v', '1', '-q:v', '2', path.join(stillsDir, `${String(s.index + 1).padStart(2, '0')}_${s.id}.jpg`)]);
    });
    console.log(`Review stills: ${stillsDir}`);
  }
  console.log(`\nDraft: ${file}`);
} else {
  const dir = path.join(outRoot, 'final');
  mkdirSync(dir, {recursive: true});
  const file = path.join(dir, `${slug}_4k.mp4`);
  run('npx', [...common, file, '--scale', '2', '--codec', 'h264', '--crf', '16', '--x264-preset', 'slow'], {cwd: studioDir});
  if (a.prores) {
    run('npx', [...common, path.join(dir, `${slug}_4k_master.mov`), '--scale', '2', '--codec', 'prores', '--prores-profile', 'hq'], {cwd: studioDir});
  }
  // Thumbnail: 4K still of the title scene's resting frame unless told otherwise.
  const thumbFrame = a['thumb-frame'] ?? String(Math.round(timeline.fps * 2));
  run('npx', ['--no-install', 'remotion', 'still', bundleDir, id, path.join(dir, `${slug}_thumbnail.png`), '--frame', thumbFrame, '--scale', '2'], {cwd: studioDir});
  run('node', [path.join(path.dirname(fileURLToPath(import.meta.url)), 'build-docs.mjs'), '--project', slug]);
  console.log(`\nFinal: ${file}`);
}
