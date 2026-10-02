// measure.mjs — print element centres in a container's own coordinate space, so cursor/tap targets come from layout, not guesses.
// Usage: node measure.mjs --scene=video2/scenes/secL.html --t=10 --root=".lap .content" --sel=".l-other,.l-fido"
//   --root: the coordinate space (laptop content = 1440x885, or a phone layer = 370x810 / 366x806). Untransformed size is read
//   from offsetWidth so scaling/perspective of ancestors is removed.
import { createRequire } from 'node:module'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const pw = createRequire(import.meta.url)('playwright');
const a = Object.fromEntries(process.argv.slice(2).map(s => { const i = s.indexOf('='); return [s.slice(2, i), s.slice(i + 1)]; }));
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.resolve(a.scene)).href);
await page.evaluate(() => window.__ready ?? true);
const out = await page.evaluate(({ t, root, sels }) => {
  window.__seek(+t);
  const R = document.querySelectorAll(root); const res = [];
  for (const r of R) {
    const rb = r.getBoundingClientRect(), k = rb.width / r.offsetWidth;
    for (const s of sels) r.querySelectorAll(s).forEach(n => {
      if (!n.getClientRects().length) return;
      const b = n.getBoundingClientRect();
      res.push(`${s.padEnd(14)} centre (${Math.round((b.left + b.width / 2 - rb.left) / k)}, ${Math.round((b.top + b.height / 2 - rb.top) / k)})  size ${Math.round(b.width / k)}x${Math.round(b.height / k)}`);
    });
  }
  return res;
}, { t: a.t || 0, root: a.root, sels: a.sel.split(',') });
console.log(out.join('\n'));
await browser.close();
