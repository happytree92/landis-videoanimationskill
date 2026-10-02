// screens.js — HTML templates for every Video 1 screen. Each returns a view <div class="v ..." data-v="name">.
// Labels are verbatim from video1/flow.md. Third-party store icons are neutral placeholders (flagged in flow.md).
const MARK = `<img src="../../shared/marks/authenticator-mark.png">`;
const MSLOGO = `<img class="logo" src="../../shared/marks/microsoft-logo.png">`;
const ICO = {
  back: c => `<svg width="22" height="22"><path d="M14 4 6 11l8 7M6 11h14" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  chevL: c => `<svg width="12" height="20"><path d="M10 2 2 10l8 8" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  mic: c => `<svg width="18" height="22"><rect x="5" y="1" width="8" height="13" rx="4" fill="${c}"/><path d="M2 10a7 7 0 0 0 14 0M9 17v4" stroke="${c}" stroke-width="2" fill="none"/></svg>`,
  mag: c => `<svg width="18" height="18"><circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="${c}" stroke-width="2"/><path d="m12 12 5 5" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  bag: c => `<svg width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="${c}" stroke-width="1.8" d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  msg: (c, s = 26) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="none" stroke="${c}" stroke-width="1.5" d="M4 4h16v12H8l-4 4z"/><path stroke="${c}" stroke-width="1.5" d="M8 9h8M8 12h5"/></svg>`,
  call: c => `<svg width="26" height="26" viewBox="0 0 24 24"><path fill="none" stroke="${c}" stroke-width="1.5" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>`,
  brief: c => `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="${c}" stroke-width="1.6" d="M3 8h18v11H3zM9 8V5h6v3M3 13h18"/></svg>`,
  qr: c => `<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="${c}" stroke-width="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></g><path fill="${c}" d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>`,
  key: c => `<svg width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="${c}" stroke-width="1.6" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 13l5-5M19 10l2 2"/></svg>`,
  gear: c => `<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="none" stroke="${c}" stroke-width="1.6"/><path fill="none" stroke="${c}" stroke-width="1.6" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>`,
  check: c => `<svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="${c}" stroke-width="2"/><path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  bell: c => `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="${c}" stroke-width="1.7" d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/></svg>`,
};

// ---------- section C: stores ----------
const homeAndroid = () => `<div class="v home" data-v="home">${statusBar('android', true)}
  <div class="clock">9:41</div><div class="date">Wednesday, October 1</div>
  <div class="grid">${'<div class="ap"><i></i></div>'.repeat(3)}
    <div class="ap store"><i>${ICO.bag('#3a3a3a')}</i>Play Store</div>${'<div class="ap"><i></i></div>'.repeat(4)}</div>
  <div class="dock"><i></i><i></i><i></i><i></i></div>${navBar('android', true)}</div>`;
const homeIOS = () => `<div class="v home ios" data-v="home">${statusBar('ios', true)}
  <div class="grid" style="top:120px">${'<div class="ap"><i></i></div>'.repeat(6)}
    <div class="ap store"><i>${ICO.bag('#3a3a3a')}</i>App Store</div>${'<div class="ap"><i></i></div>'.repeat(5)}</div>
  <div class="dock"><i></i><i></i><i></i><i></i></div>${navBar('ios', true)}</div>`;

const playStore = () => `<div class="v ps" data-v="store">${statusBar('android', true)}
  <div class="bar">${ICO.back('#e3e3e3')}<div class="q"><span class="ph">Search apps &amp; games</span><span class="txt"></span><span class="cur"></span></div>${ICO.mic('#e3e3e3')}</div>
  <div class="res">
    <div class="top"><div class="icon">${MARK}<svg class="ring" viewBox="0 0 88 88" width="88" height="88" style="position:absolute;left:-6px;top:-6px"><circle cx="44" cy="44" r="41" fill="none" stroke="#a8c7fa" stroke-width="3" stroke-dasharray="258" stroke-dashoffset="258" transform="rotate(-90 44 44)"/></svg></div>
      <div><div class="name">Microsoft Authenticator</div><div class="pub">Microsoft Corporation</div><div class="prog" style="display:none"></div></div></div>
    <div class="btnrow b1"><div class="install">Install</div></div>
    <div class="btnrow b2" style="display:none"><div class="outline">Cancel</div></div>
    <div class="btnrow b3" style="display:none"><div class="outline">Uninstall</div><div class="install">Open</div></div>
    <div class="shots"><div class="shot"></div><div class="shot"></div><div class="shot"></div></div>
    <div class="sec">About this app</div><div class="line" style="width:92%"></div><div class="line" style="width:70%"></div>
  </div>${navBar('android', true)}</div>`;
const appStore = () => `<div class="v as" data-v="store">${statusBar('ios', false)}
  <div class="bar"><div class="field">${ICO.mag('#8a8a8e')}<span><span class="ph">Games, Apps and More</span><span class="txt"></span><span class="cur"></span></span></div><div class="cancel">Cancel</div></div>
  <div class="res">
    <div class="row"><div class="icon">${MARK}</div><div><div class="name">Microsoft<br>Authenticator</div><div class="pub">Microsoft Corporation</div></div>
      <div class="get g1">Get</div>
      <svg class="pring" viewBox="0 0 30 30" style="display:none"><circle cx="15" cy="15" r="12" fill="none" stroke="#e3e3e8" stroke-width="2.5"/><circle class="arc" cx="15" cy="15" r="12" fill="none" stroke="#007aff" stroke-width="2.5" stroke-dasharray="75.4" stroke-dashoffset="75.4" transform="rotate(-90 15 15)"/><rect x="11" y="11" width="8" height="8" rx="1.5" fill="#007aff"/></svg>
      <div class="get g3" style="display:none">Open</div></div>
    <div class="shots"><div class="shot"></div><div class="shot"></div><div class="shot"></div></div>
    <div class="line" style="width:88%;margin-top:22px"></div><div class="line" style="width:64%"></div>
  </div>${navBar('ios', false)}</div>`;
const splash = (os) => `<div class="v splash" data-v="splash">${statusBar(os, true)}${MARK}${navBar(os, true)}</div>`;

// ---------- section D: onboarding + sign-in (Android) ----------
const shieldArt = `<svg width="140" height="160" viewBox="0 0 140 160"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fd4c4"/><stop offset=".6" stop-color="#3f9b6e"/><stop offset="1" stop-color="#2b6cd3"/></linearGradient></defs>
  <path d="M70 6 128 28v44c0 40-26 68-58 82C38 140 12 112 12 72V28z" fill="#e7e8ee"/><path d="M70 22 112 38v34c0 30-19 52-42 62C47 124 28 102 28 72V38z" fill="url(#sg)"/></svg>`;
const chartArt = `<svg width="160" height="140" viewBox="0 0 160 140"><circle cx="58" cy="56" r="44" fill="#f2d9cf"/><rect x="62" y="40" width="88" height="70" rx="8" fill="#e6e7f0"/><path d="M78 92l20-22 18 12 20-30" fill="none" stroke="#3366ff" stroke-width="4" stroke-linecap="round"/><circle cx="136" cy="52" r="5" fill="#e0457b"/></svg>`;
const peopleArt = `<svg width="150" height="130" viewBox="0 0 150 130"><circle cx="48" cy="40" r="28" fill="#ecebf5"/><circle cx="78" cy="68" r="28" fill="#e2e4f5"/><circle cx="106" cy="96" r="28" fill="#f4c04e"/><path d="M106 84v24M94 96h24" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="48" cy="34" r="8" fill="#9a6bd6"/><circle cx="78" cy="62" r="8" fill="#4b8ce0"/></svg>`;

const privacyBase = (v) => `<div class="v al" data-v="${v}"><div class="sbbg"></div>${statusBar('android', true)}
  <div class="art">${shieldArt}</div><h3>Microsoft respects your privacy</h3>
  <p style="top:380px">We collect required diagnostics data to keep the app secure and updated. This does not include any personal data.</p>
  <div class="pri" style="top:560px">Accept</div><div class="lnk" style="top:622px">Microsoft privacy statement</div>${navBar('android', false)}</div>`;
const notifDialog = () => `<div class="v" data-v="notif" style="background:transparent">
  <div class="dlg">${ICO.bell('#aab8ff')}<div class="q">Allow <b>Authenticator</b> to send you notifications?</div><div class="opt o-allow">Allow</div><div class="opt">Don't allow</div></div></div>`;
const improve = () => `<div class="v al" data-v="improve"><div class="sbbg"></div>${statusBar('android', true)}
  <div class="art">${chartArt}</div><h3>Help us improve Microsoft Authenticator</h3>
  <p style="top:384px">By allowing us to collect additional non-personal data, you can help us improve the app. You can turn this on or off at any time in the 'Settings' page.</p>
  <div class="chk" style="top:490px"><i></i>Help improve the app by sharing your app usage data</div>
  <div class="pri" style="top:560px">Continue</div><div class="lnk" style="top:622px">Microsoft privacy statement</div>${navBar('android', false)}</div>`;
const battery = () => `<div class="v al" data-v="battery"><div class="sbbg"></div>${statusBar('android', true)}
  <div class="art">${shieldArt}</div><h3>Stay signed in to your accounts by keeping Microsoft Authenticator running in the background</h3>
  <p style="top:430px;text-align:left">Turn off battery optimization to stay signed in with single sign-on and get important work notifications.<br><br>This is required to use the Authenticator app.</p>
  <div class="pri" style="top:620px">Turn off battery optimization</div>${navBar('android', false)}</div>`;
const firstRun = () => `<div class="v al" data-v="first"><div class="sbbg"></div>${statusBar('android', true)}
  <div class="skip">Skip</div><div class="art" style="top:150px">${peopleArt}</div><h3 style="top:320px">Peace of mind for your digital life</h3>
  <div class="pri" style="top:380px;display:flex;gap:14px;justify-content:center"><svg width="16" height="16"><rect width="7" height="7" fill="#fff"/><rect x="9" width="7" height="7" fill="#fff"/><rect y="9" width="7" height="7" fill="#fff"/><rect x="9" y="9" width="7" height="7" fill="#fff"/></svg>Sign in with Microsoft</div>
  <div class="ol o-work" style="top:436px">${ICO.brief('#1b1b1f')}<span class="lab">Add work or school account</span></div>
  <div class="ol" style="top:492px">${ICO.qr('#1b1b1f')}<span class="lab">Scan a QR code</span></div>
  <p style="top:552px;font-size:12px;text-align:center">You can get a QR code from your organization or account provider, such as Microsoft, Google, or Facebook.</p>
  <div class="lnk" style="top:622px">Restore from backup</div>${navBar('android', false)}</div>`;
const addSheet = () => `<div class="v" data-v="sheet" style="background:transparent"><div class="sheet"><h4>Add work or school account</h4>
  <div class="it i-sign">${ICO.brief('#1b1b1f')}Sign in</div><div class="it">${ICO.qr('#1b1b1f')}Scan QR code</div></div></div>`;
const msEmail = () => `<div class="v ms" data-v="email">${statusBar('android', false)}<div class="bar"><i></i></div><div class="pg">${MSLOGO}
  <h1 class="first">Sign in</h1><div class="field"><span class="ph">Email, phone, or Skype</span><span class="txt"></span><span class="cur"></span></div>
  <div class="lnk">Can't access your account?</div><div class="btns"><div class="b pri b-next">Next</div></div></div>
  <div class="foot"><span>Terms of use</span><span>Privacy &amp; cookies</span><span>···</span></div>${navBar('android', false)}</div>`;
const msPassword = () => `<div class="v ms" data-v="pw">${statusBar('android', false)}<div class="bar"><i></i></div><div class="pg">${MSLOGO}
  <div class="who">${ICO.back('#1b1b1b').replace(/22/g, '16')} alex.morgan@contoso.com</div><h1>Enter password</h1>
  <div class="field"><span class="ph">Password</span><span class="txt"></span><span class="cur"></span></div>
  <div class="lnk">Forgot my password</div><div class="btns"><div class="b pri b-sign">Sign in</div></div></div>
  <div class="foot"><span>Terms of use</span><span>Privacy &amp; cookies</span><span>···</span></div>${navBar('android', false)}</div>`;
const msVerify = () => `<div class="v ms" data-v="verify">${statusBar('android', false)}<div class="pg">${MSLOGO}
  <div class="who">alex.morgan@contoso.com</div><h1>Verify your identity</h1>
  <div class="opt first o-text">${ICO.msg('#1b1b1b')}<span>Text +X XXXXXXXX12</span></div>
  <div class="opt">${ICO.call('#1b1b1b')}<span>Call +X XXXXXXXX12</span></div>
  <div class="lnk">More information</div>
  <div class="note">Are your verification methods current? Check at https://aka.ms/mfasetup</div>
  <div class="btns"><div class="b">Cancel</div></div></div>
  <div class="foot"><span>Terms of use</span><span>Privacy &amp; cookies</span><span>···</span></div>${navBar('android', false)}</div>`;
const msCode = () => `<div class="v ms" data-v="code">${statusBar('android', false)}<div class="bar"><i></i></div><div class="pg">${MSLOGO}
  <div class="who">alex.morgan@contoso.com</div><h1>Enter code</h1>
  <div class="note" style="font-size:15px;display:flex;gap:10px">${ICO.msg('#1b1b1b', 22)}<span>We texted your phone +X XXXXXXXX12. Please enter the code to sign in.</span></div>
  <div class="field"><span class="ph">Code</span><span class="txt"></span><span class="cur"></span></div>
  <div class="btns"><div class="b pri b-verify">Verify</div></div></div>
  <div class="foot"><span>Terms of use</span><span>Privacy &amp; cookies</span><span>···</span></div>${navBar('android', false)}</div>`;
const allowPasskeys = (os) => `<div class="v au" data-v="allow">${statusBar(os, true)}<div class="center" style="top:${os === 'ios' ? 84 : 74}px">
  <div class="stepn">Step 1 of 1</div><h2>Allow Authenticator to use passkeys</h2><div class="ill"></div>
  <div class="steps">${os === 'ios'
    ? `<div class="st"><i>1</i><span>Open Settings and go to <b>General</b> &gt; <b>AutoFill &amp; Passwords</b></span></div>
       <div class="st"><i>2</i><span>Turn on <b>Authenticator</b></span></div>
       <div class="st"><i>3</i><span>Come back here to continue</span></div>`
    : `<div class="st"><i>1</i><span>Open Settings and go to <b>Passwords &amp; accounts</b></span></div>
       <div class="st"><i>2</i><span>Turn on <b>Authenticator</b> as a passkey provider</span></div>
       <div class="st"><i>3</i><span>Come back here to continue</span></div>`}</div></div>
  <div class="bbar"><div class="bb sec">Skip</div><div class="bb pri b-set">Settings</div></div>${navBar(os, true)}</div>`;

// ---------- section E: settings + lock ----------
const samsungPw = () => `<div class="v ss" data-v="s-pw">${statusBar('android', true)}<div class="hdr">${ICO.chevL('#f2f2f2')}<span>Passwords, passkeys, and autofill</span></div>
  <div class="desc">Manage services for passkeys and for automatically entering passwords and other information. Passkeys are encrypted digital keys that allow sign-ins using biometrics or your screen lock PIN, pattern, or password, offering a secure and convenient alternative to complicated passwords.</div>
  <div class="card c-pref" style="top:330px"><div class="lbl">Preferred service</div><div class="val"><span class="nv">None</span><span class="g">${ICO.gear('#9a9aa2')}</span></div></div>${navBar('android', true)}</div>`;
const samsungPref = () => `<div class="v ss" data-v="s-pref">${statusBar('android', true)}<div class="hdr">${ICO.chevL('#f2f2f2')}<span>Preferred service</span></div>
  <div class="desc" style="top:104px">Set a preferred service for saving and entering passwords, passkeys, and autofill information.</div>
  <div class="card" style="top:176px">
    <div class="rd r-auth"><i></i>Microsoft Authenticator</div><div class="rd"><i></i>Google</div><div class="rd"><i></i>Samsung Pass</div><div class="rd"><i class="on r-none"></i>None</div></div>
  ${navBar('android', true)}</div>`;
const sqIcon = (bg, glyph = '') => `<span class="sq" style="background:${bg}">${glyph}</span>`;
const iosRoot = () => `<div class="v is" data-v="i-root">${statusBar('ios', false)}<div class="big" style="top:70px">Settings</div>
  <div class="srch" style="top:122px">${ICO.mag('#8a8a8e')}Search</div>
  <div class="grp" style="top:176px">
    <div class="cell">${sqIcon('#ff9500')}Airplane Mode<span class="chev">›</span></div><div class="cell">${sqIcon('#007aff')}Wi‑Fi<span class="chev">›</span></div><div class="cell">${sqIcon('#007aff')}Bluetooth<span class="chev">›</span></div></div>
  <div class="grp" style="top:330px">
    <div class="cell c-gen">${sqIcon('#8e8e93', ICO.gear('#fff'))}General<span class="chev">›</span></div><div class="cell">${sqIcon('#007aff')}Accessibility<span class="chev">›</span></div><div class="cell">${sqIcon('#5856d6')}Camera<span class="chev">›</span></div></div>
  ${navBar('ios', false)}</div>`;
const iosGeneral = () => `<div class="v is" data-v="i-gen">${statusBar('ios', false)}<div class="nav"><span class="bk">${ICO.chevL('#007aff')}Settings</span><span class="ttl">General</span></div>
  <div class="grp" style="top:116px"><div class="cell">About<span class="chev">›</span></div><div class="cell">Software Update<span class="chev">›</span></div></div>
  <div class="grp" style="top:226px"><div class="cell">AppleCare &amp; Warranty<span class="chev">›</span></div></div>
  <div class="grp" style="top:290px"><div class="cell c-af">AutoFill &amp; Passwords<span class="chev">›</span></div><div class="cell">Background App Refresh<span class="chev">›</span></div><div class="cell">Date &amp; Time<span class="chev">›</span></div></div>
  ${navBar('ios', false)}</div>`;
const iosAutofill = () => `<div class="v is" data-v="i-af">${statusBar('ios', false)}<div class="nav"><span class="bk">${ICO.chevL('#007aff')}General</span><span class="ttl">AutoFill &amp; Passwords</span></div>
  <div class="grp" style="top:116px"><div class="cell">AutoFill Passwords and Passkeys<span class="tg"></span></div></div>
  <div class="gh" style="top:186px">AutoFill From:</div>
  <div class="grp" style="top:208px"><div class="cell">${sqIcon('#e5e5ea')}Passwords<span class="ck">✓</span></div><div class="cell c-auth">${sqIcon('#fff', MARK.replace('<img', '<img style="width:20px"'))}Authenticator<span class="ck ck-auth" style="opacity:0">✓</span></div></div>
  ${navBar('ios', false)}</div>`;
const canUse = (os) => `<div class="v au" data-v="canuse">${statusBar(os, true)}<div class="center" style="top:${os === 'ios' ? 84 : 74}px">
  <div class="stepn">Step 1 of 1</div><h2>You can now use passkeys with Authenticator</h2><div class="ill"></div>
  <div class="bdy">To use passkeys with Authenticator, make sure to keep it turned on as a passkey provider.</div>
  <div class="ok">${ICO.check('#4cc38a')}<span>Authenticator is now a passkey provider.</span></div></div>
  <div class="bbar"><div class="bb pri b-cont">Continue</div></div>${navBar(os, true)}</div>`;
const patternLock = () => `<div class="v lock" data-v="lock">${statusBar('android', true)}
  <div class="tt">🔒<br>Use your screen lock to create a passkey</div><div class="hint">Draw your current pattern.</div>
  <svg width="260" height="260" viewBox="0 0 260 260"><polyline class="pat" points="30,30 130,30 230,30 130,130 30,230 130,230 230,230" fill="none" stroke="#9db4ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1000" stroke-dashoffset="1000"/>
  ${[30, 130, 230].map(y => [30, 130, 230].map(x => `<circle cx="${x}" cy="${y}" r="7" fill="#d8d8de"/>`).join('')).join('')}</svg>${navBar('android', true)}</div>`;
const iosFaceId = () => `<div class="v au" data-v="faceid" style="background:#0f0f10">${statusBar('ios', true)}
  <div class="center" style="top:84px"><div class="stepn">Step 1 of 1</div><h2>You can now use passkeys with Authenticator</h2></div>
  <div class="faceid"><svg class="fglyph" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round">
    <path d="M6 20V12a6 6 0 0 1 6-6h8M44 6h8a6 6 0 0 1 6 6v8M58 44v8a6 6 0 0 1-6 6h-8M20 58h-8a6 6 0 0 1-6-6v-8"/>
    <path class="face" d="M22 24v4M42 24v4M32 24v12h-3M24 44c5 4 11 4 16 0"/></g>
    <path class="okm" d="M18 33l9 9 19-20" fill="none" stroke="#34c759" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>
    <div class="lb">Face ID</div></div>${navBar('ios', true)}</div>`;
const creating = (os) => `<div class="v au" data-v="creating">${statusBar(os, true)}<div class="app">Authenticator</div><div class="spin"><div class="rg"></div>Creating passkey</div>${navBar(os, true)}</div>`;
const createdShield = `<svg class="shield" viewBox="0 0 112 128" style="display:block;margin:26px auto 0;width:112px;height:128px"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b6cff"/><stop offset=".55" stop-color="#6a3cff"/><stop offset="1" stop-color="#1bc6b4"/></linearGradient></defs>
  <path d="M56 4 104 22v38c0 32-21 54-48 64C29 114 8 92 8 60V22z" fill="url(#g)"/><path d="M56 16 94 30v30c0 25-16 43-38 51C34 103 18 85 18 60V30z" fill="#14161f"/>
  <path class="tick" d="m36 64 14 14 28-30" fill="none" stroke="#b78bff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="80"/></svg>`;
const created = () => `<div class="v au" data-v="created">${statusBar('android', true)}<div class="app">Authenticator</div>
  <div class="center" style="top:96px;font-size:13px"><h2 style="margin-top:0">Passkey created for this profile</h2>${createdShield}
    <div class="bdy" style="font-size:13.5px">You can now use your passkey with Authenticator. Your passkey is called: <b style="color:#fff">Authenticator - Android</b></div>
    <div style="color:#8ab4ff;text-align:left;margin-top:16px">To sign in with your passkey</div>
    <div class="st" style="margin-top:14px;font-size:13px">${ICO.brief('#cfcfcf')}<span>Use the Android profile where your passkey was created.</span></div>
    <div class="st" style="margin-top:12px;font-size:13px">${ICO.key('#cfcfcf')}<span>Make sure Authenticator is turned on as a passkey provider.</span></div>
    <div class="st" style="margin-top:12px;font-size:13px">${ICO.key('#cfcfcf')}<span>Select <b>Face, fingerprint, or PIN.</b></span></div>
    <div style="color:#8ab4ff;margin-top:18px">How to use your passkey</div></div>
  <div class="bbar"><div class="bb pri b-done">Done</div></div>${navBar('android', true)}</div>`;

// ---------- iPhone Authenticator (light, from I1) ----------
const acctBadge = `<svg width="20" height="22" viewBox="0 0 20 22"><rect x="2" y="3" width="16" height="18" rx="3" fill="none" stroke="#555" stroke-width="1.6"/><path d="M7 1h6v4H7z" fill="none" stroke="#555" stroke-width="1.6"/><circle cx="10" cy="11" r="2.6" fill="none" stroke="#555" stroke-width="1.5"/><path d="M5.5 18c.8-2.4 2.5-3.5 4.5-3.5s3.7 1.1 4.5 3.5" fill="none" stroke="#555" stroke-width="1.5"/></svg>`;
const warnTri = `<svg width="20" height="18" viewBox="0 0 20 18"><path d="M10 1 19 17H1z" fill="#d13438"/><path d="M10 6v5" stroke="#fff" stroke-width="2"/><circle cx="10" cy="14" r="1.1" fill="#fff"/></svg>`;
const iaHome = (v, banner) => `<div class="v ia" data-v="${v}">${statusBar('ios', true)}
  <div class="tb"><div class="row">☰ Authenticator<span class="sp"></span>${ICO.mag('#fff')}＋</div></div>
  ${banner ? `<div class="ban">${warnTri}<div class="tx">Passkeys are turned off<span>Allow using passkeys from this app.</span></div><div class="on">Turn on</div></div>` : ''}
  <div class="acc a-row" style="top:${banner ? 162 : 104}px"><span class="badge-i">${acctBadge}</span><div><div class="nm">Contoso</div><div class="em">alex.morgan@contoso.com</div></div><span class="chev">›</span></div>
  <div class="fab">${ICO.qr('#fff')}</div>
  <div class="tabs"><div class="on">⌂<br>Authenticator</div><div>▤<br>Verified IDs</div></div>${navBar('ios', false)}</div>`;
const iaDetail = () => `<div class="v ia" data-v="i-detail">${statusBar('ios', true)}
  <div class="hdr"><div style="position:absolute;left:14px;top:64px">${ICO.chevL('#fff')}</div><div style="position:absolute;right:16px;top:62px">${ICO.gear('#fff')}</div>
    <div class="av">${acctBadge.replace(/#555/g, '#0f6cbd').replace('width="20" height="22"', 'width="30" height="33"')}</div><div class="nm">Contoso</div><div class="em">alex.morgan@contoso.com</div></div>
  <div class="sh" style="top:226px">Ways to sign in or verify</div>
  <div class="grp" style="top:244px"><div class="r"><div>Passwordless sign-in requests<small>Sign in without a password.</small></div></div></div>
  <div class="sh" style="top:306px">Other ways to sign in</div>
  <div class="grp" style="top:324px"><div class="r r-create">Create a passkey<span class="chev">›</span></div></div>
  <div class="sh" style="top:386px">Manage</div>
  <div class="grp" style="top:404px"><div class="r">Change password<span class="chev">↗</span></div><div class="r">Update security info<span class="chev">↗</span></div><div class="r">Review recent activity<span class="chev">↗</span></div></div>
  ${navBar('ios', false)}</div>`;
const passkeyArt = `<svg width="96" height="96" viewBox="0 0 96 96"><g fill="none" stroke="#3aa58f" stroke-width="5" stroke-linecap="round"><path d="M8 28V14a6 6 0 0 1 6-6h14M68 8h14a6 6 0 0 1 6 6v14M88 68v14a6 6 0 0 1-6 6H68M28 88H14a6 6 0 0 1-6-6V68"/></g><circle cx="44" cy="38" r="12" fill="#8a5cf0"/><path d="M24 74c3-12 11-18 20-18s17 6 20 18z" fill="#b48cf5"/><circle cx="64" cy="58" r="11" fill="#e8ecff" stroke="#5a7cff" stroke-width="2"/></svg>`;
const iaLetsCreate = () => `<div class="v ia" data-v="i-lets" style="background:#f7f7f9">${statusBar('ios', false)}
  <div style="position:absolute;left:14px;top:62px">${ICO.chevL('#0f6cbd')}</div>
  <div class="ctr" style="top:120px">${passkeyArt}<h2>Let's create your passkey</h2>
  <div class="p">It takes less than a minute to help secure your account with a passkey. Once set up, you can sign in faster and more securely with your face, fingerprint, or PIN. First, sign in with your <b>alex.morgan@contoso.com</b> account to verify your identity.</div></div>
  <div class="cta c-sign">Sign in</div>${navBar('ios', false)}</div>`;
const afArt = `<svg width="90" height="80" viewBox="0 0 90 80"><rect x="4" y="6" width="54" height="40" rx="6" fill="#eef0fb" stroke="#c9cde8"/><path d="M14 18h10M19 18v14M30 18h18M30 26h14" stroke="#8a5cf0" stroke-width="3"/><rect x="30" y="34" width="54" height="40" rx="6" fill="#f3f6ee" stroke="#d4dbc8"/><path d="m60 46 14 14-7 1 4 8-4 2-4-8-5 5z" fill="#f2a33a"/><path d="M42 50l6 6 8-10" stroke="#3aa58f" stroke-width="3" fill="none"/></svg>`;
const iaTurnOnAF = () => `<div class="v ia" data-v="i-af1" style="background:#f7f7f9">${statusBar('ios', true)}<div class="tb" style="height:58px"></div>
  <div class="ctr" style="top:96px">${afArt}<h2>Turn on AutoFill in Authenticator on the next screen</h2>
  <div class="p" style="text-align:center">This is required to use a passkey with Microsoft Authenticator and sign in with your face, fingerprint, or PIN.</div></div>
  <div class="cta c-cont">Continue</div>${navBar('ios', false)}</div>`;
const iaAlert = () => `<div class="v" data-v="i-alert" style="background:transparent"><div class="ialert">
  <div class="ttl">Turn on AutoFill from “Authenticator”?</div>
  <div class="msg">When AutoFill is enabled, credentials from “Authenticator” will be suggested for filling in apps. You can change this later in Settings.</div>
  <div class="bts"><div class="bt">Not Now</div><div class="bt pri b-turnon">Turn On</div></div></div></div>`;
const iaCreating = () => `<div class="v ia" data-v="i-creating" style="background:#f7f7f9">${statusBar('ios', true)}<div class="tb" style="height:58px"></div>
  <div class="spin"><div class="rg"></div>Creating passkey</div>${navBar('ios', false)}</div>`;
// Android "Let's create your passkey" (C1 0:04), dark
const auLetsCreate = () => `<div class="v au" data-v="a-lets">${statusBar('android', true)}<div style="position:absolute;left:22px;top:52px">${ICO.back('#e6e6e6')}</div>
  <div class="lcp"><h2>Let's create your passkey</h2><div style="margin-top:22px">${passkeyArt}</div>
  <div class="p">Passkeys are a fast and secure way to sign in with your face, fingerprint or PIN. We'll help you create yours. First, sign in with your alex.morgan@contoso.com account to verify your identity.</div></div>
  <div class="bbar"><div class="bb pri b-asign">Sign in</div></div>${navBar('android', true)}</div>`;

// ---------- section F ----------
const authHome = () => `<div class="v au" data-v="ahome">${statusBar('android', true)}
  <div class="app">Authenticator<span class="sp"></span>＋&nbsp;&nbsp;${ICO.mag('#e6e6e6')}&nbsp;⋮</div>
  <div class="acct a-row">${ICO.brief('#cfcfcf')}<div><div class="nm">Contoso</div><div class="em">alex.morgan@contoso.com</div></div><span style="margin-left:auto;color:#8a8a96">›</span></div>
  <div class="a-fab" style="position:absolute;right:20px;bottom:124px;width:56px;height:56px;border-radius:50%;background:#3a4fd8;display:grid;place-items:center;box-shadow:0 6px 14px rgba(0,0,0,.4)">${ICO.qr('#fff')}</div>
  <div class="tabs"><div class="on">⌂<br>Authenticator</div><div>▤<br>Verified IDs</div></div>${navBar('android', true)}</div>`;
const authDetail = () => `<div class="v au" data-v="adetail">${statusBar('android', true)}
  <div class="app">${ICO.back('#e6e6e6')}<span class="sp"></span>${ICO.gear('#e6e6e6')}</div>
  <div class="lst" style="top:100px">
    <div class="rw" style="height:60px">${ICO.brief('#cfcfcf')}<div><div style="font-size:18px">Contoso</div><div style="font-size:12.5px;color:#b5b5bb">alex.morgan@contoso.com</div></div></div>
    <div class="hd">Ways to sign in or verify</div><div class="rw r-pk">${ICO.key('#cfcfcf')}Passkey<span class="chev">›</span></div>
    <div class="hd">Other ways to sign in</div><div class="rw">Set up 2-step verification<span class="chev">›</span></div><div class="rw">Set up Passwordless sign-in requests<span class="chev">›</span></div>
    <div class="hd">Manage</div><div class="rw">Change password<span class="chev">›</span></div><div class="rw">Update security info<span class="chev">›</span></div><div class="rw">Review recent activity<span class="chev">›</span></div></div>
  ${navBar('android', true)}</div>`;
