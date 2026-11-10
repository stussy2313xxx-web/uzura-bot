// ==UserScript==
// @name          うずら BOT Android — メロジョイ
// @namespace     uzura.bot.android.mellojoy
// @version       2.1.44.10942
// @description   Android版。メロジョイの購入・入店抽選。
// @match         https://*.mellojoylucky.cn/*
// @match         https://*.mellojoyjapan.com/*
// @match         https://*.mellojoyus.com/*
// @match         https://*.shop.app/*
// @run-at        document-start
// @sandbox       raw
// @grant         none
// @noframes      
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window) return;


// ===================== Ng\u00f4n ng\u1eef (build.py t\u1ea1o 2 b\u1ea3n: ja / vi) =====================
const SYNOVA_LANG = 'ja';
const L = (ja, vi) => (SYNOVA_LANG === 'vi' ? vi : ja);
// C\u00e0i c\u1ea3 b\u1ea3n Nh\u1eadt l\u1eabn b\u1ea3n Vi\u1ec7t -> ch\u1ec9 b\u1ea3n ch\u1ea1y tr\u01b0\u1edbc ho\u1ea1t \u0111\u1ed9ng (tr\u00e1nh 2 khung b\u1ea5m tr\u00f9ng)
const SYNOVA_DUP = !!window.__synovajoy;
window.__synovajoy = true;

// ===================== Discord webhook =====================
// URL webhook + logo (base64 PNG) \u0111\u01b0\u1ee3c build.py ch\u00e8n v\u00e0o t\u1eeb webhook.txt / logo.png.
const SYNOVA_WEBHOOK = ''; // Author's fixed notification destination disabled.
const SYNOVA_LOGO_B64 = '';
const SYNOVA_NAME = 'うずら BOT';
const SYNOVA_VERSION = '2.1.44';   // build.py ch\u00e8n t\u1eeb @version
// key CapSolver m\u1eb7c \u0111\u1ecbnh (build.py ch\u00e8n t\u1eeb capsolver_key.txt); nh\u1eadp key kh\u00e1c trong khung bot s\u1ebd ghi \u0111\u00e8
const CAPSOLVER_KEY = '';
// logo nh\u1ecf trong khung bot (build.py ch\u00e8n t\u1eeb icon_panel.png)
const SYNOVA_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNiIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjQwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTAyMTNiIj5VPC90ZXh0Pjwvc3ZnPg==";
// b\u1ea3ng b\u1ecb \u1ea9n -> ch\u1ec9 c\u00f2n n\u00fat tr\u00f2n logo \u1edf m\u00e9p ph\u1ea3i, ch\u1ea1m \u0111\u1ec3 hi\u1ec7n l\u1ea1i (th\u00e0nh vi\u00ean y\u00eau c\u1ea7u 28/10 thay cho Thu nh\u1ecf/M\u1edf r\u1ed9ng)
function synovaBubble(id, onShow) {
  let b = document.getElementById(id);
  if (!b) {
    b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'position:fixed;right:10px;z-index:2147483647;width:52px;height:52px;border-radius:50%;background:#0d1b32;' +
      'border:2px solid #ffffff;box-shadow:0 4px 16px #000c;display:none;align-items:center;justify-content:center;cursor:pointer';
    b.innerHTML = `<img src="${SYNOVA_ICON}" alt="" style="width:40px;height:40px;mix-blend-mode:screen;pointer-events:none">` +
      '<span style="position:absolute;right:1px;top:1px;width:12px;height:12px;border-radius:50%;border:2px solid #0d1b32"></span>';
    b.onclick = onShow;
    document.body.appendChild(b);
  }
  return {
    show(top, active) {                       // ch\u1ea5m xanh = BOT \u0111ang ch\u1ea1y, x\u00e1m = \u0111ang t\u1eaft
      b.style.top = top ? 'calc(env(safe-area-inset-top) + 60px)' : 'auto';
      b.style.bottom = top ? 'auto' : 'calc(env(safe-area-inset-bottom) + 90px)';
      b.lastChild.style.background = active ? '#2ecc71' : '#777';
      b.style.display = 'flex';
    },
    hide() { b.style.display = 'none'; },
  };
}
const ICON_TAG = `<img src="${SYNOVA_ICON}" alt="" style="width:40px;height:40px;flex:none;mix-blend-mode:screen">`;
// d\u00f2ng ch\u1eef "SYNOVAJOY BOT" c\u1eaft t\u1eeb logo (c\u00f3 s\u1eebng tr\u00ean ch\u1eef O) \u2013 build.py ch\u00e8n t\u1eeb title_panel.jpg
const SYNOVA_TITLE = '';
const TITLE_TAG = `<span style="font:900 20px/1.3 -apple-system,sans-serif;color:#ffffff">うずら BOT</span>`;
// embed: { author, title, url, thumb, fields:[[name, value, inline]], site, color }
// Logo g\u1eedi k\u00e8m l\u00e0m t\u1ec7p logo.png -> d\u00f9ng 'attachment://logo.png' cho icon tr\u00ean \u0111\u1ea7u v\u00e0 cu\u1ed1i embed.
// multipart + no-cors: kh\u00f4ng c\u1ea7n Discord tr\u1ea3 CORS; keepalive \u0111\u1ec3 tin v\u1eabn \u0111i khi trang chuy\u1ec3n trang.
// \u1ea2nh trong webhook: ch\u1ec9 g\u1eedi URL http(s) \u0111\u1ea7y \u0111\u1ee7 (URL sai l\u00e0m Discord t\u1eeb ch\u1ed1i c\u1ea3 tin), kh\u00f4ng c\u00f3 \u1ea3nh th\u00ec d\u00f9ng logo
function synovaThumb(u) {
  try {
    const s = String(u || '').trim();
    if (!s || /^(data|blob):/i.test(s)) return '';
    const x = new URL(s, location.origin);
    return /^https?:$/.test(x.protocol) ? x.href : '';
  } catch (e) { return ''; }
}
// \u1ea3nh s\u1ea3n ph\u1ea9m tr\u00ean trang c\u1ea3m \u01a1n (khi kh\u00f4ng bi\u1ebft m\u00f3n \u0111\u00e3 mua): b\u1ecf logo v\u00e0 \u1ea3nh \u1edf \u0111\u1ea7u trang
function synovaPageImg() {
  try {
    const el = [...document.querySelectorAll('img')].find((e) => !e.closest('header') && !/logo/i.test((e.alt || '') + ' ' + (e.className || '') + ' ' + (e.currentSrc || e.src || '')) &&
      /cdn\.shopify\.com|\/cdn\/shop\/|\/products?\//i.test(e.currentSrc || e.src || ''));
    return el ? synovaThumb(el.currentSrc || el.src) : '';
  } catch (e) { return ''; }
}
function synovaNotify(embeds) {
  window.dispatchEvent(new CustomEvent('uzura-purchase-success', {detail:JSON.stringify({embeds})}));
  return; // Purchase-success only; old notification destinations are disabled.
  if (!/^https:\/\/(discord|discordapp)\.com\/api\/webhooks\//.test(SYNOVA_WEBHOOK)) return;
  try {
    const hasLogo = SYNOVA_LOGO_B64.length > 100;
    const icon = hasLogo ? 'attachment://logo.png' : undefined;
    const payload = {
      username: SYNOVA_NAME,
      embeds: embeds.slice(0, 10).map((e) => ({
        author: { name: e.author, icon_url: icon },
        title: (e.title || '').slice(0, 250),
        url: e.url || undefined,
        color: e.color || 0x2ecc71,
        thumbnail: synovaThumb(e.thumb) ? { url: synovaThumb(e.thumb) } : (icon ? { url: icon } : undefined),
        fields: (e.fields || []).filter((f) => f[1] != null && f[1] !== '').map(([name, value, inline]) => ({ name, value: String(value).slice(0, 1000), inline: inline !== false })),
        footer: { text: `${SYNOVA_NAME} \u00b7 ${e.site || location.hostname}`, icon_url: icon },
        timestamp: new Date().toISOString(),
      })),
    };
    const fd = new FormData();
    if (hasLogo) {
      const bin = atob(SYNOVA_LOGO_B64), u8 = new Uint8Array(bin.length);
      for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k);
      fd.append('files[0]', new Blob([u8], { type: 'image/png' }), 'logo.png');
      payload.attachments = [{ id: 0, filename: 'logo.png' }];
    }
    fd.append('payload_json', JSON.stringify(payload));
    fetch(SYNOVA_WEBHOOK, { method: 'POST', mode: 'no-cors', body: fd, keepalive: true }).catch(() => {});
  } catch (e) {}
}

// ===================== 13\u6642 \u62bd\u9078 (mellojoylucky.cn) =====================
if (!SYNOVA_DUP && /mellojoylucky\.cn$/.test(location.hostname)) (function () {
  'use strict';

  // ================= C\u1ea5u h\u00ecnh =================
  const SLOTS = ['10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30'];
  const OPEN_H = 13, OPEN_M = 0;          // gi\u1edd m\u1edf ng\u00e0y m\u1edbi (JST)
  const WATCH_FROM_SEC = 10;              // b\u1eaft \u0111\u1ea7u d\u00f2 tr\u01b0\u1edbc gi\u1edd m\u1edf bao nhi\u00eau gi\u00e2y (12:59:50)
  const POLL_MS = 300;                    // nh\u1ecbp d\u00f2 bookable-dates quanh gi\u1edd m\u1edf
  const MAX_LOSE = 3;                     // tr\u01b0\u1ee3t li\u00ean ti\u1ebfp bao nhi\u00eau l\u1ea7n th\u00ec d\u1eebng
  const WAIT_AGREE_MS = 6000;             // ch\u1edd h\u1ed9p \u540c\u610f\u3057\u3066\u53c2\u52a0\u3059\u308b
  const WAIT_RESULT_MS = 25000;           // m\u00e1y ch\u1ee7 hay tr\u1ea3 l\u1eddi \u1edf gi\u00e2y 16-19
  // 13:00 m\u00e1y ch\u1ee7 qu\u00e1 t\u1ea3i tr\u1ea3 409 SYSTEM_BUSY / HTTP 500 = CH\u01afA x\u00e9t \u0111\u01a1n -> g\u1eedi l\u1ea1i \u0111\u00fang khung \u0111\u00f3 thay v\u00ec b\u1ecf sang khung k\u1ebf (log user 2/11)
  // 3/11 (h\u1ecdc BOT \u0111\u1ed1i th\u1ee7): g\u1eedi d\u1ed3n d\u1ec5 d\u00ednh RATE_LIMIT / COOLDOWN = h\u1ebft l\u01b0\u1ee3t c\u1ea3 ng\u00e0y -> ngh\u1ec9 T\u0102NG D\u1ea6N, m\u1ed7i khung t\u1ed1i \u0111a 2 l\u1ea7n,
  // c\u1ea3 l\u01b0\u1ee3t t\u1ed1i \u0111a 8 l\u1ea7n qu\u00e1 t\u1ea3i, v\u00e0 c\u1ea3 ng\u00e0y t\u1ed1i \u0111a MAX_POSTS l\u1ea7n g\u1eedi (m\u1ecdi l\u1ea7n g\u1eedi t\u1edbi m\u00e1y ch\u1ee7 \u0111\u1ec1u t\u00ednh)
  const BUSY_PER_SLOT = 2;                // qu\u00e1 t\u1ea3i \u1edf 1 khung bao nhi\u00eau l\u1ea7n th\u00ec sang khung k\u1ebf (v\u00f2ng sau quay l\u1ea1i)
  const BUSY_WAITS = [600, 600, 900, 1200, 2000, 3000, 4000, 5000];   // ngh\u1ec9 tr\u01b0\u1edbc l\u1ea7n g\u1eedi l\u1ea1i th\u1ee9 1, 2, 3\u2026
  const BUSY_MAX = 8;                     // qu\u00e1 t\u1ea3i qu\u00e1 8 l\u1ea7n trong 1 l\u01b0\u1ee3t -> d\u1eebng
  const BUSY_UNTIL_MS = 180e3;            // ch\u1ebf \u0111\u1ed9 request: c\u00f2n khung ch\u1ec9 b\u1ecb qu\u00e1 t\u1ea3i / ch\u01b0a m\u1edf th\u00ec quay v\u00f2ng th\u1eed ti\u1ebfp t\u1edbi 3 ph\u00fat
  // "ch\u01b0a m\u1edf" (g\u1eedi s\u1edbm v\u00e0i ms tr\u01b0\u1edbc 13:00 / m\u00e1y ch\u1ee7 ch\u01b0a k\u1ecbp m\u1edf ng\u00e0y) -> g\u1eedi l\u1ea1i \u0110\u00daNG khung \u0111\u00f3 sau 1,2 gi\u00e2y, kh\u00f4ng b\u1ecf khung
  const EARLY_CODES = new Set(['SLOT_NOT_STARTED', 'SLOT_CLOSED', 'SLOT_DATE_NOT_BOOKABLE', 'ACTIVITY_NOT_STARTED']);
  const EARLY_SLOT = new Set(['SLOT_NOT_STARTED', 'SLOT_CLOSED']);   // ch\u1ec9 khung \u0111\u00f3 ch\u01b0a m\u1edf -> 2 l\u1ea7n th\u00ec sang khung k\u1ebf
  const EARLY_GAP_MS = 1200, EARLY_PER_SLOT = 2, EARLY_MAX = 6;
  const MAX_POSTS = 5;                    // c\u1ea3 ng\u00e0y (gi\u1edd Nh\u1eadt) g\u1eedi t\u1ed1i \u0111a 5 l\u1ea7n nh\u01b0 BOT \u0111\u1ed1i th\u1ee7 \u2013 qu\u00e1 d\u1ec5 b\u1ecb RATE_LIMIT kh\u00f3a c\u1ea3 ng\u00e0y
  const GAP_MS = 800;                     // tr\u01b0\u1ee3t / khung \u0111\u1ea7y -> ngh\u1ec9 0,8 gi\u00e2y r\u1ed3i m\u1edbi g\u1eedi khung k\u1ebf

  const K_PRIO = 'pj_prio_v1';            // { "10:30": 1, "11:30": "x", ... }
  const K_STATE = 'pj_state_v1';
  const K_UI = 'pj_ui_v1';
  const K_LOG = 'pj_log_v2';

  const STOP_CODES = new Set(['EMAIL_DUPLICATE_1D', 'EMAIL_DUPLICATE_TODAY', 'PHONE_DUPLICATE_1D',
    'BLACKLISTED', 'DESKTOP_DEVICE_BLOCKED', 'GPS_REJECTED', 'GPS_OUT_OF_FENCE',
    'IP_OUT_OF_FENCE', 'TURNSTILE_INVALID', 'RATE_LIMIT', 'COOLDOWN']);
  // DEVICE_DUPLICATE_1D = m\u00e1y n\u00e0y \u0111\u00e3 \u0111\u0103ng k\u00fd KHUNG N\u00c0Y r\u1ed3i -> sang khung k\u1ebf (tr\u01b0\u1edbc 3/11 l\u00e0 d\u1eebng h\u1eb3n)
  const SKIP_CODES = new Set(['SLOT_FULL', 'SLOT_NOT_FOUND', 'SLOT_ENDED', 'TIME_SLOT_NOT_FOUND', 'DEVICE_DUPLICATE_1D']);

  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ================= B\u1eaft ph\u1ea3n h\u1ed3i POST /api/registrations =================
  // Ch\u1ea1y \u1edf document-start + inject-into page -> b\u1ecdc fetch/XHR tr\u01b0\u1edbc khi trang t\u1ea3i xong.
  let resultWaiter = null;
  let regPosted = false;                  // l\u01b0\u1ee3t b\u1ea5m giao di\u1ec7n: trang \u0111\u00e3 th\u1eadt s\u1ef1 g\u1eedi POST \u0111\u0103ng k\u00fd ch\u01b0a
  function onRegResponse(status, body) {
    let j = {};
    try { j = JSON.parse(body); } catch (e) {}
    if (resultWaiter) { const w = resultWaiter; resultWaiter = null; w({ status, data: j || {} }); }
  }
  const isRegPost = (url, method) => /\/api\/registrations(\?|$)/.test(url || '') && String(method || 'GET').toUpperCase() === 'POST';
  const _fetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = (init && init.method) || (input && input.method) || 'GET';
    if (isRegPost(url, method)) regSent();
    if (isRegPost(url, method) && init && typeof init.body === 'string') init = { ...init, body: tsPatchBody(init.body) };
    const res = await _fetch.call(this, input, init);
    if (isRegPost(url, method)) res.clone().text().then((t) => onRegResponse(res.status, t)).catch(() => {});
    return res;
  };
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__pj = { m, u }; return _open.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (body) {
    if (this.__pj && isRegPost(this.__pj.u, this.__pj.m)) {
      this.addEventListener('loadend', () => onRegResponse(this.status, this.responseText));
      regSent();
      if (typeof body === 'string') return _send.call(this, tsPatchBody(body));
    }
    return _send.apply(this, arguments);
  };

  // Log t\u1ed1c \u0111\u1ed9: t\u1eeb l\u00fac th\u1ea5y ng\u00e0y m\u1edbi t\u1edbi l\u00fac g\u1eedi \u0111\u0103ng k\u00fd \u0111\u1ea7u ti\u00ean
  function regSent() {
    regPosted = true;
    if (st.active && st.mode === 'run') { st.postPending = true; save(K_STATE, st); }
    try {
      if (!st.tDetect) return;
      log(L(`\u23f1 \u65b0\u3057\u3044\u65e5\u4ed8\u3092\u691c\u51fa\u3057\u3066\u304b\u3089 ${Date.now() - st.tDetect}ms \u3067\u7533\u8fbc\u9001\u4fe1`, `\u23f1 G\u1eedi \u0111\u0103ng k\u00fd sau ${Date.now() - st.tDetect}ms t\u1eeb l\u00fac th\u1ea5y ng\u00e0y m\u1edbi`));
      st.tDetect = 0; save(K_STATE, st);
    } catch (e) {}
  }

  // ================= GPS: d\u00f9ng v\u1ecb tr\u00ed th\u1eadt \u0111o s\u1eb5n =================
  // Trang \u0111o GPS M\u1edaI m\u1ed7i l\u1ea7n b\u1ea5m (maximumAge:0) -> iPhone m\u1ea5t 1\u20135 gi\u00e2y m\u1ed7i l\u01b0\u1ee3t. Khi bot \u0111ang ch\u1ea1y, bot theo d\u00f5i
  // v\u1ecb tr\u00ed th\u1eadt c\u1ee7a m\u00e1y (watchPosition) t\u1eeb tr\u01b0\u1edbc gi\u1edd m\u1edf; trang h\u1ecfi th\u00ec tr\u1ea3 ngay v\u1ecb tr\u00ed th\u1eadt m\u1edbi nh\u1ea5t (\u2264 30 gi\u00e2y).
  // Kh\u00f4ng gi\u1ea3 GPS: ch\u01b0a c\u00f3 v\u1ecb tr\u00ed th\u1eadt th\u00ec trang t\u1ef1 \u0111o nh\u01b0 b\u00ecnh th\u01b0\u1eddng.
  const geo = navigator.geolocation;
  let geoLast = null, geoWatch = null, geoOrig = null;
  try {
    const _gcp = geo.getCurrentPosition.bind(geo);
    geoOrig = _gcp;
    geo.getCurrentPosition = function (ok, err, opt) {
      if (st.active && geoLast && Date.now() - geoLast.at < 30e3) { const p = geoLast.p; setTimeout(() => ok(p), 0); return; }
      return _gcp((p) => { geoLast = { p, at: Date.now() }; if (ok) ok(p); }, err, opt);
    };
  } catch (e) {}
  function geoWarm() {
    if (!geo || geoWatch != null) return;
    try { geoWatch = geo.watchPosition((p) => { geoLast = { p, at: Date.now() }; }, () => {}, { enableHighAccuracy: true, maximumAge: 0, timeout: 15e3 }); } catch (e) {}
  }
  function geoStop() { if (geoWatch != null) { try { geo.clearWatch(geoWatch); } catch (e) {} geoWatch = null; } }

  // ================= T\u1ea3i l\u1ea1i khung \u0111\u1eb7t v\u00e9 KH\u00d4NG t\u1ea3i l\u1ea1i c\u1ea3 trang =================
  // Danh s\u00e1ch ng\u00e0y ch\u1ec9 \u0111\u01b0\u1ee3c trang t\u1ea3i 1 l\u1ea7n l\u00fac khung \u0111\u1eb7t v\u00e9 (route "/") hi\u1ec7n ra. Thay v\u00ec location.reload (2\u20135 gi\u00e2y),
  // chuy\u1ec3n SPA sang /my-tickets r\u1ed3i quay v\u1ec1 -> React g\u1eafn l\u1ea1i khung, ch\u1ec9 g\u1ecdi l\u1ea1i bookable-dates (~0,3 gi\u00e2y).
  async function spaRemount() {
    const back = location.pathname + location.search;
    if (back.startsWith('/my-tickets')) return false;
    try {
      history.replaceState(history.state, '', '/my-tickets'); dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
      await sleep(40);
      history.replaceState(history.state, '', back); dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
      return true;
    } catch (e) { return false; }
  }
  // c\u00f3 ng\u00e0y m\u1edbi m\u00e0 ch\u01b0a c\u00f3 n\u00fat ng\u00e0y \u0111\u00f3 -> g\u1eafn l\u1ea1i khung, qu\u00e1 2,5 gi\u00e2y v\u1eabn ch\u01b0a th\u1ea5y th\u00ec m\u1edbi t\u1ea3i l\u1ea1i c\u1ea3 trang
  async function refreshDates(date) {
    if (await spaRemount() && await waitFor(() => findDateTab(date), 2500, 25)) return true;
    st.reloads = (st.reloads || 0) + 1; save(K_STATE, st);
    location.reload();
    return false;
  }

  // ================= CapSolver: gi\u1ea3i Cloudflare Turnstile =================
  // Trang ch\u1ec9 g\u1eedi POST /api/registrations khi \u00f4 Turnstile (interaction-only) \u0111\u00e3 tr\u1ea3 token cho React.
  // B\u1ecdc window.turnstile.render \u0111\u1ec3 gi\u1eef callback c\u1ee7a trang -> \u0111\u01b0a token CapSolver v\u00e0o khi Safari ch\u01b0a c\u00f3 token
  // (th\u1ef1c t\u1ebf tr\u00ean iPhone Turnstile hay \u0111\u00f2i b\u1ea5m tay; ai \u0111\u00e3 b\u1ea5m tay c\u00f3 token th\u00ec d\u00f9ng token \u0111\u00f3, kh\u00f4ng t\u1ed1n ti\u1ec1n). Gi\u00e1 CapSolver: $1.2 / 1000 l\u01b0\u1ee3t gi\u1ea3i th\u00e0nh c\u00f4ng.
  const K_CAP = 'pj_capsolver_v1';        // key nh\u1eadp trong khung (ghi \u0111\u00e8 key build s\u1eb5n)
  const K_CAPN = 'pj_capsolver_n_v1';     // \u0111\u1ebfm l\u01b0\u1ee3t gi\u1ea3i theo ng\u00e0y JST: { d, n }
  const CAP_PRICE = 1.2 / 1000;           // USD / l\u01b0\u1ee3t
  const TS_LIFE_MS = 250e3;               // token Turnstile s\u1ed1ng 300s, ch\u1eeba 50s
  const TS_POOL = 3;                      // s\u1ed1 token gi\u1ea3i s\u1eb5n tr\u01b0\u1edbc 13:00 / khi \u0111ang \u0111\u1eb7t
  const capKey = () => { const k = String(load(K_CAP, '') || '').trim() || CAPSOLVER_KEY; return /^CAP-[0-9A-F]{20,}$/i.test(k) ? k : ''; };
  let capLastErr = '';
  let tsSiteKey = '', tsPool = [], tsSolving = 0, capErrUntil = 0, pageTok = null, forceCap = false;
  const tsUsed = new Set(), tsOurs = new Set(), tsCbs = new Map();   // id \u00f4 Turnstile -> callback c\u1ee7a trang

  function hookTurnstile(ts) {
    if (!ts || ts.__pj || typeof ts.render !== 'function') return ts;
    const _render = ts.render.bind(ts), _reset = ts.reset && ts.reset.bind(ts), _remove = ts.remove && ts.remove.bind(ts);
    ts.render = function (el, opts) {
      let cb = null;
      if (opts && typeof opts === 'object') {
        if (opts.sitekey) tsSiteKey = opts.sitekey;
        const ex = opts['expired-callback'];
        if (typeof opts.callback === 'function') { cb = opts.callback; opts.callback = (t) => { pageTok = t; return cb(t); }; }
        if (typeof ex === 'function') opts['expired-callback'] = () => { pageTok = null; return ex(); };
      }
      const id = _render(el, opts);
      if (cb) tsCbs.set(id, cb);
      return id;
    };
    if (_reset) ts.reset = function (id) { pageTok = null; return _reset(id); };
    if (_remove) ts.remove = function (id) { tsCbs.delete(id); return _remove(id); };
    ts.__pj = true;
    return ts;
  }
  // ch\u1ea1y \u1edf document-start: b\u1eaft l\u00fac api.js c\u1ee7a Cloudflare g\u00e1n window.turnstile
  let _ts = hookTurnstile(window.turnstile);
  try { Object.defineProperty(window, 'turnstile', { configurable: true, get: () => _ts, set: (v) => { _ts = hookTurnstile(v); } }); } catch (e) {}

  function capCount() {
    const d = jstDateStr(jstNow()), c = load(K_CAPN, { d, n: 0 });
    if (c.d !== d) { c.d = d; c.n = 0; }
    c.n++; save(K_CAPN, c);
    return c.n;
  }
  async function capApi(path, body, timeoutMs = 15e3) {
    const ac = new AbortController(), tm = setTimeout(() => ac.abort(), timeoutMs);   // m\u1ea1ng treo -> b\u00e1o l\u1ed7i, kh\u00f4ng \u0111\u1ee9ng im
    try {
      const r = await _fetch('https://api.capsolver.com/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ac.signal });
      const j = await r.json();
      if (j.errorId) throw new Error(j.errorCode || j.errorDescription || 'errorId ' + j.errorId);
      return j;
    } catch (e) {
      throw e.name === 'AbortError' ? new Error(L('CapSolverの応答がタイムアウトしました', 'CapSolver khong tra loi kip')) : e;
    } finally { clearTimeout(tm); }
  }
  async function capSolve() {
    const key = capKey();
    if (!key) return null;
    if (!tsSiteKey) {
      const ac = new AbortController(), timer = setTimeout(() => ac.abort(), 10e3);
      let j;
      try {
        const r = await _fetch('/api/turnstile-config', { credentials: 'include', cache: 'no-store', signal: ac.signal });
        if (!r.ok) throw new Error(`Turnstile config HTTP ${r.status}`);
        j = await r.json();
      } finally { clearTimeout(timer); }
      if (j.enabled === false) return null;
      tsSiteKey = j.siteKey || '';
      if (!tsSiteKey) throw new Error(L('sitekey\u53d6\u5f97\u5931\u6557', 'kh\u00f4ng l\u1ea5y \u0111\u01b0\u1ee3c sitekey'));
    }
    const t0 = Date.now();
    const { taskId } = await capApi('createTask', { clientKey: key,
      task: { type: 'AntiTurnstileTaskProxyLess', websiteURL: location.origin + location.pathname, websiteKey: tsSiteKey } });
    while (Date.now() - t0 < 40e3) {
      await sleep(1000);
      const remaining = t0 + 40e3 - Date.now();
      if (remaining <= 0) break;
      const j = await capApi('getTaskResult', { clientKey: key, taskId }, Math.min(15e3, remaining));
      if (j.status === 'ready') {
        const t = j.solution && j.solution.token;
        if (!t) throw new Error('token r\u1ed7ng');
        tsOurs.add(t);
        const n = capCount();
        log(L(`CapSolver \u89e3\u6c7a ${((Date.now() - t0) / 1000).toFixed(1)}\u79d2\uff08\u672c\u65e5 ${n}\u56de \u2248 $${(n * CAP_PRICE).toFixed(4)}\uff09`,
              `CapSolver gi\u1ea3i xong ${((Date.now() - t0) / 1000).toFixed(1)}s (h\u00f4m nay ${n} l\u01b0\u1ee3t \u2248 $${(n * CAP_PRICE).toFixed(4)})`));
        return t;
      }
      if (j.status === 'failed') throw new Error(j.errorCode || 'failed');
    }
    throw new Error(L('\u30bf\u30a4\u30e0\u30a2\u30a6\u30c8 40\u79d2', 'qu\u00e1 40 gi\u00e2y'));
  }
  const tsPrune = () => { tsPool = tsPool.filter((x) => Date.now() - x.at < TS_LIFE_MS && !tsUsed.has(x.t)); };
  // gi\u1ea3i s\u1eb5n cho \u0111\u1ee7 n token (ch\u1ea1y n\u1ec1n, l\u1ed7i th\u00ec ngh\u1ec9 10 gi\u00e2y)
  function tsFill(n) {
    if (!capKey() || Date.now() < capErrUntil) return;
    tsPrune();
    while (tsPool.length + tsSolving < n) {
      tsSolving++;
      capSolve().then((t) => { if (t) tsPool.push({ t, at: Date.now() }); })
        .catch((e) => { capErrUntil = Date.now() + 10e3; log('CapSolver ' + L('\u30a8\u30e9\u30fc: ', 'l\u1ed7i: ') + e.message); })
        .finally(() => { tsSolving--; });
    }
  }
  const tsTakeNow = () => { tsPrune(); const x = tsPool.shift(); return x ? x.t : null; };
  async function tsTake() {
    let t = tsTakeNow();
    if (t) return t;
    if (tsSolving) {
      await waitFor(() => tsPool.length || !tsSolving || !st.active, 45e3, 50);
      if (!st.active) return null;
      t = tsTakeNow();
      if (t) return t;
    }
    capLastErr = '';
    try {
      return await capSolve();
    } catch (e) { capLastErr = e.message || ''; log('CapSolver ' + L('\u30a8\u30e9\u30fc: ', 'l\u1ed7i: ') + e.message); return null; }
  }
  // Tr\u01b0\u1edbc khi b\u1ea5m \u540c\u610f\u3057\u3066\u53c2\u52a0\u3059\u308b: trang ch\u01b0a c\u00f3 token (ho\u1eb7c token Safari b\u1ecb t\u1eeb ch\u1ed1i) -> \u0111\u01b0a token CapSolver v\u00e0o React
  async function ensureToken() {
    if (!capKey()) return;
    if (pageTok && !tsUsed.has(pageTok) && (!forceCap || tsOurs.has(pageTok))) return;
    if (!tsCbs.size) await waitFor(() => tsCbs.size, 1500, 50);
    const t = await tsTake();
    if (!t) return;
    pageTok = t;
    for (const cb of tsCbs.values()) { try { cb(t); } catch (e) {} }
    await sleep(60);                      // ch\u1edd React c\u1eadp nh\u1eadt state
  }
  // L\u01b0\u1edbi an to\u00e0n: body g\u1eedi \u0111i kh\u00f4ng c\u00f3 token / token \u0111\u00e3 d\u00f9ng -> thay token CapSolver gi\u1ea3i s\u1eb5n
  function tsPatchBody(body) {
    try {
      const j = JSON.parse(body);
      if (!j || typeof j !== 'object') return body;
      if ((!j.turnstileToken || tsUsed.has(j.turnstileToken)) && capKey()) { const t = tsTakeNow(); if (t) j.turnstileToken = t; }
      if (j.turnstileToken) tsUsed.add(j.turnstileToken);   // token ch\u1ec9 d\u00f9ng \u0111\u01b0\u1ee3c 1 l\u1ea7n
      pageTok = null;
      return JSON.stringify(j);
    } catch (e) { return body; }
  }

  // ================= Th\u1eddi gian JST =================
  // Gi\u1edd m\u00e1y ch\u1ee7: \u0111\u1ecdc header Date (tr\u1eeb n\u1eeda th\u1eddi gian m\u1ea1ng), \u0111i\u1ec7n tho\u1ea1i l\u1ec7ch gi\u1edd v\u1eabn d\u00f2 \u0111\u00fang 13:00
  let clockOff = 0, clockSampleAt = 0, clockLogged = false;
  const nowS = () => Date.now() + clockOff;
  const jstNow = () => new Date(nowS() + 9 * 3600e3);          // d\u00f9ng getUTC* \u0111\u1ec3 \u0111\u1ecdc gi\u1edd JST
  const jstDateStr = (d) => d.toISOString().slice(0, 10);
  // 4/11 user b\u00e1o h\u1eb9n 13:00 m\u00e0 BOT kh\u00f4ng b\u1ea5m, log 1 d\u00f2ng: tr\u01b0\u1edbc \u0111\u00e2y qu\u00e1 13:10 h\u00e0m n\u00e0y nh\u1ea3y sang 13:00 NG\u00c0Y MAI n\u00ean
  // modeWait kh\u00f4ng bao gi\u1edd t\u1edbi nh\u00e1nh "qu\u00e1 13:10 \u2013 d\u1eebng", l\u1eb7ng l\u1ebd \u0111\u1ebfm ng\u01b0\u1ee3c ti\u1ebfp. Gi\u1edd m\u1ed1c ch\u1edd l\u01b0u c\u1ed1 \u0111\u1ecbnh l\u00fac b\u1ea5m (st.openAt).
  function nextOpenAt() {
    const n = jstNow();
    let t = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), OPEN_H, OPEN_M, 0) - n;
    if (t < 0) t += 86400e3;                            // b\u1ea5m l\u00fac \u0111\u00e3 qu\u00e1 13:00 (ng\u00e0y h\u00f4m nay \u0111\u00e3 m\u1edf) -> ch\u1edd 13:00 ng\u00e0y mai
    return nowS() + t;
  }
  const msToOpen = () => (st.openAt || nextOpenAt()) - nowS();

  // ================= API =================
  async function apiDates() {
    const t0 = Date.now();
    const r = await _fetch(`/api/registrations/bookable-dates?_=${Date.now()}`, { credentials: 'include', cache: 'no-store' });
    if (!r.ok) throw new Error('bookable-dates HTTP ' + r.status);
    const sv = Date.parse(r.headers.get('date') || ''), t1 = Date.now();
    if (Number.isFinite(sv) && Number(r.headers.get('age') || 0) === 0 &&
        t0 >= clockSampleAt && t1 >= t0 && t1 - t0 < 2000) {
      clockSampleAt = t0;
      const off = sv + 500 - (t0 + t1) / 2;              // header ch\u1ec9 ch\u00ednh x\u00e1c t\u1edbi gi\u00e2y -> l\u1ea5y gi\u1eefa gi\u00e2y
      clockOff = Math.abs(off) > 2000 ? off : 0;         // l\u1ec7ch d\u01b0\u1edbi 2 gi\u00e2y: gi\u1eef gi\u1edd m\u00e1y
      if (clockOff && !clockLogged) { clockLogged = true; log(L(`\u7aef\u672b\u306e\u6642\u8a08\u304c ${Math.round(off / 1000)}\u79d2 \u305a\u308c\u3066\u3044\u307e\u3059 \u2192 \u30b5\u30fc\u30d0\u30fc\u6642\u523b\u3067\u52d5\u4f5c`, `Gi\u1edd \u0111i\u1ec7n tho\u1ea1i l\u1ec7ch ${Math.round(off / 1000)} gi\u00e2y \u2192 BOT d\u00f9ng gi\u1edd m\u00e1y ch\u1ee7`)); }
    }
    const j = await r.json();
    return (j.dates || []).map((d) => (typeof d === 'string' ? d : d.date || d.slotDate)).filter(Boolean);
  }
  async function apiSlots(date) {
    try {
      const r = await _fetch(`/api/registrations/slots?date=${date}&_=${Date.now()}`, { credentials: 'include', cache: 'no-store' });
      if (!r.ok) return null;
      const j = await r.json();
      if (!Array.isArray(j)) return null;
      return j;
    } catch (e) { return null; }
  }

  // ================= Th\u1ee9 t\u1ef1 khung theo c\u00e0i \u0111\u1eb7t =================
  function slotOrder(apiList) {
    const prio = load(K_PRIO, {});
    const free = (t) => {
      if (!apiList) return true;                        // API h\u1ecfng -> \u0111\u1ec3 UI quy\u1ebft (n\u00fat x\u00e1m = b\u1ecf)
      const s = apiList.find((x) => typeof x?.startTime === 'string' && x.startTime.slice(0, 5) === t);
      if (!s) return true;
      return s.isOpen !== false && !s.isFull && !s.isPast && (s.remaining == null || s.remaining > 0);
    };
    const ranked = SLOTS.filter((t) => typeof prio[t] === 'number').sort((a, b) => prio[a] - prio[b]);
    const normal = SLOTS.filter((t) => prio[t] == null);
    return [...ranked, ...normal].filter(free);
  }

  // ================= Thao t\u00e1c giao di\u1ec7n =================
  const btns = () => [...document.querySelectorAll('button, [role=button]')].filter((b) => !b.closest('#pjbox'));
  const txt = (e) => (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim();
  const visible = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  function findDateTab(date) {
    const m = +date.slice(5, 7), d = +date.slice(8, 10);
    const re = new RegExp('(^|[^0-9/])' + m + '/' + d + '(?![0-9])');
    return btns().find((b) => re.test(txt(b)));
  }
  function isDateSelected(date) {
    const tab = findDateTab(date);
    return !!tab && (
      tab.getAttribute('aria-selected') === 'true' ||
      tab.getAttribute('aria-pressed') === 'true' ||
      tab.classList.contains('border-[#fe198a]')
    );
  }
  function dateSlotsReady(date) {
    return isDateSelected(date) && ![...document.querySelectorAll('.animate-spin')].some(visible);
  }
  function findSlotBtn(t) { return btns().find((b) => txt(b).startsWith(t) || txt(b).includes(t + '-') || txt(b).includes(t + '\u2013')); }
  function findByText(re) { return btns().find((b) => re.test(txt(b)) && visible(b) && !b.disabled); }
  function closeAgreeDialog() {
    const ok = findByText(/\u540c\u610f\u3057\u3066\u53c2\u52a0/);
    if (!ok) return;
    const cancel = btns().find((b) => txt(b) === '\u30ad\u30e3\u30f3\u30bb\u30eb');
    if (cancel) cancel.click();
  }
  async function waitFor(fn, ms, step = 25) {
    const end = Date.now() + ms;
    while (Date.now() < end) { const v = fn(); if (v) return v; await sleep(step); }
    return null;
  }
  function toastText() {
    return [...document.querySelectorAll('[role=status],[role=alert],[data-sonner-toast],[class*=toast],[class*=Toast]')]
      .map(txt).filter(Boolean).reverse().join(' | ');
  }

  // 1 l\u01b0\u1ee3t: b\u1ea5m khung -> \u62bd\u9078\u306b\u53c2\u52a0 -> \u540c\u610f\u3057\u3066\u53c2\u52a0\u3059\u308b -> \u0111\u1ecdc k\u1ebft qu\u1ea3
  function isCurrentRun(runAt) { return st.active && st.mode === 'run' && st.runAt === runAt; }
  const stoppedBeforeSubmit = () => ({ kind: 'stop', notSent: true, note: '申込を停止しました' });
  const unknownRegistration = () => ({ kind: 'stop', pending: true, note: '申込結果を確認できません。マイチケットを確認してください。' });
  async function trySlot(date, t) {
    const runAt = st.runAt;
    closeAgreeDialog();
    const sb = await waitFor(() => dateSlotsReady(date) && findSlotBtn(t), 8000);
    if (!isCurrentRun(runAt)) return stoppedBeforeSubmit();
    if (!dateSlotsReady(date)) return { kind: 'skip', note: '選択した日付の枠を確認できませんでした' };
    if (!sb) return { kind: 'skip', note: L('\u67a0\u30dc\u30bf\u30f3\u306a\u3057', 'kh\u00f4ng th\u1ea5y n\u00fat khung') };
    if (sb.disabled || /\u6e80\u5e2d|\u7d42\u4e86/.test(txt(sb))) return { kind: 'skip', note: '\u6e80\u5e2d' };
    sb.click();
    await sleep(50);                         // \u0111\u1ec3 React ghi khung v\u1eeba ch\u1ecdn
    const join = await waitFor(() => findByText(/\u62bd\u9078\u306b\u53c2\u52a0/), 3000);
    if (!isCurrentRun(runAt)) return stoppedBeforeSubmit();
    if (!isDateSelected(date)) return { kind: 'skip', note: '選択した日付が変わりました' };
    if (!join) return { kind: 'skip', note: L('\u62bd\u9078\u306b\u53c2\u52a0 \u62bc\u305b\u305a', 'kh\u00f4ng b\u1ea5m \u0111\u01b0\u1ee3c \u62bd\u9078\u306b\u53c2\u52a0') };

    regPosted = false;
    let resolveResponse;
    const resP = new Promise((res) => { resolveResponse = res; });
    resultWaiter = resolveResponse;
    const timer = setTimeout(() => {
      if (resultWaiter === resolveResponse) resultWaiter = null;
      resolveResponse(null);
    }, WAIT_RESULT_MS);
    try {
      join.click();
      const agree = await waitFor(() => findByText(/\u540c\u610f\u3057\u3066\u53c2\u52a0/), WAIT_AGREE_MS);
      if (!isCurrentRun(runAt)) return stoppedBeforeSubmit();
      await ensureToken();
      if (!isCurrentRun(runAt)) return stoppedBeforeSubmit();
      if (agree && resultWaiter === resolveResponse) {
        if (!isDateSelected(date) && !regPosted) {
          closeAgreeDialog();
          return { kind: 'skip', note: '選択した日付が変わりました' };
        }
        agree.click();
      }
      if (st.active) tsFill(TS_POOL);           // gi\u1ea3i b\u00f9 token cho l\u01b0\u1ee3t sau

      const r = await resP;
      if (!isCurrentRun(runAt)) return regPosted ? unknownRegistration() : stoppedBeforeSubmit();
      if (!r || !r.status) {
        const tt = toastText();
        if (/\u5f53\u9078\u304a\u3081\u3067\u3068\u3046|\u3059\u3067\u306b\u53d6\u5f97\u6e08\u307f/.test(tt)) return { kind: 'won', note: tt.slice(0, 40), freshWin: regPosted && /\u5f53\u9078\u304a\u3081\u3067\u3068\u3046/.test(tt) && !/\u3059\u3067\u306b\u53d6\u5f97\u6e08\u307f/.test(tt) };
        if (/\u5b9a\u54e1\u306b\u9054\u3057\u307e\u3057\u305f/.test(tt)) return { kind: 'lose', note: L('\u5b9a\u54e1\u306b\u9054\u3057\u307e\u3057\u305f', '\u0111\u00e3 \u0111\u1ee7 ng\u01b0\u1eddi') };
        // trang CH\u01afA g\u1eedi \u0111\u0103ng k\u00fd: kh\u00f4ng t\u00ednh v\u00e0o l\u01b0\u1ee3t g\u1eedi. Kh\u00f4ng c\u00f3 key th\u00ec khung sau c\u0169ng v\u1eady -> d\u1eebng v\u00e0 b\u00e1o r\u00f5
        if (!regPosted && !capKey()) return { kind: 'stop', notSent: true, note: L('\u9001\u4fe1\u3067\u304d\u307e\u305b\u3093: Cloudflare \u8a8d\u8a3c\u5f85\u3061\uff08\u30c1\u30a7\u30c3\u30af\u3092\u30bf\u30c3\u30d7 or CapSolver \u30ad\u30fc\u3092\u5165\u529b\uff09', 'ch\u01b0a g\u1eedi \u0111\u01b0\u1ee3c: Cloudflare \u0111ang ch\u1edd x\u00e1c nh\u1eadn (b\u1ea5m \u00f4 x\u00e1c nh\u1eadn ho\u1eb7c nh\u1eadp key CapSolver)') };
        if (!regPosted) return { kind: 'error', notSent: true, note: L('\u30da\u30fc\u30b8\u304c\u7533\u8fbc\u3092\u9001\u4fe1\u3057\u307e\u305b\u3093\u3067\u3057\u305f', 'trang ch\u01b0a g\u1eedi \u0111\u0103ng k\u00fd') + (tt ? ': ' + tt.slice(0, 40) : '') };
        return unknownRegistration();
      }
      return parseReg(r);
    } finally {
      clearTimeout(timer);
      if (resultWaiter === resolveResponse) resultWaiter = null;
    }
  }

  // \u0110\u1ecdc k\u1ebft qu\u1ea3 POST /api/registrations (d\u00f9ng chung cho ch\u1ebf \u0111\u1ed9 giao di\u1ec7n v\u00e0 ch\u1ebf \u0111\u1ed9 request)
  function parseReg(r) {
    if (r.status === 429) return { kind: 'stop', note: 'HTTP 429 アクセス制限のため停止しました。' };
    if (r.status === 403) return { kind: 'stop', note: 'HTTP 403 アクセスが拒否されたため停止しました。' };
    const d = r.data || {};
    const res = String(d.result || '').toLowerCase();
    const code = String(d.code || '');
    if (res === 'won' || res === 'already_won') return { kind: 'won', note: res, freshWin: res === 'won' && r.status >= 200 && r.status < 300 };
    if (res) return { kind: 'lose', note: res };
    // c\u00f3 CapSolver: token b\u1ecb t\u1eeb ch\u1ed1i -> t\u1eeb gi\u1edd lu\u00f4n d\u00f9ng token CapSolver, th\u1eed khung k\u1ebf thay v\u00ec d\u1eebng
    if (code === 'TURNSTILE_INVALID' && capKey() && !forceCap) { forceCap = true; pageTok = null; return { kind: 'error', note: code + L(' \u2192 \u6b21\u304b\u3089 CapSolver', ' \u2192 t\u1eeb l\u01b0\u1ee3t sau d\u00f9ng CapSolver') }; }
    if (EARLY_CODES.has(code)) return { kind: 'early', slotLevel: EARLY_SLOT.has(code), note: code };
    if (STOP_CODES.has(code)) return { kind: 'stop', note: `${code} ${d.message || ''}` };
    if (SKIP_CODES.has(code)) return { kind: 'skip', lost: true, note: code };
    if (r.status >= 500 && code !== 'SYSTEM_BUSY') return unknownRegistration();
    if (code === 'SYSTEM_BUSY') return { kind: 'error', busy: true, note: `HTTP ${r.status} ${code} ${d.message || ''}` };
    if (r.status === 401) return { kind: 'stop', note: L('\u30ed\u30b0\u30a4\u30f3\u5207\u308c\uff08\u518d\u30ed\u30b0\u30a4\u30f3\u3057\u3066\u304f\u3060\u3055\u3044\uff09', 'h\u1ebft phi\u00ean \u0111\u0103ng nh\u1eadp (h\u00e3y \u0111\u0103ng nh\u1eadp l\u1ea1i)') };
    return { kind: 'error', note: `HTTP ${r.status} ${code} ${d.message || ''}` };
  }

  // Ch\u1ea1y tr\u00ean danh s\u00e1ch ng\u00e0y, d\u1eebng khi tr\u00fang / d\u1eebng / tr\u01b0\u1ee3t \u0111\u1ee7 MAX_LOSE
  async function runDates(dates) {
    const runAt = st.runAt;
    let lose = 0, busyLeft = false, busyN = 0, earlyN = 0;
    const rq = useRq(), until = Date.now() + BUSY_UNTIL_MS, done = new Set();   // done: khung \u0111\u00e3 c\u00f3 k\u1ebft qu\u1ea3, kh\u1ecfi g\u1eedi l\u1ea1i
    // \u0111\u1ebfm s\u1ed1 l\u1ea7n g\u1eedi + khung \u0111\u00e3 tr\u01b0\u1ee3t TRONG NG\u00c0Y (gi\u1edd Nh\u1eadt): b\u1ea5m ch\u1ea1y l\u1ea1i c\u0169ng kh\u00f4ng g\u1eedi qu\u00e1 MAX_POSTS, kh\u00f4ng g\u1eedi l\u1ea1i khung \u0111\u00e3 tr\u01b0\u1ee3t
    const today = jstDateStr(jstNow());
    dates = dates.filter((d) => d >= today);             // m\u00e1y ch\u1ee7 tr\u1ea3 c\u1ea3 ng\u00e0y \u0111\u00e3 qua t\u1edbi 13:00 -> kh\u00f4ng t\u1ed1n l\u01b0\u1ee3t g\u1eedi cho ng\u00e0y \u0111\u00f3
    if (!dates.length) { finish(L('\u7533\u8fbc\u3067\u304d\u308b\u65e5\u4ed8\u304c\u3042\u308a\u307e\u305b\u3093', 'Hi\u1ec7n kh\u00f4ng c\u00f3 ng\u00e0y n\u00e0o \u0111\u1ec3 \u0111\u0103ng k\u00fd')); return; }
    if (st.postDay !== today) { st.postDay = today; st.posts = 0; st.lost = []; save(K_STATE, st); }
    const markLost = (k) => { if (!st.lost.includes(k)) { st.lost.push(k); save(K_STATE, st); } };
    if (st.posts) log(L(`\u4eca\u65e5\u306f\u3059\u3067\u306b ${st.posts}\u56de \u9001\u4fe1\uff08\u4e0a\u9650 ${MAX_POSTS}\u56de\uff09`, `H\u00f4m nay \u0111\u00e3 g\u1eedi ${st.posts} l\u1ea7n (t\u1ed1i \u0111a ${MAX_POSTS})`));
    log(rq ? L('\u30e2\u30fc\u30c9: \u30ea\u30af\u30a8\u30b9\u30c8\uff08PC\u7248\u3068\u540c\u3058\u304f API \u306b\u76f4\u63a5\u9001\u4fe1\uff09', 'Ch\u1ebf \u0111\u1ed9 REQUEST (g\u1eedi th\u1eb3ng API nh\u01b0 b\u1ea3n PC)')
           : L('\u30e2\u30fc\u30c9: \u753b\u9762\u64cd\u4f5c\uff08CapSolver \u30ad\u30fc\u306a\u3057\uff09', 'Ch\u1ebf \u0111\u1ed9 b\u1ea5m giao di\u1ec7n (ch\u01b0a c\u00f3 key CapSolver)'));
    for (let pass = 1; ; pass++) {
    busyLeft = false;
    for (const date of dates) {
      if (!isCurrentRun(runAt)) return;
      let tab = null;
      if (!rq) {
        tab = findDateTab(date);
        if (!tab) {
          if ((st.reloads || 0) < 2) {
            if (!(await refreshDates(date))) return;       // t\u1ea3i l\u1ea1i c\u1ea3 trang -> script t\u1ef1 ch\u1ea1y ti\u1ebfp
            tab = findDateTab(date);
          }
          if (!tab) { log(L(`${date.slice(5)} \u306e\u65e5\u4ed8\u30dc\u30bf\u30f3\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\uff08\u30ed\u30b0\u30a4\u30f3\u72b6\u614b\u3092\u78ba\u8a8d\uff09`, `Kh\u00f4ng th\u1ea5y n\u00fat ng\u00e0y ${date.slice(5)} tr\u00ean trang (ki\u1ec3m tra \u0111\u00e3 \u0111\u0103ng nh\u1eadp ch\u01b0a)`)); continue; }
        }
        tab.click();
      }
      // ng\u00e0y m\u1edbi m\u1edf: khung n\u00e0o c\u0169ng c\u00f2n ch\u1ed7 -> kh\u1ecfi h\u1ecfi API slots (\u0111\u1ee1 0,2\u20130,5 gi\u00e2y); ng\u00e0y c\u0169 th\u00ec h\u1ecfi song song l\u00fac ch\u1edd trang v\u1ebd khung
      const slotsP = st.fresh ? Promise.resolve(null) : apiSlots(date);
      if (!rq && !await waitFor(() => dateSlotsReady(date), 2500)) {
        if (!isCurrentRun(runAt)) return;
        log(`${date} の枠の表示を確認できなかったためスキップしました`);
        continue;
      }
      const slotList = await slotsP;
      const order = slotOrder(slotList);
      const slotIndexes = new Map();
      for (const slot of slotList || []) {
        if (typeof slot?.startTime !== 'string' || !/^\d{1,8}$/.test(String(slot.slotIndex))) continue;
        slotIndexes.set(slot.startTime.slice(0, 5), Number(slot.slotIndex));
      }
      if (slotList && !order.length) log(L(`${date.slice(5)} \u7a7a\u304d\u306a\u3057`, `${date.slice(5).replace('-', '/')}: h\u1ebft ch\u1ed7`));
      for (const t of order) {
        if (!isCurrentRun(runAt)) return;
        if (done.has(date + t) || st.lost.includes(date + '#' + t)) continue;
        const md = date.slice(5).replace('-', '/');
        let r, busyHere = 0, earlyHere = 0;
        for (;;) {
          if (!isCurrentRun(runAt)) return;
          if (st.posts >= MAX_POSTS) {
            finish(L(`\u672c\u65e5\u306e\u9001\u4fe1\u4e0a\u9650\uff08${MAX_POSTS}\u56de\uff09\u306b\u9054\u3057\u305f\u306e\u3067\u505c\u6b62\uff08RATE_LIMIT \u9632\u6b62\uff09`, `H\u00f4m nay \u0111\u00e3 g\u1eedi \u0111\u1ee7 ${MAX_POSTS} l\u1ea7n \u2013 d\u1eebng (tr\u00e1nh b\u1ecb RATE_LIMIT kh\u00f3a c\u1ea3 ng\u00e0y)`)); beep(1); return;
          }
          if (!rq) { log(L(`${md} ${t} \u7533\u8fbc\u4e2d\u2026`, `${md} ${t}: \u0111ang b\u1ea5m \u0111\u0103ng k\u00fd\u2026`)); setStatus(L(`${md} ${t} \u7533\u8fbc\u4e2d\u2026`, `\u0110ang \u0111\u0103ng k\u00fd ${md} ${t}\u2026`)); }
          r = rq ? await rqTry(date, t, slotIndexes.get(t)) : await trySlot(date, t);
          if (!isCurrentRun(runAt)) return;
          if (!r.pending) st.postPending = false;
          if ((r.kind !== 'skip' || r.lost) && !r.notSent) st.posts = (st.posts || 0) + 1;
          save(K_STATE, st);   // skip \u1edf giao di\u1ec7n (kh\u00f4ng th\u1ea5y n\u00fat) = ch\u01b0a g\u1eedi
          if (r.busy) {
            if (++busyN > BUSY_MAX) { finish(L(`\u30b5\u30fc\u30d0\u30fc\u6df7\u96d1\u304c${BUSY_MAX}\u56de\u7d9a\u3044\u305f\u306e\u3067\u505c\u6b62`, `M\u00e1y ch\u1ee7 qu\u00e1 t\u1ea3i ho\u1eb7c kh\u00f4ng tr\u1ea3 l\u1eddi ${BUSY_MAX} l\u1ea7n li\u00ean ti\u1ebfp \u2013 d\u1eebng`)); beep(1); return; }
            if (++busyHere >= BUSY_PER_SLOT) break;            // khung n\u00e0y qu\u00e1 t\u1ea3i 2 l\u1ea7n -> sang khung k\u1ebf, v\u00f2ng sau quay l\u1ea1i
            const w = BUSY_WAITS[Math.min(busyN - 1, BUSY_WAITS.length - 1)];
            log(L(`${md} ${t} \u30b5\u30fc\u30d0\u30fc\u6df7\u96d1: ${r.note} \u2192 ${(w / 1000).toFixed(1)}\u79d2\u5f8c\u306b\u540c\u3058\u6642\u9593\u5e2f\u3067\u518d\u9001`, `${md} ${t} m\u00e1y ch\u1ee7 qu\u00e1 t\u1ea3i: ${r.note} \u2192 ${(w / 1000).toFixed(1)} gi\u00e2y sau g\u1eedi l\u1ea1i \u0111\u00fang khung n\u00e0y`));
            await sleep(w);
          } else if (r.kind === 'early') {
            if (++earlyN > EARLY_MAX) { finish(L(`\u53d7\u4ed8\u524d\u306e\u30a8\u30e9\u30fc\u304c${EARLY_MAX}\u56de\u7d9a\u3044\u305f\u306e\u3067\u505c\u6b62`, `M\u00e1y ch\u1ee7 b\u00e1o "ch\u01b0a m\u1edf" ${EARLY_MAX} l\u1ea7n \u2013 d\u1eebng`)); beep(1); return; }
            if (r.slotLevel && ++earlyHere >= EARLY_PER_SLOT) break;   // ri\u00eang khung n\u00e0y ch\u01b0a m\u1edf -> sang khung k\u1ebf
            log(L(`${md} ${t} \u307e\u3060\u53d7\u4ed8\u524d\uff08${r.note}\uff09\u2192 1.2\u79d2\u5f8c\u306b\u540c\u3058\u6642\u9593\u5e2f\u3067\u518d\u9001`, `${md} ${t} ch\u01b0a m\u1edf (${r.note}) \u2192 1,2 gi\u00e2y sau g\u1eedi l\u1ea1i \u0111\u00fang khung n\u00e0y`));
            await sleep(EARLY_GAP_MS);
          } else break;
          if (!rq) { const tb = findDateTab(date); if (tb) tb.click(); await sleep(150); }
        }
        if (r.kind === 'skip' && !r.lost) log(`${md} ${t} スキップ: ${r.note}`);
        if (!r.busy && r.kind !== 'early') done.add(date + t);
        if (r.kind === 'lose' || r.lost) markLost(date + '#' + t);
        if (r.kind === 'early') { busyLeft = true; log(L(`${md} ${t} \u307e\u3060\u53d7\u4ed8\u524d \u2192 \u6b21\u306e\u6642\u9593\u5e2f\u3078`, `${md} ${t} v\u1eabn ch\u01b0a m\u1edf \u2192 sang khung k\u1ebf`)); }
        if (r.lost) { log(L(`${md} ${t} \u2192 \u6b21\u306e\u6642\u9593\u5e2f: ${r.note}`, `${md} ${t} \u2192 sang khung k\u1ebf: ${r.note}`)); await sleep(GAP_MS); }
        if (r.kind === 'won') {
          finish(L(`\ud83c\udf89 \u5f53\u9078\uff01 ${md} ${t}`, `\ud83c\udf89 TR\u00daNG V\u00c9! ${md} ${t}`)); beep(3);
          if (r.freshWin) synovaNotify([{ author: '\u2705 Lottery Won', title: `MelloJoy \u5165\u5834\u5238 ${md} ${t}`, url: location.origin + '/register',
            fields: [['\u6765\u5e97\u65e5', date], ['\u6642\u9593', t], ['Site', location.hostname, false]] }]);
          if (rq) setTimeout(() => { location.href = '/my-tickets'; }, 1500);   // m\u1edf trang v\u00e9 \u0111\u1ec3 xem v\u00e9 v\u1eeba tr\u00fang
          return;
        }
        if (r.kind === 'stop') { finish(L('\u505c\u6b62: ', 'D\u1eebng: ') + r.note); beep(1); return; }
        if (r.kind === 'lose') { lose++; log(L(`${md} ${t} \u843d\u9078 (${lose}/${MAX_LOSE})`, `${md} ${t} tr\u01b0\u1ee3t (${lose}/${MAX_LOSE})`)); if (lose >= MAX_LOSE) { finish(L(`${MAX_LOSE}\u56de\u7d9a\u3051\u3066\u843d\u9078 \u2192 \u505c\u6b62`, `Tr\u01b0\u1ee3t ${MAX_LOSE} l\u1ea7n li\u00ean ti\u1ebfp \u2013 d\u1eebng`)); return; } await sleep(GAP_MS); }
        if (r.kind === 'error') {
          if (r.busy) { busyLeft = true; log(L(`${md} ${t} \u6df7\u96d1\u304c\u7d9a\u304f \u2192 \u6b21\u306e\u6642\u9593\u5e2f\u3078\uff08\u5f8c\u3067\u3082\u3046\u4e00\u5ea6\uff09`, `${md} ${t} v\u1eabn qu\u00e1 t\u1ea3i \u2192 sang khung k\u1ebf (v\u00f2ng sau th\u1eed l\u1ea1i)`)); }
          else log(L(`${md} ${t} \u30a8\u30e9\u30fc: ${r.note}`, `${md} ${t} l\u1ed7i: ${r.note}`));
          await sleep(r.busy ? BUSY_WAITS[Math.min(busyN, BUSY_WAITS.length - 1)] : 1500);
        }
        if (!rq) { tab = findDateTab(date); if (tab) tab.click(); await sleep(150); }
      }
    }
    // ch\u1ebf \u0111\u1ed9 request: khung n\u00e0o ch\u1ec9 b\u1ecb qu\u00e1 t\u1ea3i (ch\u01b0a x\u00e9t) th\u00ec quay l\u1ea1i th\u1eed ti\u1ebfp, kh\u00f4ng b\u00e1o nh\u1ea7m "h\u1ebft khung"
    if (!rq || !busyLeft || !st.active || Date.now() > until) break;
    log(L(`\u6df7\u96d1\u30fb\u53d7\u4ed8\u524d \u2192 \u7d50\u679c\u306e\u51fa\u3066\u3044\u306a\u3044\u6642\u9593\u3092\u3082\u3046\u4e00\u5ea6\uff08${pass + 1}\u5468\u76ee\uff09`, `Qu\u00e1 t\u1ea3i / ch\u01b0a m\u1edf \u2192 th\u1eed l\u1ea1i c\u00e1c khung ch\u01b0a c\u00f3 k\u1ebft qu\u1ea3 (v\u00f2ng ${pass + 1})`));
    }
    finish(busyLeft ? L('\u30b5\u30fc\u30d0\u30fc\u6df7\u96d1\u304c\u7d9a\u3044\u305f\u305f\u3081\u505c\u6b62', 'M\u00e1y ch\u1ee7 qu\u00e1 t\u1ea3i li\u00ean t\u1ee5c \u2013 d\u1eebng')
                    : L('\u7a7a\u3044\u3066\u3044\u308b\u6642\u9593\u306a\u3057', 'Kh\u00f4ng c\u00f2n khung tr\u1ed1ng'));
  }

  // ================= Ch\u1ebf \u0111\u1ed9 REQUEST (gi\u1ed1ng b\u1ea3n PC SYNOVAJOY BOT PC) =================
  // Kh\u00f4ng b\u1ea5m giao di\u1ec7n: g\u1eedi th\u1eb3ng POST /api/registrations y nh\u01b0 trang g\u1eedi:
  //  - token \u0111\u0103ng nh\u1eadp: trang l\u01b0u \u1edf localStorage 'h5.accessToken' (h\u1ebft h\u1ea1n -> POST /api/user-auth/refresh b\u1eb1ng cookie)
  //  - deviceFingerprint: t\u00ednh \u0111\u00fang c\u00f4ng th\u1ee9c c\u1ee7a trang tr\u00ean ch\u00ednh m\u00e1y n\u00e0y (ra c\u00f9ng gi\u00e1 tr\u1ecb trang g\u1eedi)
  //  - GPS: v\u1ecb tr\u00ed th\u1eadt c\u1ee7a m\u00e1y (\u0111o s\u1eb5n t\u1eeb 12:59) ; turnstileToken: CapSolver gi\u1ea3i s\u1eb5n
  // B\u1eaft bu\u1ed9c c\u00f3 key CapSolver (kh\u00f4ng c\u00f3 token Turnstile th\u00ec m\u00e1y ch\u1ee7 tr\u1ea3 TURNSTILE_INVALID) -> kh\u00f4ng c\u00f3 key th\u00ec b\u1ea5m giao di\u1ec7n nh\u01b0 c\u0169.
  // V\u1eabn g\u1eedi L\u1ea6N L\u01af\u1ee2T t\u1eebng khung (kh\u00f4ng song song): g\u1eedi song song t\u1eebng l\u00e0m 1 TK tr\u00fang nhi\u1ec1u v\u00e9 c\u00f9ng ng\u00e0y (b\u1ea3n PC 1/10).
  const POLL_MAX_INFLIGHT = 8;
  let pollInflight = 0, pollFound = null, pollWake = null;
  const useRq = () => !!capKey();
  const K_TOK = 'h5.accessToken';
  const getTok = () => { try { return localStorage.getItem(K_TOK) || ''; } catch (e) { return ''; } };
  function jwtExp(t) { try { return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000 || 0; } catch (e) { return 0; } }
  async function rqRefresh() {
    try {
      const r = await _fetch('/api/user-auth/refresh', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.accessToken) { localStorage.setItem(K_TOK, j.accessToken); return j.accessToken; }
    } catch (e) {}
    return '';
  }
  let rqWarmAt = 0;
  // tr\u01b0\u1edbc gi\u1edd m\u1edf: token s\u1eafp h\u1ebft h\u1ea1n (< 5 ph\u00fat) th\u00ec l\u00e0m m\u1edbi lu\u00f4n, kh\u1ecfi m\u1ea5t 1 v\u00f2ng 401 l\u00fac 13:00
  function rqWarmToken() {
    if (!useRq() || Date.now() - rqWarmAt < 60e3) return;
    rqWarmAt = Date.now();
    const exp = jwtExp(getTok());
    if (!getTok() || (exp && exp - Date.now() < 5 * 60e3)) rqRefresh();
  }
  // deviceFingerprint: ch\u00e9p \u0111\u00fang h\u00e0m Zc() c\u1ee7a trang (UA|ng\u00f4n ng\u1eef|m\u00e0n h\u00ecnh|m\u00fai gi\u1edd|CPU|deviceId|canvas -> FNV-1a)
  let fpCache = '';
  function deviceId() {
    try {
      let id = localStorage.getItem('h5.deviceId');
      if (id) return id;
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('h5.deviceId', id);
      return id;
    } catch (e) { return ''; }
  }
  function pageFp() {
    if (fpCache) return fpCache;
    try {
      const a = [navigator.userAgent, navigator.language, `${screen.width}x${screen.height}x${screen.colorDepth}`,
        Intl.DateTimeFormat().resolvedOptions().timeZone ?? '', String(navigator.hardwareConcurrency ?? 0), deviceId()];
      const c = document.createElement('canvas');
      c.width = 240; c.height = 60;
      const g = c.getContext('2d');
      if (g) {
        g.textBaseline = 'top'; g.font = "14px 'Arial'"; g.fillStyle = '#d34325'; g.fillRect(2, 2, 80, 20);
        g.fillStyle = '#161310'; g.fillText('\u5165\u5834\u5238\u00b7Backstage\u00b72026', 4, 4);
        g.strokeStyle = 'rgba(22,19,16,0.4)'; g.beginPath(); g.arc(180, 30, 18, 0, Math.PI * 2); g.stroke();
        a.push(c.toDataURL());
      }
      const o = a.join('|');
      let h = 2166136261;
      for (let k = 0; k < o.length; k++) { h ^= o.charCodeAt(k); h = h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0; }
      fpCache = h.toString(16).padStart(8, '0') + '-' + o.length.toString(16);
    } catch (e) {
      try { fpCache = localStorage.getItem('h5.fallbackFp') || ''; } catch (e2) {}
    }
    return fpCache;
  }
  // GPS th\u1eadt: v\u1ecb tr\u00ed \u0111o s\u1eb5n \u2264 30 gi\u00e2y, ch\u01b0a c\u00f3 th\u00ec \u0111o ngay (t\u1ed1i \u0111a 10 gi\u00e2y nh\u01b0 trang)
  function rqGps() {
    // \u0111\u1ee9ng y\u00ean th\u00ec watchPosition \u00edt b\u00e1o m\u1edbi; v\u1ecb tr\u00ed th\u1eadt \u0111o trong 2 ph\u00fat v\u1eabn h\u1ee3p l\u1ec7 -> l\u1ea7n g\u1eedi l\u1ea1i kh\u00f4ng m\u1ea5t th\u00eam v\u00e0i gi\u00e2y \u0111o GPS
    if (geoLast && Date.now() - geoLast.at < 120e3) return Promise.resolve(geoLast.p.coords);
    return new Promise((res) => {
      if (!geoOrig) return res(null);
      const timer = setTimeout(() => res(null), 12e3);                 // iPhone c\u00f3 l\u00fac kh\u00f4ng g\u1ecdi l\u1ea1i (\u0111ang ch\u1edd cho ph\u00e9p v\u1ecb tr\u00ed) -> kh\u00f4ng \u0111\u1ee9ng im
      geoOrig((p) => { clearTimeout(timer); geoLast = { p, at: Date.now() }; res(p.coords); },
        () => { clearTimeout(timer); res(null); }, { enableHighAccuracy: true, timeout: 10e3, maximumAge: 0 });
    });
  }
  async function rqRegister(date, idx, label) {
    const runAt = st.runAt;
    setStatus(L(`${label} \u4f4d\u7f6e\u60c5\u5831\u3068\u8a8d\u8a3c\u3092\u6e96\u5099\u4e2d\u2026`, `${label}: \u0111ang l\u1ea5y GPS + token\u2026`));
    const gps = await rqGps();
    const ts = gps && isCurrentRun(runAt) ? await tsTake() : null;
    if (!isCurrentRun(runAt)) return { status: 0, stop: true, notSent: true, data: { message: '申込を停止しました' } };
    if (!gps) return { status: 0, stop: true, notSent: true, data: { message: L('\u4f4d\u7f6e\u60c5\u5831\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\uff08Safari \u306e\u4f4d\u7f6e\u60c5\u5831\u3092\u8a31\u53ef\u3057\u3066\u304f\u3060\u3055\u3044\uff09', 'kh\u00f4ng l\u1ea5y \u0111\u01b0\u1ee3c v\u1ecb tr\u00ed GPS (h\u00e3y cho Safari d\u00f9ng v\u1ecb tr\u00ed)') } };
    if (!ts && /KEY|BALANCE|ZERO|DENIED|INVALID/i.test(capLastErr)) return { status: 0, stop: true, notSent: true, data: { message: L('CapSolver \u30ad\u30fc\u304c\u7121\u52b9\u307e\u305f\u306f\u6b8b\u9ad8\u4e0d\u8db3: ', 'key CapSolver sai ho\u1eb7c h\u1ebft ti\u1ec1n: ') + capLastErr } };
    if (!ts) return { status: 0, notSent: true, data: { message: L('Turnstile \u30c8\u30fc\u30af\u30f3\u306a\u3057', 'kh\u00f4ng c\u00f3 token Cloudflare') } };
    tsUsed.add(ts);
    const body = JSON.stringify({ slotDate: date, slotIndex: idx, deviceFingerprint: pageFp(), gpsLat: gps.latitude, gpsLng: gps.longitude, turnstileToken: ts });
    for (let k = 0; k < 2; k++) {
      if (!isCurrentRun(runAt)) return { status: 0, stop: true, notSent: k === 0, data: { message: '申込を停止しました' } };
      // m\u00e1y ch\u1ee7 hay tr\u1ea3 l\u1eddi \u1edf gi\u00e2y 16\u201319 l\u00fac \u0111\u00f4ng -> ch\u1edd t\u1edbi 30 gi\u00e2y (trang ch\u1ec9 ch\u1edd 20 gi\u00e2y r\u1ed3i b\u1ecf)
      const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 30e3), t0 = Date.now();
      log(L(`${label} \u9001\u4fe1 \u2192 \u30b5\u30fc\u30d0\u30fc\u306e\u5fdc\u7b54\u5f85\u3061\uff08\u6700\u592730\u79d2\uff09`, `${label}: \u0111\u00e3 g\u1eedi \u2192 ch\u1edd m\u00e1y ch\u1ee7 tr\u1ea3 l\u1eddi (t\u1ed1i \u0111a 30 gi\u00e2y)`));
      const tick = setInterval(() => isCurrentRun(runAt) && setStatus(L(`${label} \u5fdc\u7b54\u5f85\u3061 ${Math.round((Date.now() - t0) / 1000)}\u79d2`, `${label}: ch\u1edd m\u00e1y ch\u1ee7 ${Math.round((Date.now() - t0) / 1000)} gi\u00e2y`)), 1000);
      try {
        regSent();
        const r = await _fetch('/api/registrations', { method: 'POST', credentials: 'include', signal: ac.signal,
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getTok() }, body });
        const t = await r.text();
        let j = {};
        try { j = JSON.parse(t) || {}; } catch (e) {}
        if (r.status === 401 && k === 0 && await rqRefresh()) continue;   // phi\u00ean h\u1ebft h\u1ea1n -> l\u00e0m m\u1edbi r\u1ed3i g\u1eedi l\u1ea1i 1 l\u1ea7n
        return { status: r.status, data: j };
      } catch (e) {
        return { status: 0, data: { message: e.name === 'AbortError' ? L('\u5fdc\u7b54\u306a\u3057(30\u79d2)', 'kh\u00f4ng ph\u1ea3n h\u1ed3i (30 gi\u00e2y)') : e.message } };
      } finally { clearTimeout(tm); clearInterval(tick); }
    }
    return { status: 401, data: {} };
  }
  async function rqTry(date, t, slotIndex) {
    const idx = slotIndex ?? (SLOTS.indexOf(t) + 1);
    const t0 = Date.now();
    const r = await rqRegister(date, idx, `${date.slice(5).replace('-', '/')} ${t}`);
    // A lost POST response is ambiguous. Retrying it can register twice.
    const out = r.status ? parseReg(r)
      : r.notSent ? { kind: r.stop ? 'stop' : 'error', notSent: true, note: r.data.message || '' }
      : unknownRegistration();
    if (st.active && out.kind !== 'won' && out.kind !== 'stop') tsFill(TS_POOL);   // c\u00f2n th\u1eed ti\u1ebfp m\u1edbi gi\u1ea3i b\u00f9 token (tr\u00fang r\u1ed3i th\u00ec th\u00f4i, \u0111\u1ee1 t\u1ed1n)
    out.note = `${out.note} \u00b7 ${Date.now() - t0}ms`;
    return out;
  }

  // ================= Ch\u1ebf \u0111\u1ed9 =================
  // st.mode: 'wait' (ch\u1edd ng\u00e0y m\u1edbi 13:00) | 'run' (\u0111ang \u0111\u1eb7t) ; st.active
  const st = load(K_STATE, { active: false });

  // gi\u1eef m\u00e0n h\u00ecnh s\u00e1ng khi ch\u1edd / \u0111ang \u0111\u1eb7t (Safari kh\u00f3a m\u00e0n h\u00ecnh = trang ng\u1ee7, BOT kh\u00f4ng ch\u1ea1y)
  let wakeLock = null;
  async function keepAwake() {
    try { if (st.active && !wakeLock && navigator.wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') keepAwake(); });
  async function modeWait() {
    if (!clockSampleAt) apiDates().catch(() => {});
    setStatus(L('13:00 \u5f85\u6a5f\u4e2d', 'Ch\u1edd 13:00 gi\u1edd Nh\u1eadt'));
    keepAwake();
    if (!st.openAt) { st.openAt = nextOpenAt(); save(K_STATE, st); }
    let resampled = false;
    let lastTick = Date.now(), pollStartLogged = false, pollN = 0, errN = 0, errLogAt = 0, beatAt = 0;
    while (st.active && st.mode === 'wait') {
      // Safari cho trang "ng\u1ee7" (kh\u00f3a m\u00e0n h\u00ecnh / chuy\u1ec3n app / tab n\u1ec1n) -> v\u00f2ng l\u1eb7p \u0111\u1ee9ng; th\u1ee9c d\u1eady th\u00ec b\u00e1o cho bi\u1ebft
      const gap = Date.now() - lastTick; lastTick = Date.now();
      if (gap > 5000) log(L(`\u26a0\ufe0f \u30da\u30fc\u30b8\u304c ${Math.round(gap / 1000)}\u79d2 \u505c\u6b62\u3057\u3066\u3044\u307e\u3057\u305f\uff08\u753b\u9762\u30ed\u30c3\u30af / Safari \u3092\u88cf\u306b\u56de\u3057\u305f\uff09`, `\u26a0\ufe0f Trang b\u1ecb Safari cho ng\u1ee7 ${Math.round(gap / 1000)} gi\u00e2y (kh\u00f3a m\u00e0n h\u00ecnh / chuy\u1ec3n app) \u2013 BOT kh\u00f4ng ch\u1ea1y trong l\u00fac \u0111\u00f3`));
      const left = msToOpen();
      if (!resampled && left <= 60e3 && left > WATCH_FROM_SEC * 1000) {
        resampled = true;
        apiDates().catch(() => {});
      }
      if (left < 60e3) { tsFill(TS_POOL); geoWarm(); rqWarmToken(); }   // t\u1eeb 12:59:00 gi\u1ea3i s\u1eb5n token CapSolver + \u0111o s\u1eb5n GPS + l\u00e0m m\u1edbi phi\u00ean
      if (left > WATCH_FROM_SEC * 1000) {
        const s = Math.ceil(left / 1000);
        setStatus(L('\u30b9\u30bf\u30fc\u30c8\u307e\u3067 ', 'C\u00f2n t\u1edbi 13:00 ') + `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);
        await sleep(Math.min(1000, left - WATCH_FROM_SEC * 1000));
        continue;
      }
      if (left < -10 * 60e3) {
        finish(L(`13:10\u307e\u3067\u65b0\u3057\u3044\u65e5\u4ed8\u306a\u3057 \u2192 \u505c\u6b62\uff08\u78ba\u8a8d ${pollN}\u56de\u30fb\u30a8\u30e9\u30fc ${errN}\u56de\uff09`, `Qu\u00e1 13:10 ch\u01b0a th\u1ea5y ng\u00e0y m\u1edbi \u2013 d\u1eebng (\u0111\u00e3 d\u00f2 ${pollN} l\u1ea7n, l\u1ed7i ${errN} l\u1ea7n)`)); beep(1); return;
        return;
      }
      if (!pollStartLogged) {
        pollStartLogged = true;
        log(L(`\u65b0\u3057\u3044\u65e5\u4ed8\u306e\u78ba\u8a8d\u3092\u958b\u59cb\uff08\u4eca\u3042\u308b\u65e5\u4ed8: ${st.known.map((d) => d.slice(5)).join(', ') || '\u306a\u3057'}\uff09`, `B\u1eaft \u0111\u1ea7u d\u00f2 ng\u00e0y m\u1edbi (ng\u00e0y \u0111ang c\u00f3: ${st.known.map((d) => d.slice(5)).join(', ') || 'kh\u00f4ng c\u00f3'})`));
      }
      if (Date.now() - beatAt > 10e3) {        // 10 gi\u00e2y 1 d\u00f2ng: cho bi\u1ebft BOT v\u1eabn \u0111ang d\u00f2
        if (beatAt) log(L(`\u78ba\u8a8d\u4e2d\u2026 ${pollN}\u56de\uff08\u30a8\u30e9\u30fc ${errN}\u56de\uff09`, `V\u1eabn \u0111ang d\u00f2 ng\u00e0y m\u1edbi\u2026 ${pollN} l\u1ea7n (l\u1ed7i ${errN} l\u1ea7n)`));
        beatAt = Date.now();
      }
      tsFill(TS_POOL);                        // 12:59:50: gi\u1ea3i s\u1eb5n token, ng\u00e0y m\u1edbi ra l\u00e0 b\u1ea5m \u0111\u01b0\u1ee3c ngay
      setStatus(L('\u65b0\u3057\u3044\u65e5\u4ed8\u3092\u78ba\u8a8d\u4e2d\u2026', '\u0110ang d\u00f2 ng\u00e0y m\u1edbi\u2026'));
      // nh\u01b0 b\u1ea3n PC: c\u1ee9 POLL_MS b\u1eafn 1 l\u01b0\u1ee3t h\u1ecfi bookable-dates, KH\u00d4NG ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc tr\u1ea3 l\u1eddi
      // (m\u00e1y ch\u1ee7 l\u00fac 13:00 c\u00f3 khi tr\u1ea3 l\u1eddi 2\u20138 gi\u00e2y); l\u01b0\u1ee3t n\u00e0o th\u1ea5y ng\u00e0y m\u1edbi tr\u01b0\u1edbc th\u00ec ch\u1ea1y ngay
      if (pollInflight < POLL_MAX_INFLIGHT) {
        pollInflight++;
        pollN++;
        apiDates().then((dates) => {
          const fresh = dates.filter((d) => !st.known.includes(d));
          if (fresh.length && !pollFound) { pollFound = fresh; if (pollWake) pollWake(); }
        }).catch((e) => {
          errN++;
          setStatus(L('\u8aad\u307f\u8fbc\u307f\u30a8\u30e9\u30fc: ', 'L\u1ed7i \u0111\u1ecdc: ') + e.message);
          // tr\u01b0\u1edbc \u0111\u00e2y l\u1ed7i ch\u1ec9 hi\u1ec7n \u1edf d\u00f2ng tr\u1ea1ng th\u00e1i, log tr\u1ed1ng tr\u01a1n -> ghi log (5 gi\u00e2y t\u1ed1i \u0111a 1 d\u00f2ng)
          if (Date.now() - errLogAt > 5000) { errLogAt = Date.now(); log(L('\u65e5\u4ed8\u306e\u8aad\u307f\u8fbc\u307f\u30a8\u30e9\u30fc: ', 'L\u1ed7i \u0111\u1ecdc danh s\u00e1ch ng\u00e0y: ') + e.message); }
        }).finally(() => { pollInflight--; });
      }
      await new Promise((r) => { pollWake = r; setTimeout(r, POLL_MS); });
      if (pollFound && st.active && st.mode === 'wait') {
        const fresh = pollFound; pollFound = null;
        log(L('\u65b0\u3057\u3044\u65e5\u4ed8: ', 'Ng\u00e0y m\u1edbi: ') + fresh.map((d) => d.slice(5).replace('-', '/')).join(', '));
        st.mode = 'run'; st.dates = fresh; st.fresh = true; st.reloads = 0; st.tDetect = Date.now(); st.runAt = Date.now(); save(K_STATE, st);
        if (useRq() || findDateTab(fresh[0]) || await refreshDates(fresh[0])) return modeRun();
        return;
      }
    }
  }
  async function modeRun() {
    const runAt = st.runAt;
    setStatus(L('\u7533\u8fbc\u4e2d\u2026', '\u0110ang \u0111\u0103ng k\u00fd\u2026'));
    tsFill(1); geoWarm();
    try {
      if (!useRq()) {
        setStatus(L('\u65e5\u4ed8\u30dc\u30bf\u30f3\u306e\u8868\u793a\u3092\u5f85\u3063\u3066\u3044\u307e\u3059\u2026', '\u0110ang ch\u1edd trang hi\u1ec7n c\u00e1c ng\u00e0y\u2026'));
        const ok = await waitFor(() => findDateTab(st.dates[0]) || btns().some((b) => /\d+\/\d+/.test(txt(b))), 10000);
        if (!ok) log(L('10\u79d2\u5f85\u3063\u3066\u3082\u65e5\u4ed8\u30dc\u30bf\u30f3\u304c\u51fa\u307e\u305b\u3093\uff08\u30ed\u30b0\u30a4\u30f3\u72b6\u614b\u3092\u78ba\u8a8d\uff09', 'Ch\u1edd 10 gi\u00e2y v\u1eabn kh\u00f4ng th\u1ea5y n\u00fat ng\u00e0y (ki\u1ec3m tra \u0111\u00e3 \u0111\u0103ng nh\u1eadp ch\u01b0a)'));
      }
      if (isCurrentRun(runAt)) await runDates(st.dates);
    } catch (e) {
      if (!isCurrentRun(runAt)) return;
      finish(L('\u30a8\u30e9\u30fc\u3067\u505c\u6b62: ', 'D\u1eebng v\u00ec l\u1ed7i: ') + (e && e.message || e)); beep(1);
    }
  }

  async function startWait() {
    if (!isRegisterPage()) { log(L('\u6765\u5e97\u65e5\u306e\u753b\u9762\u3092\u958b\u3044\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y m\u1edf m\u00e0n h\u00ecnh ch\u1ecdn ng\u00e0y \u0111\u1ebfn (\u6765\u5e97\u65e5)')); return; }
    let known = [];
    try { known = await apiDates(); } catch (e) { log(L('\u65e5\u4ed8\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093: ', 'Kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c danh s\u00e1ch ng\u00e0y: ') + e.message); return; }
    Object.assign(st, { active: true, mode: 'wait', known, dates: [], fresh: false, tDetect: 0, reloads: 0, postPending: false, openAt: nextOpenAt() });
    save(K_STATE, st);
    const tomorrow = jstNow().getUTCHours() * 60 + jstNow().getUTCMinutes() >= OPEN_H * 60 + OPEN_M;
    log(L(`13:00 \u81ea\u52d5\u30b9\u30bf\u30fc\u30c8\uff1a\u5f85\u6a5f\u958b\u59cb\uff08${tomorrow ? '\u660e\u65e5' : '\u4eca\u65e5'}\u306e13:00\u30fb\u4eca\u3042\u308b\u65e5\u4ed8 ${known.length}\u4ef6\uff09`,
          `B\u1eaft \u0111\u1ea7u ch\u1edd ng\u00e0y m\u1edbi l\u00fac 13:00 ${tomorrow ? 'NG\u00c0Y MAI' : 'h\u00f4m nay'} (\u0111ang c\u00f3 ${known.length} ng\u00e0y). Gi\u1eef Safari m\u1edf, m\u00e0n h\u00ecnh s\u00e1ng`));
    modeWait();
  }
  async function startNow() {
    if (!isRegisterPage()) { log(L('\u6765\u5e97\u65e5\u306e\u753b\u9762\u3092\u958b\u3044\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y m\u1edf m\u00e0n h\u00ecnh ch\u1ecdn ng\u00e0y \u0111\u1ebfn (\u6765\u5e97\u65e5)')); return; }
    let dates = [];
    try { dates = await apiDates(); } catch (e) { log(L('\u65e5\u4ed8\u3092\u8aad\u307f\u8fbc\u3081\u307e\u305b\u3093: ', 'Kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c danh s\u00e1ch ng\u00e0y: ') + e.message); return; }
    if (!dates.length) { log(L('\u7533\u8fbc\u3067\u304d\u308b\u65e5\u4ed8\u304c\u3042\u308a\u307e\u305b\u3093', 'Hi\u1ec7n kh\u00f4ng c\u00f3 ng\u00e0y n\u00e0o \u0111\u1ec3 \u0111\u0103ng k\u00fd')); return; }
    Object.assign(st, { active: true, mode: 'run', dates, fresh: false, tDetect: 0, reloads: 0, postPending: false, openAt: 0, runAt: Date.now() });
    save(K_STATE, st);
    keepAwake();
    log(L(`\u3059\u3050\u5b9f\u884c\uff1a\u958b\u59cb\uff08${dates.map((d) => d.slice(5)).join(', ')}\uff09`, `Ch\u1ea1y Ngay: \u0111\u0103ng k\u00fd t\u1eeb c\u00e1c ng\u00e0y \u0111ang c\u00f3 (${dates.map((d) => d.slice(5).replace('-', '/')).join(', ')})`));
    modeRun();
  }
  function finish(msg) {
    st.active = false; st.mode = null; st.tDetect = 0; st.openAt = 0; save(K_STATE, st);
    geoStop();
    try { if (wakeLock) { wakeLock.release(); wakeLock = null; } } catch (e) {}
    log(msg); setStatus(msg);
  }
  function stop() { resultWaiter = null; finish(L('\u505c\u6b62\u3057\u307e\u3057\u305f', '\u0110\u00e3 d\u1eebng')); }

  function beep(n) {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      for (let i = 0; i < n; i++) { const o = a.createOscillator(); o.frequency.value = 880; o.connect(a.destination); o.start(a.currentTime + i * 0.5); o.stop(a.currentTime + i * 0.5 + 0.3); }
    } catch (e) {}
  }
  const isRegisterPage = () => /\/register/.test(location.pathname) || !!btns().find((b) => /^(\u6708|\u706b|\u6c34|\u6728|\u91d1|\u571f|\u65e5)\s*\d+\/\d+/.test(txt(b)));

  // ================= B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n =================
  let logBuf = load(K_LOG, []);
  function log(m) {
    const n = jstNow();
    const iso = n.toISOString();                   // gi\u1edd Nh\u1eadt: MM/DD HH:MM:SS.mmm
    const line = `${iso.slice(5, 7)}/${iso.slice(8, 10)} ${iso.slice(11, 23)} ${m}`;
    logBuf.unshift(line); logBuf = logBuf.slice(0, 300); save(K_LOG, logBuf);
    const el = document.getElementById('pjlog'); if (el) el.textContent = logBuf.join('\n');
    const last = document.getElementById('pjlast'); if (last) last.textContent = m;
  }
  function setStatus(s) { const el = document.getElementById('pjst'); if (el) el.textContent = s; }

  function buildUI() {
    if (document.getElementById('pjbox')) return;
    const ui = load(K_UI, { top: true, small: false });
    const box = document.createElement('div');
    box.id = 'pjbox';
    box.innerHTML = `
<style>
#pjbox{position:fixed;left:8px;right:8px;z-index:2147483647;background:#0d1b32;color:#f2f2f2;border:1px solid #527198;
  border-radius:16px;box-shadow:0 6px 24px #000c;padding:10px 12px;font:13px -apple-system,"Hiragino Sans",sans-serif}
#pjbox.top{top:calc(env(safe-area-inset-top) + 6px)} #pjbox.bot{bottom:calc(env(safe-area-inset-bottom) + 70px)}
#pjbox .hd{display:flex;align-items:center;gap:6px;font-weight:700}
#pjbox .hd button.pj{padding:6px 7px;font-size:12px;white-space:nowrap;flex:none}
#pjbox .hd b{flex:1}
#pjbox .ttl{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
#pjbox .ver{font-size:10px;font-weight:600;color:#b7c8df;letter-spacing:.5px;margin-top:1px;line-height:1}
#pjbox button.pj{border:1px solid #527198;background:#203a5d;color:#ffffff;border-radius:10px;padding:7px 10px;font-size:13px;font-weight:700;
  text-shadow:none;box-shadow:none}
#pjbox button.pj.main{background:linear-gradient(180deg,#e8f0fc,#ffffff);color:#10213b;border:0;box-shadow:0 2px 10px #ffffff40}
#pjbox button.pj.on{background:#284c75;border-color:#ffffff;color:#ffffff}
#pjbox .row{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}
#pjbox .desc{font-size:12px;color:#c2d1e5;margin-top:4px}
#pjbox .st{font-size:12px;color:#ffffff;margin-top:4px;font-weight:700}
#pjbox.small .body{display:none}
#pjbox button,#pjbox input,#pjbox select{font-family:-apple-system,"Hiragino Sans",sans-serif}
#pjlog{display:block;max-height:220px;overflow:auto;white-space:pre-wrap;font:11px ui-monospace,monospace;background:#10213b;color:#cfdeef;border:1px solid #385573;border-radius:8px;padding:6px;margin-top:6px}
#pjcapk{flex:1;min-width:0;box-sizing:border-box;background:#10213b;color:#f2f2f2;border:1px solid #527198;border-radius:10px;padding:8px 10px;
  font:13px ui-monospace,monospace;-webkit-appearance:none}
#pjbox a.pj{display:block;flex:1;text-align:center;text-decoration:none;border:1px solid #527198;background:#203a5d;color:#ffffff;
  border-radius:10px;padding:8px 10px;font-size:13px;font-weight:700}
#pjgrid{display:none;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-top:6px}
#pjgrid button{border:1px solid #3a3a44;border-radius:8px;padding:6px 2px;background:#162a46;color:#ffffff;font-size:12px}
#pjgrid button.p{background:linear-gradient(180deg,#e8f0fc,#ffffff);color:#10213b;border-color:#ffffff;font-weight:700}
#pjgrid button.x{background:#111;color:#666;text-decoration:line-through}
</style>
<div class="hd">${ICON_TAG}<b class="ttl">${TITLE_TAG}<span class="ver">v${SYNOVA_VERSION}</span></b>
  <button class="pj" id="pjpos">${L('\u4e0a\u4e0b', 'L\u00ean/Xu\u1ed1ng')}</button><button class="pj" id="pjsmall">${L('\u96a0\u3059', '\u1ea8n')}</button></div>
<div class="st" id="pjst"></div>
<div class="body">
  <div class="desc">${L('12:59:50\u304b\u3089\u81ea\u52d5\u3067\u7533\u8fbc\u307f\uff08\u65b0\u3057\u3044\u65e5\u4ed8 \u2192 \u512a\u5148\u306e\u6642\u9593 \u2192 \u62bd\u9078\u306b\u53c2\u52a0 \u2192 \u540c\u610f\uff09\u3002\u300c\u3059\u3050\u5b9f\u884c\u300d= \u4eca\u3042\u308b\u65e5\u4ed8\u3067\u4eca\u3059\u3050\u7533\u8fbc\u307f\u3002\u5f85\u6a5f\u4e2d\u306f Safari \u3092\u958b\u3044\u305f\u307e\u307e\u753b\u9762\u3092\u3064\u3051\u3066\u304a\u3044\u3066\u304f\u3060\u3055\u3044',
    'T\u1eeb 12:59:50 (gi\u1edd Nh\u1eadt) t\u1ef1 d\u00f2 \u2192 ch\u1ecdn ng\u00e0y m\u1edbi \u2192 khung \u01b0u ti\u00ean \u2192 \u62bd\u9078\u306b\u53c2\u52a0 \u2192 \u540c\u610f. "Ch\u1ea1y Ngay" = \u0111\u0103ng k\u00fd ngay v\u1edbi c\u00e1c ng\u00e0y \u0111ang c\u00f3. L\u00fac ch\u1edd: \u0111\u1ec3 Safari m\u1edf \u1edf trang n\u00e0y, m\u00e0n h\u00ecnh s\u00e1ng.')}</div>
  <div class="row">
    <button class="pj main" id="pjwait">${L('13:00 \u81ea\u52d5\u30b9\u30bf\u30fc\u30c8', 'Ch\u1edd ng\u00e0y m\u1edbi l\u00fac 13:00')}</button>
    <button class="pj main" id="pjnow">${L('\u3059\u3050\u5b9f\u884c', 'Ch\u1ea1y Ngay')}</button>
  </div>
  <div class="row">
    <button class="pj" id="pjstop">${L('\u505c\u6b62', '\u0110\u00f3ng / D\u1eebng')}</button>
    <button class="pj" id="pjlogb">${L('\u30ed\u30b0\u3092\u898b\u308b', 'Xem Log')}</button>
    <button class="pj" id="pjset">${L('\u6642\u9593\u306e\u8a2d\u5b9a', 'C\u00e0i khung gi\u1edd')}</button>
    <button class="pj" id="pjcap">CapSolver</button>
  </div>
  <div class="desc" id="pjlast"></div>
  <div id="pjgrid"></div>
  <div id="pjcapw" style="display:none">
    <div class="desc">${L('\u81ea\u5206\u306e CapSolver \u30ad\u30fc\u3092\u5165\u529b\uff08Turnstile \u81ea\u52d5\u89e3\u6c7a\u30fb1\u56de \u7d04$0.0012\uff09\u3002\u7a7a\u6b04 = \u8a8d\u8a3c\uff08\u30c1\u30a7\u30c3\u30af\uff09\u3092\u81ea\u5206\u3067\u30bf\u30c3\u30d7', 'Nh\u1eadp key CapSolver c\u1ee7a b\u1ea1n (t\u1ef1 gi\u1ea3i Turnstile, ~$0.0012/l\u01b0\u1ee3t). \u0110\u1ec3 tr\u1ed1ng = b\u1ea1n ph\u1ea3i t\u1ef1 b\u1ea5m \u00f4 x\u00e1c nh\u1eadn Cloudflare')}</div>
    <div class="row"><input id="pjcapk" type="text" placeholder="CAP-..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></div>
    <div class="row">
      <button class="pj main" id="pjcaps">${L('\u4fdd\u5b58', 'L\u01b0u key')}</button>
      <button class="pj" id="pjcapb">${L('\u6b8b\u9ad8', 'Xem s\u1ed1 d\u01b0')}</button>
      <button class="pj" id="pjcapx">${L('\u524a\u9664', 'X\u00f3a key')}</button>
    </div>
    <div class="row"><a class="pj" id="pjcapbuy" href="https://dashboard.capsolver.com/dashboard/overview" target="_blank" rel="noopener">\ud83d\udd17 ${L('CapSolver \u3067\u30ad\u30fc\u53d6\u5f97\u30fb\u30c1\u30e3\u30fc\u30b8', 'Mua / n\u1ea1p ti\u1ec1n key CapSolver')}</a></div>
    <div class="desc" id="pjcapst"></div>
  </div>
  <div id="pjlogw" style="display:none"><div class="row"><button class="pj" id="pjclr">${L('\u30ed\u30b0\u6d88\u53bb', 'X\u00f3a log')}</button></div><div id="pjlog"></div></div>
</div>`;
    document.body.appendChild(box);
    const bub = synovaBubble('pjbub', () => { ui.hide = false; apply(); });
    const apply = () => {
      box.className = ui.top ? 'top' : 'bot';
      box.style.display = ui.hide ? 'none' : '';
      if (ui.hide) bub.show(ui.top, st.active); else bub.hide();
      save(K_UI, ui);
    };
    apply();
    const $ = (id) => document.getElementById(id);
    $('pjpos').onclick = () => { ui.top = !ui.top; apply(); };
    $('pjsmall').onclick = () => { ui.hide = true; apply(); };
    setInterval(() => { if (ui.hide) bub.show(ui.top, st.active); }, 1000);
    $('pjwait').onclick = () => { if (!st.active) { log(L('13:00 \u81ea\u52d5\u30b9\u30bf\u30fc\u30c8\u3092\u62bc\u3057\u307e\u3057\u305f', '\u0110\u00e3 b\u1ea5m Ch\u1edd 13:00')); startWait(); } else log(L('BOT \u5b9f\u884c\u4e2d\u3067\u3059\uff08\u3084\u308a\u76f4\u3059\u5834\u5408\u306f\u5148\u306b\u505c\u6b62\uff09', 'BOT \u0111ang ch\u1ea1y (mu\u1ed1n ch\u1ea1y l\u1ea1i th\u00ec b\u1ea5m D\u1eebng tr\u01b0\u1edbc)')); };
    // Ch\u1ea1y Ngay: b\u1ea5m \u0111\u01b0\u1ee3c c\u1ea3 khi \u0111ang ch\u1edd 13:00 (b\u1ecf ch\u1edd, \u0111\u0103ng k\u00fd lu\u00f4n v\u1edbi c\u00e1c ng\u00e0y \u0111ang c\u00f3)
    $('pjnow').onclick = () => {
      if (!st.active) { log(L('\u3059\u3050\u5b9f\u884c\u3092\u62bc\u3057\u307e\u3057\u305f', '\u0110\u00e3 b\u1ea5m Ch\u1ea1y Ngay')); startNow(); return; }
      if (st.mode === 'wait') { st.mode = null; save(K_STATE, st); log(L('\u5f85\u6a5f\u3092\u3084\u3081\u3066\u4eca\u3059\u3050\u5b9f\u884c', 'B\u1ecf ch\u1edd 13:00 \u2013 ch\u1ea1y ngay')); startNow(); }
      else log(L('BOT \u5b9f\u884c\u4e2d\u3067\u3059\uff08\u3084\u308a\u76f4\u3059\u5834\u5408\u306f\u5148\u306b\u505c\u6b62\uff09', 'BOT \u0111ang ch\u1ea1y (mu\u1ed1n ch\u1ea1y l\u1ea1i th\u00ec b\u1ea5m D\u1eebng tr\u01b0\u1edbc)'));
    };
    $('pjstop').onclick = () => { if (st.active) stop(); else { ui.hide = true; apply(); } };
    $('pjlogb').onclick = () => { const w = $('pjlogw'); w.style.display = w.style.display === 'block' ? 'none' : 'block'; $('pjlog').textContent = logBuf.join('\n'); };
    $('pjclr').onclick = () => { logBuf = []; save(K_LOG, logBuf); $('pjlog').textContent = ''; $('pjlast').textContent = ''; };
    $('pjset').onclick = () => { const g = $('pjgrid'); const on = g.style.display !== 'grid'; g.style.display = on ? 'grid' : 'none'; $('pjset').classList.toggle('on', on); drawGrid(); };
    // CapSolver: m\u1ed7i ng\u01b0\u1eddi nh\u1eadp key ri\u00eang, l\u01b0u tr\u00ean m\u00e1y (localStorage), kh\u00f4ng g\u1eedi \u0111i \u0111\u00e2u ngo\u00e0i api.capsolver.com
    const mask = (k) => k.slice(0, 8) + '\u2026' + k.slice(-4);
    const capSt = (m) => { $('pjcapst').textContent = m; };
    const capBtn = () => {
      const k = capKey();
      $('pjcap').textContent = 'CapSolver ' + (k ? '\u2713' : '\u2715');
      $('pjcap').classList.toggle('on', !!k);
      capSt(k ? L('\u4f7f\u7528\u4e2d\u306e\u30ad\u30fc: ', '\u0110ang d\u00f9ng key: ') + mask(k) : L('\u30ad\u30fc\u306a\u3057\uff08\u8a8d\u8a3c\u306f\u624b\u52d5\u30bf\u30c3\u30d7\uff09', 'Ch\u01b0a c\u00f3 key (t\u1ef1 b\u1ea5m \u00f4 x\u00e1c nh\u1eadn)'));
    };
    async function capBalance() {
      const key = capKey();
      if (!key) { capSt(L('\u30ad\u30fc\u306a\u3057', 'Ch\u01b0a c\u00f3 key')); return; }
      capSt(L('\u6b8b\u9ad8\u3092\u78ba\u8a8d\u4e2d\u2026', '\u0110ang xem s\u1ed1 d\u01b0\u2026'));
      try {
        const j = await capApi('getBalance', { clientKey: key });
        const m = L(`\u6b8b\u9ad8 $${j.balance}\uff08\u7d04 ${Math.floor(j.balance / CAP_PRICE)} \u56de\uff09`, `S\u1ed1 d\u01b0 $${j.balance} (~${Math.floor(j.balance / CAP_PRICE)} l\u01b0\u1ee3t gi\u1ea3i)`);
        capSt(mask(key) + ' \u00b7 ' + m); log('CapSolver ' + m);
      } catch (e) { capSt(L('\u30a8\u30e9\u30fc: ', 'L\u1ed7i: ') + e.message); }
    }
    capBtn();
    $('pjcap').onclick = () => {
      const w = $('pjcapw'), on = w.style.display !== 'block';
      w.style.display = on ? 'block' : 'none';
      if (on) { $('pjcapk').value = String(load(K_CAP, '') || ''); capBtn(); }
    };
    $('pjcaps').onclick = () => {
      const v = $('pjcapk').value.replace(/\s+/g, '');
      if (v && !/^CAP-[0-9A-F]{20,}$/i.test(v)) { capSt(L('\u30ad\u30fc\u306e\u5f62\u5f0f\u304c\u9055\u3044\u307e\u3059\uff08CAP-\u2026\uff09', 'Key kh\u00f4ng \u0111\u00fang d\u1ea1ng (CAP-\u2026)')); return; }
      save(K_CAP, v); capErrUntil = 0; tsPool = []; capBtn();
      if (v) capBalance();
    };
    $('pjcapb').onclick = capBalance;
    $('pjcapx').onclick = () => { save(K_CAP, ''); $('pjcapk').value = ''; tsPool = []; capBtn(); };
    $('pjlast').textContent = logBuf[0] ? logBuf[0].replace(/^\S+ \S+ /, '') : '';
    setStatus(st.active ? (st.mode === 'wait' ? L('13:00 \u5f85\u6a5f\u4e2d', 'Ch\u1edd 13:00 gi\u1edd Nh\u1eadt') : L('\u7533\u8fbc\u4e2d\u2026', '\u0110ang \u0111\u0103ng k\u00fd\u2026')) : L('\u505c\u6b62\u4e2d', '\u0110ang t\u1eaft'));
  }

  // B\u1ea5m 1 l\u1ea7n -> \u512a\u5148 N (s\u1ed1 ti\u1ebfp theo), l\u1ea7n n\u1eefa -> \u9664\u5916, l\u1ea7n n\u1eefa -> \u901a\u5e38
  function drawGrid() {
    const g = document.getElementById('pjgrid');
    const prio = load(K_PRIO, {});
    g.innerHTML = '';
    for (const t of SLOTS) {
      const b = document.createElement('button');
      const v = prio[t];
      b.textContent = `${t}  ${typeof v === 'number' ? L('\u512a\u5148', '\u01afu ti\u00ean ') + v : v === 'x' ? L('\u9664\u5916', 'B\u1ecf') : L('\u901a\u5e38', 'Th\u01b0\u1eddng')}`;
      if (typeof v === 'number') b.className = 'p'; else if (v === 'x') b.className = 'x';
      b.onclick = () => {
        const p = load(K_PRIO, {});
        if (p[t] == null) { const nums = Object.values(p).filter((x) => typeof x === 'number'); p[t] = (nums.length ? Math.max(...nums) : 0) + 1; }
        else if (typeof p[t] === 'number') {
          const n = p[t]; p[t] = 'x';
          for (const k in p) if (typeof p[k] === 'number' && p[k] > n) p[k]--;    // d\u1ed3n s\u1ed1 \u01b0u ti\u00ean
        } else delete p[t];
        save(K_PRIO, p); drawGrid();
      };
      g.appendChild(b);
    }
  }

  function boot() {
    buildUI();
    if (st.active && st.mode === 'wait') modeWait();
    else if (st.active && st.mode === 'run') {
      if (st.postPending) { finish(unknownRegistration().note); return; }
      if (Date.now() - (st.runAt || 0) > 10 * 60e3) finish(L('\u524d\u56de\u306e\u7533\u8fbc\u306f\u9014\u4e2d\u3067\u6b62\u307e\u3063\u3066\u3044\u307e\u3057\u305f \u2192 \u30ea\u30bb\u30c3\u30c8\uff08\u3082\u3046\u4e00\u5ea6\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\uff09', 'L\u01b0\u1ee3t \u0111\u0103ng k\u00fd tr\u01b0\u1edbc b\u1ecb d\u1eebng gi\u1eefa ch\u1eebng \u2192 \u0111\u00e3 \u0111\u1eb7t l\u1ea1i, h\u00e3y b\u1ea5m ch\u1ea1y l\u1ea1i'));
      else modeRun();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

// ===================== \u30ab\u30fc\u30c8 (mellojoyjapan.com / mellojoyus.com) =====================
if (!SYNOVA_DUP && /mellojoy(japan|us)\.com$/.test(location.hostname)) {
  const pjcRun = () => (function () {
  'use strict';
  if (!document.body) return;

  const IS_US = /mellojoyus\.com$/.test(location.hostname);
  const SHOP = IS_US ? 'MellojoyUS' : 'MellojoyJapan';
  const WATCH_FROM_SEC = 1;             // b\u1eaft \u0111\u1ea7u qu\u00e9t 1 gi\u00e2y tr\u01b0\u1edbc gi\u1edd m\u1edf (11:59:59)
  const POLL_MS = 300;                  // nh\u1ecbp d\u00f2 th\u01b0\u1eddng (t\u00ednh t\u1eeb l\u00fac B\u1eaeT \u0110\u1ea6U l\u01b0\u1ee3t tr\u01b0\u1edbc)
  // H\u00e0ng MelloJoy th\u01b0\u1eddng l\u00ean l\u00fac 12:00:07\u201312:00:12 -> 11:59:59\u201312:00:07 qu\u00e9t nh\u1ecbp th\u01b0\u1eddng POLL_MS (0,3s),
  // 12:00:07\u201312:00:12 qu\u00e9t t\u1ed1c \u0111\u1ed9 cao: c\u1ee9 DENSE_MS (0,3s) g\u1eedi 1 l\u01b0\u1ee3t KH\u00d4NG ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc tr\u1ea3 l\u1eddi (m\u1ea1ng ch\u1eadm v\u1eabn gi\u1eef ~3 l\u01b0\u1ee3t/gi\u00e2y),
  // sau 12:00:12 l\u1ea1i nh\u1ecbp th\u01b0\u1eddng. 0,1s \u0111\u00e3 th\u1eed: b\u1ecb Shopify ch\u1eb7n c\u1ea3 IP h\u00e0ng ch\u1ee5c ph\u00fat (24/10).
  // c\u1ee9 DENSE_MS g\u1eedi 1 l\u01b0\u1ee3t, kh\u00f4ng ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc (t\u1ed1i \u0111a MAX_INFLIGHT l\u01b0\u1ee3t c\u00f9ng l\u00fac); l\u01b0\u1ee3t n\u00e0o th\u1ea5y h\u00e0ng tr\u01b0\u1edbc th\u00ec th\u00eam gi\u1ecf.
  const DENSE_MS = 300, DENSE_FROM_MS = 7000, DENSE_FOR_MS = 12000, MAX_INFLIGHT = 4;   // t\u1ed1c \u0111\u1ed9 cao 12:00:07 \u2192 12:00:12
  const monitorDelay = (value, minimum) => {
    const ms = Number(value);
    return Number.isFinite(ms) && ms > 0 ? Math.min(30000, Math.max(minimum, Math.round(ms))) : 0;
  };
  // 429: ngh\u1ec9 ng\u1eafn r\u1ed3i t\u0103ng d\u1ea7n 0,3 \u2192 0,6 \u2192 1,2 \u2192 t\u1ed1i \u0111a 2 gi\u00e2y; g\u1eedi \u0111\u01b0\u1ee3c l\u1ea1i th\u00ec v\u1ec1 0. C\u00f3 Retry-After th\u00ec theo (\u2264 2s)
  const BACKOFF_MIN = 300, BACKOFF_MAX = 2000;
  const GIVE_UP_MIN = 10;               // qu\u00e1 gi\u1edd m\u1edf 10 ph\u00fat kh\u00f4ng th\u1ea5y h\u00e0ng th\u00ec d\u1eebng
  // Mellojoy US KH\u00d4NG b\u00e1n gi\u1edd c\u1ed1 \u0111\u1ecbnh (m\u1edf theo LIVE TikTok c\u1ee7a k\u00eanh US, user b\u00e1o 29/10):
  // b\u1ea5m l\u00e0 canh li\u00ean t\u1ee5c t\u1edbi khi mua \u0111\u01b0\u1ee3c / b\u1ea5m D\u1eebng, nh\u1ecbp ch\u1eadm h\u01a1n \u0111\u1ec3 canh h\u00e0ng gi\u1edd li\u1ec1n kh\u00f4ng b\u1ecb Shopify ch\u1eb7n
  // 0,5s/l\u1ea7n l\u00fac th\u01b0\u1eddng; shop v\u1eeba thay \u0111\u1ed5i (\u0111\u0103ng m\u00f3n m\u1edbi, \u0111\u1ed5i t\u1ed3n kho\u2026) -> 0,3s trong 90 gi\u00e2y v\u00ec h\u00e0ng th\u01b0\u1eddng l\u00ean ngay sau \u0111\u00f3.
  // B\u1ecb 429 th\u00ec t\u1ef1 gi\u00e3n nh\u01b0 b\u1ea3n Nh\u1eadt (backoff).
  const US_POLL_MS = 500, US_BURST_MS = 300, US_BURST_FOR = 90e3;
  const K_US_RETRY_AT = 'pjc_us_retry_at_v1';
  let usSig = '', usBurstUntil = 0, usPoll = US_POLL_MS, usOk = 0;
  // Gi\u1edd m\u1edf b\u00e1n theo GI\u1edc \u0110I\u1ec6N THO\u1ea0I (gi\u1edd Vi\u1ec7t Nam). Nh\u1eadt: 12:00 JST = gi\u1edd m\u00e1y c\u1ee7a 03:00 UTC.
  const pad = (n) => String(n).padStart(2, '0');
  // M\u1ecdi gi\u1edd trong khung n\u00e0y l\u00e0 GI\u1edc NH\u1eacT (JST), kh\u00f4ng ph\u1ee5 thu\u1ed9c m\u00fai gi\u1edd \u0111i\u1ec7n tho\u1ea1i
  const jpDefault = '12:00', usDefault = '07:30';
  const jstNow = () => new Date(Date.now() + 9 * 3600e3);   // \u0111\u1ecdc b\u1eb1ng getUTC* = gi\u1edd JST
  const K_CFG = 'pjc_cfg_v1', K_ST = 'pjc_state_v1', K_UI = 'pjc_ui_v1', K_LOG = 'pjc_log_v2';

  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function msToOpen() {
    const [h, m] = (cfg.open || '').split(':').map(Number);
    const n = jstNow();
    let t = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), h, m, 0) - n;
    if (t < -GIVE_UP_MIN * 60e3) t += 86400e3;          // \u0111\u00e3 qua gi\u1edd m\u1edf h\u00f4m nay -> ch\u1edd ng\u00e0y mai
    return t;
  }

  // cfg.items: [{kw, qty}] x4 ; cfg.backup: {kw, qty} ; cfg.open: "HH:MM" gi\u1edd Nh\u1eadt (JST)
  const cfg = load(K_CFG, { items: [{ kw: '', qty: 1 }, { kw: '', qty: 1 }, { kw: '', qty: 1 }, { kw: '', qty: 1 }], backup: { kw: '', qty: 1 } });
  if (!cfg.openJst) { cfg.open = IS_US ? usDefault : jpDefault; cfg.openJst = true; }
  // s\u1ed1 \u00f4 t\u1eeb kh\u00f3a: m\u1eb7c \u0111\u1ecbnh 4, b\u1ea5m \uff0b th\u00eam t\u1edbi MAX_KW
  const MAX_KW = 10;
  while (cfg.items.length < MAX_KW) cfg.items.push({ kw: '', qty: 1 });
  if (!cfg.kwCount) cfg.kwCount = Math.max(4, cfg.items.reduce((n, it, i) => (it.kw.trim() ? i + 1 : n), 0));
  const st = load(K_ST, { active: false });
  if (/\/checkouts?\b/.test(location.pathname) && st.active) { st.active = false; save(K_ST, st); }
  if (IS_US && st.active && !st.now) { st.now = true; save(K_ST, st); }   // b\u1ea3n c\u0169 \u0111ang ch\u1edd gi\u1edd US -> chuy\u1ec3n sang canh li\u00ean t\u1ee5c

  // ---------- Kh\u1edbp t\u1eeb kh\u00f3a: c\u00e1ch nhau b\u1eb1ng d\u1ea5u c\u00e1ch = ph\u1ea3i ch\u1ee9a T\u1ea4T C\u1ea2 ----------
  const norm = (s) => (s || '').normalize('NFKC').toLowerCase();
  // Mellojoy US \u0111\u1eb7t t\u00ean s\u1ea3n ph\u1ea9m b\u1eb1ng ti\u1ebfng Anh: g\u00f5 t\u00ean Nh\u1eadt / Vi\u1ec7t / Anh \u0111\u1ec1u nh\u1eadn (\u30c9\u30fc\u30ca\u30c4 = donut = b\u00e1nh v\u00f2ng\u2026)
  const ALIAS = [
    ['\u30c9\u30fc\u30ca\u30c4', 'donut', 'doughnut', 'b\u00e1nh v\u00f2ng'], ['\u30d0\u30bf\u30fc', 'butter'], ['\u30b9\u30d5\u30ec', 'souffle', 'souffl\u00e9'],
    ['\u30df\u30cb\u30e9\u30f3\u30c9', 'mini land', 'miniland'], ['\u30c1\u30e7\u30b3\u30ec\u30b3\u30fc\u30c9', '\u30c1\u30e7\u30b3\u30ec\u30fc\u30c8\u30ec\u30b3\u30fc\u30c9', 'chocolate record'],
    ['\u30c1\u30e7\u30b3', '\u30c1\u30e7\u30b3\u30ec\u30fc\u30c8', 'chocolate', 'choco', 's\u00f4 c\u00f4 la', 'socola'], ['\u30e8\u30fc\u30b0\u30eb\u30c8', 'yogurt', 'yoghurt', 's\u1eefa chua'],
    ['\u30b7\u30e7\u30fc\u30c8\u30b1\u30fc\u30ad', 'shortcake', 'short cake'], ['\u3044\u3061\u3054', '\u82fa', '\u30a4\u30c1\u30b4', 'strawberry', 'd\u00e2u'], ['\u30df\u30eb\u30d5\u30a3\u30fc\u30e6', 'mille-feuille', 'millefeuille', 'mille feuille'],
    ['\u30c8\u30fc\u30b9\u30c8', 'toast'], ['\u5bff\u53f8', '\u9ba8', '\u3059\u3057', 'sushi'], ['\u30d7\u30ea\u30f3', 'pudding', 'purin'], ['\u30e0\u30fc\u30b9', 'mousse'], ['\u30af\u30ea\u30fc\u30e0', 'cream', 'kem'],
    ['\u30d6\u30e9\u30a4\u30f3\u30c9\u30dc\u30c3\u30af\u30b9', '\u30d6\u30e9\u30a4\u30f3\u30c9', 'blind box', 'blindbox', 'h\u1ed9p m\u00f9'], ['\u30b1\u30fc\u30ad', 'cake'], ['\u62b9\u8336', 'matcha'], ['\u30ed\u30fc\u30eb', 'roll'],
    ['\u91ce\u83dc', 'veg', 'vegetable', 'rau'], ['\u30d5\u30eb\u30fc\u30c4', 'fruit', 'tr\u00e1i c\u00e2y'], ['\u30e1\u30ed\u30b8\u30e7\u30a4', 'mellojoy'], ['\u30e1\u30ed\u30a4\u30a2', '\u30e1\u30ed\u30e4', 'melloya'],
  ].map((g) => g.map(norm));
  const aliasOf = (w) => ALIAS.find((g) => g.includes(w)) || [w];
  const match = (title, kw) => { const t = norm(title); const g = ALIAS.find((x) => x.includes(norm(kw).trim())); if (g) return g.some((a) => t.includes(a)); const ws = norm(kw).split(/\s+/).filter(Boolean); return ws.length > 0 && ws.every((w) => aliasOf(w).some((a) => t.includes(a))); };

  // th\u1ed1ng k\u00ea cho log t\u1eebng gi\u00e2y
  const stats = { req: 0, ok: 0, r429: 0, err: 0, lat: 0 };
  let lastFound = '', lastShelf = '', curDense = false, kwStat = [];
  let lastScan = { sent: 0, ms: 0 };       // l\u01b0\u1ee3t qu\u00e9t v\u1eeba tr\u1ea3 v\u1ec1: g\u1eedi l\u00fac n\u00e0o, m\u00e1y ch\u1ee7 tr\u1ea3 sau bao l\u00e2u
  let lastOkAt = 0;                         // l\u00fac shop tr\u1ea3 products.json g\u1ea7n nh\u1ea5t (log 2/11: request treo -> b\u1ea3ng KW \u0111\u1ee9ng h\u00ecnh "c\u00f2n h\u00e0ng" m\u1ea5y ph\u00fat m\u00e0 BOT kh\u00f4ng qu\u00e9t)
  const SCAN_TIMEOUT = 4000;                // qu\u00e1 4 gi\u00e2y kh\u00f4ng tr\u1ea3 l\u1eddi -> hu\u1ef7, l\u01b0\u1ee3t sau g\u1eedi l\u1ea1i
  async function getProducts() {
    const t0 = performance.now(), sent = Date.now();
    stats.req++;
    const ac = new AbortController(), tm = setTimeout(() => ac.abort(), SCAN_TIMEOUT);
    let ps;
    try {
      let r;
      try { r = await fetch(`/products.json?limit=250&_=${Date.now()}`, { cache: 'no-store', credentials: 'same-origin', signal: ac.signal }); }
      catch (e) { stats.err++; throw new Error(e.name === 'AbortError' ? L('\u5fdc\u7b54\u306a\u3057(4\u79d2)', 'shop kh\u00f4ng tr\u1ea3 l\u1eddi (4 gi\u00e2y)') : e.message); }
      stats.lat += performance.now() - t0;
      lastScan = { sent, ms: Math.round(performance.now() - t0) };
      if (r.status === 429) { stats.r429++; const e = new Error('429'); e.retryAfter = r.headers.get('Retry-After'); throw e; }
      if (!r.ok) { stats.err++; throw new Error('HTTP ' + r.status); }
      try { ps = (await r.json()).products || []; } catch (e) { stats.err++; throw new Error(e.name === 'AbortError' ? L('\u5fdc\u7b54\u306a\u3057(4\u79d2)', 'shop kh\u00f4ng tr\u1ea3 l\u1eddi (4 gi\u00e2y)') : e.message); }
    } finally { clearTimeout(tm); }
    stats.ok++;
    lastOkAt = Date.now();
    if (ps.length) warmOps(ps);
    if (IS_US) {
      const sig = ps.map((p) => p.id + ':' + p.updated_at + ':' + (p.variants || []).map((v) => (v.available ? 1 : 0)).join('')).join('|');
      if (usPoll === US_POLL_MS && usSig && sig !== usSig) {
        if (Date.now() > usBurstUntil) log(L('\u30b7\u30e7\u30c3\u30d7\u306b\u5909\u5316\u3042\u308a \u2192 90\u79d2\u9593 \u9ad8\u901f\u76e3\u8996\uff080.3\u79d2\uff09', 'Shop v\u1eeba thay \u0111\u1ed5i \u2192 qu\u00e9t nhanh 0,3 gi\u00e2y trong 90 gi\u00e2y'));
        usBurstUntil = Date.now() + US_BURST_FOR;
      }
      usSig = sig;
    }
    return ps;
  }
  const firstAvail = (p) => (p.variants || []).find((v) => v.available);

  // gi\u1edbi h\u1ea1n m\u1ed7i ng\u01b0\u1eddi ghi trong t\u00ean (VD "\u30102 PER PERSON!!!\u3011", "\u304a\u4e00\u4eba\u69d82\u70b9\u307e\u3067"): \u0111\u1eb7t \u0111\u00fang s\u1ed1 \u0111\u00f3 ngay l\u01b0\u1ee3t \u0111\u1ea7u,
  // kh\u1ecfi b\u1ecb shop t\u1eeb ch\u1ed1i r\u1ed3i th\u1eed l\u1ea1i 6 -> 3 -> 2 (log 2/11: ch\u1ecdn 3 c\u00e1i m\u00f3n "2 PER PERSON" m\u1ea5t ~2 gi\u00e2y m\u1edbi v\u00e0o gi\u1ecf)
  const perPerson = (t) => { const m = String(t || '').match(/(\d+)\s*per\s*(?:person|customer)|\u4e00\u4eba\u69d8?\s*(\d+)\s*(?:\u70b9|\u500b|\u3064|\u7bb1)/i); return m ? +(m[1] || m[2]) : 0; };
  const item = ({ p, v }, qty, prefix) => ({
    id: v.id, qty: Math.min(qty, perPerson(p.title) || qty), title: prefix + p.title, name: p.title, handle: p.handle, size: v.title || '-', price: v.price,
    image: (v.featured_image && v.featured_image.src) || (p.images && p.images[0] && p.images[0].src) || '',
  });
  // M\u1ed7i \u0111\u01a1n ch\u1ec9 l\u1ea5y t\u1ed1i \u0111a MAX_PICK m\u00e3: 10 m\u00e3 \u0111i\u1ec1n s\u1eb5n, m\u00e3 n\u00e0o L\u00caN K\u1ec6 (c\u00f2n h\u00e0ng) S\u1edaM NH\u1ea4T th\u00ec l\u1ea5y;
  // c\u00f9ng m\u1ed9t l\u01b0\u1ee3t qu\u00e9t c\u00f3 nhi\u1ec1u h\u01a1n 4 m\u00e3 c\u00f2n h\u00e0ng -> ch\u1ecdn ng\u1eabu nhi\u00ean 4 (user y\u00eau c\u1ea7u 26/10)
  const MAX_PICK = 4;
  // Tr\u1ea3 danh s\u00e1ch m\u00f3n c\u1ea7n th\u00eam; d\u00f9ng \u4e88\u5099 cho ph\u1ea7n b\u1ecb h\u1ebft
  function plan(products) {
    let out = [];
    const missing = [];
    const wanted = cfg.items.slice(0, cfg.kwCount).filter((i) => i.kw.trim());
    const stat = (ps, hit) => (hit ? 'in' : ps.length ? 'out' : 'none');
    kwStat = [];
    cfg.items.slice(0, cfg.kwCount).forEach((it, idx) => {
      if (!it.kw.trim()) return;
      // t\u1eeb kho\u00e1 l\u00e0 M\u00c3 VARIANT (s\u1ed1): kh\u1edbp \u0111\u00fang variant \u0111\u00f3, kh\u00f4ng theo t\u00ean.
      // Nhi\u1ec1u m\u00e3 n\u1ed1i b\u1eb1ng & (VD 111&222&333): \u00f4 n\u00e0y ch\u1ec9 l\u1ea5y 1 m\u00e3, ch\u1ecdn NG\u1eaaU NHI\u00caN trong c\u00e1c m\u00e3 c\u00f2n h\u00e0ng (user y\u00eau c\u1ea7u 2/11)
      const vids = vidsOf(it.kw);
      const ps = vids.length ? products.filter((p) => (p.variants || []).some((v) => vids.includes(String(v.id)))) : products.filter((p) => match(p.title, it.kw));
      const listed = vids.length ? ps.flatMap((p) => p.variants.filter((v) => vids.includes(String(v.id))).map((v) => ({ p, v }))) : [];
      const hit = vids.length
        ? pickOne(listed.filter((x) => x.v.available))
        : ps.map((p) => ({ p, v: firstAvail(p) })).find((x) => x.v);
      kwStat.push({ label: `KW${idx + 1}`, kw: it.kw, st: stat(ps, hit) });
      if (hit) out.push(item(hit, it.qty, ''));
      else {
        // m\u00f3n \u0110\u00c3 l\u00ean trang nh\u01b0ng products.json c\u00f2n b\u00e1o h\u1ebft: nh\u1edb variant c\u1ee7a n\u00f3 \u0111\u1ec3 b\u1ea3n JP th\u00eam gi\u1ecf th\u1eb3ng (products.json c\u00f3 th\u1ec3 tr\u1ec5).
        // T\u1eeb kh\u00f3a / m\u00e3 s\u1ea3n ph\u1ea9m kh\u1edbp nhi\u1ec1u m\u00f3n -> l\u1ea5y m\u00f3n \u0111\u0103ng M\u1edaI NH\u1ea4T (m\u00f3n c\u0169 \u0111\u00e3 b\u00e1n h\u1ebft th\u01b0\u1eddng v\u1eabn c\u00f2n tr\u00ean trang)
        const lx = pickOne(listed);
        const np = vids.length ? lx && lx.p : ps.slice().sort((a, b) => String(b.published_at || b.created_at || '').localeCompare(String(a.published_at || a.created_at || '')))[0];
        const nv = vids.length ? lx && lx.v : np && (np.variants || [])[0];
        // dv: 1 m\u00e3 (ng\u1eabu nhi\u00ean) CH\u01afA l\u00ean products.json -> th\u00eam th\u1eb3ng /cart/add.js
        const dv = vids.length ? pickOne(vids.filter((id) => !listed.some((x) => String(x.v.id) === id))) || '' : '';
        missing.push({ it, seen: ps.length > 0, p: np, v: nv, dv });
      }
    });
    if (cfg.backup.kw.trim()) {
      const ps = products.filter((p) => match(p.title, cfg.backup.kw));
      kwStat.push({ label: L('\u4e88\u5099', 'D\u1ef1 ph\u00f2ng'), kw: cfg.backup.kw, st: stat(ps, ps.find((p) => firstAvail(p))) });
    }
    let capped = [];
    if (out.length > MAX_PICK) {
      for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
      capped = out.slice(MAX_PICK);
      out = out.slice(0, MAX_PICK);
    }
    if (missing.length && out.length < MAX_PICK && cfg.backup.kw.trim()) {
      const ps = products.filter((p) => match(p.title, cfg.backup.kw));
      const hit = ps.map((p) => ({ p, v: firstAvail(p) })).find((x) => x.v);
      if (hit && !out.some((o) => o.id === hit.v.id)) out.push(item(hit, cfg.backup.qty, L('[\u4e88\u5099] ', '[D\u1ef1 ph\u00f2ng] ')));
    }
    return { out, missing, wanted, capped };
  }

  // L\u01b0u t\u00ean, link, \u1ea3nh, size, gi\u00e1, s\u1ed1 l\u01b0\u1ee3ng \u0111\u1ec3 b\u00e1o Discord khi thanh to\u00e1n xong (kh\u00f4ng t\u1ed1n request)
  function saveForWebhook(list) {
    try {
      const cur = IS_US ? 'USD' : 'JPY';
      const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(Number(v));
      const img = (u) => (!u ? '' : u.startsWith('//') ? 'https:' + u : u);
      save('pjc_last', { shop: SHOP, site: location.hostname, at: Date.now(), items: list.map((x) => ({
        title: x.name, url: location.origin + '/products/' + x.handle, image: img(x.image), size: x.size, price: fmt(x.price), qty: x.qty,
      })) });
    } catch (e) {}
  }

  async function addAll(list) {
    let r, err = '';
    for (let k = 0; k < 6; k++) {                 // 429 / l\u1ed7i m\u1ea1ng / treo l\u00fac th\u00eam gi\u1ecf: th\u1eed l\u1ea1i sau 0,3 gi\u00e2y (t\u1ed1i \u0111a 6 l\u1ea7n)
      // Shopify \u0111\u00f4ng ng\u01b0\u1eddi c\u00f3 th\u1ec3 gi\u1eef request r\u1ea5t l\u00e2u: qu\u00e1 5 gi\u00e2y l\u00e0 hu\u1ef7, g\u1eedi l\u1ea1i (tr\u01b0\u1edbc \u0111\u00e2y treo m\u00e3i -> BOT \u0111\u1ee9ng im, user b\u00e1o 30/10)
      const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 5000);
      try {
        r = await fetch('/cart/add.js', {
          method: 'POST', credentials: 'same-origin', signal: ac.signal,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ items: list.map((x) => ({ id: x.id, quantity: x.qty })) }),
        });
        err = '';
      } catch (e) {
        r = null;
        err = e.name === 'AbortError' ? L('\u5fdc\u7b54\u306a\u3057(5\u79d2)', 'kh\u00f4ng ph\u1ea3n h\u1ed3i (5 gi\u00e2y)') : e.message;
      } finally {
        clearTimeout(tm);
      }
      if (r && r.status !== 429) break;
      await sleep(BACKOFF_MIN);
    }
    if (!r) return { ok: false, msg: err };
    if (r.ok) { const j = await r.json().catch(() => ({})); return { ok: true, items: j.items || (j.id ? [j] : []) }; }
    const j = await r.json().catch(() => ({}));
    return { ok: false, msg: `${r.status} ${j.description || j.message || ''}` };
  }
  // Th\u00eam c\u1ea3 l\u00f4 b\u1ecb t\u1eeb ch\u1ed1i (1 m\u00f3n h\u1ebft / v\u01b0\u1ee3t gi\u1edbi h\u1ea1n) -> th\u00eam l\u1ebb t\u1eebng m\u00f3n
  const SOLD_MSG = /sold out|out of stock|\u58f2\u308a\u5207\u308c|\u5728\u5eab\u5207\u308c/i;
  // first: l\u00f4 ch\u1ec9 c\u00f3 1 m\u00f3n th\u00ec l\u01b0\u1ee3t th\u00eam c\u1ea3 l\u00f4 v\u1eeba r\u1ed3i CH\u00cdNH L\u00c0 l\u01b0\u1ee3t th\u00eam l\u1ebb -> d\u00f9ng lu\u00f4n k\u1ebft qu\u1ea3, kh\u1ecfi g\u1eedi l\u1ea1i y h\u1ec7t
  async function addEach(list, first) {
    let n = 0;
    await Promise.all(list.map(async (x) => {          // nh\u01b0 b\u1ea3n PC: th\u00eam l\u1ebb t\u1eebng m\u00f3n C\u00d9NG L\u00daC, kh\u00f4ng l\u1ea7n l\u01b0\u1ee3t
      const r = first || await addAll([x]);
      if (r.ok) { n++; fillFromCart(x, r.items); return; }
      // m\u00e3 variant ch\u01b0a l\u00ean h\u00e0ng / h\u1ebft h\u00e0ng: shop t\u1eeb ch\u1ed1i l\u00e0 b\u00ecnh th\u01b0\u1eddng. Ch\u1ec9 b\u1ecb v\u01b0\u1ee3t s\u1ed1 l\u01b0\u1ee3ng (VD ch\u1ecdn 3, shop cho 2) th\u00ec th\u1eed s\u1ed1 nh\u1ecf h\u01a1n b\u00ean d\u01b0\u1edbi
      if (x.direct && (!r.msg || SOLD_MSG.test(r.msg) || /^404|not found|cannot find/i.test(r.msg))) { x.qty = 0; return; }
      if (SOLD_MSG.test(r.msg)) { x.qty = 0; x.err = r.msg; return; }   // shop b\u00e1o h\u1ebft h\u00e0ng: th\u1eed s\u1ed1 nh\u1ecf h\u01a1n c\u0169ng v\u00f4 \u00edch
      // kh\u00f4ng \u0111\u1ee7 s\u1ed1 l\u01b0\u1ee3ng (VD shop ch\u1ec9 cho 3 m\u00e0 \u0111\u1eb7t 12) -> th\u1eed s\u1ed1 shop b\u00e1o trong l\u1ed7i, r\u1ed3i 6 -> 3 -> 2 -> 1
      // (kh\u00f4ng l\u00f9i t\u1eebng c\u00e1i m\u1ed9t: 12 -> 11 -> 10\u2026 qu\u00e1 ch\u1eadm l\u00fac \u0111\u00f4ng ng\u01b0\u1eddi)
      let got = 0;
      // s\u1ed1 g\u1ee3i \u00fd ch\u1ec9 l\u1ea5y \u1edf c\u00e2u "only 2\u2026/ can add 2\u2026", kh\u00f4ng l\u1ea5y s\u1ed1 trong T\u00caN m\u00f3n (VD "Z089-2", "270g")
      const hint = [...r.msg.matchAll(/(?:only|can (?:only )?add|up to)\D{0,16}?(\d+)/gi)].map((m) => +m[1]).filter((q) => q >= 1 && q < x.qty);
      const top = hint.length ? Math.max(...hint) : x.qty;          // shop b\u00e1o "ch\u1ec9 \u0111\u01b0\u1ee3c 3" -> th\u1eed 3 tr\u01b0\u1edbc
      const tries = [...new Set([...(hint.length ? [top] : []), 6, 3, 2, 1].filter((q) => q < x.qty && q <= top))];
      for (const q of tries) {
        const rr = await addAll([{ ...x, qty: q }]);
        if (rr.ok) { got = q; fillFromCart(x, rr.items); break; }   // m\u00e3 variant th\u1eb3ng: l\u1ea5y t\u00ean / gi\u00e1 / \u1ea3nh \u0111\u1ec3 b\u00e1o Discord
      }
      if (got) { n++; x.qty = got; log(L(`\u2192 ${got}\u500b\u3060\u3051\u8ffd\u52a0\u3067\u304d\u307e\u3057\u305f`, `\u2192 ch\u1ec9 th\u00eam \u0111\u01b0\u1ee3c ${got} c\u00e1i`) + `: ${x.title.slice(0, 22)}`); }
      else { x.qty = 0; x.err = r.msg; }
    }));
    return n;
  }
  // B\u1ea3n PC 31/10 (mellojoyus, 172 task, 0 \u0111\u01a1n): shop tr\u1ea3 422 "Only 1 item was added to your cart due to availability"
  // = \u0110\u00c3 V\u00c0O GI\u1ece (\u00edt h\u01a1n s\u1ed1 xin) m\u00e0 bot t\u01b0\u1edfng h\u1ecfng; l\u01b0\u1ee3t sau shop b\u00e1o "maximum quantity \u2026 already in your cart" -> l\u1eb7p m\u00e3i
  // kh\u00f4ng \u0111i thanh to\u00e1n. B\u1ecb t\u1eeb ch\u1ed1i -> \u0111\u1ecdc /cart.js: m\u00f3n n\u00e0o \u0111\u00e3 n\u1eb1m trong gi\u1ecf th\u00ec t\u00ednh l\u00e0 \u0111\u00e3 v\u00e0o (v\u1edbi s\u1ed1 l\u01b0\u1ee3ng shop cho).
  async function rescueFromCart(list) {
    try {
      const c = await (await fetch('/cart.js', { credentials: 'same-origin', cache: 'no-store' })).json();
      let n = 0;
      for (const x of list) {
        const it = (c.items || []).find((i) => String(i.variant_id || i.id) === String(x.id));
        if (!it || !it.quantity) continue;
        if (it.quantity !== x.qty || x.err) log(L(`\u2192 \u30ab\u30fc\u30c8\u306b\u65e2\u306b ${it.quantity}\u500b\u3042\u308a`, `\u2192 \u0111\u00e3 c\u00f3 ${it.quantity} c\u00e1i trong gi\u1ecf`) + `: ${(it.product_title || x.title).slice(0, 22)}`);
        x.qty = it.quantity; x.inCart = true; delete x.err; fillFromCart(x, [it]); n++;
      }
      return n;
    } catch (e) { return 0; }
  }
  // m\u00f3n th\u00eam b\u1eb1ng m\u00e3 variant th\u1eb3ng: l\u1ea5y t\u00ean / gi\u00e1 / \u1ea3nh t\u1eeb c\u00e2u tr\u1ea3 l\u1eddi c\u1ee7a gi\u1ecf \u0111\u1ec3 b\u00e1o Discord
  function fillFromCart(x, items) {
    const it = (items || []).find((i) => String(i.variant_id || i.id) === String(x.id));
    if (!it || !x.direct) return;
    Object.assign(x, { title: it.product_title || x.title, name: it.product_title || x.name, handle: it.handle || '', size: it.variant_title || '-',
      price: it.price != null ? it.price / 100 : x.price, image: it.image || '' });
  }
  // T\u1eeb kho\u00e1 l\u00e0 M\u00c3 VARIANT (s\u1ed1) m\u00e0 products.json ch\u01b0a c\u00f3 (ch\u01b0a \u0111\u0103ng / b\u1ecb \u1ea9n): nh\u01b0 b\u1ea3n PC, POST th\u1eb3ng /cart/add.js,
  // shop nh\u1eadn l\u00e0 c\u00f3 h\u00e0ng. Th\u1eed t\u1ed1i \u0111a 1 l\u1ea7n / DIRECT_MS \u0111\u1ec3 kh\u00f4ng b\u1ecb Shopify ch\u1eb7n v\u00ec g\u1eedi gi\u1ecf qu\u00e1 d\u00e0y.
  // 1 m\u00e3 ho\u1eb7c nhi\u1ec1u m\u00e3 n\u1ed1i b\u1eb1ng & (d\u1ea5u ph\u1ea9y / kho\u1ea3ng tr\u1eafng c\u0169ng \u0111\u01b0\u1ee3c) -> danh s\u00e1ch m\u00e3; c\u00f3 ch\u1eef th\u00ec l\u00e0 t\u1eeb kh\u00f3a th\u01b0\u1eddng -> []
  const vidsOf = (kw) => { const a = String(kw || '').split(/[&,\s]+/).filter(Boolean); return a.length && a.every((x) => /^\d{8,}$/.test(x)) ? [...new Set(a)] : []; };
  const pickOne = (a) => (a.length ? a[Math.floor(Math.random() * a.length)] : undefined);
  // Mellojoy JP (b\u00e1n \u0111\u00fang gi\u1edd, ch\u1ec9 canh ~10 ph\u00fat): m\u00e3 variant \u0110\u00c3 c\u00f3 tr\u00ean trang m\u00e0 products.json c\u00f2n b\u00e1o h\u1ebft h\u00e0ng th\u00ec V\u1eaaN th\u00eam th\u1eb3ng
  // -> products.json c\u1ee7a Shopify c\u00f3 th\u1ec3 tr\u1ec5 v\u00e0i gi\u00e2y so v\u1edbi t\u1ed3n kho th\u1eadt, c\u00f2n /cart/add.js tr\u1ea3 l\u1eddi theo t\u1ed3n kho th\u1eadt n\u00ean v\u00e0o gi\u1ecf s\u1edbm h\u01a1n.
  // 1 l\u1ea7n / gi\u00e2y; khung t\u1ed1c \u0111\u1ed9 cao 12:00:07\u201312:00:12 th\u00ec 0,3 gi\u00e2y. US canh h\u00e0ng gi\u1edd li\u1ec1n -> kh\u00f4ng l\u00e0m (qu\u00e1 nhi\u1ec1u request gi\u1ecf).
  const DIRECT_MS = 1000, DIRECT_DENSE_MS = 300;   // 0,3s = nh\u1ecbp qu\u00e9t (user ch\u1ecdn 2/11, bi\u1ebft c\u00f3 th\u1ec3 b\u1ecb 429)
  let lastDirect = 0;
  function directList(missing) {
    // Variant ID ch\u01b0a l\u00ean trang (US + JP) ; JP: th\u00eam c\u1ea3 m\u00f3n \u0111\u00e3 l\u00ean trang m\u00e0 c\u00f2n b\u00e1o h\u1ebft (Variant ID, m\u00e3 s\u1ea3n ph\u1ea9m hay t\u1eeb kh\u00f3a \u0111\u1ec1u \u0111\u01b0\u1ee3c)
    const ms = missing.filter((m) => m.dv || (!IS_US && m.v)).slice(0, MAX_PICK);
    if (!ms.length || Date.now() - lastDirect < (curDense ? DIRECT_DENSE_MS : DIRECT_MS)) return [];
    lastDirect = Date.now();
    // JP c\u00f3 c\u1ea3 m\u00e3 \u0111\u00e3 l\u00ean trang (m.v) l\u1eabn m\u00e3 ch\u01b0a l\u00ean (m.dv) -> ch\u1ecdn ng\u1eabu nhi\u00ean 1 trong 2 ; US ch\u1ec9 th\u00eam th\u1eb3ng m\u00e3 ch\u01b0a l\u00ean
    return ms.map((m) => (!IS_US && m.v && !(m.dv && Math.random() < 0.5) ? { ...item({ p: m.p, v: m.v }, m.it.qty, ''), direct: true, kw: m.it.kw }
      : { id: Number(m.dv), qty: m.it.qty, title: m.dv, name: m.dv, handle: '', size: '-', price: 0, image: '', direct: true, kw: m.it.kw }));
  }


  // ================= Thanh to\u00e1n TH\u1eba b\u1eb1ng REQUEST (ch\u00e9p t\u1eeb b\u1ea3n PC: shopify_rq_checkout.py) =================
  // Kh\u00f4ng c\u1ea7n m\u1edf trang checkout, kh\u00f4ng c\u1ea7n \u0111\u0103ng nh\u1eadp shop (Mellojoy US cho mua ki\u1ec3u kh\u00e1ch; Mellojoy JP b\u1eaft \u0111\u0103ng nh\u1eadp):
  //   1) GET /checkout?skip_shop_pay=true -> trang /checkouts/cn/<token>: \u0111\u1ecdc sessionToken, sourceToken, commitSha\u2026
  //   2) m\u00e3 truy v\u1ea5n GraphQL (Proposal / SubmitForCompletion / PollForReceipt) \u0111\u1ecdc t\u1eeb file JS checkout tr\u00ean cdn.shopify.com,
  //      l\u01b0u theo b\u1ea3n build (commitSha); \u0111\u1ecdc S\u1eb4N l\u00fac b\u1eaft \u0111\u1ea7u canh h\u00e0ng (warmOps) \u0111\u1ec3 l\u00fac c\u00f3 h\u00e0ng kh\u1ecfi m\u1ea5t v\u00e0i gi\u00e2y
  //   3) Proposal v\u1edbi \u0111\u1ecba ch\u1ec9 trong khung -> ph\u00ed ship r\u1ebb nh\u1ea5t ; 4) l\u01b0u th\u1ebb: POST checkout.pci.shopifyinc.com/sessions
  //   5) SubmitForCompletion -> PollForReceipt: ProcessedReceipt = \u0111\u1eb7t xong / FailedReceipt = th\u1ebb b\u1ecb t\u1eeb ch\u1ed1i / ActionRequired = 3D Secure
  // H\u1ecfng TR\u01af\u1edaC l\u00fac g\u1eedi \u0111\u1eb7t h\u00e0ng -> m\u1edf trang checkout \u0111\u1ec3 b\u1ea1n t\u1ef1 tr\u1ea3. \u0110\u00c3 g\u1eedi \u0111\u1eb7t h\u00e0ng th\u00ec kh\u00f4ng bao gi\u1edd g\u1eedi l\u1ea1i (tr\u00e1nh 2 \u0111\u01a1n).
  const K_BUY = 'pjc_buy_v1';
  const buy = () => load(K_BUY, {});
  // \u0111\u00e3 \u0111\u0103ng nh\u1eadp t\u00e0i kho\u1ea3n shop: Shopify ghi m\u00e3 kh\u00e1ch v\u00e0o bi\u1ebfn c\u1ee7a trang (script ch\u1ea1y trong trang n\u00ean \u0111\u1ecdc \u0111\u01b0\u1ee3c)
  const loggedIn = () => {
    try {
      const m = window.ShopifyAnalytics && ShopifyAnalytics.meta;
      if (m && ((m.page && m.page.customerId) || m.customerId)) return true;
      if (window.__st && window.__st.cid) return true;
    } catch (e) {}
    return /"customerId":\s*\d+|customer_id["']?\s*[:=]\s*["']?\d{5,}/.test(document.documentElement.innerHTML.slice(0, 300000));
  };
  const COUNTRY = IS_US ? 'US' : 'JP';
  // n\u01b0\u1edbc giao h\u00e0ng ch\u1ecdn trong khung (Mellojoy US: US ho\u1eb7c JP; Mellojoy JP: lu\u00f4n JP)
  const shipCountry = (b) => (IS_US && (b.country === 'JP' || b.country === 'US') ? b.country : COUNTRY);
  const digits = (v) => String(v || '').replace(/\D/g, '');
  const hasCard = (b) => digits(b.cnum).length >= 12 && digits(b.cexp).length >= 4 && digits(b.ccvv).length >= 3;
  const hasAddr = (b) => !!(b.last && b.first && b.email && b.phone && b.zip && b.zone && b.city && b.addr1);
  // 2/11: Mellojoy US tr\u1ea3 403 "Request Forbidden" cho trang checkout khi l\u1ea5y b\u1eb1ng request (m\u1edf b\u1eb1ng tr\u00ecnh duy\u1ec7t th\u00ec v\u1eabn v\u00e0o \u0111\u01b0\u1ee3c)
  // -> shop ch\u1eb7n ki\u1ec3u thanh to\u00e1n n\u00e0y. \u0110\u00e3 b\u1ecb ch\u1eb7n th\u00ec 12 gi\u1edd kh\u00f4ng th\u1eed request n\u1eefa: c\u00f3 h\u00e0ng l\u00e0 m\u1edf th\u1eb3ng trang thanh to\u00e1n,
  // kh\u1ecfi m\u1ea5t ~0,5\u20131 gi\u00e2y cho 1 l\u1ea7n th\u1eed ch\u1eafc ch\u1eafn h\u1ecfng. H\u1ebft 12 gi\u1edd t\u1ef1 th\u1eed l\u1ea1i 1 l\u1ea7n (shop c\u00f3 th\u1ec3 m\u1edf l\u1ea1i).
  const K_RQB = 'pjc_rq_blocked_v1';
  const rqBlocked = () => Date.now() - (load(K_RQB, {})[location.hostname] || 0) < 12 * 3600e3;
  const markRqBlocked = () => { const m = load(K_RQB, {}); m[location.hostname] = Date.now(); save(K_RQB, m); };
  class CoErr extends Error { constructor(m, o) { super(m); Object.assign(this, o || {}); } }
  const decodeHtml = (x) => { const t = document.createElement('textarea'); t.innerHTML = x; return t.value; };
  function meta(h, n) {
    const m = h.match(new RegExp(`<meta name="serialized-${n}" content="([^"]*)"`));
    if (!m) return null;
    const v = decodeHtml(m[1]);
    try { return JSON.parse(v); } catch (e) { return v; }
  }
  const errShort = (ds) => (ds || []).slice(0, 3).map((e) => `${e.code}: ${e.localizedMessage || e.nonLocalizedMessage || ''}`.trim()).join(' | ') || '-';
  const SOLD_RE = /OUT_OF_STOCK|INVENTORY|MERCHANDISE_NOT_AVAILABLE|NOT_ENOUGH_STOCK|SOLD_OUT|InventoryReservationFailure|MERCHANDISE_EXPECTATIONS_NOT_MET/i;
  const isSold = (x) => SOLD_RE.test(typeof x === 'string' ? x : JSON.stringify(x || ''));
  const OPS = ['Proposal', 'SubmitForCompletion', 'PollForReceipt'];
  const K_OPS = 'pjc_ops_v1';
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

  // m\u00e3 truy v\u1ea5n theo b\u1ea3n build: ch\u1ec9 2/342 file JS ch\u1ee9a -> t\u1ea3i song song 16 file m\u1ed9t l\u00fac, \u0111\u1ee7 3 m\u00e3 l\u00e0 th\u00f4i
  async function getOps(html, commit) {
    const cache = load(K_OPS, {});
    if (commit && cache[commit] && OPS.every((k) => cache[commit][k])) return cache[commit];
    const files = [...new Set(html.match(/\/cdn\/shopifycloud\/checkout-web\/assets\/[A-Za-z0-9/._-]+\.js/g) || [])];
    const ops = {}, re = new RegExp(`id:"([a-f0-9]{64})",type:"(?:query|mutation)",name:"(${OPS.join('|')})"`, 'g');
    let i = 0;
    const worker = async () => {
      while (i < files.length && !OPS.every((k) => ops[k])) {
        const f = files[i++];
        try { const t = await (await fetch('https://cdn.shopify.com' + f)).text(); for (const m of t.matchAll(re)) ops[m[2]] = m[1]; } catch (e) {}
      }
    };
    await Promise.all(Array.from({ length: 16 }, worker));
    if (!OPS.every((k) => ops[k])) throw new CoErr(L('\u8cfc\u5165\u7528\u306e\u30b3\u30fc\u30c9\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093', 'kh\u00f4ng t\u00ecm th\u1ea5y m\u00e3 truy v\u1ea5n checkout'), { ui: true });
    const keep = Object.entries(cache).slice(-3);
    save(K_OPS, Object.fromEntries([...keep, [commit, ops]]));
    return ops;
  }
  // \u0110\u1ecdc s\u1eb5n m\u00e3 truy v\u1ea5n khi b\u1eaft \u0111\u1ea7u canh: m\u1edf checkout c\u1ee7a 1 m\u00f3n b\u1ea5t k\u1ef3 KH\u00d4NG g\u1eedi cookie (gi\u1ecf c\u1ee7a b\u1ea1n kh\u00f4ng b\u1ecb \u0111\u1ee5ng)
  let warmAt = 0;
  async function warmOps(products) {
    if (!IS_US || !hasCard(buy()) || rqBlocked() || Date.now() - warmAt < 30 * 60e3) return;
    warmAt = Date.now();
    try {
      const v = products && products[0] && products[0].variants && products[0].variants[0];
      if (!v) { warmAt = 0; return; }
      const r = await fetch(`/cart/${v.id}:1?skip_shop_pay=true`, { credentials: 'omit', cache: 'no-store' });
      if (r.status === 403) {
        markRqBlocked();
        log(L('\u26a0\ufe0f \u30b7\u30e7\u30c3\u30d7\u304c\u30ea\u30af\u30a8\u30b9\u30c8\u8cfc\u5165\u3092\u30d6\u30ed\u30c3\u30af\u4e2d\uff08403\uff09\u2192 \u5728\u5eab\u304c\u51fa\u305f\u3089\u8cfc\u5165\u753b\u9762\u3092\u76f4\u63a5\u958b\u304d\u307e\u3059', '\u26a0\ufe0f Shop \u0111ang ch\u1eb7n thanh to\u00e1n b\u1eb1ng request (403) \u2192 c\u00f3 h\u00e0ng BOT m\u1edf th\u1eb3ng trang thanh to\u00e1n'));
        return;
      }
      const h = await r.text(), env = meta(h, 'environment') || {};
      if (!env.commitSha) return;
      const t0 = performance.now();
      await getOps(h, env.commitSha);
      log(L(`\ud83d\udcb3 \u8cfc\u5165\u6e96\u5099OK\uff08\u30d3\u30eb\u30c9 ${env.commitSha.slice(0, 7)}\u30fb${Math.round(performance.now() - t0)}ms\uff09`, `\ud83d\udcb3 \u0110\u00e3 chu\u1ea9n b\u1ecb thanh to\u00e1n request (b\u1ea3n build ${env.commitSha.slice(0, 7)}, ${Math.round(performance.now() - t0)}ms)`));
    } catch (e) {}
  }

  async function rqCheckout() {
    const b = buy();
    const t0 = performance.now(), mark = {};
    const tick = (k) => { mark[k] = Math.round(performance.now() - t0); };
    // 1) m\u1edf checkout
    let r, html = '', url = '';
    for (let k = 0; ; k++) {
      try { r = await fetch('/checkout?skip_shop_pay=true', { credentials: 'include', cache: 'no-store' }); } catch (e) {
        // chuy\u1ec3n sang shopify.com (\u0111\u0103ng nh\u1eadp) / shop.app -> kh\u00e1c t\u00ean mi\u1ec1n, fetch b\u00e1o l\u1ed7i
        throw new CoErr(L('\u8cfc\u5165\u753b\u9762\u3092\u958b\u3051\u307e\u305b\u3093\uff08\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981\u306a\u5e97\u8217\uff09', 'kh\u00f4ng m\u1edf \u0111\u01b0\u1ee3c checkout (shop b\u1eaft \u0111\u0103ng nh\u1eadp?)'), { ui: true });
      }
      url = r.url;
      if (/\/throttle|\/queue/.test(url)) throw new CoErr(L('\u9806\u756a\u5f85\u3061', 'shop \u0111ang cho x\u1ebfp h\u00e0ng ch\u1edd'), { ui: true });
      if ((r.status === 429 || r.status >= 500) && k < 8) { await sleep(800); continue; }
      if (r.status === 403) { markRqBlocked(); throw new CoErr(L('\u30b7\u30e7\u30c3\u30d7\u304c\u30ea\u30af\u30a8\u30b9\u30c8\u8cfc\u5165\u3092\u30d6\u30ed\u30c3\u30af\uff08403\uff09', 'shop ch\u1eb7n thanh to\u00e1n b\u1eb1ng request (403)'), { ui: true }); }
      if (r.status >= 400) throw new CoErr(`checkout HTTP ${r.status}`, { ui: true });
      html = await r.text();
      break;
    }
    if (!/\/checkouts\//.test(url)) throw new CoErr(/account|authentication|login/.test(url) ? L('\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981', 'shop b\u1eaft \u0111\u0103ng nh\u1eadp') : `checkout \u2192 ${url.slice(0, 60)}`, { ui: true });
    tick('trang');
    const goc = new URL(url).origin;
    const sessionToken = meta(html, 'sessionToken'), sourceToken = meta(html, 'sourceToken');
    const sourceType = meta(html, 'sourceType') || 'cn';
    const env = meta(html, 'environment') || {};
    const commit = env.commitSha || '', deploy = env.deployStage || 'production';
    const serverHandling = meta(html, 'serverHandling') || '', serverRender = meta(html, 'serverRender') || 'no';
    if (!sessionToken || !sourceToken) throw new CoErr(L('\u8cfc\u5165\u753b\u9762\u306e\u8aad\u307f\u8fbc\u307f\u5931\u6557', 'trang checkout kh\u00f4ng c\u00f3 sessionToken'), { ui: true });
    const gq = meta(html, 'graphql') || {};
    let cardsink = 'https://checkout.pci.shopifyinc.com/sessions', sig = meta(html, 'shopifyIdentificationSignature'), sess = null;
    for (const v of Object.values(gq)) {
      if (v && typeof v === 'object' && v.session && v.session.negotiate) sess = v.session;
      if (v && typeof v === 'object' && v.cardsinkUrl) cardsink = v.cardsinkUrl;
    }
    if (!sess) throw new CoErr(L('\u8cfc\u5165\u753b\u9762\u306e\u8aad\u307f\u8fbc\u307f\u5931\u6557', 'kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c phi\u00ean checkout'), { ui: true });
    sig = sess.checkoutCardsinkCallerIdentificationSignature || sig;
    let seller = {}, buyer = {}, queueToken = null, negErr = [];
    const take = (neg) => {
      const res = (neg || {}).result || {};
      negErr = (neg || {}).errors || [];
      if (res.queueToken) queueToken = res.queueToken;
      if (res.__typename === 'Throttled') throw new CoErr(L('\u9806\u756a\u5f85\u3061', 'shop \u0111ang cho x\u1ebfp h\u00e0ng ch\u1edd'), { ui: true });
      if (res.sellerProposal) seller = res.sellerProposal;
      if (res.buyerProposal) buyer = res.buyerProposal;
      return res;
    };
    take(sess.negotiate);
    // 2) m\u00e3 truy v\u1ea5n  +  4) l\u01b0u th\u1ebb ch\u1ea1y SONG SONG (kh\u00f4ng ph\u1ee5 thu\u1ed9c nhau)
    const vault = (async () => {
      const d = digits(b.cexp), yy = d.length > 4 ? d.slice(-4) : d.slice(2, 4);
      const cc = { number: digits(b.cnum), month: +d.slice(0, 2), year: +(yy.length === 4 ? yy : '20' + yy), verification_value: digits(b.ccvv), name: b.cname || `${b.first || ''} ${b.last || ''}`.trim() };
      const rr = await fetch(cardsink, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(sig ? { 'Shopify-Identification-Signature': sig } : {}) },
        body: JSON.stringify({ credit_card: cc, payment_session_scope: new URL(goc).host }) });
      const j = await rr.json().catch(() => ({}));
      if (rr.status >= 400 || !j.id) throw new CoErr(L(`\u30ab\u30fc\u30c9\u767b\u9332\u5931\u6557 (HTTP ${rr.status})`, `l\u01b0u th\u1ebb h\u1ecfng (HTTP ${rr.status})`) + (j.errors ? ': ' + JSON.stringify(j.errors).slice(0, 80) : ''), { ui: true });
      return j.id;
    })();
    vault.catch(() => {});
    const ops = await getOps(html, commit);
    tick('ma');
    const H = { Accept: 'application/json', 'Content-Type': 'application/json', 'Shopify-Checkout-Client': 'checkout-web/1.0',
      'X-Checkout-One-Session-Token': sessionToken, 'X-Checkout-Web-Build-Id': commit, 'X-Checkout-Web-Deploy-Stage': deploy,
      'X-Checkout-Web-Source-Id': sourceToken, 'X-Checkout-Web-Server-Handling': serverHandling, 'X-Checkout-Web-Server-Rendering': serverRender,
      'Shopify-Checkout-Source': `id="${sourceToken}", type="${sourceType}"` };
    async function gql(name, vars) {
      for (let k = 0; k < 6; k++) {
        const rr = await fetch(`${goc}/checkouts/internal/graphql/persisted?operationName=${name}`, { method: 'POST', credentials: 'include', headers: H,
          body: JSON.stringify({ variables: vars, operationName: name, id: ops[name] }) });
        if ([429, 502, 503, 504].includes(rr.status)) { await sleep(600 * (k + 1)); continue; }
        let j;
        try { j = await rr.json(); } catch (e) { throw new CoErr(`${name}: HTTP ${rr.status}`, { ui: true }); }
        if (j.errors && !j.data) throw new CoErr(`${name}: ${JSON.stringify(j.errors).slice(0, 160)}`, { ui: true });
        return j.data || {};
      }
      throw new CoErr(`${name}: ${L('\u30a2\u30af\u30bb\u30b9\u5236\u9650', 'shop ch\u1eb7n t\u1ed1c \u0111\u1ed9')}`, { ui: true });
    }
    const addr = () => {
      if (hasAddr(b)) return { address1: b.addr1, address2: b.addr2 || '', city: b.city, countryCode: shipCountry(b), postalCode: b.zip,
        firstName: b.first, lastName: b.last, zoneCode: b.zone, phone: b.phone, company: '' };
      // khung tr\u1ed1ng m\u00e0 \u0111\u00e3 \u0111\u0103ng nh\u1eadp shop -> \u0111\u1ecba ch\u1ec9 \u0111\u00e3 l\u01b0u trong t\u00e0i kho\u1ea3n
      const a0 = (seller.availableDeliveryAddresses || [])[0];
      if (a0) { const a = a0.address || a0; return Object.fromEntries(['address1', 'address2', 'city', 'countryCode', 'postalCode', 'firstName', 'lastName', 'zoneCode', 'phone', 'company'].map((k) => [k, a[k] || ''])); }
      throw new CoErr(L('\u914d\u9001\u5148\u304c\u672a\u5165\u529b', 'ch\u01b0a nh\u1eadp \u0111\u1ecba ch\u1ec9 giao h\u00e0ng'), { ui: true });
    };
    const cur = () => {
      for (const ln of ((seller.merchandise || {}).merchandiseLines || [])) { const pr = (ln.merchandise || {}).price || {}; if (pr.currencyCode) return pr.currencyCode; }
      return IS_US ? 'USD' : 'JPY';
    };
    const lines = () => {
      const ds = ((buyer.merchandise || seller.merchandise || {}).merchandiseLines || []).map((ln) => {
        const m = ln.merchandise || {};
        return { stableId: ln.stableId,
          merchandise: { productVariantReference: { id: m.id, variantId: m.variantId, properties: m.properties || [], sellingPlanId: null, sellingPlanDigest: null } },
          quantity: { items: { value: (((ln.quantity || {}).items || {}).value) || 1 } }, expectedTotalPrice: { any: true }, lineComponentsSource: null, lineComponents: [] };
      });
      if (!ds.length) throw new CoErr(L('\u30ab\u30fc\u30c8\u304c\u7a7a\uff08\u58f2\u308a\u5207\u308c\uff09', 'gi\u1ecf trong checkout tr\u1ed1ng (v\u1eeba h\u1ebft h\u00e0ng)'), { sold: true });
      return ds;
    };
    const input = (ship, pay) => {
      const dc = addr(), tt = cur();
      const inp = {
        sessionInput: { sessionToken }, queueToken,
        discounts: { lines: [], acceptUnexpectedDiscounts: true },
        delivery: {
          deliveryLines: [{
            destination: ship ? { streetAddress: dc } : { partialStreetAddress: dc },
            selectedDeliveryStrategy: ship ? { deliveryStrategyByHandle: { handle: ship.handle, customDeliveryRate: false }, options: {} }
              : { deliveryStrategyMatchingConditions: { estimatedTimeInTransit: { any: true }, shipments: { any: true } }, options: {} },
            targetMerchandiseLines: { any: true }, deliveryMethodTypes: ['SHIPPING'],
            expectedTotalPrice: ship ? { value: ship.price } : { any: true }, destinationChanged: !ship,
          }],
          noDeliveryRequired: [], useProgressiveRates: false, prefetchShippingRatesStrategy: null, supportsSplitShipping: true,
        },
        deliveryExpectations: { deliveryExpectationLines: [] },
        merchandise: { merchandiseLines: lines() },
        payment: { totalAmount: { any: true }, paymentLines: pay || [], billingAddress: { streetAddress: dc } },
        buyerIdentity: { customer: { presentmentCurrency: tt, countryCode: dc.countryCode }, ...(b.email ? { email: b.email, emailChanged: false } : {}),
          phoneCountryCode: dc.countryCode, marketingConsent: [], shopPayOptInPhone: { countryCode: dc.countryCode }, rememberMe: false },
        tip: { tipLines: [] },
        taxes: { proposedAllocations: null, proposedTotalAmount: { value: { amount: '0', currencyCode: tt } }, proposedTotalIncludedAmount: null, proposedMixedStateTotalAmount: null, proposedExemptions: [] },
        note: { message: null, customAttributes: [] }, localizationExtension: { fields: [] }, nonNegotiableTerms: null,
        scriptFingerprint: seller.scriptFingerprint || null, optionalDuties: { buyerRefusesDuties: false },
      };
      if (inp.scriptFingerprint && typeof inp.scriptFingerprint === 'object') { const { __typename, ...rest } = inp.scriptFingerprint; inp.scriptFingerprint = rest; }
      const tax = ((seller.tax || {}).totalTaxAmount || {}).value;
      if (tax) inp.taxes.proposedTotalAmount = { value: { amount: tax.amount, currencyCode: tax.currencyCode } };
      return inp;
    };
    async function proposal(ship, pay) {
      for (let k = 0; k < 40; k++) {
        const res = take(((await gql('Proposal', input(ship, pay))).session || {}).negotiate);
        if (res.__typename !== 'NegotiationResultAvailable') throw new CoErr(`Proposal: ${res.__typename} ${errShort(negErr)}`, { ui: true, sold: isSold(negErr) });
        const pend = ['delivery', 'tax', 'payment'].find((k2) => (seller[k2] || {}).__typename === 'PendingTerms');
        if (!pend) return;
        await sleep(Math.max(300, Math.min(2000, (seller[pend] || {}).pollDelay || 500)));
      }
      throw new CoErr(L('\u9001\u6599\u30fb\u7a0e\u306e\u8a08\u7b97\u5f85\u3061\u304c\u9577\u3059\u304e\u308b', 'ch\u1edd t\u00ednh ph\u00ed ship / thu\u1ebf qu\u00e1 l\u00e2u'), { ui: true });
    }
    // 3) Proposal 1: \u0111\u1ecba ch\u1ec9 -> ph\u00ed ship
    await proposal();
    tick('ship');
    const dv = seller.delivery || {};
    if (dv.__typename !== 'FilledDeliveryTerms') throw new CoErr(L('\u9001\u6599\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093: ', 'shop ch\u01b0a tr\u1ea3 ph\u00ed ship: ') + errShort(negErr), { ui: true, sold: isSold(negErr) });
    let ship = null;
    for (const ln of dv.deliveryLines || []) for (const s2 of ln.availableDeliveryStrategies || []) {
      const g = (s2.amount || {}).value || { amount: '0', currencyCode: cur() };
      if (!ship || +g.amount < +ship.price.amount) ship = { handle: s2.handle, price: { amount: g.amount, currencyCode: g.currencyCode }, title: s2.title || s2.handle };
    }
    if (!ship) throw new CoErr(L('\u3053\u306e\u4f4f\u6240\u306b\u914d\u9001\u3067\u304d\u307e\u305b\u3093', 'shop kh\u00f4ng giao t\u1edbi \u0111\u1ecba ch\u1ec9 n\u00e0y'), { ui: true });
    const pmLine = ((seller.payment || {}).availablePaymentLines || []).find((ln) => (ln.paymentMethod || {}).__typename === 'PaymentProvider' && (ln.placements || []).includes('PAYMENT_METHOD'));
    if (!pmLine) throw new CoErr(L('\u30ab\u30fc\u30c9\u6255\u3044\u304c\u306a\u3044\u5e97\u8217', 'shop kh\u00f4ng c\u00f3 thanh to\u00e1n b\u1eb1ng th\u1ebb'), { ui: true });
    const pmid = pmLine.paymentMethod.paymentMethodIdentifier;
    const sessionId = await vault;
    tick('the');
    log(L(`\ud83d\ude9a ${ship.title} ${ship.price.amount} ${ship.price.currencyCode} \u00b7 \ud83d\udcb3 ****${digits(b.cnum).slice(-4)}`, `\ud83d\ude9a Giao: ${ship.title} ${ship.price.amount} ${ship.price.currencyCode} \u00b7 \ud83d\udcb3 th\u1ebb ****${digits(b.cnum).slice(-4)}`));
    const payLines = (total) => [{ paymentMethod: { directPaymentMethod: { paymentMethodIdentifier: pmid, sessionId, billingAddress: { streetAddress: addr() }, cardSource: null } },
      amount: total ? { value: total } : { any: true }, dueAt: null }];
    const totalNow = () => { for (const k of ['checkoutTotal', 'runningTotal', 'total']) { const v = (seller[k] || {}).value; if (v && v.amount != null) return { amount: v.amount, currencyCode: v.currencyCode }; } return null; };
    // Proposal 2: \u0111\u00e3 ch\u1ecdn ship + th\u1ebb -> t\u1ed5ng ti\u1ec1n \u0111\u00fang
    const calc = async () => {
      await proposal(ship, payLines(null));
      if (negErr.length && isSold(negErr)) throw new CoErr(L('\u58f2\u308a\u5207\u308c: ', 'H\u1ebeT H\u00c0NG trong checkout: ') + errShort(negErr), { sold: true });
      return totalNow();
    };
    let total = await calc();
    tick('tong');
    log(L(`\ud83e\uddfe \u5408\u8a08 ${total ? total.amount + ' ' + total.currencyCode : '?'}`, `\ud83e\uddfe T\u1ed5ng ti\u1ec1n ${total ? total.amount + ' ' + total.currencyCode : '?'}`));
    // 5) g\u1eedi \u0111\u1eb7t h\u00e0ng (c\u00f9ng attemptToken: g\u1eedi tr\u00f9ng th\u00ec shop tr\u1ea3 SubmitAlreadyAccepted, kh\u00f4ng th\u00e0nh 2 \u0111\u01a1n)
    let rid = null;
    for (let k = 0; k < 4 && !rid; k++) {
      const vars = { input: input(ship, payLines(total)), attemptToken: `${sourceToken}-${uuid().replace(/-/g, '').slice(0, 10)}`, metafields: [],
        analytics: { requestUrl: url, pageId: uuid().toUpperCase() } };
      let d;
      try { d = await gql('SubmitForCompletion', vars); } catch (e) {
        // kh\u00f4ng bi\u1ebft shop \u0111\u00e3 nh\u1eadn hay ch\u01b0a -> KH\u00d4NG g\u1eedi l\u1ea1i, m\u1edf trang \u0111\u1ec3 xem
        return { tt: 'unknown', checkout: url, loi: e.message, mark };
      }
      const kq = d.submitForCompletion || {};
      if (['SubmitSuccess', 'SubmitAlreadyAccepted', 'SubmittedForCompletion'].includes(kq.__typename)) { rid = (kq.receipt || {}).id; break; }
      if (kq.__typename === 'Throttled') { await sleep(Math.max(500, kq.pollAfter || 1000)); k--; continue; }
      if (kq.__typename === 'CheckpointDenied') throw new CoErr(L('\u30dc\u30c3\u30c8\u78ba\u8a8d\uff08\u30ad\u30e3\u30d7\u30c1\u30e3\uff09', 'shop b\u1eaft ki\u1ec3m tra bot (captcha)'), { ui: true });
      const errs = kq.errors || [];
      if (errs.some((e) => /PAYMENT_AMOUNT/.test(String(e.code || ''))) && k < 3) {   // t\u1ed5ng ti\u1ec1n v\u1eeba \u0111\u1ed5i: shop CH\u01afA t\u1ea1o \u0111\u01a1n -> t\u00ednh l\u1ea1i, g\u1eedi l\u1ea1i
        log(L('\u5408\u8a08\u304c\u5909\u308f\u3063\u305f \u2192 \u518d\u8a08\u7b97\u3057\u3066\u518d\u9001', 'T\u1ed5ng ti\u1ec1n v\u1eeba \u0111\u1ed5i \u2192 t\u00ednh l\u1ea1i v\u00e0 g\u1eedi l\u1ea1i'));
        total = await calc(); continue;
      }
      throw new CoErr(`SubmitForCompletion ${kq.__typename}: ${errShort(errs)}`, { ui: true, sold: isSold(errs) });
    }
    tick('gui');
    if (!rid) return { tt: 'unknown', checkout: url, mark };
    log(L(`\ud83e\uddfe \u6ce8\u6587\u9001\u4fe1\uff08\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8\u304b\u3089 ${mark.gui}ms\uff09\u2192 \u7d50\u679c\u5f85\u3061`, `\ud83e\uddfe \u0110\u00c3 G\u1eecI \u0110\u1eb6T H\u00c0NG (${mark.gui}ms t\u1eeb l\u00fac m\u1edf checkout) \u2192 ch\u1edd k\u1ebft qu\u1ea3`));
    for (let k = 0; k < 120; k++) {
      let rc = {};
      try { rc = (await gql('PollForReceipt', { receiptId: rid, sessionToken })).receipt || {}; } catch (e) { await sleep(1000); continue; }
      if (rc.__typename === 'ProcessedReceipt') return { tt: 'ok', url: rc.orderStatusPageUrl || '', order: String(((rc.orderIdentity || {}).buyerIdentifier) || rc.id || ''), total, mark };
      if (rc.__typename === 'FailedReceipt') { const pe = rc.processingError || {}; return { tt: 'fail', loi: `${pe.code || pe.__typename || 'FailedReceipt'} ${pe.messageUntranslated || ''}`.trim(), checkout: url, sold: isSold(pe), mark }; }
      if (rc.__typename === 'ActionRequiredReceipt') return { tt: '3ds', url: ((rc.action || {}).url) || url, mark };
      await sleep(Math.max(300, rc.pollDelay || 500));
    }
    return { tt: 'unknown', checkout: url, mark };
  }

  // C\u00f3 h\u00e0ng trong gi\u1ecf -> tr\u1ea3 b\u1eb1ng request. H\u1ecfng tr\u01b0\u1edbc khi g\u1eedi \u0111\u1eb7t h\u00e0ng -> m\u1edf checkout cho b\u1ea1n t\u1ef1 tr\u1ea3.
  async function rqPay() {
    setStatus(L('\ud83d\udcb3 \u30ea\u30af\u30a8\u30b9\u30c8\u3067\u652f\u6255\u3044\u4e2d\u2026', '\ud83d\udcb3 \u0110ang thanh to\u00e1n b\u1eb1ng request\u2026'));
    log(L('\ud83d\udcb3 \u30ab\u30fc\u30c9\u6255\u3044\uff08\u30ea\u30af\u30a8\u30b9\u30c8\uff09\u958b\u59cb', '\ud83d\udcb3 B\u1eaft \u0111\u1ea7u thanh to\u00e1n th\u1ebb b\u1eb1ng request'));
    let k;
    try { k = await rqCheckout(); } catch (e) {
      if (e.sold) {
        log(L('\u58f2\u308a\u5207\u308c \u2192 \u76e3\u8996\u3092\u7d9a\u3051\u307e\u3059: ', 'H\u1ebft h\u00e0ng trong l\u00fac thanh to\u00e1n \u2192 qu\u00e9t ti\u1ebfp: ') + e.message);
        try { await fetch('/cart/clear.js', { method: 'POST', credentials: 'same-origin' }); } catch (x) {}
        await sleep(1500);                          // ngh\u1ec9 ch\u00fat cho products.json k\u1ecbp c\u1eadp nh\u1eadt, kh\u1ecfi v\u00f2ng l\u1eb7p d\u1ed3n d\u1eadp
        st.active = true; save(K_ST, st); adding = false; run(); return;
      }
      log(L('\u30ea\u30af\u30a8\u30b9\u30c8\u652f\u6255\u3044\u5931\u6557 \u2192 \u8cfc\u5165\u753b\u9762\u3067\u81ea\u5206\u3067\u652f\u6255\u3063\u3066\u304f\u3060\u3055\u3044: ', 'Thanh to\u00e1n request h\u1ecfng \u2192 m\u1edf trang thanh to\u00e1n, b\u1ea1n t\u1ef1 tr\u1ea3: ') + e.message);
      // m\u1edf trang thanh to\u00e1n nh\u01b0 \u0111\u01b0\u1eddng th\u01b0\u1eddng: \u0111\u00e3 login Shop Pay th\u00ec BOT v\u1eabn t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046
      save('pjc_autopay', { at: Date.now() });
      location.href = '/checkout#synova-pay-' + Date.now(); return;
    }
    const tm = Object.entries(k.mark || {}).map(([a, v]) => `${a} ${v}ms`).join(' \u00b7 ');
    if (k.tt === 'ok') {
      log(L(`\u2705 \u6ce8\u6587\u5b8c\u4e86\uff01 ${k.order} ${k.total ? k.total.amount + ' ' + k.total.currencyCode : ''}`, `\u2705 \u0110\u1eb6T H\u00c0NG TH\u00c0NH C\u00d4NG! M\u00e3 \u0111\u01a1n ${k.order} ${k.total ? k.total.amount + ' ' + k.total.currencyCode : ''}`));
      if (tm) log('\u23f1 ' + tm);
      let last = null;
      try { last = JSON.parse(localStorage.getItem('pjc_last')); } catch (e) {}
      synovaNotify((last && last.items && last.items.length ? last.items : [{ title: SHOP, url: location.origin }]).map((it) => ({
        author: '\u2705 Checkout Successful (request)', title: it.title, url: it.url, thumb: it.image, site: location.hostname,
        fields: [['Size', it.size], ['\u4fa1\u683c', it.price], ['Quantity', it.qty], ['Order', k.order], ['Site', location.hostname, false]] })));
      try { localStorage.removeItem('pjc_last'); } catch (e) {}
      beep(); setStatus(L('\u2705 \u6ce8\u6587\u5b8c\u4e86', '\u2705 \u0110\u1eb7t h\u00e0ng th\u00e0nh c\u00f4ng'));
      // \u0111\u00e3 b\u00e1o Discord \u1edf \u0111\u00e2y -> \u0111\u00e1nh d\u1ea5u \u0111\u1ec3 trang c\u1ea3m \u01a1n kh\u00f4ng b\u00e1o l\u1ea7n 2
      if (k.url) { try { localStorage.setItem('synova_sent_' + new URL(k.url, location.origin).pathname, '1'); } catch (e) {} location.href = k.url; }
      return;
    }
    if (k.tt === '3ds') { log(L('\ud83d\udd10 3D\u30bb\u30ad\u30e5\u30a2 \u2192 \u753b\u9762\u3067\u8a8d\u8a3c\u3057\u3066\u304f\u3060\u3055\u3044', '\ud83d\udd10 Th\u1ebb c\u1ea7n 3D Secure \u2192 x\u00e1c th\u1ef1c tr\u00ean m\u00e0n h\u00ecnh')); location.href = k.url; return; }
    if (k.tt === 'fail') { log(L('\u274c \u30ab\u30fc\u30c9\u6c7a\u6e08\u5931\u6557: ', '\u274c Thanh to\u00e1n b\u1ecb t\u1eeb ch\u1ed1i: ') + k.loi); location.href = k.checkout; return; }
    log(L('\u6ce8\u6587\u9001\u4fe1\u6e08\u307f\u30fb\u7d50\u679c\u4e0d\u660e \u2192 \u753b\u9762\u3067\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\uff08\u518d\u9001\u3057\u307e\u305b\u3093\uff09', '\u0110\u00e3 g\u1eedi \u0111\u1eb7t h\u00e0ng nh\u01b0ng ch\u01b0a c\u00f3 k\u1ebft qu\u1ea3 \u2192 m\u1edf trang \u0111\u1ec3 xem (BOT kh\u00f4ng g\u1eedi l\u1ea1i)') + (k.loi ? ': ' + k.loi : ''));
    location.href = k.checkout;
  }

  // M\u1edf s\u1eb5n k\u1ebft n\u1ed1i t\u1edbi m\u00e1y ch\u1ee7 \u1ea3nh/checkout c\u1ee7a Shopify \u0111\u1ec3 trang thanh to\u00e1n t\u1ea3i nhanh h\u01a1n
  function warmUp() {
    for (const h of ['https://cdn.shopify.com', IS_US ? 'https://shop.app' : null].filter(Boolean)) {
      if (document.querySelector(`link[rel=preconnect][href="${h}"]`)) continue;
      const l = document.createElement('link'); l.rel = 'preconnect'; l.href = h; l.crossOrigin = ''; document.head.appendChild(l);
    }
  }

  let adding = false, inflight = 0, backoffUntil = 0, slowMode = false, hits429 = 0, denseMs = DENSE_MS, logged429 = false;
  // Mellojoy JP (user ch\u1ecdn 3/11, h\u1ecdc BOT \u0111\u1ed1i th\u1ee7): m\u00f3n \u0110\u00c3 l\u00ean products.json + c\u00f2n h\u00e0ng -> m\u1edf th\u1eb3ng link /cart/<vid>:<qty>,...
  // = th\u00eam gi\u1ecf + sang thanh to\u00e1n trong 1 l\u01b0\u1ee3t (b\u1edbt 1 l\u01b0\u1ee3t ch\u1edd m\u00e1y ch\u1ee7 l\u00fac 12:00). M\u00f3n th\u00eam m\u00f9 (variant ID ch\u01b0a l\u00ean web) v\u1eabn qua
  // /cart/add.js: m\u00f3n ch\u01b0a l\u00ean / b\u1ecb g\u1ee1 m\u00e0 m\u1edf link th\u00ec Shopify ra trang l\u1ed7i \u300c\u30ea\u30f3\u30af\u306f\u3082\u3046\u5b58\u5728\u3057\u3066\u304a\u308a\u307e\u305b\u3093\u300d.
  // Link b\u1ecb t\u1eeb ch\u1ed1i (v\u1eeba h\u1ebft / v\u01b0\u1ee3t s\u1ed1 l\u01b0\u1ee3ng m\u1ed7i \u0111\u01a1n) -> trang l\u1ed7i \u0111\u00f3 t\u1ef1 quay l\u1ea1i, 10 ph\u00fat d\u00f9ng l\u1ea1i c\u00e1ch th\u00eam gi\u1ecf c\u0169.
  const K_PERMA = 'pjc_perma_v1', K_PERMA_OFF = 'pjc_perma_off_v1';
  const permaOn = () => !IS_US && Date.now() - (load(K_PERMA_OFF, 0) || 0) > 10 * 60e3;

  // x\u1eed l\u00fd 1 k\u1ebft qu\u1ea3 d\u00f2: c\u00f3 h\u00e0ng -> th\u00eam gi\u1ecf -> sang thanh to\u00e1n (ch\u1ec9 1 l\u01b0\u1ee3t \u0111\u01b0\u1ee3c l\u00e0m vi\u1ec7c n\u00e0y)
  async function handle(products) {
    if (adding || !st.active) return;
    let { out, missing, wanted, capped } = plan(products);
    lastFound = `${wanted.length - missing.length}/${wanted.length}`;                       // c\u00f2n h\u00e0ng
    lastShelf = `${wanted.length - missing.filter((m) => !m.seen).length}/${wanted.length}`;  // c\u00f3 tr\u00ean trang (k\u1ec3 c\u1ea3 Sold out)
    if (!out.length) out = directList(missing);
    if (!out.length) { setStatus(L(`\u8a72\u5f53\u306a\u3057\uff08\u63b2\u8f09${lastShelf}\u30fb\u5728\u5eab${lastFound}\uff09`, `Ch\u01b0a c\u00f3 h\u00e0ng (l\u00ean k\u1ec7 ${lastShelf} \u00b7 c\u00f2n h\u00e0ng ${lastFound})`)); return; }
    adding = true;
    const scan = lastScan, tAdd = performance.now();
    if (permaOn() && out.every((x) => !x.direct)) {
      st.active = false; save(K_ST, st);
      saveForWebhook(out);
      save('pjc_autopay', null);                 // JP: b\u1ea1n t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046
      save(K_PERMA, { at: Date.now(), page: location.pathname + location.search, now: !!st.now });
      location.href = '/cart/' + out.map((x) => `${x.id}:${x.qty}`).join(',');   // chuy\u1ec3n trang NGAY
      const sentAt = new Date(scan.sent + 9 * 3600e3).toISOString().slice(11, 23);
      log(L(`\u5728\u5eab\u691c\u51fa: ${sentAt} \u306b\u9001\u3063\u305f\u30b9\u30ad\u30e3\u30f3\uff08\u30b5\u30fc\u30d0\u30fc\u5fdc\u7b54 ${scan.ms}ms\uff09\u2192 \u76f4\u884c\u30ea\u30f3\u30af\u3067\u8cfc\u5165\u753b\u9762\u3078\uff08\u300c\u4eca\u3059\u3050\u652f\u6255\u3046\u300d\u306f\u81ea\u5206\u3067\u30bf\u30c3\u30d7\uff09`,
            `Th\u1ea5y h\u00e0ng \u1edf l\u01b0\u1ee3t qu\u00e9t g\u1eedi l\u00fac ${sentAt} (m\u00e1y ch\u1ee7 tr\u1ea3 sau ${scan.ms}ms) \u2192 m\u1edf link th\u1eb3ng v\u00e0o thanh to\u00e1n (b\u1ea1n t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046)`));
      log(L('\u76f4\u884c: ', 'Link th\u1eb3ng: ') + out.map((x) => `${x.title.slice(0, 18)}\u00d7${x.qty}`).join(', '));
      if (capped.length) log(L(`\u5728\u5eab\u3042\u308a\u304c${MAX_PICK}\u30b3\u30fc\u30c9\u8d85\u3048 \u2192 \u30e9\u30f3\u30c0\u30e0\u306b${MAX_PICK}\u500b\u9078\u629e\u3001\u9664\u5916: `, `C\u00f3 h\u01a1n ${MAX_PICK} m\u00e3 c\u00f2n h\u00e0ng \u2192 ch\u1ecdn ng\u1eabu nhi\u00ean ${MAX_PICK}, b\u1ecf: `) + capped.map((x) => x.title.slice(0, 18)).join(', '));
      beep();
      return;
    }
    let n = 0;
    try {
      const r = await addAll(out);
      n = out.length;
      if (r.ok) out.forEach((x) => fillFromCart(x, r.items));
      else {
        // shop b\u00e1o \u0111\u00e3 cho v\u00e0o gi\u1ecf \u00edt h\u01a1n s\u1ed1 xin / \u0111\u00e3 t\u1ed1i \u0111a -> \u0111\u1ecdc gi\u1ecf NGAY, kh\u1ecfi th\u1eed l\u1ea1i 3 -> 2 -> 1 c\u00e1i
        if (/only \d+ items? (was|were) added|already in your cart/i.test(r.msg)) await rescueFromCart(out);
        const rest = out.filter((x) => !x.inCart);
        if (rest.length) {
          await addEach(rest, out.length === 1 ? r : null);
          // \u0111\u1ecdc gi\u1ecf l\u1ea7n n\u1eefa ch\u1ec9 khi c\u00f2n m\u00f3n h\u1ecfng m\u00e0 KH\u00d4NG ph\u1ea3i do h\u1ebft h\u00e0ng (shop c\u00f3 th\u1ec3 \u0111\u00e3 cho v\u00e0o 1 ph\u1ea7n)
          if (rest.some((x) => !x.qty && !SOLD_MSG.test(x.err || ''))) await rescueFromCart(rest);
        }
        for (const x of out) if (!x.qty && x.err && !x.direct) log(L('\u8ffd\u52a0\u5931\u6557: ', 'Th\u00eam th\u1ea5t b\u1ea1i: ') + `${x.title.slice(0, 22)} (${x.err})`);
        out = out.filter((x) => x.qty > 0);
        n = out.length;
      }
    } catch (e) {
      n = 0;
      log(L('\u30ab\u30fc\u30c8\u8ffd\u52a0\u30a8\u30e9\u30fc: ', 'L\u1ed7i th\u00eam gi\u1ecf: ') + e.message);
    }
    if (n > 0) {
      st.active = false; save(K_ST, st);
      saveForWebhook(out);
      // T\u1ef1 b\u1ea5m thanh to\u00e1n:
      //   \u00b7 \u0110\u00c3 \u0110\u0102NG NH\u1eacP shop -> m\u1edf checkout, shop c\u00f3 s\u1eb5n \u0111\u1ecba ch\u1ec9 / th\u1ebb (ho\u1eb7c chuy\u1ec3n sang Shop Pay) -> BOT b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046
      //   \u00b7 CH\u01afA \u0111\u0103ng nh\u1eadp + khung \u0111\u00e3 nh\u1eadp \u0111\u1ee7 \u0111\u1ecba ch\u1ec9 + th\u1ebb -> tr\u1ea3 b\u1eb1ng REQUEST ngay t\u1ea1i trang n\u00e0y (mua ki\u1ec3u kh\u00e1ch)
      //   \u00b7 CH\u01afA \u0111\u0103ng nh\u1eadp + khung ch\u01b0a \u0111\u1ee7 -> m\u1edf checkout; Shop Pay nh\u1eadn ra m\u00e1y (\u0111\u00e3 \u0111\u0103ng nh\u1eadp Shop Pay) th\u00ec BOT b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046
      const b0 = buy(), viaRq = IS_US && !loggedIn() && hasCard(b0) && hasAddr(b0) && !rqBlocked();   // JP: lu\u00f4n m\u1edf trang thanh to\u00e1n (\u0111\u00e3 login)
      // Mellojoy JP: user t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046 (y\u00eau c\u1ea7u 2/11) -> ch\u1ec9 m\u1edf trang thanh to\u00e1n, KH\u00d4NG \u0111\u00e1nh d\u1ea5u t\u1ef1 b\u1ea5m
      save('pjc_autopay', IS_US && !viaRq ? { at: Date.now() } : null);
      log(!IS_US ? L('\u30ab\u30fc\u30c8\u306b\u8ffd\u52a0 \u2192 \u8cfc\u5165\u753b\u9762\u3092\u958b\u304d\u307e\u3059\uff08\u300c\u4eca\u3059\u3050\u652f\u6255\u3046\u300d\u306f\u81ea\u5206\u3067\u30bf\u30c3\u30d7\uff09', '\u0110\u00e3 v\u00e0o gi\u1ecf \u2192 m\u1edf trang thanh to\u00e1n (b\u1ea1n t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046)')
        : viaRq ? L('\u672a\u30ed\u30b0\u30a4\u30f3 \u2192 \u5165\u529b\u3057\u305f\u914d\u9001\u5148\u30fb\u30ab\u30fc\u30c9\u3067\u30ea\u30af\u30a8\u30b9\u30c8\u8cfc\u5165', 'Ch\u01b0a login shop \u2192 tr\u1ea3 b\u1eb1ng request v\u1edbi \u0111\u1ecba ch\u1ec9 + th\u1ebb trong khung')
        : loggedIn() ? L('\u30ed\u30b0\u30a4\u30f3\u6e08\u307f \u2192 \u4fdd\u5b58\u6e08\u307f\u306e\u60c5\u5831\u3067\u8cfc\u5165\u753b\u9762\u306e\u652f\u6255\u3044\u30dc\u30bf\u30f3\u3092\u62bc\u3057\u307e\u3059', '\u0110\u00e3 login shop \u2192 m\u1edf thanh to\u00e1n, b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046 b\u1eb1ng th\u00f4ng tin \u0111\u00e3 l\u01b0u')
        : L('\u672a\u30ed\u30b0\u30a4\u30f3\u30fb\u5165\u529b\u4e0d\u8db3 \u2192 \u8cfc\u5165\u753b\u9762\u3078\uff08Shop Pay \u30ed\u30b0\u30a4\u30f3\u6e08\u307f\u306a\u3089\u81ea\u52d5\u3067\u652f\u6255\u3044\uff09', 'Ch\u01b0a login, khung ch\u01b0a \u0111\u1ee7 \u2192 m\u1edf thanh to\u00e1n (\u0111\u00e3 login Shop Pay th\u00ec BOT t\u1ef1 b\u1ea5m)'));
      if (viaRq) rqPay(); else location.href = '/checkout' + (IS_US ? '#synova-pay-' + Date.now() : '');   // chuy\u1ec3n trang NGAY
      const addMs = Math.round(performance.now() - tAdd);
      const sentAt = new Date(scan.sent + 9 * 3600e3).toISOString().slice(11, 23);
      log(L(`\u5728\u5eab\u691c\u51fa: ${sentAt} \u306b\u9001\u3063\u305f\u30b9\u30ad\u30e3\u30f3\uff08\u30b5\u30fc\u30d0\u30fc\u5fdc\u7b54 ${scan.ms}ms\uff09\u2192 \u30ab\u30fc\u30c8\u8ffd\u52a0 ${addMs}ms`,
            `Th\u1ea5y h\u00e0ng \u1edf l\u01b0\u1ee3t qu\u00e9t g\u1eedi l\u00fac ${sentAt} (m\u00e1y ch\u1ee7 tr\u1ea3 sau ${scan.ms}ms) \u2192 v\u00e0o gi\u1ecf m\u1ea5t ${addMs}ms`));
      log(L('\u5728\u5eab\u3042\u308a \u2192 \u30ab\u30fc\u30c8\u306b\u8ffd\u52a0 \u2192 \u8cfc\u5165\u753b\u9762\u3078: ', 'C\u00f3 h\u00e0ng \u2192 \u0111\u00e3 v\u00e0o gi\u1ecf \u2192 sang thanh to\u00e1n: ') + out.map((x) => `${x.title.slice(0, 18)}\u00d7${x.qty}`).join(', '));
      if (capped.length) log(L(`\u5728\u5eab\u3042\u308a\u304c${MAX_PICK}\u30b3\u30fc\u30c9\u8d85\u3048 \u2192 \u30e9\u30f3\u30c0\u30e0\u306b${MAX_PICK}\u500b\u9078\u629e\u3001\u9664\u5916: `, `C\u00f3 h\u01a1n ${MAX_PICK} m\u00e3 c\u00f2n h\u00e0ng \u2192 ch\u1ecdn ng\u1eabu nhi\u00ean ${MAX_PICK}, b\u1ecf: `) + capped.map((x) => x.title.slice(0, 18)).join(', '));
      const skipped = missing.filter((m) => !out.some((x) => x.direct && x.kw === m.it.kw));
      if (skipped.length) log(L('\u30b9\u30ad\u30c3\u30d7\uff08\u672a\u63b2\u8f09\u30fb\u58f2\u308a\u5207\u308c\uff09: ', 'B\u1ecf qua (ch\u01b0a l\u00ean k\u1ec7 / h\u1ebft h\u00e0ng): ') + skipped.map((m) => m.it.kw).join(', '));
      beep();
      return;
    }
    adding = false;                            // kh\u00f4ng th\u00eam \u0111\u01b0\u1ee3c m\u00f3n n\u00e0o -> qu\u00e9t ti\u1ebfp
    setStatus(L('\u30ab\u30fc\u30c8\u8ffd\u52a0\u3067\u304d\u305a \u2192 \u76e3\u8996\u3092\u7d9a\u3051\u307e\u3059', 'Kh\u00f4ng th\u00eam \u0111\u01b0\u1ee3c v\u00e0o gi\u1ecf \u2192 qu\u00e9t ti\u1ebfp'));
  }

  function usRetryWait(header) {
    const value = header?.trim() || '';
    const delay = /^\d+$/.test(value) ? Number(value) * 1000 : Date.parse(value) - Date.now();
    const fallback = Math.min(60000, 5000 * 2 ** Math.max(0, hits429 - 1));
    return Number.isFinite(delay) && delay > 0 ? Math.max(1000, delay) : fallback;
  }

  async function scan(gen = runGen) {
    inflight++;
    try {
      const ps = await getProducts();
      if (IS_US && (gen !== runGen || !st.active || Date.now() < backoffUntil)) return;
      if (IS_US && usPoll > US_POLL_MS && ++usOk >= 20) {
        usPoll = Math.max(US_POLL_MS, usPoll - 500);
        usOk = 0;
      }
      hits429 = 0;                               // g\u1eedi \u0111\u01b0\u1ee3c l\u1ea1i -> h\u1ebft b\u1ecb ch\u1eb7n
      if (denseMs > DENSE_MS) denseMs = Math.max(DENSE_MS, denseMs - 10);   // h\u1ebft b\u1ecb ch\u1eb7n -> nh\u1ecbp qu\u00e9t nhanh d\u1ea7n v\u1ec1 300ms
      await handle(ps);
    } catch (e) {
      if (e.message === '429') {
        const now = Date.now();
        if (IS_US) {
          const previous = Math.max(backoffUntil, Number(load(K_US_RETRY_AT, 0)) || 0);
          if (now >= previous) {
            hits429++;
            usPoll = Math.min(5000, usPoll * 2);
            usOk = 0;
          }
          backoffUntil = Math.max(previous, now + usRetryWait(e.retryAfter));
          save(K_US_RETRY_AT, backoffUntil);
          if (now >= previous && st.active) log(`ショップのアクセス制限 (429) により ${Math.ceil((backoffUntil - now) / 1000)}秒待機します`);
          return;
        }
        if (now >= backoffUntil) {               // nhi\u1ec1u l\u01b0\u1ee3t c\u00f9ng tr\u1ea3 429 -> ch\u1ec9 t\u00ednh 1 l\u1ea7n
          hits429++;
          let wait = Math.min(BACKOFF_MAX, BACKOFF_MIN * 2 ** (hits429 - 1));
          const retryAfter = parseFloat(e.retryAfter) || 0;
          if (retryAfter > 0) wait = Math.min(BACKOFF_MAX, Math.max(BACKOFF_MIN, retryAfter * 1000));
          backoffUntil = now + wait;
          denseMs = Math.min(600, denseMs + 100);      // b\u1ecb 429: gi\u00e3n nh\u1ecbp 300 \u2192 400 \u2192 \u2026 \u2192 600ms
          setStatus(L('\u5728\u5eab\u76e3\u8996\u4e2d\u2026', '\u0110ang canh h\u00e0ng\u2026'));
        }
      } else setStatus(L('\u30a8\u30e9\u30fc: ', 'L\u1ed7i: ') + e.message);
    } finally {
      inflight--;
    }
  }

  let ticker = null;
  function startTicker() {
    if (ticker) return;
    const t0 = Date.now();
    let prev = { ...stats }, sec = 0;
    ticker = setInterval(() => {
      if (!st.active) { clearInterval(ticker); ticker = null; return; }
      sec++;
      const d = { req: stats.req - prev.req, ok: stats.ok - prev.ok, r429: stats.r429 - prev.r429, err: stats.err - prev.err, lat: stats.lat - prev.lat };
      if (sec > 60 && sec % (IS_US ? 60 : 10)) return;       // sau 60 gi\u00e2y: 10 gi\u00e2y ghi 1 d\u00f2ng (US canh l\u00e2u: 1 ph\u00fat)
      prev = { ...stats };
      // m\u1ed7i gi\u00e2y: 1 d\u00f2ng cho t\u1eebng t\u1eeb kh\u00f3a. Ghi ng\u01b0\u1ee3c (KW cu\u1ed1i tr\u01b0\u1edbc) \u0111\u1ec3 log m\u1edbi-\u1edf-tr\u00ean hi\u1ec7n KW1 tr\u00ean c\u00f9ng
      const ST = { in: L('\u5728\u5eab\u3042\u308a\u2705', 'c\u00f2n h\u00e0ng \u2705'), out: L('\u58f2\u308a\u5207\u308c', 'h\u1ebft h\u00e0ng'), none: L('\u672a\u63b2\u8f09', 'ch\u01b0a l\u00ean k\u1ec7') };
      if (IS_US && Date.now() < backoffUntil) return;
      if (d.err && !d.ok) log(L('\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30a8\u30e9\u30fc', 'l\u1ed7i m\u1ea1ng'));
      const wait = Date.now() - Math.max(lastOkAt, IS_US ? backoffUntil : 0);
      if (wait > 2500 + (cfg.monitorDelay || 0)) log(L(`\u23f3 \u30b7\u30e7\u30c3\u30d7\u5fdc\u7b54\u306a\u3057 ${Math.round(wait / 1000)}\u79d2\uff08\u518d\u9001\u4e2d\uff09`, `\u23f3 Shop ch\u01b0a tr\u1ea3 l\u1eddi ${Math.round(wait / 1000)} gi\u00e2y (\u0111ang g\u1eedi l\u1ea1i)`));
      else for (const k of [...kwStat].reverse()) log(`[${k.label}] ${k.kw} \u00b7 ${ST[k.st]}`);
      if (adding) log(L('\u5728\u5eab\u3042\u308a \u2192 \u30ab\u30fc\u30c8\u306b\u8ffd\u52a0\u4e2d\u2026', 'C\u00f3 h\u00e0ng \u2192 \u0111ang th\u00eam v\u00e0o gi\u1ecf\u2026'));
    }, 1000);
  }

  let runGen = 0;
  async function run() {
    warmUp();
    adding = false; slowMode = false; hits429 = 0; denseMs = DENSE_MS; logged429 = false;
    if (!IS_US) inflight = 0;
    kwStat = []; lastOkAt = Date.now();
    const gen = ++runGen;                       // b\u1ea5m D\u1eebng -> B\u1eaft \u0111\u1ea7u l\u1ea1i: v\u00f2ng c\u0169 (c\u00f3 th\u1ec3 \u0111ang ch\u1edd shop) t\u1ef1 tho\u00e1t, kh\u00f4ng ch\u1ea1y 2 v\u00f2ng
    let denseShown = false, opened = false;
    while (st.active && gen === runGen) {
      const t0 = Date.now();
      const left = st.now ? -1 : msToOpen();
      if (opened && !st.now && left > WATCH_FROM_SEC * 1000) { finish(L(`${GIVE_UP_MIN}\u5206\u904e\u304e\u3066\u3082\u58f2\u308a\u5207\u308c \u2192 \u505c\u6b62`, `Qu\u00e1 ${GIVE_UP_MIN} ph\u00fat v\u1eabn h\u1ebft h\u00e0ng \u2013 d\u1eebng`)); return; }
      if (left <= WATCH_FROM_SEC * 1000) opened = true;
      if (left > WATCH_FROM_SEC * 1000) {
        const s = Math.ceil(left / 1000);
        setStatus(L(`${cfg.open}\uff08\u65e5\u672c\u6642\u9593\uff09\u307e\u3067: `, `C\u00f2n t\u1edbi ${cfg.open} gi\u1edd Nh\u1eadt: `) + `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`);
        await sleep(Math.min(1000, left - WATCH_FROM_SEC * 1000));
        continue;
      }
      if (!st.now && left < -GIVE_UP_MIN * 60e3) { finish(L(`${GIVE_UP_MIN}\u5206\u904e\u304e\u3066\u3082\u58f2\u308a\u5207\u308c \u2192 \u505c\u6b62`, `Qu\u00e1 ${GIVE_UP_MIN} ph\u00fat v\u1eabn h\u1ebft h\u00e0ng \u2013 d\u1eebng`)); return; }
      startTicker();
      if (IS_US) {
        backoffUntil = Math.max(backoffUntil, Number(load(K_US_RETRY_AT, 0)) || 0);
        const remaining = backoffUntil - Date.now();
        if (remaining > 0) {
          usPoll = Math.max(usPoll, US_POLL_MS * 2);
          setStatus(`アクセス制限 (429) で待機中。再開まで ${Math.ceil(remaining / 1000)}秒`);
          await sleep(Math.min(remaining, 1000));
          continue;
        }
      }
      if (adding || Date.now() < backoffUntil) { await sleep(40); continue; }
      const dense = !st.now && !slowMode && left <= -DENSE_FROM_MS && left > -DENSE_FOR_MS;
      curDense = dense;
      if (dense) {
        if (!denseShown) { denseShown = true; log(L('\u9ad8\u901f\u30b9\u30ad\u30e3\u30f3\u958b\u59cb', 'B\u1eaft \u0111\u1ea7u qu\u00e9t t\u1ed1c \u0111\u1ed9 cao')); }
        if (inflight < MAX_INFLIGHT) scan();      // kh\u00f4ng await: c\u00e1c l\u01b0\u1ee3t ch\u1ed3ng l\u00ean nhau
        await sleep(Math.max(denseMs, cfg.monitorDelay || 0));
      } else if (IS_US) {
        // US canh li\u00ean t\u1ee5c: g\u1eedi theo nh\u1ecbp, KH\u00d4NG ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc tr\u1ea3 l\u1eddi (t\u1ed1i \u0111a 2 l\u01b0\u1ee3t c\u00f9ng l\u00fac)
        // -> 1 request b\u1ecb shop gi\u1eef l\u00e2u kh\u00f4ng l\u00e0m BOT \u0111\u1ee9ng im (log 2/11: c\u00f2n h\u00e0ng m\u00e0 kh\u00f4ng th\u00eam gi\u1ecf m\u1ea5y ph\u00fat)
        if (inflight < 2) scan();
        const interval = usPoll === US_POLL_MS && Date.now() < usBurstUntil ? US_BURST_MS : usPoll;
        await sleep(Math.max(interval, cfg.monitorDelay || 0) + Math.random() * 60);
      } else {
        await scan();
        await sleep(Math.max(0, Math.max(POLL_MS, cfg.monitorDelay || 0) + Math.random() * 60 - (Date.now() - t0)));
      }
    }
  }

  function start(now) {
    readCfg();
    if (!cfg.items.slice(0, cfg.kwCount).some((i) => i.kw.trim())) { log(L('\u30ad\u30fc\u30ef\u30fc\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp t\u1eeb kh\u00f3a')); return; }
    if (!now && !/^\d{1,2}:\d{2}$/.test(cfg.open || '')) { log(L('\u8ca9\u58f2\u958b\u59cb\u6642\u523b\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp gi\u1edd m\u1edf b\u00e1n')); return; }
    st.active = true; st.now = !!now; save(K_ST, st); keepAwake();
    log(IS_US ? L(`${SHOP}: \u76e3\u8996\u30b9\u30bf\u30fc\u30c8\uff08\u5728\u5eab\u304c\u51fa\u308b\u307e\u3067\u7d9a\u3051\u307e\u3059\uff09`, `${SHOP}: b\u1eaft \u0111\u1ea7u canh h\u00e0ng li\u00ean t\u1ee5c (t\u1edbi khi c\u00f3 h\u00e0ng)`) : now ? L(`${SHOP}: \u4eca\u3059\u3050\u76e3\u8996`, `${SHOP}: canh h\u00e0ng ngay`) : L(`${SHOP}: ${cfg.open}\uff08\u65e5\u672c\u6642\u9593\uff09\u307e\u3067\u5f85\u6a5f`, `${SHOP}: ch\u1edd t\u1edbi ${cfg.open} gi\u1edd Nh\u1eadt`)); run();
  }
  function finish(m) { st.active = false; save(K_ST, st); log(m); setStatus(m); }
  let wakeLock = null;
  async function keepAwake() {
    try { if (st.active && !wakeLock && navigator.wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); } } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') keepAwake(); });
  function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(); o.frequency.value = 880; o.connect(a.destination); o.start(); o.stop(a.currentTime + 0.4); } catch (e) {} }

  // ---------- B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n ----------
  // Log m\u1edbi n\u1eb1m TR\u00caN C\u00d9NG, ch\u1ec9 gi\u1eef LOG_MAX d\u00f2ng m\u1edbi nh\u1ea5t (d\u00f2ng c\u0169 t\u1ef1 x\u00f3a). 4/11 th\u00e0nh vi\u00ean t\u01b0\u1edfng log "d\u1eebng" \u1edf 1500 d\u00f2ng
  // v\u00ec con s\u1ed1 \u0111\u1ee9ng y\u00ean -> hi\u1ec7n th\u00eam gi\u1edd c\u1ee7a d\u00f2ng m\u1edbi nh\u1ea5t. L\u01b0u localStorage t\u1ed1i \u0111a 1 l\u1ea7n / gi\u00e2y (tr\u01b0\u1edbc: m\u1ed7i d\u00f2ng ghi l\u1ea1i
  // c\u1ea3 1500 d\u00f2ng, iPhone gi\u1eadt l\u00fac \u0111\u00f4ng); khung log \u0111ang \u0111\u00f3ng th\u00ec kh\u00f4ng v\u1ebd l\u1ea1i. R\u1eddi trang th\u00ec l\u01b0u ngay (pagehide).
  const LOG_MAX = 1500;
  let logBuf = load(K_LOG, []), logSaveT = 0, logLast = '';
  const logFlush = () => { if (logSaveT) { clearTimeout(logSaveT); logSaveT = 0; } save(K_LOG, logBuf); };
  window.addEventListener('pagehide', logFlush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') logFlush(); });
  const logCount = () => L(`${logBuf.length}\u884c${logBuf.length >= LOG_MAX ? '\uff08\u6700\u65b0\u5206\u306e\u307f\u4fdd\u6301\uff09' : ''}${logLast ? ' \u00b7 \u6700\u65b0 ' + logLast : ''}`,
    `${logBuf.length} d\u00f2ng${logBuf.length >= LOG_MAX ? ' (ch\u1ec9 gi\u1eef d\u00f2ng m\u1edbi nh\u1ea5t)' : ''}${logLast ? ' \u00b7 m\u1edbi nh\u1ea5t ' + logLast : ''}`);
  function log(m) {
    const iso = jstNow().toISOString();            // gi\u1edd Nh\u1eadt: MM/DD HH:MM:SS.mmm
    logBuf.unshift(`${iso.slice(5, 7)}/${iso.slice(8, 10)} ${iso.slice(11, 23)} ${m}`);
    if (logBuf.length > LOG_MAX) logBuf.length = LOG_MAX;
    logLast = iso.slice(11, 19);
    if (!logSaveT) logSaveT = setTimeout(logFlush, 1000);
    const el = document.getElementById('pjclog'); if (el && el.getClientRects().length) el.textContent = logBuf.join('\n');
    const n = document.getElementById('pjclogn'); if (n) n.textContent = logCount();
  }
  function setStatus(s) { const el = document.getElementById('pjcst'); if (el) el.textContent = s; }
  function readCfg() {
    for (let i = 0; i < MAX_KW; i++) {
      cfg.items[i].kw = document.getElementById('pjck' + i).value.trim();
      cfg.items[i].qty = +document.getElementById('pjcq' + i).value;
    }
    cfg.backup.kw = document.getElementById('pjckb').value.trim();
    cfg.backup.qty = +document.getElementById('pjcqb').value;
    cfg.open = document.getElementById('pjcopen').value;
    const delay = document.getElementById('pjcmonitor');
    cfg.monitorDelay = monitorDelay(delay.value, POLL_MS);
    delay.value = cfg.monitorDelay || '';
    save(K_CFG, cfg);
  }

  const ui = load(K_UI, { top: true, small: false });
  const box = document.createElement('div');
  box.id = 'pjcbox';
  const goLabel = () => IS_US ? L('\u76e3\u8996\u30b9\u30bf\u30fc\u30c8\uff08\u8ca9\u58f2\u6642\u523b\u30d5\u30ea\u30fc\uff09', 'B\u1eadt canh h\u00e0ng li\u00ean t\u1ee5c') : (cfg.open ? L(`${cfg.open} \u306b\u4e88\u7d04\u30fb\u81ea\u52d5\u30b9\u30bf\u30fc\u30c8`, `H\u1eb9n \u0111\u1ebfn ${cfg.open} T\u1ef1 B\u1eadt`) : L('\u8ca9\u58f2\u958b\u59cb\u6642\u523b\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp gi\u1edd m\u1edf b\u00e1n'));
  const MAX_QTY = IS_US ? 12 : 3;           // s\u1ed1 l\u01b0\u1ee3ng m\u1ed7i m\u00e3: US 1\u201312 (user \u0111\u1ed5i 2/11), JP 1\u20133 (Mellojoy JP gi\u1edbi h\u1ea1n 3/m\u00f3n)
  const qtySel = (id) => `<select id="${id}">${Array.from({ length: MAX_QTY }, (_, i) => `<option>${i + 1}</option>`).join('')}</select>`;
  const fi = (id, ph, extra) => `<input id="pjcb_${id}" placeholder="${ph}" ${extra || ''}>`;
  const ZONES = { US: [["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"]],
    JP: [["JP-01", "\u5317\u6d77\u9053"], ["JP-02", "\u9752\u68ee\u770c"], ["JP-03", "\u5ca9\u624b\u770c"], ["JP-04", "\u5bae\u57ce\u770c"], ["JP-05", "\u79cb\u7530\u770c"], ["JP-06", "\u5c71\u5f62\u770c"], ["JP-07", "\u798f\u5cf6\u770c"], ["JP-08", "\u8328\u57ce\u770c"], ["JP-09", "\u6803\u6728\u770c"], ["JP-10", "\u7fa4\u99ac\u770c"], ["JP-11", "\u57fc\u7389\u770c"], ["JP-12", "\u5343\u8449\u770c"], ["JP-13", "\u6771\u4eac\u90fd"], ["JP-14", "\u795e\u5948\u5ddd\u770c"], ["JP-15", "\u65b0\u6f5f\u770c"], ["JP-16", "\u5bcc\u5c71\u770c"], ["JP-17", "\u77f3\u5ddd\u770c"], ["JP-18", "\u798f\u4e95\u770c"], ["JP-19", "\u5c71\u68a8\u770c"], ["JP-20", "\u9577\u91ce\u770c"], ["JP-21", "\u5c90\u961c\u770c"], ["JP-22", "\u9759\u5ca1\u770c"], ["JP-23", "\u611b\u77e5\u770c"], ["JP-24", "\u4e09\u91cd\u770c"], ["JP-25", "\u6ecb\u8cc0\u770c"], ["JP-26", "\u4eac\u90fd\u5e9c"], ["JP-27", "\u5927\u962a\u5e9c"], ["JP-28", "\u5175\u5eab\u770c"], ["JP-29", "\u5948\u826f\u770c"], ["JP-30", "\u548c\u6b4c\u5c71\u770c"], ["JP-31", "\u9ce5\u53d6\u770c"], ["JP-32", "\u5cf6\u6839\u770c"], ["JP-33", "\u5ca1\u5c71\u770c"], ["JP-34", "\u5e83\u5cf6\u770c"], ["JP-35", "\u5c71\u53e3\u770c"], ["JP-36", "\u5fb3\u5cf6\u770c"], ["JP-37", "\u9999\u5ddd\u770c"], ["JP-38", "\u611b\u5a9b\u770c"], ["JP-39", "\u9ad8\u77e5\u770c"], ["JP-40", "\u798f\u5ca1\u770c"], ["JP-41", "\u4f50\u8cc0\u770c"], ["JP-42", "\u9577\u5d0e\u770c"], ["JP-43", "\u718a\u672c\u770c"], ["JP-44", "\u5927\u5206\u770c"], ["JP-45", "\u5bae\u5d0e\u770c"], ["JP-46", "\u9e7f\u5150\u5cf6\u770c"], ["JP-47", "\u6c96\u7e04\u770c"]] };
  box.innerHTML = `
<style>
#pjcbox{position:fixed;left:8px;right:8px;z-index:2147483647;background:#0d1b32;color:#f2f2f2;border:1px solid #527198;border-radius:16px;
  box-shadow:0 6px 24px #000c;padding:10px 12px;font:13px -apple-system,"Hiragino Sans",sans-serif}
#pjcbox.top{top:calc(env(safe-area-inset-top) + 6px)} #pjcbox.bot{bottom:calc(env(safe-area-inset-bottom) + 10px)}
#pjcbox .hd{display:flex;gap:6px;align-items:center;font-weight:700} #pjcbox .hd b{flex:1}
#pjcbox .hd button{padding:6px 7px;font-size:12px;white-space:nowrap;flex:none}
#pjcbox .ttl{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
#pjcbox .ver{font-size:10px;font-weight:600;color:#b7c8df;letter-spacing:.5px;margin-top:1px;line-height:1}
#pjcbox button{border:1px solid #527198;background:#203a5d;color:#ffffff;border-radius:10px;padding:7px 10px;font-size:13px;font-weight:700;
  text-shadow:none;box-shadow:none}
#pjcbox .btns button{white-space:nowrap}
#pjcbox .btns{flex-wrap:wrap}
#pjcbox .btns button{flex:1}
#pjcbox .btns button.main{flex:1 1 100%}
#pjcbox button.main{flex:1;font-size:14px;padding:9px 10px;background:linear-gradient(180deg,#e8f0fc,#ffffff);color:#10213b;border:0;box-shadow:0 2px 10px #ffffff40}
#pjcbox .r{display:flex;gap:6px;margin-top:6px;align-items:center}
#pjcbox input{flex:1;min-width:0;font-size:16px;padding:6px 8px;border:1px solid #527198;border-radius:8px;background:#162a46;color:#fff}
#pjcbox input::placeholder{color:#a9bed8}
#pjcbox input:focus,#pjcbox select:focus{outline:none;border-color:#ffffff;box-shadow:0 0 0 2px #ffffff40}
#pjcbox select{-webkit-appearance:none;appearance:none;font-size:16px;padding:6px 24px 6px 10px;border-radius:8px;background:#162a46 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='2' fill='none'/%3E%3C/svg%3E") no-repeat right 8px center;color:#fff;border:1px solid #527198;font-weight:700}
#pjcbox input[type=time]{flex:0 0 auto;width:110px;color-scheme:dark}
#pjcbox .lb{width:34px;font-size:11px;color:#ffffff;font-weight:700}
#pjcbox .desc{font-size:12px;color:#c2d1e5;margin-top:4px} #pjcbox .st{font-size:12px;color:#ffffff;font-weight:700;margin-top:3px}
#pjcbox.small .body{display:none}
#pjcbox .body{max-height:calc(100vh - 160px);overflow-y:auto;-webkit-overflow-scrolling:touch}
#pjcbox button:disabled{opacity:.35}
#pjcbox button,#pjcbox input,#pjcbox select{font-family:-apple-system,"Hiragino Sans",sans-serif}
#pjclog{display:block;max-height:220px;overflow:auto;white-space:pre-wrap;font:11px ui-monospace,monospace;background:#10213b;color:#cfdeef;border:1px solid #385573;border-radius:8px;padding:6px;margin-top:6px}
#pjcbox .sec{border:1px solid #385573;border-radius:10px;padding:8px;margin-top:6px} #pjcbox .sec b{color:#ffffff;font-size:12px}
#pjcbox .sec select{flex:0 0 auto;max-width:45%}
</style>
<div class="hd">${ICON_TAG}<b class="ttl">${TITLE_TAG}<span class="ver">v${SYNOVA_VERSION}</span></b><button id="pjcpos">${L('\u4e0a\u4e0b', 'L\u00ean/Xu\u1ed1ng')}</button><button id="pjcsmall">${L('\u96a0\u3059', '\u1ea8n')}</button></div>
<div class="st" id="pjcst">${st.active ? L('\u5f85\u6a5f\u4e2d', '\u0110ang ch\u1edd') : L('\u505c\u6b62\u4e2d', '\u0110ang t\u1eaft')}</div>
<div class="body">
  <div class="desc">${IS_US
    ? L('Mellojoy US : \u8ca9\u58f2\u6642\u523b\u306f\u6c7a\u307e\u3063\u3066\u3044\u307e\u305b\u3093\uff08TikTok LIVE \u4e2d\u30fb\u671d 7:30\u301c \u65e5\u672c\u6642\u9593\uff09\u3002\u5148\u306b Safari \u3067\u30b7\u30e7\u30c3\u30d7\u304b Shop Pay \u306b\u30ed\u30b0\u30a4\u30f3\uff08\u4f4f\u6240\u30fb\u30ab\u30fc\u30c9\u4fdd\u5b58\u6e08\u307f\uff09\u2192 \u30d0\u30ea\u30a2\u30f3\u30c8ID\uff08\u6700\u901f\uff09\u307e\u305f\u306f\u30ad\u30fc\u30ef\u30fc\u30c9\uff0b\u500b\u6570 \u2192\u300c\u76e3\u8996\u30b9\u30bf\u30fc\u30c8\u300d\u3002\u5728\u5eab\u304c\u51fa\u305f\u3089\u8cfc\u5165\u753b\u9762\u3092\u958b\u304d\u3001\u81ea\u52d5\u3067\u300c\u4eca\u3059\u3050\u652f\u6255\u3046\u300d\u3092\u62bc\u3057\u307e\u3059\u3002Safari \u306f\u958b\u3044\u305f\u307e\u307e\u30fb\u753b\u9762\u306f\u3064\u3051\u305f\u307e\u307e\u306b\u3002',
        'Mellojoy US : b\u00e1n gi\u1edd kh\u00f4ng c\u1ed1 \u0111\u1ecbnh (theo LIVE TikTok, t\u1eeb 7:30 s\u00e1ng gi\u1edd Nh\u1eadt). Login shop ho\u1eb7c Shop Pay tr\u01b0\u1edbc tr\u00ean Safari (\u0111\u00e3 l\u01b0u \u0111\u1ecba ch\u1ec9 + th\u1ebb) \u2192 nh\u1eadp Variant ID (nhanh nh\u1ea5t) ho\u1eb7c t\u1eeb kh\u00f3a + s\u1ed1 l\u01b0\u1ee3ng \u2192 b\u1ea5m "B\u1eadt canh h\u00e0ng li\u00ean t\u1ee5c". C\u00f3 h\u00e0ng BOT m\u1edf trang thanh to\u00e1n v\u00e0 t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046. Gi\u1eef Safari m\u1edf v\u00e0 m\u00e0n h\u00ecnh s\u00e1ng.')
    : L('Mellojoy JP : \u30b7\u30e7\u30c3\u30d7\u3078\u306e\u30ed\u30b0\u30a4\u30f3\u5fc5\u9808\uff08\u4fdd\u5b58\u6e08\u307f\u306e\u4f4f\u6240\u30fb\u30ab\u30fc\u30c9\u3067\u652f\u6255\u3044\uff09\u3002\u5546\u54c1\u30b3\u30fc\u30c9\uff08\u4f8b A026\uff09\u30fb\u5546\u54c1\u540d\u30fb\u30d0\u30ea\u30a2\u30f3\u30c8ID \u3068\u500b\u6570\u3092\u5165\u529b\u3002\u63b2\u8f09\u6e08\u307f\u306e\u5546\u54c1\uff08\u58f2\u308a\u5207\u308c\u8868\u793a\u4e2d\u3082\uff09\u306f\u8ca9\u58f2\u958b\u59cb\u3068\u540c\u6642\u306b\u76f4\u63a5\u30ab\u30fc\u30c8\u3078\u8ffd\u52a0\u3057\u307e\u3059\u3002\u5728\u5eab\u304c\u51fa\u305f\u3089\u30ab\u30fc\u30c8\u306b\u5165\u308c\u3066\u8cfc\u5165\u753b\u9762\u3092\u958b\u304d\u307e\u3059\uff08\u300c\u4eca\u3059\u3050\u652f\u6255\u3046\u300d\u306f\u81ea\u5206\u3067\u30bf\u30c3\u30d7\uff09\u3002', 'Mellojoy JP : b\u1eaft bu\u1ed9c login shop (tr\u1ea3 b\u1eb1ng \u0111\u1ecba ch\u1ec9, th\u1ebb \u0111\u00e3 l\u01b0u trong t\u00e0i kho\u1ea3n). Nh\u1eadp m\u00e3 s\u1ea3n ph\u1ea9m (VD A026), t\u00ean m\u00f3n ho\u1eb7c Variant ID + s\u1ed1 l\u01b0\u1ee3ng. M\u00f3n \u0111\u00e3 l\u00ean trang (k\u1ec3 c\u1ea3 \u0111ang b\u00e1o h\u1ebft h\u00e0ng) BOT th\u00eam th\u1eb3ng v\u00e0o gi\u1ecf ngay l\u00fac m\u1edf b\u00e1n. C\u00f3 h\u00e0ng BOT th\u00eam gi\u1ecf v\u00e0 m\u1edf trang thanh to\u00e1n, b\u1ea1n t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046.')}</div>
  <div class="r"${IS_US ? ' style="display:none"' : ''}><span class="lb">\u23f0</span><input type="time" id="pjcopen"><span class="desc" style="margin:0">${L('\u8ca9\u58f2\u958b\u59cb\uff08\u65e5\u672c\u6642\u9593\uff09\u30fb\u521d\u671f\u5024', 'Gi\u1edd m\u1edf b\u00e1n (gi\u1edd Nh\u1eadt) \u00b7 m\u1eb7c \u0111\u1ecbnh')} ${IS_US ? usDefault : jpDefault}</span></div>
  <div class="r"><label class="desc" for="pjcmonitor">モニターディレイ（ms）</label><input id="pjcmonitor" type="number" min="${POLL_MS}" max="30000" step="1" inputmode="numeric" placeholder="自動"></div>
  ${Array.from({ length: MAX_KW }, (_, i) => i).map((i) => `<div class="r kwrow" id="pjcr${i}"><span class="lb">KW${i + 1}</span><input id="pjck${i}" placeholder="${L('\u4f8b: 42727888976830 / 111&222&333 / A026 / \u30c9\u30fc\u30ca\u30c4', 'VD: 42727888976830 / 111&222&333 / A026 / \u30c9\u30fc\u30ca\u30c4')}">${qtySel('pjcq' + i)}</div>`).join('')}
  <div class="r"><button id="pjcadd">\uff0b ${L('\u30ad\u30fc\u30ef\u30fc\u30c9\u8ffd\u52a0', 'Th\u00eam t\u1eeb kh\u00f3a')}</button><button id="pjcdel">\uff0d</button><span class="desc" id="pjccnt" style="margin:0"></span></div>
  <div class="r"><span class="lb">${L('\u4e88\u5099', 'D\u1ef1 ph\u00f2ng')}</span><input id="pjckb" placeholder="${L('\u58f2\u308a\u5207\u308c\u6642\u306b\u4ee3\u308f\u308a\u306b\u8cb7\u3046', 'Mua thay khi m\u00f3n tr\u00ean h\u1ebft h\u00e0ng')}">${qtySel('pjcqb')}</div>
  <!-- Mellojoy JP b\u1eaft bu\u1ed9c login shop -> tr\u1ea3 b\u1eb1ng \u0111\u1ecba ch\u1ec9 / th\u1ebb \u0111\u00e3 l\u01b0u trong t\u00e0i kho\u1ea3n, khung n\u00e0y v\u00f4 d\u1ee5ng -> \u1ea9n (user y\u00eau c\u1ea7u 2/11) -->
  <div class="r"${IS_US ? '' : ' style="display:none"'}><button id="pjcbuyb" style="flex:1">\u2699\ufe0f ${L('\u914d\u9001\u5148\u30fb\u30ab\u30fc\u30c9\uff08\u30ea\u30af\u30a8\u30b9\u30c8\u8cfc\u5165\uff09', 'Th\u00f4ng tin giao h\u00e0ng & thanh to\u00e1n')}</button></div>
  <div class="sec" id="pjcbuy" style="display:none">
    <b>${L('\u914d\u9001\u5148', '\u0110\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng')}</b>
    <div class="r"${IS_US ? '' : ' style="display:none"'}><span class="lb">${L('\u56fd', 'N\u01b0\u1edbc')}</span><select id="pjcb_country" style="flex:1;max-width:none"><option value="US">United States</option><option value="JP">${L('\u65e5\u672c', 'Nh\u1eadt B\u1ea3n (JP)')}</option></select></div>
    <div class="r">${fi('last', IS_US ? L('\u59d3 (Last name)', 'H\u1ecd (Last name)') : L('\u59d3', 'H\u1ecd (\u59d3)'))}${fi('first', IS_US ? L('\u540d (First name)', 'T\u00ean (First name)') : L('\u540d', 'T\u00ean (\u540d)'))}</div>
    <div class="r">${fi('email', 'Email', 'type="email" autocomplete="email"')}</div>
    <div class="r">${fi('phone', IS_US ? L('\u96fb\u8a71\u756a\u53f7', '\u0110i\u1ec7n tho\u1ea1i (VD 2125551234)') : L('\u643a\u5e2f\u96fb\u8a71\uff08\u4f8b 09012345678\uff09', '\u0110i\u1ec7n tho\u1ea1i (VD 09012345678)'), 'type="tel" inputmode="tel"')}</div>
    <div class="r">${fi('zip', IS_US ? 'ZIP code' : L('\u90f5\u4fbf\u756a\u53f7', 'M\u00e3 b\u01b0u \u0111i\u1ec7n (\u3012)'), 'inputmode="numeric"')}<select id="pjcb_zone"></select></div>
    <div class="r">${fi('city', IS_US ? 'City' : L('\u5e02\u533a\u753a\u6751', 'Qu\u1eadn / th\u00e0nh ph\u1ed1 (\u5e02\u533a\u753a\u6751)'))}</div>
    <div class="r">${fi('addr1', IS_US ? 'Address' : L('\u4f4f\u6240\uff08\u756a\u5730\uff09', '\u0110\u1ecba ch\u1ec9 (\u756a\u5730)'))}</div>
    <div class="r">${fi('addr2', IS_US ? L('Apt / Suite\uff08\u4efb\u610f\uff09', 'Apt / Suite (kh\u00f4ng b\u1eaft bu\u1ed9c)') : L('\u5efa\u7269\u540d\u30fb\u90e8\u5c4b\u756a\u53f7\uff08\u4efb\u610f\uff09', 'T\u00f2a nh\u00e0, ph\u00f2ng (kh\u00f4ng b\u1eaft bu\u1ed9c)'))}</div>
    <b style="display:block;margin-top:8px">${L('\u652f\u6255\u3044\u65b9\u6cd5', 'C\u00e1ch thanh to\u00e1n')}</b>
    <div class="r"><div style="flex:1;font-size:16px;font-weight:700;padding:6px 10px;border:1px solid #527198;border-radius:8px;background:#162a46;color:#fff">${L('\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9', 'Th\u1ebb t\u00edn d\u1ee5ng')}</div></div>
    <div class="r">${fi('cnum', L('\u30ab\u30fc\u30c9\u756a\u53f7', 'S\u1ed1 th\u1ebb'), 'inputmode="numeric" autocomplete="off"')}</div>
    <div class="r">${fi('cexp', 'MM/YY', 'inputmode="numeric" maxlength="5" autocomplete="off"')}${fi('ccvv', 'CVV', 'inputmode="numeric" autocomplete="off"')}</div>
    <div class="r">${fi('cname', L('\u30ab\u30fc\u30c9\u540d\u7fa9\uff08\u4f8b TARO YAMADA\uff09', 'T\u00ean tr\u00ean th\u1ebb (VD TARO YAMADA)'), 'autocomplete="off"')}</div>
    <div class="r"><button id="pjcb_cclr">${L('\u30ab\u30fc\u30c9\u60c5\u5831\u3092\u6d88\u53bb', 'X\u00f3a th\u00f4ng tin th\u1ebb')}</button></div>
    <div class="desc" id="pjcb_msg"></div>
  </div>
  <div class="r btns ${SYNOVA_LANG}"><button class="main" id="pjcgo">${goLabel()}</button><button id="pjcnow"${IS_US ? ' style="display:none"' : ''}>${L('\u3059\u3050\u5b9f\u884c', 'Ch\u1ea1y Ngay')}</button><button id="pjcstop">${L('\u505c\u6b62', 'D\u1eebng')}</button><button id="pjclogb">${L('\u30ed\u30b0\u3092\u898b\u308b', 'Xem Log')}</button></div>
  <div id="pjclogw" style="display:none"><div class="r"><button id="pjcclr">${L('\u30ed\u30b0\u6d88\u53bb', 'X\u00f3a log')}</button><button id="pjccopy">${L('\u30ed\u30b0\u3092\u30b3\u30d4\u30fc', 'Sao ch\u00e9p log')}</button><span class="desc" id="pjclogn" style="margin:0"></span></div><div id="pjclog"></div></div>
</div>`;
  document.body.appendChild(box);
  const bub = synovaBubble('pjcbub', () => { ui.hide = false; apply(); });
  const apply = () => {
    box.className = ui.top ? 'top' : 'bot';
    box.style.display = ui.hide ? 'none' : '';
    if (ui.hide) bub.show(ui.top, st.active); else bub.hide();
    save(K_UI, ui);
  };
  apply();
  const $ = (id) => document.getElementById(id);
  for (let i = 0; i < MAX_KW; i++) { $('pjck' + i).value = cfg.items[i].kw; $('pjcq' + i).value = String(Math.min(MAX_QTY, cfg.items[i].qty || 1)); }   // c\u00e0i c\u0169 l\u1edbn h\u01a1n -> c\u1eaft v\u1ec1 MAX_QTY
  const showRows = () => {
    for (let i = 0; i < MAX_KW; i++) $('pjcr' + i).style.display = i < cfg.kwCount ? '' : 'none';
    $('pjccnt').textContent = `${cfg.kwCount}/${MAX_KW}`;
    $('pjcadd').disabled = cfg.kwCount >= MAX_KW;
    $('pjcdel').disabled = cfg.kwCount <= 1;
  };
  showRows();
  $('pjcadd').onclick = () => { if (cfg.kwCount < MAX_KW) { cfg.kwCount++; save(K_CFG, cfg); showRows(); $('pjck' + (cfg.kwCount - 1)).focus(); } };
  $('pjcdel').onclick = () => {
    if (cfg.kwCount <= 1) return;
    cfg.kwCount--;                                       // b\u1edbt \u00f4 cu\u1ed1i v\u00e0 xo\u00e1 n\u1ed9i dung c\u1ee7a n\u00f3
    $('pjck' + cfg.kwCount).value = ''; $('pjcq' + cfg.kwCount).value = '1';
    readCfg(); showRows();
  };
  $('pjckb').value = cfg.backup.kw; $('pjcqb').value = String(Math.min(MAX_QTY, cfg.backup.qty || 1));
  // T\u1ef1 tr\u1ea3 ti\u1ec1n LU\u00d4N B\u1eacT (user y\u00eau c\u1ea7u 2/11: b\u1ecf n\u00fat b\u1eadt/t\u1eaft v\u00e0 c\u00e1c d\u00f2ng gi\u1ea3i th\u00edch).
  // ---------- Th\u00f4ng tin giao h\u00e0ng + th\u1ebb (thanh to\u00e1n b\u1eb1ng request) ----------
  const BUY_KEYS = ['country', 'last', 'first', 'email', 'phone', 'zip', 'zone', 'city', 'addr1', 'addr2', 'cnum', 'cexp', 'ccvv', 'cname'];
  const buyMsg = () => {
    const b2 = buy(), miss = [];
    if (!hasAddr(b2)) miss.push(L('\u914d\u9001\u5148', '\u0111\u1ecba ch\u1ec9'));
    if (!hasCard(b2)) miss.push(L('\u30ab\u30fc\u30c9', 'th\u1ebb'));
    $('pjcb_msg').textContent = miss.length ? L('\u672a\u5165\u529b: ', 'C\u00f2n thi\u1ebfu: ') + miss.join(', ')
      : L(`\u2705 \u5165\u529bOK \u00b7 \u30ab\u30fc\u30c9 ****${digits(b2.cnum).slice(-4)}`, `\u2705 \u0110\u1ee7 th\u00f4ng tin \u00b7 th\u1ebb ****${digits(b2.cnum).slice(-4)}`);
  };
  // N\u01b0\u1edbc giao h\u00e0ng (Mellojoy US ch\u1ecdn \u0111\u01b0\u1ee3c US / JP; Mellojoy JP lu\u00f4n JP) -> \u00f4 State / T\u1ec9nh \u0111\u1ed5i danh s\u00e1ch theo n\u01b0\u1edbc
  const fillZones = (c) => {
    const z = $('pjcb_zone'), keep = z.value;
    z.innerHTML = `<option value="">${c === 'US' ? 'State' : L('\u90fd\u9053\u5e9c\u770c', 'T\u1ec9nh')}</option>` + ZONES[c].map(([k, n]) => `<option value="${k}">${n}</option>`).join('');
    z.value = ZONES[c].some(([k]) => k === keep) ? keep : '';
  };
  { const b2 = buy(); $('pjcb_country').value = shipCountry(b2); fillZones($('pjcb_country').value); for (const k of BUY_KEYS) $('pjcb_' + k).value = k === 'country' ? shipCountry(b2) : b2[k] || ''; }
  $('pjcb_country').addEventListener('change', () => fillZones($('pjcb_country').value));
  const readBuy = () => { const b2 = {}; for (const k of BUY_KEYS) b2[k] = $('pjcb_' + k).value.trim(); save(K_BUY, b2); buyMsg(); };
  // H\u1ea1n th\u1ebb: b\u00e0n ph\u00edm s\u1ed1 c\u1ee7a iPhone kh\u00f4ng c\u00f3 d\u1ea5u "/" -> g\u00f5 0330 t\u1ef1 th\u00e0nh 03/30 (xo\u00e1 th\u00ec b\u1ecf lu\u00f4n d\u1ea5u /)
  $('pjcb_cexp').addEventListener('input', (e) => {
    const el = $('pjcb_cexp'), d = digits(el.value).slice(0, 4);
    const del = e.inputType && e.inputType.startsWith('delete');
    el.value = d.length > 2 || (d.length === 2 && !del) ? d.slice(0, 2) + '/' + d.slice(2) : d;
  });
  for (const k of BUY_KEYS) { $('pjcb_' + k).addEventListener('change', readBuy); $('pjcb_' + k).addEventListener('input', readBuy); }
  $('pjcbuyb').onclick = () => { const w = $('pjcbuy'); w.style.display = w.style.display === 'block' ? 'none' : 'block'; };
  $('pjcb_cclr').onclick = () => { for (const k of ['cnum', 'cexp', 'ccvv', 'cname']) $('pjcb_' + k).value = ''; readBuy(); };
  buyMsg();
  $('pjcopen').value = cfg.open || '';
  cfg.monitorDelay = monitorDelay(cfg.monitorDelay, POLL_MS);
  $('pjcmonitor').value = cfg.monitorDelay || '';
  // \u0110\u1ed5i ch\u1eef n\u00fat ngay khi g\u00f5 gi\u1edd (KH\u00d4NG \u0111\u1ed5i l\u00fac 'change': change b\u1eafn khi \u00f4 m\u1ea5t focus, t\u1ee9c l\u00e0
  // gi\u1eefa l\u00fac ch\u1ea1m v\u00e0 nh\u1ea3 ng\u00f3n tay tr\u00ean n\u00fat -> Safari b\u1ecf m\u1ea5t c\u00fa b\u1ea5m)
  if (!IS_US) $('pjcopen').addEventListener('input', () => { const t = $('pjcopen').value ? L(`${$('pjcopen').value} \u306b\u4e88\u7d04\u30fb\u81ea\u52d5\u30b9\u30bf\u30fc\u30c8`, `H\u1eb9n \u0111\u1ebfn ${$('pjcopen').value} T\u1ef1 B\u1eadt`) : L('\u8ca9\u58f2\u958b\u59cb\u6642\u523b\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp gi\u1edd m\u1edf b\u00e1n'); if ($('pjcgo').textContent !== t) $('pjcgo').textContent = t; });
  box.querySelectorAll('input,select').forEach((e) => e.addEventListener('change', readCfg));
  $('pjcpos').onclick = () => { ui.top = !ui.top; apply(); };
  $('pjcsmall').onclick = () => { ui.hide = true; apply(); };
  setInterval(() => { if (ui.hide) bub.show(ui.top, st.active); }, 1000);
  $('pjcgo').onclick = () => { if (!st.active) start(IS_US); };   // US: canh li\u00ean t\u1ee5c, kh\u00f4ng ch\u1edd gi\u1edd
  $('pjcnow').onclick = () => {
    if (!st.active) { start(true); return; }
    if (!st.now) { readCfg(); st.now = true; save(K_ST, st); log(L(`${SHOP}: \u5f85\u6a5f\u3092\u3084\u3081\u3066\u4eca\u3059\u3050\u76e3\u8996`, `${SHOP}: b\u1ecf ch\u1edd gi\u1edd \u2013 canh h\u00e0ng ngay`)); }
  };
  $('pjcstop').onclick = () => finish(L('\u505c\u6b62\u3057\u307e\u3057\u305f', '\u0110\u00e3 d\u1eebng'));
  $('pjclogb').onclick = () => {
    const w = $('pjclogw'); w.style.display = w.style.display === 'block' ? 'none' : 'block';
    $('pjclog').textContent = logBuf.join('\n'); $('pjclogn').textContent = logCount();
  };
  $('pjccopy').onclick = () => {
    const txt = logBuf.join('\n'), b = $('pjccopy'), ok = () => { b.textContent = L('\u30b3\u30d4\u30fc\u6e08\u307f \u2713', '\u0110\u00e3 ch\u00e9p \u2713'); setTimeout(() => { b.textContent = L('\u30ed\u30b0\u3092\u30b3\u30d4\u30fc', 'Sao ch\u00e9p log'); }, 1500); };
    const old = () => { const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;opacity:0';
      document.body.appendChild(t); t.select(); t.setSelectionRange(0, txt.length); try { document.execCommand('copy'); ok(); } catch (e) {} t.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, old); else old();
  };
  $('pjcclr').onclick = () => { logBuf = []; logFlush(); $('pjclog').textContent = ''; $('pjclogn').textContent = L('0\u884c', '0 d\u00f2ng'); };

  // link th\u1eb3ng /cart/<vid>:<qty> b\u1ecb Shopify t\u1eeb ch\u1ed1i -> \u0111ang \u0111\u1ee9ng \u1edf trang l\u1ed7i: quay l\u1ea1i trang c\u0169, canh ti\u1ebfp b\u1eb1ng c\u00e1ch th\u00eam gi\u1ecf c\u0169
  {
    const pm = load(K_PERMA, null);
    if (pm && /^\/cart\/\d+:\d+/.test(location.pathname)) {
      save(K_PERMA, null);
      if (Date.now() - pm.at < 60e3) {
        save(K_PERMA_OFF, Date.now());
        st.active = true; st.now = pm.now; save(K_ST, st);
        log(L('\u76f4\u884c\u30ea\u30f3\u30af\u304c\u4f7f\u3048\u307e\u305b\u3093\uff08\u58f2\u308a\u5207\u308c\u30fb\u500b\u6570\u5236\u9650\uff09\u2192 \u5143\u306e\u30da\u30fc\u30b8\u306b\u623b\u308a\u3001\u30ab\u30fc\u30c8\u8ffd\u52a0\u65b9\u5f0f\u3067\u76e3\u8996\u3092\u7d9a\u3051\u307e\u3059',
              'Link th\u1eb3ng b\u1ecb t\u1eeb ch\u1ed1i (v\u1eeba h\u1ebft / v\u01b0\u1ee3t s\u1ed1 l\u01b0\u1ee3ng) \u2192 quay l\u1ea1i trang c\u0169, canh ti\u1ebfp b\u1eb1ng c\u00e1ch th\u00eam gi\u1ecf'));
        location.replace(pm.page || '/');
        return;
      }
    }
  }

  if (st.active) run();
})();;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pjcRun); else pjcRun();
}

// ===================== \u81ea\u52d5\u3067\u652f\u6255\u3046 (Shopify checkout / Shop Pay) =====================
// Ch\u1ec9 ch\u1ea1y khi trang thanh to\u00e1n n\u00e0y do BOT v\u1eeba m\u1edf (\u2264 10 ph\u00fat); t\u1ef1 m\u1edf trang thanh to\u00e1n th\u00ec kh\u00f4ng b\u1ea5m.
// T\u1ed0C \u0110\u1ed8 T\u1ed0I \u0110A (user y\u00eau c\u1ea7u 2/11, b\u1ecf \u0111\u1ebfm 3 gi\u00e2y + n\u00fat H\u1ee6Y): d\u00f2 n\u00fat m\u1ed7i 50ms, n\u00fat v\u1eeba b\u1ea5m \u0111\u01b0\u1ee3c l\u00e0 b\u1ea5m NGAY.
// L\u1ea7n b\u1ea5m ch\u01b0a qua (shop c\u00f2n t\u00ednh ph\u00ed ship / b\u00e1o l\u1ed7i) -> 4 gi\u00e2y sau n\u00fat v\u1eabn b\u1ea5m \u0111\u01b0\u1ee3c th\u00ec b\u1ea5m l\u1ea1i, t\u1ed1i \u0111a 3 l\u1ea7n.
// Th\u1ea5y khung 3D Secure th\u00ec th\u00f4i, \u0111\u1ec3 ng\u01b0\u1eddi d\u00f9ng t\u1ef1 x\u00e1c th\u1ef1c.
function synovaAutoPay(done) {
  if (window.__synovaPay) return;            // m\u1ed7i trang ch\u1ec9 1 b\u1ed9 t\u1ef1 b\u1ea5m (tr\u00e1nh b\u1ea5m 2 l\u1ea7n)
  window.__synovaPay = true;
  const clog = (m) => {
    try {
      const b = JSON.parse(localStorage.getItem('pjc_log_v2') || '[]'), iso = new Date(Date.now() + 9 * 3600e3).toISOString();
      b.unshift(`${iso.slice(5, 7)}/${iso.slice(8, 10)} ${iso.slice(11, 23)} ${m}`); localStorage.setItem('pjc_log_v2', JSON.stringify(b.slice(0, 1500)));
    } catch (e) {}
  };
  const PAY_RE = /^(\u4eca\u3059\u3050\u652f\u6255\u3046|\u6ce8\u6587\u3092\u78ba\u5b9a\u3059\u308b|\u6ce8\u6587\u3092\u5b8c\u4e86\u3059\u308b|\u652f\u6255\u3046|Pay now|Complete order|Place order|Pay)$/i;
  const visible = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const findPay = () => {
    const b = document.getElementById('checkout-pay-button');
    if (b && visible(b)) return b;
    return [...document.querySelectorAll('button[type=submit],button')].find((x) => PAY_RE.test((x.innerText || '').trim()) && visible(x));
  };
  const busy = (b) => b.disabled || b.getAttribute('aria-disabled') === 'true' || b.getAttribute('aria-busy') === 'true';
  const in3ds = () => [...document.querySelectorAll('iframe')].some((f) => /3ds|challenge|authenticat|acs/i.test((f.src || '') + (f.name || '') + (f.title || '')) && visible(f));
  let clicks = 0, lastClick = 0, bar = null;
  const showBar = (txt) => {                // b\u0103ng b\u00e1o tr\u1ea1ng th\u00e1i (kh\u00f4ng c\u00f3 n\u00fat)
    if (!document.body) return;
    if (!bar) {
      bar = document.createElement('div');
      bar.style.cssText = 'position:fixed;left:8px;right:8px;bottom:calc(env(safe-area-inset-bottom) + 10px);z-index:2147483647;background:#0d1b32;color:#ffffff;' +
        'border:1px solid #ffffff;border-radius:12px;padding:10px 12px;font:600 14px -apple-system,sans-serif;box-shadow:0 6px 24px #000c';
      document.body.appendChild(bar);
    }
    if (bar.textContent !== txt) bar.textContent = txt;
  };
  const t0 = Date.now();
  const timer = setInterval(() => {
    if (/thank[-_]you|\/orders\//i.test(location.pathname)) { done(); return clearInterval(timer); }
    if (Date.now() - t0 > 3 * 60e3 || clicks >= 3 && Date.now() - lastClick > 4000) { done(); clearInterval(timer); if (bar) showBar(L('\ud83e\udd16 \u81ea\u52d5\u652f\u6255\u3044\u7d42\u4e86 \u2192 \u753b\u9762\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044', '\ud83e\udd16 H\u1ebft l\u01b0\u1ee3t t\u1ef1 b\u1ea5m \u2192 h\u00e3y xem m\u00e0n h\u00ecnh')); return; }
    if (in3ds()) { showBar(L('\ud83d\udd10 3D\u30bb\u30ad\u30e5\u30a2: \u81ea\u5206\u3067\u8a8d\u8a3c\u3057\u3066\u304f\u3060\u3055\u3044', '\ud83d\udd10 3D Secure: b\u1ea1n t\u1ef1 x\u00e1c th\u1ef1c')); return; }
    if (clicks >= 3 || (clicks && Date.now() - lastClick < 4000)) return;
    const b = findPay();
    if (!b || busy(b)) { if (!clicks) showBar(L('\ud83e\udd16 \u652f\u6255\u3044\u30dc\u30bf\u30f3\u5f85\u3061\u2026', '\ud83e\udd16 Ch\u1edd n\u00fat thanh to\u00e1n\u2026')); return; }
    clicks++; lastClick = Date.now();
    b.click();
    const ms = Date.now() - t0;
    clog(L(`\u81ea\u52d5\u652f\u6255\u3044: \u300c${(b.innerText || '').trim()}\u300d\u3092\u30bf\u30c3\u30d7 (${clicks}/3\u30fb\u753b\u9762\u8868\u793a\u304b\u3089 ${ms}ms)`, `T\u1ef1 b\u1ea5m thanh to\u00e1n: \u0111\u00e3 b\u1ea5m "${(b.innerText || '').trim()}" (${clicks}/3 \u00b7 ${ms}ms sau khi m\u1edf trang)`));
    showBar(L(`\ud83e\udd16 \u652f\u6255\u3044\u30dc\u30bf\u30f3\u3092\u30bf\u30c3\u30d7\u3057\u307e\u3057\u305f (${clicks}/3)`, `\ud83e\udd16 \u0110\u00e3 b\u1ea5m thanh to\u00e1n (${clicks}/3)`));
  }, 50);
}
// trang checkout c\u1ee7a shop: d\u1ea5u pjc_autopay do khung BOT ghi (c\u00f9ng t\u00ean mi\u1ec1n)
if (!SYNOVA_DUP && /mellojoy(japan|us)\.com$/.test(location.hostname) && /\/checkouts?\b/.test(location.pathname)) (function () {
  let flag = null;
  try { flag = JSON.parse(localStorage.getItem('pjc_autopay')); } catch (e) {}
  if (!flag || Date.now() - flag.at > 10 * 60e3) return;
  synovaAutoPay(() => { try { localStorage.removeItem('pjc_autopay'); } catch (e) {} });
})();
// Shop Pay (shop.app): \u0111\u00e3 \u0111\u0103ng nh\u1eadp Shop Pay -> trang c\u00f3 s\u1eb5n \u0111\u1ecba ch\u1ec9 + th\u1ebb ("Visa \u00b7\u00b7\u00b7\u00b7 4423") -> b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046.
// shop.app l\u00e0 t\u00ean mi\u1ec1n kh\u00e1c, kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c localStorage c\u1ee7a shop -> BOT m\u1edf checkout k\u00e8m "#synova-pay-<gi\u1edd>" (ph\u1ea7n # \u0111\u01b0\u1ee3c gi\u1eef
// qua c\u00e1c l\u1ea7n chuy\u1ec3n trang). \u0110\u1ecdc ngay l\u00fac trang m\u1edbi m\u1edf r\u1ed3i c\u1ea5t v\u00e0o sessionStorage (trang c\u00f3 th\u1ec3 xo\u00e1 ph\u1ea7n # sau \u0111\u00f3).
if (!SYNOVA_DUP && /(^|\.)shop\.app$/.test(location.hostname)) (function () {
  let ts = 0;
  const m = location.hash.match(/synova-pay-(\d+)/);
  try { if (m) sessionStorage.setItem('synova_pay', m[1]); ts = +(m ? m[1] : sessionStorage.getItem('synova_pay') || 0); } catch (e) { ts = m ? +m[1] : 0; }
  if (!ts || Date.now() - ts > 10 * 60e3) return;
  synovaAutoPay(() => { try { sessionStorage.removeItem('synova_pay'); } catch (e) {} });
})();

// ===================== \u8cfc\u5165\u5b8c\u4e86 (Shopify thank-you) \u2192 Discord =====================
// Trang c\u1ea3m \u01a1n c\u1ee7a Shopify: /checkouts/.../thank-you (ho\u1eb7c /thank_you, /orders/...). Checkout l\u00e0 SPA n\u00ean
// URL c\u00f3 th\u1ec3 \u0111\u1ed5i m\u00e0 kh\u00f4ng t\u1ea3i l\u1ea1i trang -> ki\u1ec3m tra m\u1ed7i gi\u00e2y.
if (!SYNOVA_DUP && /mellojoy(japan|us)\.com$|(^|\.)shop\.app$/.test(location.hostname) && /\/checkouts?\b|shop\.app$/.test(location.hostname + location.pathname)) (function () {
  const isThanks = () => /thank[-_]you|\/orders\/[0-9a-z]{16,}/i.test(location.pathname);
  const shop = /mellojoyus/.test(location.hostname) ? 'MellojoyUS' : /mellojoyjapan/.test(location.hostname) ? 'MellojoyJapan' : 'Mellojoy';
  let tries = 0;
  const timer = setInterval(() => {
    if (++tries > 1800) return clearInterval(timer);            // t\u1ed1i \u0111a 30 ph\u00fat
    if (!isThanks() || !document.body) return;
    const text = document.body.innerText || '';
    if (!/\u3042\u308a\u304c\u3068\u3046|Thank you|\u6ce8\u6587|order/i.test(text)) return;   // ch\u1edd trang hi\u1ec7n ch\u1eef (t\u1ed1i \u0111a ~15s)
    clearInterval(timer);
    const key = 'synova_sent_' + location.pathname;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {}
    let last = null;
    try { last = JSON.parse(localStorage.getItem('pjc_last')); } catch (e) {}
    const fresh = last && Date.now() - last.at < 3 * 3600e3 && last.items && last.items.length;
    if (fresh) {
      synovaNotify(last.items.map((it) => ({
        author: '\u2705 Checkout Successful', title: it.title, url: it.url, thumb: it.image || synovaPageImg(), site: last.site,
        fields: [['Size', it.size], ['\u4fa1\u683c', it.price], ['Quantity', it.qty], ['Site', last.site, false]],
      })));
    } else {
      // thanh to\u00e1n kh\u00f4ng qua bot (ho\u1eb7c tr\u00ean shop.app): kh\u00f4ng c\u00f3 chi ti\u1ebft m\u00f3n
      synovaNotify([{ author: '\u2705 Checkout Successful', title: shop, url: location.origin, thumb: synovaPageImg(), fields: [['Site', location.hostname, false]] }]);
    }
    try { localStorage.removeItem('pjc_last'); } catch (e) {}
  }, 1000);
})();

})();
