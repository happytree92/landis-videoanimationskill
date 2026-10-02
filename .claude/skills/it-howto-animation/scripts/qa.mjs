// qa.mjs — render several stills of one scene into a labelled contact sheet for review.
// Usage: node qa.mjs --scene=video1/scenes/secC.html --times=1,5,9 --out=video1/qa/secC.png
import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const pw = createRequire(import.meta.url)('playwright');
const a = Object.fromEntries(process.argv.slice(2).map(s => s.replace(/^--/, '').split('=')));
const times = a.times.split(',').map(Number);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-'));
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(pathToFileURL(path.resolve(a.scene)).href);
await page.evaluate(() => window.__ready ?? true); await page.evaluate(() => document.fonts.ready);
for (const [i, t] of times.entries()) { await page.evaluate(t => window.__seek(t), t); await page.screenshot({ path: `${dir}/q${String(i).padStart(2, '0')}.png` }); }
await browser.close();
const cols = +(a.cols || 3), rows = Math.ceil(times.length / cols);
const labels = times.map((t, i) => `[${i}:v]scale=960:540,drawtext=fontfile='C\\:/Windows/Fonts/segoeuib.ttf':text='t=${t}':x=10:y=10:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.7[v${i}]`).join(';');
const layout = times.map((_, i) => `${(i % cols) * 960}_${Math.floor(i / cols) * 540}`).join('|');
const inputs = times.flatMap((_, i) => ['-i', `${dir}/q${String(i).padStart(2, '0')}.png`]);
fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true });
const fc = times.length > 1 ? `${labels};${times.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${times.length}:layout=${layout}:fill=black` : labels.replace('[v0]', '');
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-frames:v', '1', a.out], { stdio: 'inherit' });
fs.rmSync(dir, { recursive: true });
console.log(`qa ${times.length} frames -> ${a.out} [exit ${r.status}]`);
