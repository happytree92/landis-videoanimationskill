// Shared helpers for the skill's scripts. Node 18+, no dependencies beyond the
// studio's own node_modules.
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repo root = the directory that contains studio/. Walk up from here. */
export const repoRoot = (() => {
  let dir = here;
  while (dir !== path.dirname(dir)) {
    if (existsSync(path.join(dir, 'studio', 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error('Could not find the repo root (a folder containing studio/package.json).');
})();

export const studioDir = path.join(repoRoot, 'studio');
export const projectDir = (slug) => path.join(repoRoot, 'projects', slug);
export const storyboardPath = (slug) => path.join(studioDir, 'src', 'projects', slug, 'storyboard.json');

export function loadStoryboard(slug) {
  const p = storyboardPath(slug);
  if (!existsSync(p)) throw new Error(`No storyboard at ${p}. Run new-project.mjs first.`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

/** Composition id for a slug (must match studio/src/Root.tsx). */
export const compositionId = (slug) => slug.replace(/^_+/, '').replace(/[^a-zA-Z0-9-]/g, '-');

/** Parse --key value / --flag arguments. */
export function args() {
  const out = {_: []};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) {
      const key = a[i].slice(2);
      const next = a[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    } else out._.push(a[i]);
  }
  return out;
}

const onPath = (bin) => spawnSync(process.platform === 'win32' ? 'where' : 'which', [bin]).status === 0;

/**
 * Resolve a full ffmpeg/ffprobe binary: system install first, then the static
 * builds installed with the studio (ffmpeg-static / ffprobe-static), so users
 * never have to install ffmpeg themselves. (Remotion's own bundled ffmpeg is a
 * stripped build without select/tile/showinfo, so it isn't used for analysis.)
 */
function resolveBinary(name) {
  if (onPath(name)) return name;
  const req = createRequire(path.join(studioDir, 'package.json'));
  try {
    const p = name === 'ffmpeg' ? req('ffmpeg-static') : req('ffprobe-static').path;
    if (p && existsSync(p)) return p;
  } catch {
    // fall through
  }
  throw new Error(`${name} not found. Run "npm install" in studio/ (installs ${name}-static) or install ffmpeg system-wide.`);
}

/** Returns a function that runs ffmpeg/ffprobe with the given args. */
export function tool(name) {
  const bin = resolveBinary(name);
  return (argv, opts = {}) =>
    execFileSync(bin, argv, {stdio: opts.capture ? 'pipe' : 'inherit', encoding: 'utf8', maxBuffer: 1 << 28});
}

/** Run ffmpeg/ffprobe and return its stderr (where filters like showinfo log). */
export function toolStderr(name, argv) {
  const r = spawnSync(resolveBinary(name), argv, {encoding: 'utf8', maxBuffer: 1 << 28});
  if (r.status !== 0) throw new Error(`${name} failed:\n${r.stderr}`);
  return r.stderr;
}

export function run(cmd, argv, opts = {}) {
  const r = spawnSync(cmd, argv, {stdio: 'inherit', shell: process.platform === 'win32', ...opts});
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(' ')} exited with ${r.status}`);
}
