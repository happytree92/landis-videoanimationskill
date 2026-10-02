// securitykey.js — Security info modals, "Setting up your passkey..." page, Windows Security key dialogs,
// InPrivate browser chrome, and the security-key close-up panel (KeyPanel). Depends on shared/lib.js, screens.js, laptop.js.
const keyIco = c => `<svg width="22" height="26" viewBox="0 0 22 26"><rect x="5" y="9" width="12" height="15" rx="2.5" fill="none" stroke="${c}" stroke-width="1.7"/><path d="M8 9V3h6v6" fill="none" stroke="${c}" stroke-width="1.7"/></svg>`;
const bigKey = `<svg width="40" height="56" viewBox="0 0 22 26"><rect x="5" y="9" width="12" height="15" rx="2.5" fill="none" stroke="#4cc2ff" stroke-width="1.6"/><path d="M8 9V3h6v6" fill="none" stroke="#4cc2ff" stroke-width="1.6"/></svg>`;
const lockIco = c => `<svg width="14" height="16" viewBox="0 0 14 16"><rect x="1.5" y="7" width="11" height="8" rx="1.5" fill="none" stroke="${c}" stroke-width="1.4"/><path d="M4 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="${c}" stroke-width="1.4"/></svg>`;

const privChrome = (url, title, inner) => `<div class="desk-bg"></div><div class="br priv">
  <div class="tabs"><div class="tab"><i></i>${title}</div></div>
  <div class="tb">‹&nbsp;&nbsp;›&nbsp;&nbsp;↻<span class="ipbadge">InPrivate</span><div class="addr"><span class="lk">🔒</span><span class="url">${url}</span></div>⋯</div>
  <div class="page">${inner}</div></div>
  <div class="taskbar"><i></i><i></i><i class="on"></i><i></i><i></i><div class="clock">9:41 AM<br>10/1/2026</div></div>`;

// ---- Security info modals (exact labels from R2) ----
const modal = (v, inner, top = 150) => `<div class="abs" data-v="${v}" style="inset:0"><div class="mdim"></div><div class="mod" style="top:${top}px">${inner}</div></div>`;
const mAdd = () => modal('m-add', `<h3>Add a sign-in method<span class="x">✕</span></h3>
  <div class="m-opt">${pkIco('#1b1b1b')}<div><div class="t1">Passkey in Microsoft Authenticator</div><div class="t2">Sign in with your face, fingerprint, PIN</div></div></div>
  <div class="m-opt o-key">${keyIco('#1b1b1b')}<div><div class="t1">Security key</div><div class="t2">Sign in using a USB, Bluetooth, or NFC device</div></div></div>
  <div class="m-opt">${ICO.msg('#1b1b1b', 22)}<div><div class="t1">Microsoft Authenticator</div><div class="t2">Approve sign-in requests or use one-time codes</div></div></div>
  <div class="m-opt"><span style="width:22px;text-align:center">▭</span><div><div class="t1">Hardware token</div><div class="t2">Sign in with a code from a hardware token</div></div></div>`, 90);
const mType = () => modal('m-type', `<h3>Security key<span class="x">✕</span></h3>
  <div class="p">Choose the type of security key that you have.</div>
  <div><span class="tb t-usb">${keyIco('#1b1b1b').replace('22', '14').replace('26', '17')} USB device</span></div><div><span class="tb">NFC device</span></div>
  <div class="bts"><span class="bt">Cancel</span></div>`);
const mReady = () => modal('m-ready', `<h3>Security key<span class="x">✕</span></h3>
  <div class="p">Have your key ready.</div>
  <div class="p">When you choose Next, you will be prompted to plug your security key into the USB port. Then, touch the button or the sensor on your security key to finish setting up your device.</div>
  <div class="p">For more detailed instructions, visit your key manufacturer's website.</div>
  <div class="bts"><span class="bt">Back</span><span class="bt pri r-next">Next</span></div>`);
const mRedir = () => modal('m-redir', `<h3>Security key<span class="x">✕</span></h3>
  <div class="p">Your device will redirect you to a new window to finish setup.</div><div class="bar"><i></i></div>`);
const mName = () => modal('m-name', `<h3>Security key<span class="x">✕</span></h3>
  <div class="p">Name your security key. This will help distinguish it from other keys.</div>
  <div class="inp"><span class="ph">Enter a security key name</span><span class="txt"></span><span class="cur"></span></div>
  <div class="bts"><span class="bt">Cancel</span><span class="bt pri n-next">Next</span></div>`);
const mDone = () => modal('m-done', `<h3>Security key<span class="x">✕</span></h3>
  <div class="p">You're all set!</div>
  <div class="p">You can use your security key instead of a username and password the next time you sign in.</div>
  <div class="p">Be sure to follow your security key manufacturer's guidance to perform any additional setup tasks such as registering your fingerprint.</div>
  <div class="bts"><span class="bt pri d-done">Done</span></div>`);
const supPage = () => `<div class="sup" data-v="sup"><div class="card"><img style="height:24px" src="../../shared/marks/microsoft-logo.png">
  <h1>Setting up your passkey...</h1><div class="p">Your device is opening a security window. Follow the instructions to finish setting up your passkey.</div>
  <div class="dots">• • •</div><div class="bts"><div class="b">Cancel</div><div class="b pri s-next">Next</div></div></div></div>`;

// ---- Windows Security dialogs ----
const wsHead = `<div class="hd">${shieldIco}Windows Security<span class="x">✕</span></div>`;
const wsAcct = `<div class="acct">${pkIco('#fff')}<div>alex.morgan@contoso.com<div class="t2">Passkey for login.microsoft.com</div></div><span class="dot"></span></div>`;
const wsKeyAcct = `<div class="acct">${keyIco('#fff')}<div>Security key<div class="t2">Passkey for login.microsoft.com</div></div><span class="dot"></span></div>`;
const wsSave = `<div class="sv">${lockIco('#ccc')}<span>This will be saved to your security key.</span><span class="ch">Change</span></div>`;
const wInsert = () => `<div class="abs" data-v="w-insert" style="inset:0"><div class="wsd">${wsHead}<h2>Save your passkey</h2>${wsAcct}
  <div class="big">${bigKey}</div><div class="msg">Insert your security key into the USB port.</div>${wsSave}<div class="cancel">Cancel</div></div></div>`;
// ⚑ new-key PIN creation — labels to verify (footage only shows the existing-PIN prompt)
const wCreate = () => `<div class="abs" data-v="w-create" style="inset:0"><div class="wsd">${wsHead}<h2>Save your passkey</h2>${wsAcct}
  <div class="big" style="margin-top:14px">${bigKey}</div><div class="msg">Create a security key PIN</div>
  <div class="fld">Security Key PIN</div><div class="pin p1"></div>
  <div class="fld">Confirm Security Key PIN</div><div class="pin p2 idle"></div>
  <div class="row2"><div class="ok c-ok">OK</div><div class="cn">Cancel</div></div></div></div>`;
const wTouch = (v, acct) => `<div class="abs" data-v="${v}" style="inset:0"><div class="wsd">${wsHead}<h2>${v === 'w-touch' ? 'Save your passkey' : 'Sign in with a passkey'}</h2>${acct}
  <div class="big" style="margin-top:40px">${bigKey}</div><div class="msg" style="font-size:17px">Touch your security key.</div>
  ${v === 'w-touch' ? wsSave : '<div class="alt">Choose a different passkey</div>'}<div class="cancel">Cancel</div></div></div>`;
const wChooseKey = () => `<div class="abs" data-v="w-choose" style="inset:0"><div class="wsd">${wsHead}
  <h2>Choose a passkey</h2><div class="sub">Passkey for login.microsoft.com</div>
  <div class="row" style="margin-top:18px">${qrIco('#fff')}<span>iPhone, iPad, or Android device</span></div>
  <div class="row w-key">${usbIco('#fff')}<span>Security key</span></div><div class="cancel">Cancel</div></div></div>`;
const wEnterPin = () => `<div class="abs" data-v="w-epin" style="inset:0"><div class="wsd">${wsHead}<h2>Sign in with a passkey</h2>${wsKeyAcct}
  <div class="big" style="margin-top:14px">${bigKey}</div><div class="msg">Enter your security key PIN</div>
  <div class="fld">Security Key PIN</div><div class="pin p3"></div><div class="alt" style="margin-top:12px">Choose a different passkey</div>
  <div class="row2"><div class="ok e-ok">OK</div><div class="cn">Cancel</div></div></div></div>`;

// ---- security-key close-up panel ----
// set(insert 0..1, led 0..1 brightness, touch 0..1 ring progress, opacity)
function KeyPanel(stage, o = {}) {
  const p = el(`<div class="kp"><div class="lbl">Your security key</div><div class="lapside"><div class="deck"></div></div><div class="port"><i></i></div>
    <div class="key"><div class="body"><div class="ring"></div><div class="pad"></div><div class="led"></div><div class="tp"></div></div><div class="plug"></div></div>
    <div class="cap"></div></div>`);
  stage.appendChild(p);
  const key = $('.key', p), led = $('.led', p), tp = $('.tp', p), cap = $('.cap', p);
  return {
    root: p,
    place(x, y, s = 1, op = 1) { p.style.left = (x - 350) + 'px'; p.style.top = (y - 235) + 'px'; p.style.transform = `scale(${s})`; p.style.opacity = op; },
    set(ins, ledB, touch, caption = '') {
      key.style.left = lerp(-280, 82, ins) + 'px';          // inserted: 40 px of plug hidden inside the laptop, ~20 px of metal visible
      led.style.boxShadow = `0 0 ${10 + 26 * ledB}px ${4 + 10 * ledB}px rgba(140,255,170,${.85 * ledB})`;
      led.style.background = `rgba(190,255,200,${.55 * ledB})`;
      tp.style.opacity = touch > 0 && touch < 1 ? 1 - touch : 0; tp.style.transform = `scale(${.6 + touch * .7})`;
      if (cap.innerHTML !== caption) cap.innerHTML = caption;
    },
  };
}
