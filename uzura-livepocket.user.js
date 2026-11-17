// ==UserScript==
// @name         うずら BOT — LivePocket
// @namespace    uzura.livepocket
// @version      2.1.45.11000
// @updateURL    https://raw.githubusercontent.com/stussy2313xxx-web/uzura-bot/main/uzura-livepocket.meta.js
// @downloadURL  https://raw.githubusercontent.com/stussy2313xxx-web/uzura-bot/main/uzura-livepocket.user.js
// @match        https://livepocket.jp/*
// @match        https://*.livepocket.jp/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
// LivePocket ticket panel.
if (/(?:^|\.)livepocket\.jp$/.test(location.hostname)) {
  const mountLivePocket = () => {
(() => {
  'use strict';
  const detailRoute = /^\/(?:t|e)\/[\w-]+\/?$/;
  const ticketRoute = /^\/e\/[\w-]+\/receptions\/[\w-]+\/tickets\/?$/;
  const eventRoute = { test: path => detailRoute.test(path) || ticketRoute.test(path) };
  const pageEvent = location.pathname.split('/').slice(1, 3).join('/');
  const recordedHandoffKey = 'uzura-livepocket-combined:ticket-handoff';
  const agreementHandoffKey = recordedHandoffKey + ':agreement';
  let recordedHandoff, agreementHandoff;
  try {
    recordedHandoff = JSON.parse(sessionStorage.getItem(recordedHandoffKey) || 'null');
    agreementHandoff = JSON.parse(sessionStorage.getItem(agreementHandoffKey) || 'null');
  } catch {}
  const recordedEvent = eventRoute.test(location.pathname) ? pageEvent :
    recordedHandoff?.event || agreementHandoff?.event;
  const compact = value => value.normalize('NFKC').replace(/\s+/g, '');
  const matchesEvent = handoff => !!handoff?.title &&
    handoff.expires > Date.now() &&
    (!eventRoute.test(location.pathname) || handoff.event === pageEvent) &&
    compact(document.body.textContent).includes(handoff.title);
  const agreementPending = () => {
    try { return matchesEvent(JSON.parse(sessionStorage.getItem(agreementHandoffKey) || 'null')); }
    catch { return false; }
  };
  const matchingTicketScreen = handoff =>
    matchesEvent(handoff) &&
    (ticketRoute.test(location.pathname) ||
      Array.from(document.querySelectorAll('h1, h2, [role="heading"]'))
        .some(heading => heading.textContent.trim() === 'チケット選択'));
  const recordedTicketPage = ticketRoute.test(location.pathname) || matchingTicketScreen(recordedHandoff);
  const eventPage = recordedTicketPage || eventRoute.test(location.pathname);
  let referrer;
  try {
    if (document.referrer) referrer = new URL(document.referrer);
  } catch {}
  const nextPage = referrer && referrer.origin === location.origin &&
    eventRoute.test(referrer.pathname);
  if (window.top !== window) return;
  if (!eventPage && !nextPage && !agreementPending()) {
    if (recordedHandoff?.expires > Date.now()) {
      const watcher = new MutationObserver(() => {
        if (!matchingTicketScreen(recordedHandoff)) return;
        watcher.disconnect();
        mountLivePocket();
      });
      watcher.observe(document.body, { childList: true, subtree: true, characterData: true });
      setTimeout(() => watcher.disconnect(), 15000);
    }
    return;
  }

  const event = recordedTicketPage || agreementPending() ? recordedEvent :
    (eventPage ? location.pathname : referrer.pathname).split('/').slice(1, 3).join('/');
  const key = 'uzura-livepocket-combined:' + event;
  const logKey = key + ':log';
  const ticketHandoffKey = recordedHandoffKey;
  const timerKey = key + ':timer:' + location.pathname;
  const normalize = value => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
  const host = document.createElement('aside');
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host { position:fixed; left:8px; right:8px; top:calc(8px + env(safe-area-inset-top)); z-index:2147483647; color-scheme:dark; font:14px system-ui; }
      :host([data-bottom]) { top:auto; bottom:calc(76px + env(safe-area-inset-bottom)); }
      * { box-sizing:border-box; }
      [hidden] { display:none !important; }
      header { margin-bottom:6px; }
      header strong { font-size:clamp(18px,5vw,24px); line-height:1.15; font-weight:900; }
      header small { display:block; color:#b7c8df; margin-top:4px; font-size:12px; }
      .icon { display:grid; place-items:center; flex:none; width:42px; height:42px;
        border-radius:50%; background:#fff; color:#203a5d; font-size:25px; font-weight:900; }
      #launcher { position:fixed; top:calc(8px + env(safe-area-inset-top)); right:12px;
        display:grid; place-items:center; width:54px; height:54px; padding:0;
        border:2px solid #fff; border-radius:50%; background:#101f36; box-shadow:0 4px 16px #0007; }
      #launcher .icon { width:36px; height:36px; }
      #launcher::after { content:''; position:absolute; top:1px; right:1px; width:12px;
        height:12px; border:2px solid #101f36; border-radius:50%; background:#808080; }
      #launcher[data-active]::after { background:#2ecc71; }
      :host([data-bottom]) #launcher { top:auto; bottom:calc(76px + env(safe-area-inset-bottom)); }
      #body label { margin-top:6px; }
      #jump { width:100%; margin-top:6px; }
      #controls { position:sticky; bottom:-12px; background:#101f36; padding:6px 0 8px; }
      #controls .row { margin-bottom:0; }
      section { max-width:440px; max-height:70vh; max-height:70dvh; overflow:auto; margin:auto; background:#101f36; color:white; border:1px solid #536f95; border-radius:16px; padding:12px; box-shadow:0 8px 24px #0007; }
      header,.row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
      strong { flex:1; }
      label { display:grid; gap:4px; flex:1; min-width:0; }
      button,input,select { font:inherit; border:1px solid #536f95; border-radius:8px; background:#203a5d; color:white; padding:8px; min-width:0; }
      input,select { font-size:16px; width:100%; }
      button { min-height:44px; cursor:pointer; }
      header button, #controls button { font-weight:800; border-radius:12px; }
      .commands button { flex:1; padding-inline:4px; }
      .primary { width:100%; min-height:48px; margin-bottom:8px;
        background:linear-gradient(#e9effa,#fff); color:#102139; font-weight:900; }
      #status { margin:6px 0; }
      #logPanel { margin-top:8px; }
      #logPanel .row { flex-wrap:wrap; }
      #logCount { color:#b7c8df; font-variant-numeric:tabular-nums; }
      #log { margin:0; padding:10px; border:1px solid #536f95; border-radius:10px;
        background:#12223b; color:#d9e5f4; font:13px/1.55 ui-monospace, monospace;
        white-space:pre-wrap; overflow-wrap:anywhere; max-height:32vh; overflow:auto; }
    </style>
    <button id="launcher" type="button" aria-label="うずら BOT LivePocketを開く" aria-controls="panel" aria-expanded="true" hidden><span class="icon" aria-hidden="true">U</span></button>
    <section id="panel" aria-label="うずら BOT LivePocket">
      <header><span class="icon" aria-hidden="true">U</span><strong>うずら BOT<small>LivePocket · v2.1.45.11000</small></strong><button id="position" type="button">上下</button><button id="toggle" type="button">隠す</button></header>
      <p id="status" role="status">停止中</p>
      <div id="body">
        <div id="ticket">
          <p id="eventTitle"></p>
          <p id="ticketSelection" hidden></p>
          <label>券種モード<select id="mode"><option value="slots">時間帯指定</option><option value="regular">通常チケット</option></select></label>
          <label id="slotsWrap">KW（希望枠・優先順）<input id="slots" placeholder="例 12:00〜13:00, 14:00"></label>
          <div class="row">
            <label>枚数<select id="quantity"><option value="1">1枚</option><option value="2">2枚</option></select></label>
            <label>受付開始（日本時間）<input id="time" type="time" step="1"></label>
          </div>
        </div>
        <div id="payment" hidden>
          <label>支払い方法<select id="method"><option value="">選択しない</option><option>クレジット</option><option>コンビニ</option><option>PayPay</option></select></label>
          <button id="agree" type="button">注意事項を確認済み · 同意して申込ボタンへ</button>
        </div>
        <button id="jump" type="button">公式の申込・進行ボタンへ</button>
        <div id="controls">
          <button class="primary" id="schedule">予約・自動スタート</button>
          <div class="row commands"><button id="run">すぐ実行</button><button id="stop">停止</button><button id="logs" aria-expanded="false">ログを見る</button></div>
        </div>
        <div id="logPanel" hidden>
          <div class="row"><button id="clear" type="button">ログ消去</button><button id="copyLog" type="button">ログをコピー</button><span id="logCount">0行</span></div>
          <pre id="log" tabindex="0" aria-label="実行ログ"></pre>
        </div>
      </div>
    </section>`;
  document.body.append(host);

  const byId = id => root.getElementById(id);
  const eventTitle = document.querySelector('main h1, h1')?.textContent.trim();
  byId('eventTitle').textContent = eventTitle || document.title || event;
  const ticketSelection = byId('ticketSelection');
  const slots = byId('slots');
  const quantity = byId('quantity');
  const time = byId('time');
  const method = byId('method');
  const mode = byId('mode');
  const syncMode = () => { byId('slotsWrap').hidden = mode.value === 'regular'; };
  mode.addEventListener('change', syncMode);
  byId('schedule').hidden = !eventPage;
  byId('ticket').hidden = !eventPage;
  byId('payment').hidden = eventPage;
  let reservation;
  let observer;
  let deadline;
  let reloadTimer;
  let log = [];
  try {
    const savedLog = JSON.parse(sessionStorage.getItem(logKey) || '[]');
    if (Array.isArray(savedLog)) log = savedLog.filter(entry => typeof entry === 'string').slice(0, 40);
  } catch {}
  const renderLog = () => {
    byId('log').textContent = log.join('\n');
    byId('logCount').textContent = log.length + '行';
    byId('clear').disabled = byId('copyLog').disabled = !log.length;
  };
  renderLog();
  const report = message => {
    byId('status').textContent = message;
    log.unshift(new Date().toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }) + ' ' + message);
    if (log.length > 40) log.pop();
    try { sessionStorage.setItem(logKey, JSON.stringify(log)); } catch {}
    renderLog();
  };
  const refreshSchedule = () => {
    byId('schedule').textContent = time.value ? time.value + ' に予約・自動スタート' : '予約・自動スタート';
  };
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    for (const field of [slots, quantity, time, method, byId('mode')]) {
      if (typeof saved[field.id] === 'string') field.value = saved[field.id];
    }
  } catch {}
  syncMode();
  refreshSchedule();
  time.addEventListener('input', refreshSchedule);
  root.addEventListener('change', () => {
    try {
      localStorage.setItem(key, JSON.stringify(Object.fromEntries(
        [slots, quantity, time, method, byId('mode')].map(field => [field.id, field.value])
      )));
    } catch {}
  });

  let wakeLock;
  let pendingWakeLock;
  let wakeRequested = false;

  async function keepScreenAwake() {
    if (!wakeRequested || wakeLock || pendingWakeLock ||
        document.visibilityState !== 'visible' || !navigator.wakeLock) return;
    const request = navigator.wakeLock.request('screen');
    pendingWakeLock = request;
    try {
      const lock = await request;
      if (!wakeRequested) {
        await lock.release();
      } else if (!lock.released) {
        wakeLock = lock;
        lock.addEventListener('release', () => {
          if (wakeLock === lock) wakeLock = undefined;
        }, { once: true });
      }
    } catch {
      // The timer also works when the browser denies the screen lock.
    } finally {
      pendingWakeLock = undefined;
    }
  }
  document.addEventListener('visibilitychange', keepScreenAwake);

  function stop() {
    wakeRequested = false;
    const lock = wakeLock;
    wakeLock = undefined;
    if (lock) void lock.release().catch(() => {});
    byId('launcher').removeAttribute('data-active');
    clearTimeout(reservation);
    clearTimeout(deadline);
    clearTimeout(reloadTimer);
    if (proceedFrame !== undefined) cancelAnimationFrame(proceedFrame);
    try { sessionStorage.removeItem(timerKey); } catch {}
    observer?.disconnect();
    observer = undefined;
  }

  const visible = element => element.getClientRects().length && getComputedStyle(element).visibility === 'visible';
  const labelFor = field => normalize(Array.from(field.labels || [], label => label.textContent).join(' '));
  const enabled = element => !element.matches(':disabled,[aria-disabled="true"]');
  function quantityChoices(field) {
    const options = Array.from(field.options).filter(option => option.value !== '');
    return options.length && options.every(option => /^\d+$/.test(option.value) &&
      /^(?:\d+\s*枚?|選択しない|未選択)$/.test(normalize(option.textContent))) ? options : [];
  }

  function findProceedButton(field, applicationOnly = false) {
    const entryLabel = /^(?:お?申し込む|お?申込み|お申し込みへ進む|チケットを(?:申し込む|申込む)|応募する|抽選に応募する|抽選に申し込む|抽選申込へ進む)$/;
    const nextLabel = /^(?:次へ|次へ進む|申込手続きへ進む|購入手続きへ進む|確定する)$/;
    const actions = Array.from(document.querySelectorAll('main button, main a, main input[type="submit"], form button, form input[type="submit"]'))
      .filter(element => {
        const label = normalize(element.value || element.textContent || '');
        return enabled(element) && visible(element) &&
          (entryLabel.test(label) || (!applicationOnly && nextLabel.test(label)));
      });
    if (applicationOnly) return actions.length === 1 ? actions[0] : null;
    const form = field?.form;
    const formActions = form ? actions.filter(action => action.form === form || form.contains(action)) : [];
    if (formActions.length) return formActions.length === 1 ? formActions[0] : null;
    return actions.length === 1 ? actions[0] : null;
  }

  function canOpenRecordedReception(action) {
    if (!recordedEvent || !['/' + recordedEvent, '/' + recordedEvent + '/'].includes(location.pathname)) return false;
    const section = action.closest('section#ticket');
    if (!section || !/^チケットを(?:申込む|申し込む)$/.test(normalize(action.value || action.textContent || ''))) return false;
    return !Array.from(section.querySelectorAll('select')).some(visible);
  }

  function highlightProceedButton(action = findProceedButton()) {
    if (!action) return false;
    showPanel(false);
    action.style.outline = '3px solid #00a65a';
    action.scrollIntoView({ block: 'center' });
    action.focus({ preventScroll: true });
    return true;
  }

  let selectedField;
  let proceedFrame;
  function parseSlotKeywords(value) {
    const keywords = normalize(value).replace(/\s*[-~〜～–—−]\s*/g, '~').split(/[,、\s]+/).filter(Boolean);
    if (keywords.some(keyword => !/^(?:[01]?\d|2[0-3]):[0-5]\d(?:~(?:[01]?\d|2[0-3]):[0-5]\d)?$/.test(keyword))) return [];
    return [...new Set(keywords.map(keyword => keyword.split('~').map(time => time.padStart(5, '0')).join('~')))];
  }

  function matchesSlotKeyword(caption, preference) {
    const text = normalize(caption);
    const [start, end] = preference.split('~');
    const ranges = Array.from(text.matchAll(/(?<!\d)((?:[01]?\d|2[0-3]):[0-5]\d)\s*[-~〜～–—−]\s*((?:[01]?\d|2[0-3]):[0-5]\d)(?!\d)/g));
    if (ranges.length || end) {
      return ranges.some(([, from, to]) => from.padStart(5, '0') === start && (!end || to.padStart(5, '0') === end));
    }
    const times = text.match(/(?<!\d)(?:[01]?\d|2[0-3]):[0-5]\d(?!\d)/g) || [];
    return times.length === 1 && times[0].padStart(5, '0') === start;
  }

  function selectSlot(preferences, count, regular) {
    const fields = Array.from(document.querySelectorAll('main select, form select'))
      .filter(field => visible(field) && enabled(field) && quantityChoices(field).length);
    const existing = fields.filter(field => Number(field.value) > 0);
    if (existing.length) {
      selectedField = existing.length === 1 ? existing[0] : undefined;
      report('公式画面で選択済みの券種と枚数を確認してください。');
      return true;
    }
    for (const preference of regular ? ['通常チケット'] : preferences) {
      const matches = regular ? fields : fields.filter(field => {
        const row = field.closest('tr, li, fieldset, [class*="ticket"]');
        const caption = labelFor(field) + ' ' + normalize(row?.innerText || '');
        return matchesSlotKeyword(caption, preference);
      });
      if (!regular && matches.length !== 1) continue;
      const choice = matches.map(field => ({
        field,
        option: quantityChoices(field).find(item => Number(item.value) === count && enabled(item) &&
          !item.closest('optgroup[disabled]'))
      })).find(candidate => candidate.option);
      if (!choice) continue;
      const { field, option } = choice;
      field.value = option.value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.style.outline = '2px solid #00c853';
      selectedField = field;
      ticketSelection.hidden = false;
      ticketSelection.textContent = preference + ' · ' + count + '枚を入力済み';
      report('公式の申込ボタンから進んでください。');
      return true;
    }
    return false;
  }

  function start(scheduled) {
    stop();
    selectedField = undefined;
    ticketSelection.hidden = true;
    const preferences = parseSlotKeywords(slots.value);
    const count = Number(quantity.value);
    const regular = byId('mode').value === 'regular';
    if (!regular && !preferences.length) {
      report('KWに開始時刻または時間帯を入力してください（例 12:00〜13:00）。');
      return;
    }
    const run = (until = 0) => {
      const check = () => {
        if (selectSlot(preferences, count, regular)) {
          stop();
          proceedFrame = requestAnimationFrame(() => {
            proceedFrame = undefined;
            const action = findProceedButton(selectedField);
            if (!action || !highlightProceedButton(action)) {
              report('券種・枚数を公式画面で確認し、「公式の申込・進行ボタンへ」を押してください。');
            }
          });
          return;
        }
        const action = findProceedButton(undefined, true);
        if (action) {
          stop();
          const openReception = canOpenRecordedReception(action) && !!eventTitle;
          report(openReception
            ? '公式の受付入口を開きます。認証と申込内容は公式画面で確認してください。'
            : '公式の申込ボタンを表示しました。券種・枚数は公式画面で確認してください。');
          highlightProceedButton(action);
          if (openReception) {
            const handoff = { event, title: compact(eventTitle), count, preferences, regular, expires: Date.now() + 300000 };
            try {
              sessionStorage.setItem(ticketHandoffKey, JSON.stringify(handoff));
            } catch {}
            const entryPage = location.href;
            const watcher = new MutationObserver(resumeOnTicketScreen);
            function resumeOnTicketScreen() {
              if (!matchingTicketScreen(handoff)) return;
              watcher.disconnect();
              try { sessionStorage.removeItem(ticketHandoffKey); } catch {}
              submitRecordedTicket(count, regular ? [] : preferences, handoff.title);
            }
            watcher.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
            setTimeout(() => watcher.disconnect(), 15000);
            action.click();
            resumeOnTicketScreen();
            setTimeout(() => {
              if (location.href === entryPage && action.isConnected && visible(action)) {
                report('受付入口を押しましたが画面が切り替わりませんでした。緑枠のボタンを直接押してください。');
              }
            }, 2000);
          }
        }
      };
      report(until ? '受付開始後の券種を確認しています（最大20秒）。' : '券種の表示を待っています（最大60秒）。');
      byId('launcher').setAttribute('data-active', '');
      observer = new MutationObserver(check);
      observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['disabled','aria-disabled','class','hidden','style'] });
      deadline = setTimeout(() => {
        stop();
        report('希望枠と枚数を一意に確認できませんでした。公式ページで確認してください。');
      }, until ? Math.max(0, until - Date.now()) : 60000);
      check();
      if (until && observer) {
        reloadTimer = setTimeout(() => {
          if (Date.now() >= until || document.visibilityState !== 'visible' ||
              /ロボット確認|verify (?:that )?you|too many requests|アクセス制限/i.test(document.body.innerText)) {
            stop();
            report('受付の再確認を終了しました。');
            return;
          }
          try { sessionStorage.setItem(timerKey, String(until)); } catch { return; }
          report('受付ページを再読み込みします。');
          location.reload();
        }, 1200);
      }
    };
    if (!scheduled) { run(); return; }
    if (scheduled === 'resume') { run(resumeUntil); return; }
    if (!time.value) { report('受付開始時刻を入力してください。'); return; }
    const now = Date.now();
    const day = new Date(now + 9 * 3600000).toISOString().slice(0, 10);
    let target = Date.parse(day + 'T' + (time.value.length === 5 ? time.value + ':00' : time.value) + '+09:00');
    if (!Number.isFinite(target)) { report('受付開始時刻を確認してください。'); return; }
    if (target <= now) target += 86400000;
    const targetLabel = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(target);
    wakeRequested = true;
    void keepScreenAwake();
    byId('launcher').setAttribute('data-active', '');
    reservation = setTimeout(() => run(target + 20000), target - now);
    report(targetLabel + '（日本時間）まで待機します。このタブを開いておいてください。');
  }

  function submitRecordedTicket(count, preferences = [], title = compact(eventTitle || "")) {
    stop();
    if (![1, 2].includes(count)) return;
    let selectedField, selectedValue;
    let submitted = false;
    const check = () => {
      if (submitted) return;
      const fields = Array.from(document.querySelectorAll('select')).filter(field =>
        visible(field) && enabled(field) &&
        Array.from(field.options).some(item => /^0(?:枚)?$/.test(normalize(item.textContent || ''))) &&
        Array.from(field.options).some(item => /^1(?:枚)?$/.test(normalize(item.textContent || ''))));
      const availableOption = field => Array.from(field.options).find(item => {
        const label = normalize(item.textContent || '');
        return (label === String(count) || label === count + '枚') &&
          enabled(item) && !item.closest('optgroup[disabled]');
      });
      let field = selectedField;
      let preference;
      if (!field && preferences.length) {
        for (const keyword of preferences) {
          const matches = fields.filter(candidate => {
            const card = candidate.closest('.event-detail-ticket-card, [class*="ticket-card"], fieldset, tr');
            const caption = labelFor(candidate) + ' ' + (card?.querySelector('h2, h3, h4, [class*="title"]')?.textContent || card?.innerText || '');
            return matchesSlotKeyword(caption, keyword);
          });
          if (matches.length !== 1 || !availableOption(matches[0])) continue;
          field = matches[0];
          preference = keyword;
          break;
        }
      } else if (!field && fields.length === 1) {
        field = fields[0];
      }
      const option = field && availableOption(field);
      if (!option) return;
      if (field !== selectedField) {
        selectedField = field;
        selectedValue = option.value;
        field.value = selectedValue;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        report((preference ? preference.replace('~', '〜') + ' · ' : '') + count + '枚を選択しました。申込ボタンの有効化を待っています。');
      }
      if (!field.isConnected || field.value !== selectedValue) return;
      const actions = Array.from(document.querySelectorAll('button, input[type="submit"], a[role="button"], a.event-detail-ticket-button'))
        .filter(action => enabled(action) && visible(action) &&
          !action.closest('[inert],[aria-disabled="true"]') &&
          /^チケットを(?:申込む|申し込む)$/.test(normalize(action.textContent || action.value || '')));
      if (actions.length !== 1) return;
      submitted = true;
      stop();
      report(count + '枚を選択し、チケット申込ボタンを押します。');
      try { sessionStorage.setItem(agreementHandoffKey, JSON.stringify({ event, title, expires: Date.now() + 300000 })); } catch {}
      queueMicrotask(watchForAgreement);
      actions[0].click();
    };
    report('購入枚数欄を待っています（最大15秒）。');
    deadline = setTimeout(() => {
      stop();
      report(selectedField ? '枚数入力後に申込ボタンを確認できませんでした。' : '購入枚数欄を確認できませんでした。');
    }, 15000);
    observer = new MutationObserver(check);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });
    check();
  }

  if (recordedTicketPage) {
    const handoff = recordedHandoff;
    try {
      sessionStorage.removeItem(ticketHandoffKey);
    } catch {}
    if (matchingTicketScreen(handoff) && [1, 2].includes(handoff.count)) {
      submitRecordedTicket(handoff.count, handoff.regular ? [] : handoff.preferences, handoff.title);
    } else {
      report('枚数画面です。BOTの「すぐ実行」で指定枚数を選びます。');
    }
  }

  let resumeUntil = 0;
  try { resumeUntil = Number(sessionStorage.getItem(timerKey)); } catch {}
  if (eventPage && resumeUntil > Date.now() && resumeUntil <= Date.now() + 20000) {
    start('resume');
  }

  byId('schedule').onclick = () => start(true);
  byId('run').onclick = () => {
    if (recordedTicketPage) {
      const regular = mode.value === 'regular';
      const preferences = regular ? [] : parseSlotKeywords(slots.value);
      if (!regular && !preferences.length) {
        report('KWに開始時刻または時間帯を入力してください（例 12:00〜13:00）。');
        return;
      }
      submitRecordedTicket(Number(quantity.value), preferences);
      return;
    }
    if (eventPage) { start(false); return; }
    if (!method.value) { report('支払い方法を指定してください。'); return; }
    const matches = Array.from(document.querySelectorAll('input[type="radio"]')).filter(
      field => enabled(field) && (visible(field) || Array.from(field.labels || []).some(visible)) &&
        labelFor(field).toLowerCase().includes(method.value.toLowerCase())
    );
    if (matches.length !== 1) { report('支払い方法を一意に確認できませんでした。公式画面で選択してください。'); return; }
    if (!matches[0].checked) matches[0].click();
    report(matches[0].checked ? '支払い方法を選択しました。公式画面で内容を確認してください。' : '支払い方法を公式画面で選択してください。');
  };
  byId('stop').onclick = () => { stop(); report('停止しました。'); };
  const finalApplyLabel = /^チケットを(?:申込む|申し込む|申込みする)$/;
  const agreementLabel = /^(?:上記)?注意事項に同意し(?:、)?チケットの購入\s*・\s*(?:申込|申込み|申し込み)をする[。]?$/;
  const agreementShortLabel = /^(?:上記)?(?:利用規約|注意事項)(?:と(?:利用規約|注意事項))?に同意する[。]?$/;

  function checkoutAgreement() {
    const matches = Array.from(document.querySelectorAll('input[type="checkbox"]'))
      .filter(field => {
        const labels = Array.from(field.labels || []);
        const described = (field.getAttribute('aria-labelledby') || '').split(/\s+/)
          .map(id => id && document.getElementById(id)).filter(Boolean);
        const texts = [field.getAttribute('aria-label'), ...labels.map(el => el.textContent),
          described.map(el => el.textContent).join(' '), labelFor(field)];
        return enabled(field) && !field.closest('[inert],[aria-disabled="true"]') &&
          (visible(field) || labels.some(visible) || described.some(visible)) &&
          texts.some(raw => raw && [agreementLabel, agreementShortLabel].some(pattern => pattern.test(normalize(raw))));
      });
    return matches.length === 1 ? matches[0] : null;
  }

  function findFinalApplyButton() {
    const matches = Array.from(document.querySelectorAll('button, input[type="submit"], a[role="button"], [role="button"]'))
      .filter(el => visible(el) && !el.closest('[inert]') &&
        [el.value, el.textContent, el.getAttribute('aria-label')]
          .some(raw => raw && finalApplyLabel.test(normalize(raw))));
    return matches.length === 1 ? matches[0] : null;
  }

  function scrollToFinalApplyButton() {
    const action = findFinalApplyButton();
    if (!action) return false;
    showPanel(false);
    action.style.outline = '3px solid #00a65a';
    action.scrollIntoView({ block: 'center', behavior: 'instant' });
    return true;
  }

  byId('jump').onclick = () => {
    if (!eventPage) {
      if (!scrollToFinalApplyButton()) report('公式の「チケットを申込む」ボタンを見つけられませんでした。');
      return;
    }
    const action = findProceedButton(selectedField);
    if (action && highlightProceedButton(action)) return;
    const tabs = Array.from(document.querySelectorAll('a, button, [role="tab"]'))
      .filter(element => enabled(element) && visible(element) &&
        normalize(element.textContent || '') === '受付・チケット情報');
    if (eventPage && tabs.length === 1) {
      showPanel(false);
      tabs[0].click();
      return;
    }
    const headings = Array.from(document.querySelectorAll('main h2, main h3, main [role="heading"]'))
      .filter(element => visible(element) && normalize(element.textContent || '') === '受付・チケット情報');
    if (eventPage && headings.length === 1) {
      showPanel(false);
      headings[0].scrollIntoView({ block: 'center' });
      return;
    }
    report('公式画面の「受付・チケット情報」で受付状況を確認してください。');
  };
  function checkAgreementAndScroll() {
    const agreement = checkoutAgreement();
    if (!agreement) {
      report('同意欄を一意に確認できませんでした。公式画面で確認してください。');
      return;
    }
    if (!agreement.checked) agreement.click();
    if (!agreement.checked) {
      report('同意欄にチェックできませんでした。公式画面で確認してください。');
      return;
    }
    if (scrollToFinalApplyButton()) {
      report('同意済み。申込ボタンを表示しました。申込はまだ送信していません。');
      return;
    }
    report('同意済み。公式の申込ボタンの表示を待っています。');
    const watcher = new MutationObserver(() => {
      if (!scrollToFinalApplyButton()) return;
      watcher.disconnect();
      clearTimeout(timeout);
      report('申込ボタンを表示しました。申込はまだ送信していません。');
    });
    const timeout = setTimeout(() => {
      watcher.disconnect();
      report('同意済み。公式の申込ボタンを見つけられませんでした。');
    }, 2000);
    watcher.observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['class', 'hidden', 'style'], characterData: true });
  }
  byId('agree').onclick = event => {
    if (event.isTrusted && !eventPage) checkAgreementAndScroll();
  };
  function watchForAgreement() {
    if (!agreementPending()) return;
    const check = () => {
      if (!agreementPending() || !checkoutAgreement() || !findFinalApplyButton()) return;
      watcher.disconnect();
      clearTimeout(timeout);
      try { sessionStorage.removeItem(agreementHandoffKey); } catch { return; }
      checkAgreementAndScroll();
    };
    const watcher = new MutationObserver(check);
    const timeout = setTimeout(() => watcher.disconnect(), 15000);
    watcher.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
    check();
  }
  watchForAgreement();
  function toggle(button, content, openText, closedText) {
    content.hidden = !content.hidden;
    button.textContent = content.hidden ? closedText : openText;
    button.setAttribute('aria-expanded', String(!content.hidden));
  }
  byId('position').onclick = () => host.toggleAttribute('data-bottom');
  function showPanel(open) {
    byId('panel').hidden = !open;
    byId('launcher').hidden = open;
    byId('launcher').setAttribute('aria-expanded', String(open));
  }
  byId('toggle').onclick = () => showPanel(false);
  byId('launcher').onclick = () => showPanel(true);
  byId('clear').onclick = () => {
    log = [];
    renderLog();
    try { sessionStorage.removeItem(logKey); } catch {}
  };
  byId('copyLog').onclick = async () => {
    const button = byId('copyLog');
    if (!log.length) {
      byId('status').textContent = 'コピーするログがありません。';
      return;
    }
    const content = log.join('\n');
    try {
      await navigator.clipboard.writeText(content);
      byId('status').textContent = 'ログをコピーしました。';
    } catch {
      const field = document.createElement('textarea');
      field.readOnly = true;
      field.value = content;
      field.setAttribute('aria-label', '実行ログ');
      field.style.cssText = 'width:100%;min-height:7em;font-size:16px';
      button.after(field);
      field.focus();
      field.select();
      field.setSelectionRange(0, content.length);
      byId('status').textContent = '選択したログをコピーしてください。';
      field.addEventListener('blur', () => field.remove(), { once: true });
    }
  };
  byId('logs').onclick = () => toggle(byId('logs'), byId('logPanel'), 'ログを閉じる', 'ログを見る');
})();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountLivePocket, { once: true });
  else mountLivePocket();
}
