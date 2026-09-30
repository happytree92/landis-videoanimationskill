#!/usr/bin/env node
// Generate the written deliverables from the storyboard (the single source of
// truth), using the exact timing math the video uses:
//   projects/<slug>/output/script.md     voiceover script + step-by-step procedure
//   projects/<slug>/output/captions.srt  captions
//   projects/<slug>/output/chapters.txt  chapter markers (YouTube/Stream format)
//
//   node build-docs.mjs --project ms-authenticator
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {args, loadStoryboard, projectDir, studioDir} from './lib.mjs';

const {computeTimeline, toSrtTime, toClock} = await import(
  pathToFileURL(path.join(studioDir, 'src', 'timeline', 'compute.mjs')).href
);

const a = args();
if (!a.project) {
  console.error('Usage: build-docs.mjs --project <slug>');
  process.exit(1);
}
const sb = loadStoryboard(a.project);
const t = computeTimeline(sb);
const fps = t.fps;
const out = path.join(projectDir(a.project), 'output');
mkdirSync(out, {recursive: true});

// Comfortable instructional VO pace. Above ~155 wpm viewers can't follow along.
const TARGET_WPM = 140;
const MAX_WPM = 155;
const words = (s = '') => s.trim().split(/\s+/).filter(Boolean).length;

// ---------- script.md ----------
const lines = [];
const warnings = [];
lines.push(`# ${sb.title} (voiceover script)`, '');
if (sb.subtitle) lines.push(`_${sb.subtitle}_`, '');
lines.push(
  `Runtime **${toClock(t.totalFrames, fps)}** · ${sb.scenes.length} scenes · generated from \`storyboard.json\`; edit the storyboard, not this file.`,
  '',
  `Pace target: ${TARGET_WPM} wpm (max ${MAX_WPM}). Timecodes are where each line should **start**.`,
  '',
);

let chapter;
sb.scenes.forEach((s, i) => {
  const st = t.scenes[i];
  if (s.chapter && s.chapter !== chapter) {
    chapter = s.chapter;
    const title = sb.chapters?.find((c) => c.id === chapter)?.title ?? chapter;
    lines.push(`## ${title}`, '');
  }
  const start = st.from + st.transitionFrames;
  const end = st.from + st.durationInFrames;
  const secs = (end - start) / fps;
  const w = words(s.narration);
  const wpm = secs > 0 ? Math.round((w / secs) * 60) : 0;
  const head = s.step ? `Step ${s.step.index} of ${s.step.total}: ${s.step.title}` : s.id;
  lines.push(`### ${toClock(start, fps)} · ${head}`, '');
  if (s.narration) lines.push(`> ${s.narration}`, '');
  const meta = [];
  if (s.action) meta.push(`**Viewer does:** ${s.action}`);
  meta.push(`**Window:** ${secs.toFixed(1)} s · ${w} words · ${wpm} wpm`);
  if (s.source) meta.push(`**Source:** ${s.source}`);
  if (s.notes) meta.push(`**Notes:** ${s.notes}`);
  lines.push(meta.join('  \n'), '');
  if (wpm > MAX_WPM) warnings.push(`${s.id}: ${wpm} wpm. Lengthen the scene to ~${Math.ceil((w / TARGET_WPM) * 60 + st.transitionFrames / fps)} s or trim the line.`);
});

// Procedure summary (what a KB article would list).
const steps = [];
sb.scenes.forEach((s) => {
  if (s.step && !steps.find((x) => x.chapter === s.chapter && x.index === s.step.index)) {
    steps.push({chapter: s.chapter, index: s.step.index, title: s.step.title, actions: []});
  }
  if (s.step && s.action) steps.find((x) => x.chapter === s.chapter && x.index === s.step.index).actions.push(s.action);
});
if (steps.length) {
  lines.push('---', '', '## Procedure (for the KB article / video description)', '');
  let ch;
  steps.forEach((st) => {
    if (st.chapter !== ch) {
      ch = st.chapter;
      const title = sb.chapters?.find((c) => c.id === ch)?.title;
      if (title) lines.push('', `**${title}**`, '');
    }
    lines.push(`${st.index}. **${st.title}**${st.actions.length ? ': ' + st.actions.join(' ') : ''}`);
  });
  lines.push('');
}
if (warnings.length) {
  lines.push('---', '', '## Pacing warnings', '', ...warnings.map((w) => `- ${w}`), '');
}
writeFileSync(path.join(out, 'script.md'), lines.join('\n'));

// ---------- captions.srt ----------
// One cue per sentence, timed proportionally to sentence length inside the
// scene's clear window, wrapped to <=42 chars x 2 lines (broadcast convention).
const wrap = (text, max = 42) => {
  const out = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if ((line + ' ' + w).trim().length > max) {
      out.push(line.trim());
      line = w;
    } else line += ' ' + w;
  }
  if (line.trim()) out.push(line.trim());
  return out;
};
const cues = [];
sb.scenes.forEach((s, i) => {
  if (!s.narration) return;
  const st = t.scenes[i];
  const start = st.from + st.transitionFrames;
  const end = st.from + st.durationInFrames;
  const sentences = s.narration.match(/[^.!?]+[.!?]*/g).map((x) => x.trim()).filter(Boolean);
  // Split long sentences into 2-line chunks.
  const chunks = sentences.flatMap((sen) => {
    const ls = wrap(sen);
    const res = [];
    for (let k = 0; k < ls.length; k += 2) res.push(ls.slice(k, k + 2).join('\n'));
    return res;
  });
  const total = chunks.reduce((n, c) => n + c.length, 0);
  let cursor = start;
  chunks.forEach((c) => {
    const len = Math.round(((end - start) * c.length) / total);
    cues.push({from: cursor, to: Math.min(end, cursor + len), text: c});
    cursor += len;
  });
});
writeFileSync(
  path.join(out, 'captions.srt'),
  cues.map((c, i) => `${i + 1}\n${toSrtTime(c.from, fps)} --> ${toSrtTime(c.to, fps)}\n${c.text}\n`).join('\n'),
);

// ---------- chapters.txt ----------
const chapters = [`${toClock(0, fps)} Introduction`];
let seen;
sb.scenes.forEach((s, i) => {
  if (s.chapter && s.chapter !== seen) {
    seen = s.chapter;
    const title = sb.chapters?.find((c) => c.id === s.chapter)?.title ?? s.chapter;
    const st = t.scenes[i];
    chapters.push(`${toClock(st.from + st.transitionFrames, fps)} ${title}`);
  }
});
writeFileSync(path.join(out, 'chapters.txt'), chapters.join('\n') + '\n');

console.log(`Wrote script.md, captions.srt, chapters.txt to ${out}`);
if (warnings.length) {
  console.warn(`\nPacing warnings:\n${warnings.map((w) => '  - ' + w).join('\n')}`);
}
