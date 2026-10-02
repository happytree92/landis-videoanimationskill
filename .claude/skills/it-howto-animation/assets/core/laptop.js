// laptop.js — Laptop component, laptop screen templates and Video 2 phone screens. Depends on video1/lib.js + screens.js.

// Laptop(stage, {x, y, scale}) — x,y = laptop centre (lid+deck box 1240×860). content() = 1440×885 authoring surface.
function Laptop(stage, o = {}) {
  const root = el(`<div class="lap"><div class="shadow"></div><div class="deck"></div>
    <div class="lid"><div class="cam"></div><div class="scr"><div class="content"></div></div></div><div class="glare"></div></div>`);
  stage.appendChild(root);
  const content = $('.content', root);
  const api = {
    root, content,
    layer(html) { const L = el(`<div class="abs" style="inset:0">${html}</div>`); content.appendChild(L); return L; },
    place(x, y, s = 1, rx = 0, op = 1) {
      root.style.left = (x - 620) + 'px'; root.style.top = (y - 430) + 'px';
      root.style.transform = `perspective(2600px) rotateX(${rx}deg) scale(${s})`; root.style.opacity = op;
    },
    // stage position of a content point (cx, cy in 1440×885 space) for a given placement — used for zoom focus.
    focus(x, y, s, cx, cy) { const lx = 18 + cx * .8361 - 620, ly = 18 + cy * .8361 - 430; return [x - lx * (s - 1), y - ly * (s - 1)]; },
  };
  api.place(o.x ?? 960, o.y ?? 470, o.scale ?? 1);
  return api;
}

// Cursor inside a laptop layer: waypoints [[t, x, y], ...] (content px); clicks [t, ...] show a press ring.
function Cursor(layer, pts, clicks = []) {
  const c = el(`<div class="abs" style="z-index:90;width:26px;height:26px;pointer-events:none"><svg width="26" height="26" viewBox="0 0 26 26"><path d="M3 2v19l5-5 4 8 3-1.5-4-8h7z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg></div>`);
  const ring = el(`<div class="abs" style="z-index:89;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid rgba(51,102,255,.9);opacity:0"></div>`);
  layer.appendChild(ring); layer.appendChild(c);
  return t => {
    let i = 0; while (i + 1 < pts.length && pts[i + 1][0] <= t) i++;
    const a = pts[i], b = pts[i + 1] || a, p = b === a ? 1 : seg(t, a[0], b[0]);
    const x = lerp(a[1], b[1], p), y = lerp(a[2], b[2], p);
    c.style.left = x + 'px'; c.style.top = y + 'px';
    const k = clicks.find(ct => t >= ct && t < ct + .4);
    ring.style.left = (x + 4) + 'px'; ring.style.top = (y + 4) + 'px';
    ring.style.opacity = k !== undefined ? (1 - lin(t, k, k + .4)) : 0; ring.style.transform = `scale(${k !== undefined ? .4 + lin(t, k, k + .4) * .8 : 1})`;
  };
}

// ---- deterministic, non-functional QR pattern (finder squares + seeded noise; centre passkey glyph) ----
function qrSVG(seed = 7, n = 29, size = 186) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const m = size / n; let r = '';
  const finder = (x, y) => `<rect x="${x * m}" y="${y * m}" width="${7 * m}" height="${7 * m}" fill="#000"/><rect x="${(x + 1) * m}" y="${(y + 1) * m}" width="${5 * m}" height="${5 * m}" fill="#fff"/><rect x="${(x + 2) * m}" y="${(y + 2) * m}" width="${3 * m}" height="${3 * m}" fill="#000"/>`;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  const c0 = Math.floor(n / 2) - 4, c1 = Math.floor(n / 2) + 4;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (inFinder(x, y) || (x >= c0 && x <= c1 && y >= c0 && y <= c1)) continue;
    if (rnd() > .52) r += `<rect x="${(x * m).toFixed(2)}" y="${(y * m).toFixed(2)}" width="${(m + .3).toFixed(2)}" height="${(m + .3).toFixed(2)}"/>`;
  }
  const c = size / 2;
  const glyph = `<g transform="translate(${c - 16},${c - 16})" fill="none" stroke="#000" stroke-width="2.4"><circle cx="13" cy="10" r="6"/><path d="M3 29c1-7 5-10 10-10 3 0 5 1 7 3"/><circle cx="25" cy="21" r="3.6"/><path d="M25 24.6V31m0-3h3"/></g>`;
  return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#000">${r}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}${glyph}</svg>`;
}

// ---- laptop screens ----
const shieldIco = `<svg width="18" height="20" viewBox="0 0 18 20"><path d="M9 1 17 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V4z" fill="#2b88d8"/></svg>`;
const qrIco = c => `<svg width="22" height="22" viewBox="0 0 24 24"><g fill="none" stroke="${c}" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></g><path fill="${c}" d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>`;
const usbIco = c => `<svg width="20" height="24" viewBox="0 0 20 24"><rect x="5" y="9" width="10" height="13" rx="2" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M7 9V3h6v6" fill="none" stroke="${c}" stroke-width="1.6"/></svg>`;
const pkIco = c => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><circle cx="9" cy="8" r="4"/><path d="M2 20c1-4 4-6 7-6 2 0 3 .4 4 1"/><circle cx="17" cy="15" r="2.6"/><path d="M17 17.6V22m0-2h2"/></svg>`;
const browserChrome = (url, title, inner) => `<div class="desk-bg"></div><div class="br">
  <div class="tabs"><div class="tab"><i></i>${title}</div></div>
  <div class="tb">‹&nbsp;&nbsp;›&nbsp;&nbsp;↻<div class="addr"><span class="lk">🔒</span><span class="url">${url}</span></div>⋯</div>
  <div class="page">${inner}</div></div>
  <div class="taskbar"><i></i><i></i><i class="on"></i><i></i><i></i><div class="clock">9:41 AM<br>10/1/2026</div></div>`;
const entraCard = (inner, v) => `<div class="entra" data-v="${v}"><div class="card"><img class="logo" src="../../shared/marks/microsoft-logo.png">${inner}</div>
  <div class="foot"><span>Terms of use</span><span>Privacy &amp; cookies</span><span>···</span></div></div>`;
const lapSignIn = () => entraCard(`<h1>Sign in</h1><div class="field"><span class="ph">Email, phone, or Skype</span><span class="txt"></span><span class="cur"></span></div>
  <div class="lnk">Can't access your account?</div><div class="btns"><div class="b pri l-next">Next</div></div>`, 'l-email');
const lapPassword = () => entraCard(`<div class="who">← alex.morgan@contoso.com</div><h1 style="margin-top:8px">Enter password</h1>
  <div class="field"><span class="ph">Password</span></div><div class="lnk">Forgot my password</div><div class="lnk l-other">Other ways to sign in</div>
  <div class="btns"><div class="b pri">Sign in</div></div>`, 'l-pw');
const lapOther = () => entraCard(`<div class="who">← alex.morgan@contoso.com</div><h1 style="margin-top:8px">Sign in another way</h1>
  <div class="opt first l-fido">${pkIco('#1b1b1b')}<span>Face, fingerprint, PIN or security key</span></div>
  <div class="opt">${ICO.msg('#1b1b1b', 24)}<span>Approve a request on my Microsoft Authenticator app</span></div>
  <div class="opt">${ICO.key('#1b1b1b')}<span>Use my password</span></div>`, 'l-other');
const lapFido = () => entraCard(`<div class="who">← alex.morgan@contoso.com</div><h1 style="margin-top:8px">Face, fingerprint, PIN or security key</h1>
  <div class="p">Your device will open a security window. Follow the instructions there to sign in.</div>`, 'l-fido');
const wsChoose = () => `<div class="abs" data-v="w-choose" style="inset:0"><div class="wsd"><div class="hd">${shieldIco}Windows Security<span class="x">✕</span></div>
  <h2>Choose a passkey</h2><div class="sub">Passkey for login.microsoft.com</div>
  <div class="row w-phone" style="margin-top:18px">${qrIco('#fff')}<span>iPhone, iPad, or Android device</span></div>
  <div class="row">${usbIco('#fff')}<span>Security key</span></div><div class="cancel">Cancel</div></div></div>`;
const wsQR = () => `<div class="abs" data-v="w-qr" style="inset:0"><div class="wsd"><div class="hd">${shieldIco}Windows Security<span class="x">✕</span></div>
  <h2>Sign in with a passkey</h2><div class="acct">${qrIco('#fff')}<div>iPhone, iPad, or Android device<div class="t2">Passkey for login.microsoft.com</div></div><span class="dot"></span></div>
  <div class="qr">${qrSVG(11)}</div><div class="msg">Scan this QR code with your phone or tablet</div>
  <div class="alt">Choose a different passkey</div><div class="cancel">Cancel</div></div></div>`;
const wsConnected = () => `<div class="abs" data-v="w-conn" style="inset:0"><div class="wsd"><div class="hd">${shieldIco}Windows Security<span class="x">✕</span></div>
  <h2>Sign in with a passkey</h2><div class="acct">${qrIco('#fff')}<div>iPhone, iPad, or Android device<div class="t2">Passkey for login.microsoft.com</div></div><span class="dot"></span></div>
  <div style="text-align:center;margin-top:34px"><svg width="54" height="64" viewBox="0 0 54 64"><rect x="8" y="4" width="30" height="52" rx="6" fill="none" stroke="#4cc2ff" stroke-width="3"/><circle cx="38" cy="44" r="12" fill="#0f6cbd"/><path d="m32 44 4 4 8-8" stroke="#fff" stroke-width="3" fill="none"/></svg></div>
  <div class="msg" style="font-size:18px">Device connected!<br>Continue on your device</div>
  <div class="alt" style="margin-top:40px">Choose a different passkey</div><div class="cancel">Cancel</div></div></div>`;
const msiPage = () => `<div class="msi" data-v="l-msi"><div class="top">⋮⋮⋮ <span class="org">Contoso</span> My Sign-Ins<span class="av">AM</span></div>
  <div class="nav"><div class="me"><i></i><div><b>Alex Morgan</b><br><span style="font-size:12px;color:#666">alex.morgan@contoso.com</span></div></div>
    <div class="it">Overview</div><div class="it on">Security info</div><div class="it">Devices</div><div class="it">Password</div><div class="it">Organizations</div><div class="it">Settings &amp; Privacy</div><div class="it">Recent activity</div></div>
  <div class="main"><h1>Security info</h1><div class="d">These are the methods you use to sign into your account or reset your password.</div>
    <div class="box"><div class="add">+ Add sign-in method</div>
      <div class="mrow"><span>▭</span><span>Password</span><span class="t2">Last updated: 1 day ago</span><span class="del">Change</span></div>
      <div class="mrow">${ICO.msg('#444', 18)}<span>Phone<div class="t2">+X XXXXXXXX12</div></span><span></span><span class="del">Delete</span></div>
      <div class="mrow mhl">${pkIco('#444')}<span>Passkey (Device-bound)<div class="t2">Microsoft Authenticator</div></span><span class="t2">Authenticator - Android</span><span class="del">Delete</span></div>
    </div></div><div class="spin" style="display:none"></div></div>`;

// ---- Video 2 phone screens ----
// Mini laptop QR as seen through the phone camera (dialog crop, slightly skewed)
const viewfinderShot = (seed) => `<div class="abs" style="inset:0;background:radial-gradient(260px 300px at 50% 38%, #2b3140 0%, #12151c 70%, #07080b 100%)">
  <div class="abs" style="left:58px;top:150px;width:250px;height:290px;background:#202020;border-radius:6px;transform:perspective(600px) rotateX(6deg) rotateZ(-1.5deg);box-shadow:0 0 40px rgba(0,0,0,.6)">
    <div style="font:600 11px 'Segoe UI';color:#ddd;padding:12px 14px 0">Sign in with a passkey</div>
    <div style="position:absolute;left:42px;top:52px;width:166px;height:166px;background:#fff;padding:8px">${qrSVG(seed)}</div>
    <div style="position:absolute;left:0;right:0;top:232px;text-align:center;font:10px 'Segoe UI';color:#ccc">Scan this QR code with your phone or tablet</div></div></div>`;
const brackets = (c) => `<svg class="abs" style="left:48px;top:140px" width="270" height="310"><g fill="none" stroke="${c}" stroke-width="4"><path d="M2 40V2h40M228 2h40v38M268 270v38h-40M42 308H2v-38"/></g></svg>`;
const aScan = () => `<div class="v" data-v="a-scan" style="background:#000">${viewfinderShot(11)}${brackets('#5a8cff')}
  <div class="abs" style="left:0;right:0;top:0;height:96px;background:#2f54d3">${statusBar('android', true)}<div style="position:absolute;left:20px;bottom:16px;color:#fff;font:500 19px var(--android-font)">←&nbsp;&nbsp;Scan QR Code</div></div>
  <div class="abs" style="left:0;right:0;top:96px;text-align:center;color:#fff;font:14px var(--android-font);padding-top:10px">Your account provider will display a QR code.</div>
  <div class="abs" style="left:22px;right:22px;bottom:70px;height:44px;border-radius:6px;background:#2f54d3;color:#fff;display:grid;place-items:center;font:500 15px var(--android-font)">Enter code manually</div>${navBar('android', true)}</div>`;
const iScan = () => `<div class="v" data-v="i-scan" style="background:#000">${viewfinderShot(11)}${brackets('#4a9cff')}
  <div class="abs" style="left:0;right:0;top:0;height:104px;background:#0f6cbd">${statusBar('ios', true)}<div style="position:absolute;left:0;right:0;bottom:14px;color:#fff;text-align:center;font:600 17px var(--ios-font)">Scan QR code</div><div style="position:absolute;left:14px;bottom:12px">${ICO.chevL('#fff')}</div></div>
  <div class="abs" style="left:0;right:0;top:480px;text-align:center;color:#fff;font:13.5px var(--ios-font)">Your account provider will display a QR code</div>
  <div class="abs" style="left:18px;right:18px;top:516px;height:46px;border-radius:8px;background:#0f6cbd;color:#fff;display:grid;place-items:center;font:600 14px var(--ios-font)">Enter code manually</div>${navBar('ios', true)}</div>`;
// iOS system sheets (dark, rounded)
const iSheet = (v, inner, top = 330) => `<div class="v" data-v="${v}" style="background:transparent"><div class="abs" style="left:8px;right:8px;top:${top}px;bottom:8px;border-radius:40px;background:rgba(44,44,48,.97);color:#fff;font-family:var(--ios-font);padding:28px 26px">
  <div style="position:absolute;right:18px;top:18px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;font-size:15px">✕</div>${inner}</div></div>`;
const iConnect = () => iSheet('i-conn', `<div style="margin-top:20px">${pkIco('#3a8dff').replace(/24/g, '40')}</div>
  <div style="font:700 17px/1.3 var(--ios-font);margin-top:14px">Your iPhone needs to connect to this device in order to sign in with a passkey.</div>
  <div style="font:13px/1.4 var(--ios-font);color:rgba(255,255,255,.7);margin-top:8px">You should only connect to the other device if you scanned a QR code in order to sign in with a passkey.</div>
  <div class="i-cont" style="position:absolute;left:22px;right:22px;bottom:26px;height:44px;border-radius:22px;background:#0a84ff;display:grid;place-items:center;font:600 15px var(--ios-font)">Continue</div>`, 300);
const iConnecting = () => iSheet('i-cing', `<div style="position:absolute;left:0;right:0;top:44%;text-align:center;font:14px var(--ios-font)"><span class="ispin" style="display:inline-block">✳</span>&nbsp; Connecting...</div>
  <div style="position:absolute;left:20px;right:20px;bottom:26px;text-align:center;font:12px/1.4 var(--ios-font);color:rgba(255,255,255,.55)">Make sure both devices are connected to the internet and have Bluetooth turned on.</div>`, 380);
const faceGlyph = (c, s = 44) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><g fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M6 20V12a6 6 0 0 1 6-6h8M44 6h8a6 6 0 0 1 6 6v8M58 44v8a6 6 0 0 1-6 6h-8M20 58h-8a6 6 0 0 1-6-6v-8"/><path d="M22 24v4M42 24v4M32 24v12h-3M24 44c5 4 11 4 16 0"/></g></svg>`;
const iSignIn = () => iSheet('i-sign', `<div style="margin-top:12px">${faceGlyph('#3a8dff')}</div>
  <div style="font:700 18px var(--ios-font);margin-top:12px">Sign In</div>
  <div style="font:13.5px/1.4 var(--ios-font);color:rgba(255,255,255,.85);margin-top:6px">Sign in to “login.microsoft.com” on the other device with your passkey for “alex.morgan@contoso.com” saved in “Authenticator”?</div>
  <div class="i-use" style="position:absolute;left:22px;right:22px;bottom:78px;height:42px;border-radius:21px;background:#0a84ff;display:grid;place-items:center;font:600 14.5px var(--ios-font)">Use Passkey</div>
  <div style="position:absolute;left:22px;right:22px;bottom:26px;height:42px;border-radius:21px;background:rgba(255,255,255,.14);color:#6db3ff;display:grid;place-items:center;font:500 14.5px var(--ios-font)">More Options</div>
  <div class="fid abs" style="left:50%;top:-250px;width:130px;height:130px;margin-left:-65px;border-radius:30px;background:rgba(30,30,32,.95);display:grid;place-items:center;opacity:0">${faceGlyph('#fff', 58)}</div>
  <div class="fok abs" style="left:50%;top:-250px;width:130px;height:130px;margin-left:-65px;border-radius:30px;background:rgba(30,30,32,.95);display:grid;place-items:center;opacity:0">${ICO.check('#4cc38a').replace(/22/g, '64')}</div>`, 310);
// Android
const aConnecting = () => `<div class="v" data-v="a-cing" style="background:transparent"><div class="abs" style="left:0;right:0;bottom:0;height:300px;border-radius:26px 26px 0 0;background:#1f1f23;color:#e8e8ee;font-family:var(--android-font);text-align:center">
  <div style="font-size:18px;margin-top:56px">Connecting with another device</div><div class="rg" style="width:34px;height:34px;border-radius:50%;border:3px solid rgba(138,180,255,.25);border-top-color:#8ab4ff;margin:28px auto 0"></div></div></div>`;
const aCred = () => `<div class="v" data-v="a-cred" style="background:transparent"><div class="abs" style="left:0;right:0;bottom:0;height:380px;border-radius:26px 26px 0 0;background:#1f1f23;color:#e8e8ee;font-family:var(--android-font);text-align:center;padding:26px 24px">
  <div style="width:40px;height:40px;border-radius:50%;background:#fff;margin:0 auto;display:grid;place-items:center">${MARK.replace('<img', '<img style="width:28px"')}</div>
  <div style="font-size:12px;color:#b5b5bb;margin-top:6px">Microsoft Authenticator</div>
  <div style="font-size:19px;line-height:1.3;margin-top:10px">Sign in to login.microsoft.com with your saved passkey?</div>
  <div style="display:flex;align-items:center;gap:14px;text-align:left;margin-top:22px;background:#2a2b31;border-radius:14px;padding:12px 14px">${pkIco('#cfcfcf')}<div><div style="font-size:15px">Alex Morgan</div><div style="font-size:12.5px;color:#b5b5bb">alex.morgan@contoso.com</div></div></div>
  <div style="display:flex;justify-content:space-between;margin-top:34px;font-size:15px;color:#a8c7fa"><span>Cancel</span><span class="a-sign" style="background:#a8c7fa;color:#062e6f;border-radius:20px;padding:10px 26px">Sign in</span></div></div></div>`;
const fpGlyph = (c) => `<svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"><path d="M12 18a13 13 0 0 1 24 0M9 26c0-9 7-15 15-15M39 26c0 6-1 10-3 14M17 38c-2-4-3-8-3-12a10 10 0 0 1 20 0c0 3 0 6-1 9M24 26c0 6-1 11-4 15M29 26c0 5-1 9-2 13"/></svg>`;
const aLock = () => `<div class="v" data-v="a-lock" style="background:transparent"><div class="abs" style="left:0;right:0;bottom:0;height:420px;border-radius:26px 26px 0 0;background:#1f1f23;color:#e8e8ee;font-family:var(--android-font);text-align:center;padding:30px 24px">
  <div style="font-size:12px;color:#b5b5bb">Authenticator</div>
  <div style="font-size:19px;line-height:1.3;margin-top:8px">Use your screen lock to sign in with your passkey</div>
  <div style="font-size:13px;color:#b5b5bb;margin-top:10px">Scan your fingerprint.</div>
  <div style="font-size:14px;color:#a8c7fa;margin-top:14px;text-decoration:underline">Use pattern</div>
  <div class="fp" style="margin-top:44px">${fpGlyph('#e8e8ee')}</div></div></div>`;
const aOk = () => `<div class="v" data-v="a-ok" style="background:transparent"><div class="abs" style="left:0;right:0;bottom:0;height:420px;border-radius:26px 26px 0 0;background:#1f1f23;display:grid;place-items:center">
  ${ICO.check('#4cc38a').replace(/22/g, '64')}</div></div>`;
