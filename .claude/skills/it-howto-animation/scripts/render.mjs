// render.mjs — deterministic HTML scene -> MP4 (or a single PNG still). Scene must define window.__seek(seconds) (sync) and may define window.__ready (Promise).
// Video: node render.mjs --scene=video1/scenes/s01.html --duration=12 [--fps=30] [--scale=1|2] [--from=0 --to=N (frames)] [--workers=4] [--img=jpeg|png] --out=video1/out/s01.mp4
// Still: node render.mjs --scene=video1/scenes/s01.html --still=3.5 [--scale=1|2] --out=video1/frames/s01.png
// Each worker runs its own browser process (parallel compositing). Drafts default to JPEG frames (fast); --scale=2 defaults to PNG (lossless).
import { createRequire } from 'node:module'; import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const req = createRequire(import.meta.url);
let pw; try { pw = req('playwright'); } catch { pw = req(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const a = Object.fromEntries(process.argv.slice(2).map(s => s.replace(/^--/, '').split('=')));
const fps = +(a.fps || 30), scale = +(a.scale || 1), workers = +(a.workers || 4);
const img = a.img || 'jpeg', ext = img === 'png' ? 'png' : 'jpg', quality = +(a.quality || (scale > 1 ? 95 : 95));
const url = pathToFileURL(path.resolve(a.scene)).href, t0 = Date.now();
const args = (a.gl === 'sw' ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : []).concat(['--font-render-hinting=none']);
const open = async () => {
  const browser = await pw.chromium.launch({ args });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(url); await page.evaluate(() => window.__ready ?? true); await page.evaluate(() => document.fonts.ready);
  return { browser, page };
};
if (a.still !== undefined) {
  const { browser, page } = await open();
  await page.evaluate(t => window.__seek(t), +a.still);
  fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true });
  await page.screenshot({ path: a.out });
  await browser.close();
  console.log(`still t=${a.still}s -> ${a.out} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  process.exit(0);
}
const total = Math.round(+a.duration * fps), from = +(a.from || 0), to = Math.min(+(a.to || total), total);
const dir = fs.mkdtempSync(path.join(a.tmp || os.tmpdir(), 'frames-'));
const cleanup = () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup);   // never leave frames behind (a crashed 4K run once filled the disk)
try {
  await Promise.all([...Array(workers)].map(async (_, w) => {
    const { browser, page } = await open();
    for (let f = from + w; f < to; f += workers) {
      await page.evaluate(t => window.__seek(t), f / fps);
      await page.screenshot({ path: `${dir}/f${String(f - from).padStart(6, '0')}.${ext}`, type: img, ...(img === 'jpeg' ? { quality } : {}) });
    }
    await browser.close();
  }));
} catch (e) { console.error('render failed:', e.message); cleanup(); process.exit(1); }
fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true });
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${dir}/f%06d.${ext}`,
  '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', a.crf || (scale > 1 ? '14' : '20'),
  '-preset', a.preset || (scale > 1 ? 'slow' : 'veryfast'), '-movflags', '+faststart', '-an', a.out], { stdio: 'inherit' });
fs.rmSync(dir, { recursive: true });
console.log(`frames ${from}-${to} (${to - from}) in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${a.out} [exit ${r.status}]`);
