// lib.js — shared, deterministic components for Video 1 scenes. Every visual state is a pure function of t (seconds).
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // cubic in-out
const quint = t => 1 - Math.pow(1 - t, 5);                                      // quint out (entrances)
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lin = (t, s, e) => clamp((t - s) / (e - s));
const seg = (t, s, e) => ease(lin(t, s, e));
const segIn = (t, s, e) => quint(lin(t, s, e));
const lerp = (a, b, p) => a + (b - a) * p;
const $ = (sel, root = document) => root.querySelector(sel);
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

// ---------- backdrop ----------
function Backdrop(stage) {
  stage.appendChild(el(`<div class="bg"><div class="slant s3"></div><div class="slant s1"></div><div class="slant s2"></div><div class="floor"></div></div>`));
  const bg = stage.lastElementChild;
  stage.appendChild(el(`<div class="vignette"></div>`));
  return { drift(t) { bg.style.transform = `translate(${Math.sin(t * .15) * 8}px, ${Math.cos(t * .11) * 5}px)`; } };
}
function Grain(stage) { stage.appendChild(el(`<div class="grain"></div>`)); }

// ---------- status bars ----------
const sig = c => `<svg width="17" height="12" viewBox="0 0 17 12"><g fill="${c}"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1"/><rect x="9" y="3" width="3" height="9" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></g></svg>`;
const wifi = c => `<svg width="16" height="12" viewBox="0 0 16 12"><path fill="${c}" d="M8 12 5.6 9.2a3.4 3.4 0 0 1 4.8 0zM3.4 7a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.2 3.7a11.2 11.2 0 0 1 15.6 0L16 3.5 14.5 2A13.2 13.2 0 0 0 1.5 2L0 3.5z"/></svg>`;
const batt = (c, ios) => ios
  ? `<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="${c}" opacity=".45"/><rect x="2" y="2" width="18" height="9" rx="2" fill="${c}"/><rect x="24.5" y="4.5" width="1.6" height="4" rx=".8" fill="${c}" opacity=".45"/></svg>`
  : `<svg width="11" height="17" viewBox="0 0 11 17"><rect x="3.5" y="0" width="4" height="2" rx=".5" fill="${c}"/><rect x="0" y="1.6" width="11" height="15.4" rx="2" fill="${c}"/></svg>`;
function statusBar(os, dark) {
  const c = dark ? '#fff' : '#111';
  return `<div class="sb" style="color:${c}"><span>9:41</span><span class="icons">${wifi(c)}${sig(c)}${batt(c, os === 'ios')}</span></div>`;
}
function navBar(os, dark) {
  const c = dark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.75)';
  if (os === 'ios') return `<div class="homeind" style="background:${c}"></div>`;
  return `<div class="navbar"><svg width="18" height="16"><g stroke="${c}" stroke-width="2"><line x1="3" y1="2" x2="3" y2="14"/><line x1="9" y1="2" x2="9" y2="14"/><line x1="15" y1="2" x2="15" y2="14"/></g></svg>`
    + `<svg width="20" height="20"><rect x="2" y="2" width="16" height="16" rx="6" fill="none" stroke="${c}" stroke-width="2"/></svg>`
    + `<svg width="16" height="18"><path d="M12 2 4 9l8 7" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg></div>`;
}

// ---------- phone ----------
// Phone(stage, 'android'|'ios', {x, y, scale, label}) — x,y = device centre in stage px.
function Phone(stage, os, o = {}) {
  const root = el(`<div class="dev ${os}">
    <div class="shadow"></div>
    <div class="body">
      ${os === 'ios'
        ? `<div class="btn" style="left:-3px;top:150px;height:34px"></div><div class="btn" style="left:-3px;top:212px;height:62px"></div><div class="btn" style="left:-3px;top:288px;height:62px"></div><div class="btn" style="right:-3px;top:236px;height:96px"></div>`
        : `<div class="btn" style="right:-3px;top:170px;height:92px"></div><div class="btn" style="right:-3px;top:292px;height:56px"></div>`}
      <div class="bezel"><div class="screen"></div><div class="cam"></div></div>
      <div class="glare"></div>
    </div>
    ${o.label ? `<div class="label">${o.label}</div>` : ''}
  </div>`);
  stage.appendChild(root);
  const screen = $('.screen', root);
  const api = {
    root, screen, os,
    // screen size in CSS px (before device scale)
    w: os === 'ios' ? 366 : 370, h: os === 'ios' ? 806 : 810,
    // add a screen layer; returns element
    layer(html) { const L = el(`<div class="scr ${os}">${html}</div>`); screen.appendChild(L); return L; },
    place(x, y, s = 1, ry = 0, rx = 0, op = 1) {
      root.style.left = (x - 200) + 'px'; root.style.top = (y - 420) + 'px';
      root.style.transform = `perspective(2400px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${s})`;
      root.style.opacity = op;
    },
  };
  api.place(o.x ?? 960, o.y ?? 470, o.scale ?? 1);
  return api;
}

// ---------- overlays ----------
function StepBadge(stage) {
  const b = el(`<div class="badge"><div class="tab"></div><div class="card"><div class="n"></div><div class="t"></div></div></div>`);
  stage.appendChild(b);
  return { set(n, text, p) { $('.n', b).textContent = n; $('.t', b).textContent = text;
    b.style.opacity = p; b.style.transform = `translateY(${(1 - p) * 14}px)`; } };
}
function Caption(stage) {
  const c = el(`<div class="caption"></div>`); stage.appendChild(c);
  return { set(html, p) { if (c.innerHTML !== html) c.innerHTML = html;
    c.style.opacity = p; c.style.transform = `translateX(-50%) translateY(${(1 - p) * 14}px)`; } };
}
// TapRipple inside a screen layer: x,y in screen px. p = 0..1 over ~0.4 s.
function TapRipple(layer) {
  const r = el(`<div class="ripple"></div>`); layer.appendChild(r);
  return { set(x, y, p) { r.style.left = x + 'px'; r.style.top = y + 'px';
    r.style.opacity = p <= 0 || p >= 1 ? 0 : (1 - p) * .95; r.style.transform = `scale(${.35 + p * .9})`; } };
}
function Highlight(layer) {
  const h = el(`<div class="hl"></div>`); layer.appendChild(h);
  return { set(x, y, w, hh, p) { Object.assign(h.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', opacity: p }); } };
}
// ZoomTo: device centre that keeps screen point (sx, sy) fixed while the phone scales from `base` to `s`.
function focusCenter(cx, cy, base, s, sx, sy) {
  const lx = sx + 15 - 200, ly = sy + 15 - 420;
  return [cx - lx * (s - base), cy - ly * (s - base)];
}
// fade-with-rise helper for any element
function rise(e, p, dy = 14) { e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * dy}px)`; }

// ---------- timeline runtimes ----------
// Flow: drives which view (child with data-v) is visible inside a phone layer.
// steps: [{at, v, tr}] tr = 'cut' | 'fade' | 'push' (from right) | 'pop' (from left) | 'sheet' (slides up over dimmed previous)
function Flow(layer, steps) {
  const views = Object.fromEntries([...layer.querySelectorAll('[data-v]')].map(n => [n.dataset.v, n]));
  const dim = el(`<div class="abs" style="inset:0;background:#000;pointer-events:none;z-index:15;opacity:0"></div>`);
  layer.appendChild(dim);
  return t => {
    let i = 0; while (i + 1 < steps.length && steps[i + 1].at <= t) i++;
    const cur = steps[i], prev = steps[i - 1], D = cur.tr === 'fade' ? .45 : .4;
    const p = cur.tr === 'cut' || !prev ? 1 : seg(t, cur.at, cur.at + D);
    for (const k in views) { const n = views[k]; n.style.display = 'none'; n.style.zIndex = 1; n.style.transform = ''; n.style.opacity = 1; }
    dim.style.opacity = 0;
    const c = views[cur.v]; c.style.display = ''; c.style.zIndex = 3;
    if (prev && p < 1 && prev.v !== cur.v) {
      const b = views[prev.v]; b.style.display = '';
      if (cur.tr === 'fade') c.style.opacity = p;
      if (cur.tr === 'push') { c.style.transform = `translateX(${(1 - p) * 100}%)`; b.style.transform = `translateX(${-p * 28}%)`; }
      if (cur.tr === 'pop') { c.style.transform = `translateX(${-(1 - p) * 28}%)`; b.style.transform = `translateX(${p * 100}%)`; b.style.zIndex = 4; }
    }
    if ((cur.tr === 'sheet' || cur.tr === 'alert') && prev) {   // previous stays visible underneath, dimmed
      const b = views[prev.v]; b.style.display = ''; dim.style.opacity = .5 * p; dim.style.zIndex = 2;
      if (cur.tr === 'sheet') c.style.transform = `translateY(${(1 - p) * 100}%)`;
      else { c.style.opacity = p; c.style.transform = `scale(${1.08 - .08 * p})`; }
    }
  };
}
// Taps: [[at, x, y], ...] in screen px. Ring expands/fades over 0.4 s.
function Taps(layer, list) {
  const r = TapRipple(layer);
  return t => { const hit = list.find(([at]) => t >= at && t < at + .4); hit ? r.set(hit[1], hit[2], lin(t, hit[0], hit[0] + .4)) : r.set(0, 0, 0); };
}
// Sequenced badge/caption: items [{at, ...}] — fades the active item in, and out before the next one.
function Seq(items, apply) {
  return t => {
    let i = -1; while (i + 1 < items.length && items[i + 1].at <= t) i++;
    if (i < 0) return apply(items[0], 0);
    const it = items[i], next = items[i + 1], end = it.until ?? (next ? next.at : 1e9);
    apply(it, segIn(t, it.at, it.at + .45) * (1 - lin(t, end - .3, end)));
  };
}
// Typed text: returns the first n characters of s over [a, b].
const typed = (s, t, a, b) => s.slice(0, Math.round(lin(t, a, b) * s.length));

// Wait for images + fonts before rendering.
function readyAll() {
  const imgs = [...document.images].map(i => i.decode().catch(() => {}));
  return Promise.all([document.fonts.ready, ...imgs]);
}
