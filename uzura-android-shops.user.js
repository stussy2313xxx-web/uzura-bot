// ==UserScript==
// @name          うずら BOT Android — ショップ・購入通知
// @namespace     uzura.bot.android.shops
// @version       2.1.44.10931
// @description   Android版。Shopify、Supreme、HUMAN MADE、Buffer、Palaceなどの購入補助とDiscord購入通知。
// @match         https://*/*
// @run-at        document-start
// @sandbox       DOM
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM.xmlHttpRequest
// @connect       discord.com
// ==/UserScript==
// Store registry: catalog schema checked using read-only requests on 2026-11-06.
const UZURA_STORES = [{"name":"STÜSSY","hosts":["jp.stussy.com"],"group":"street"},{"name":"A+S","hosts":["architectureandsneakers.com"],"group":"street"},{"name":"DOVER STREET MARKET GINZA","hosts":["shop-jp.doverstreetmarket.com"],"group":"street"},{"name":"NUBIAN","hosts":["nubiantokyo.com"],"group":"street"},{"name":"WTAPS","hosts":["wtaps.com"],"group":"street"},{"name":"NEIGHBORHOOD","hosts":["neighborhood.jp"],"group":"street"},{"name":"BAPE","hosts":["jp.bape.com"],"group":"street"},{"name":"UNION TOKYO","hosts":["uniontokyo.jp"],"group":"street"},{"name":"JJJJOUND","hosts":["jjjjound.com"],"group":"street"},{"name":"GDC","hosts":["gdc.tokyo"],"group":"street"},{"name":"NEW ERA","hosts":["neweracap.jp"],"group":"street"},{"name":"mita sneakers","hosts":["mita-sneakers.co.jp"],"group":"street"},{"name":"WIND AND SEA","hosts":["windandsea.jp"],"group":"street"},{"name":"FTC","hosts":["ftcsf.com"],"group":"street"},{"name":"UNDEFEATED","hosts":["undefeated.jp"],"group":"street"},{"name":"HUF","hosts":["hufworldwide.jp"],"group":"street"},{"name":"SC Subculture","hosts":["sc-subculture.jp"],"group":"street"},{"name":"Denim Tears","hosts":["denimtears.com"],"group":"street"},{"name":"Carhartt WIP","hosts":["carhartt-wip.jp"],"group":"street"},{"name":"FreshService","hosts":["freshservice.jp"],"group":"street"},{"name":"Aimé Leon Dore","hosts":["aimeleondore.com"],"group":"street"},{"name":"Cactus Plant Flea Market","hosts":["cactusplantfleamarket.com"],"group":"street"},{"name":"NOAH","hosts":["noahny.com"],"group":"street"},{"name":"Awake NY","hosts":["awakenyclothing.com"],"group":"street"},{"name":"BlackEyePatch","hosts":["blackeyepatch.com"],"group":"street"},{"name":"KICKS LAB.","hosts":["kickslab.com"],"group":"street"},{"name":"CONVERSE","hosts":["converse.co.jp"],"group":"street"},{"name":"Clarks","hosts":["clarks.co.jp"],"group":"street"},{"name":"sacai","hosts":["sacai.jp"],"group":"street"},{"name":"Graphpaper","hosts":["graphpaper-tokyo.com"],"group":"street"},{"name":"N.HOOLYWOOD","hosts":["n-hoolywood.com"],"group":"street"},{"name":"Fear of God","hosts":["fearofgod.com"],"group":"street"},{"name":"Gallery Dept.","hosts":["gallerydept.com"],"group":"street"},{"name":"#FR2","hosts":["fr2.tokyo"],"group":"street"},{"name":"Liberaiders","hosts":["liberaiders.jp"],"group":"street"},{"name":"SUICOKE","hosts":["suicoke.com"],"group":"street"},{"name":"KEEN","hosts":["keenfootwear.jp"],"group":"street"},{"name":"Salomon","hosts":["salomon.jp"],"group":"street"},{"name":"Hellstar","hosts":["hellstar.com"],"group":"street"},{"name":"Sp5der","hosts":["kingspider.co"],"group":"street"},{"name":"Brain Dead","hosts":["wearebraindead.com"],"group":"street"},{"name":"PLEASURES","hosts":["pleasuresnow.com"],"group":"street"},{"name":"Dime","hosts":["dimemtl.com"],"group":"street"},{"name":"Polar Skate Co.","hosts":["polarskateco.com"],"group":"street"},{"name":"ERL","hosts":["erl.store"],"group":"street"},{"name":"Aries","hosts":["ariesarise.com"],"group":"street"},{"name":"BODE","hosts":["bode.com"],"group":"street"},{"name":"Patta","hosts":["patta.nl"],"group":"street"},{"name":"Anti Social Social Club","hosts":["antisocialsocialclub.com"],"group":"street"},{"name":"REPRESENT","hosts":["representclo.com"],"group":"street"},{"name":"Trapstar","hosts":["uk.trapstarlondon.com"],"group":"street"},{"name":"Corteiz","hosts":["corteiz.com"],"group":"street"},{"name":"PATRICK","hosts":["patrick.jp"],"group":"street"},{"name":"LFYT","hosts":["lfyt.jp"],"group":"street"},{"name":"V.A.","hosts":["vatokyo.com"],"group":"street"},{"name":"Diaspora","hosts":["diasporaskateboards.com"],"group":"skate"},{"name":"Evisen","hosts":["shop.evisenskateboards.com"],"group":"skate"},{"name":"Quasi","hosts":["quasiskateboards.com"],"group":"skate"},{"name":"Last Resort AB","hosts":["lastresortab.com"],"group":"skate"},{"name":"Frog","hosts":["frogskateboards.com"],"group":"skate"},{"name":"THRASHER","hosts":["shop.thrashermagazine.com"],"group":"skate"},{"name":"WKND","hosts":["wkndbrand.com"],"group":"skate"},{"name":"Bronze 56k","hosts":["shop.bronze56k.com"],"group":"skate"},{"name":"Butter Goods","hosts":["buttergoods.com"],"group":"skate"},{"name":"ちいかわマーケット","hosts":["chiikawamarket.jp"],"group":"hobby"},{"name":"hololive production","hosts":["shop.hololivepro.com"],"group":"hobby"},{"name":"JUMP SHOP","hosts":["jumpshop-benelic.com"],"group":"hobby"},{"name":"Filmarks Store","hosts":["store.filmarks.com"],"group":"hobby"},{"name":"Kaikai Kiki","hosts":["store.kaikaikiki.com"],"group":"hobby"},{"name":"9090","hosts":["yz-store.com"],"group":"hobby","collection":"9090"},{"name":"LIBERTY WALK","hosts":["lbwk.jp"],"group":"hobby"},{"name":"ANNA SUI","hosts":["annasui.co.jp"],"group":"ladies"},{"name":"FORGET ME NOTS","hosts":["forgetmenots.jp"],"group":"ladies"},{"name":"DEADLY DOLL","hosts":["deadlydoll.com"],"group":"ladies"},{"name":"Darich","hosts":["darich.shop"],"group":"ladies"},{"name":"Mame Kurogouchi","hosts":["mamekurogouchi.com"],"group":"ladies"},{"name":"louren","hosts":["louren.jp"],"group":"ladies"},{"name":"MURRAL","hosts":["murral.jp"],"group":"ladies"},{"name":"JUEMI","hosts":["juemi.jp"],"group":"ladies"},{"name":"COHINA","hosts":["cohina.net"],"group":"ladies"},{"name":"EDIKTED","hosts":["edikted.com"],"group":"ladies"},{"name":"House of Sunny","hosts":["houseofsunny.com"],"group":"ladies"},{"name":"Alo Yoga","hosts":["aloyoga.com"],"group":"ladies"},{"name":"Rouje","hosts":["rouje.com"],"group":"ladies"},{"name":"Marine Serre","hosts":["marineserre.com"],"group":"ladies"},{"name":"Paloma Wool","hosts":["palomawool.com"],"group":"ladies"},{"name":"Andmary","hosts":["andmary.co.jp"],"group":"ladies"},{"name":"JAM HOME MADE","hosts":["jamhomemade.com"],"group":"ladies"},{"name":"CHARI&CO","hosts":["chariandco.jp"],"group":"ladies"},{"name":"Maker’s Watch Knot","hosts":["knot-designs.com"],"group":"other"},{"name":"UNDONE","hosts":["undone.com"],"group":"other"},{"name":"Lorier","hosts":["lorierwatches.com"],"group":"other"},{"name":"MVMT","hosts":["mvmt.com"],"group":"other"},{"name":"Serica","hosts":["serica-watches.com"],"group":"other"},{"name":"anOrdain","hosts":["anordain.com"],"group":"other"},{"name":"WHIMSY","hosts":["whimsysocks.com"],"group":"other"}];
const uzuraStoreFor = host => UZURA_STORES.find(s => s.hosts.includes(String(host).toLowerCase().replace(/^www\./, ''))) || null;
const UZURA_CURRENT = uzuraStoreFor(location.hostname);
const UZURA_PENDING_HOSTS = ["marketstudios.com", "chinatownmarket.com", "nagano-market.jp", "herlipto.jp"];
const uzuraLocaleRoot = path => { const m = /^\/([a-z]{2}(?:-[a-z]{2})?)\//i.exec(path || '/'); return m ? '/' + m[1] + '/' : '/'; };

// Purchase-success webhook settings shared through Userscripts GM storage.
(async function uzuraDiscord() {
  'use strict';
  if (window.top !== window || (!UZURA_CURRENT && !/(^|\.)(?:mellojoy(?:lucky\.cn|japan\.com|us\.com)|shop\.app|supreme\.com|humanmade\.jp|buffering\.jp)$|^(?:checkout\.)?jp\.palaceskateboards\.com$/i.test(location.hostname))) return;
  const VALID = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  const FIXED_WEBHOOK = ''; // Use the notification destination saved in the script manager. // Administrator inserts the shared destination here once.
  // Initial distribution saves the shared destination once; public updates use GM storage.
  if (VALID.test(FIXED_WEBHOOK)) await GM.setValue('uzura_notify_hook', FIXED_WEBHOOK);
  const load = (k,d) => GM.getValue('uzura_notify_'+k,d);
  const save = (k,v) => GM.setValue('uzura_notify_'+k,v);
  let active = await load('enabled',true), hook = await load('hook','');
  const request = payload => new Promise((resolve,reject) => {
    if (!VALID.test(hook)) return reject(new Error('Webhook URLを保存してください'));
    GM.xmlHttpRequest({method:'POST',url:hook+'?wait=true',headers:{'Content-Type':'application/json'},
      data:JSON.stringify(payload),timeout:15000,
      onload:r=>r.status>=200&&r.status<300 ? resolve() : reject(new Error('Discord HTTP '+r.status)),
      onerror:()=>reject(new Error('通知通信エラー')),ontimeout:()=>reject(new Error('通知がタイムアウトしました'))});
  });
  const stripUrl = u => {try {const x=new URL(u);return x.protocol==='https:' ? x.origin+x.pathname : undefined;}catch{return undefined;}};
  let queue = Promise.resolve();
  window.addEventListener('uzura-purchase-success',e => {
    let data;try {data=JSON.parse(e.detail);} catch{return;}
    queue=queue.then(async()=>{
      active=await load('enabled',true);hook=await load('hook','');
      if(!active || !VALID.test(hook) || !Array.isArray(data.embeds)) return;
      const embeds=data.embeds.filter(x=>/Checkout Successful/.test(x.author||'')).slice(0,10).map(x=>({
        title:String(x.title||'購入成功').slice(0,250),color:0x2ecc71,
        author:{name:'購入成功'},url:stripUrl(x.url),thumbnail:stripUrl(x.thumb)?{url:stripUrl(x.thumb)}:undefined,
        fields:(x.fields||[]).filter(f=>/^(Size|Quantity|Site|価格|サイズ|数量|Order|注文番号)$/i.test(f[0]) && f[1]!=null && f[1]!=='').map(f=>({name:String(f[0]),value:String(f[1]).slice(0,1000),inline:true})),
        timestamp:new Date().toISOString(),footer:{text:'うずら BOT'}
      }));
      if(!embeds.length || /komoju\.com$/.test(location.hostname)) return;
      const order=embeds.flatMap(x=>x.fields).find(f=>/^(Order|注文番号)$/i.test(f.name))?.value;
      const id=location.hostname+':'+(order || location.pathname);
      embeds.forEach(e => { e.fields = e.fields.filter(f => !/^(Order|注文番号)$/i.test(f.name)); }); // Order ID is used only locally for deduplication.
      const sent=await load('sent',{});
      if(sent[id]) return;
      try {
        await request({username:'うずら BOT',allowed_mentions:{parse:[]},embeds});
        sent[id]=Date.now();await save('sent',Object.fromEntries(Object.entries(sent).slice(-100)));say('購入成功の通知を送信しました。');
      } catch(err){say(err.message+'。送信先や通信状況を管理者に確認してください。');pending={id,embeds};}
    }).catch(()=>{});
  });
  let pending=null, info;
  const say=t=>{console.info('[うずら BOT 通知]',t);};
  // Notification switch only; the shared destination cannot be edited here.
  function mountToggle() {
    const button=document.createElement('button');
    button.id='uzura-discord-toggle';
    button.style.cssText='position:fixed;right:10px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147483647;background:#10213b;color:#fff;border:1px solid #9bb3d2;border-radius:16px;padding:10px 12px;font:700 13px -apple-system,sans-serif';
    const paint=()=>{button.textContent=active?'🔔 購入通知 ON':'🔕 購入通知 OFF';button.setAttribute('aria-pressed',String(active));};
    paint();
    button.onclick=async()=>{active=!(await load('enabled',true));await save('enabled',active);paint();};
    document.body.append(button);
  }
  if(document.body)mountToggle();else document.addEventListener('DOMContentLoaded',mountToggle,{once:true});
  // No per-user Webhook settings or notification button.
  // Existing saved destination works until administrator embeds FIXED_WEBHOOK.
})();



(function uzuraValladCheckout() {
  'use strict';

  const onCart = location.pathname.startsWith('/cart/');
  if (location.origin !== 'https://test.valladstudio.com' || window.top !== window ||
      !(location.pathname === '/' || onCart)) return;

  const key = 'uzura-vallad-checkout-profile-v1';
  const fields = [
    ['name', '氏名', 'text', 'input[name="customerAddressName"]'],
    ['kana', 'フリガナ', 'text', 'input[name="customerAddressFurigana"][type="text"]'],
    ['postal', '郵便番号', 'text', 'input[name="customerAddressPostalCode"]'],
    ['prefecture', '都道府県', 'text', 'select[name="customerAddressPrefecture"]'],
    ['address1', '市区町村・番地', 'text', 'input[name="customerAddressAddress1"]'],
    ['address2', '建物名・部屋番号', 'text', 'input[name="customerAddressAddress2"]'],
    ['phone', '電話番号', 'tel', 'input[name="customerAddressPhoneNumber"], input[name="customerAddressTelMobile"]'],
    ['email', 'メールアドレス', 'email', 'cms-email-field input[ng-model="$ctrl.email"]'],
  ];
  const addressSelector = 'cms-address[name="customerAddress"]';
  const visible = field => field.getClientRects().length && getComputedStyle(field).visibility === 'visible';
  const usable = field => visible(field) && !field.matches(':disabled, [readonly]');
  const normalize = text => String(text ?? '').normalize('NFKC').trim();

  async function start() {
    const panel = document.createElement('details');
    panel.id = 'uzura-vallad-checkout';
    panel.style.cssText = onCart
      ? 'position:fixed;right:10px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:2147483647;background:#10213b;color:#fff;border-radius:12px;padding:12px;width:min(300px,calc(100vw - 44px));max-height:65vh;overflow:auto;font:16px system-ui;box-shadow:0 3px 14px #0005'
      : 'border-top:1px solid #547096;margin-top:12px;padding-top:10px';
    panel.innerHTML = '<summary></summary><form autocomplete="off"></form><p role="status"></p>';
    panel.querySelector('summary').textContent = onCart ? 'うずら BOT · VALLAD / お届け先設定' : 'お届け先設定';
    const form = panel.querySelector('form');
    const status = panel.querySelector('[role="status"]');
    const inputs = new Map();
    for (const [key, label, type] of fields) {
      const row = document.createElement('label');
      row.style.cssText = 'display:block;margin:6px 0';
      const input = document.createElement('input');
      input.type = type;
      input.style.cssText = 'display:block;width:100%;box-sizing:border-box;background:#fff;color:#10213b;-webkit-text-fill-color:#10213b;font-size:16px';
      input.maxLength = key === 'email' ? 255 : 80;
      if (key === 'postal') input.inputMode = 'numeric';
      if (key === 'prefecture') input.placeholder = '例 東京都';
      row.append(label, input);
      form.append(row);
      inputs.set(key, input);
    }
    const note = document.createElement('small');
    note.textContent = '保存後はカートの空欄に自動入力。カード欄はSafariの自動入力を使えます。';
    const save = document.createElement('button');
    save.type = 'submit';
    save.textContent = '保存';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '保存内容を消去';
    for (const button of [save, remove]) {
      button.style.cssText = 'margin:5px;color:#10213b;background:#fff;-webkit-text-fill-color:#10213b';
    }
    form.append(note, document.createElement('br'), save, remove);

    let profile = await GM.getValue(key, null);
    for (const [name, input] of inputs) input.value = profile?.[name] || '';
    let applied = new WeakSet();

    function fill() {
      if (!profile || !onCart) return;
      const addresses = [...document.querySelectorAll(addressSelector)].filter(visible);
      if (addresses.length !== 1) return;
      const address = addresses[0];
      if (address.querySelector('input[name="customerAddressOverseasDelivery"]:checked')) return;
      let count = 0;
      for (const [name, , , selector] of fields) {
        const scope = name === 'email' ? address.parentElement : address;
        const targets = [...scope.querySelectorAll(selector)].filter(usable);
        if (targets.length !== 1) continue;
        const field = targets[0];
        if (!profile[name] || field.value || applied.has(field)) continue;
        let value = profile[name];
        if (field.tagName === 'SELECT') {
          const option = [...field.options].find(option => !option.disabled && option.value &&
            normalize(option.textContent) === normalize(value));
          if (!option) continue;
          value = option.value;
        }
        applied.add(field);
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        count++;
      }
      if (count) status.textContent = 'お届け先を自動入力しました。内容と空欄をご確認ください。';
    }

    form.onsubmit = async event => {
      event.preventDefault();
      const next = Object.fromEntries([...inputs].map(([name, input]) => [name, input.value.trim()]));
      next.postal = normalize(next.postal).replace(/[\s-]/g, '');
      if (next.postal && !/^\d{7}$/.test(next.postal)) {
        status.textContent = '郵便番号は7桁で入力してください。';
        return;
      }
      try {
        await GM.setValue(key, next);
        profile = next;
        applied = new WeakSet();
        status.textContent = 'お届け先を保存しました。';
        fill();
      } catch { status.textContent = '保存できませんでした。'; }
    };
    remove.onclick = async () => {
      try {
        await GM.setValue(key, null);
        profile = null;
        for (const input of inputs.values()) input.value = '';
        status.textContent = '保存したお届け先を消去しました。';
      } catch { status.textContent = '消去できませんでした。'; }
    };
    if (!onCart) {
      const shopPanel = document.getElementById('uzura-vallad');
      if (shopPanel) shopPanel.append(panel);
      else document.addEventListener('uzura-vallad-panel-mounted', () => {
        document.getElementById('uzura-vallad')?.append(panel);
      }, { once: true });
      return;
    }
    document.body.append(panel);
    const observer = new MutationObserver(fill);
    observer.observe(document.body, { childList: true, subtree: true });
    fill();
  }

  const mount = () => start().catch(error => console.warn('VALLAD お届け先設定:', error.message));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();

(function uzuraVallad() {
  'use strict';
  const host = 'test.valladstudio.com';
  if (location.hostname !== host || window.top !== window) return;
  const url = new URL(location.href);
  const pid = url.searchParams.get('pid');
  const mode = url.searchParams.get('mode');
  if (url.pathname !== '/' || (pid !== null && !/^\d+$/.test(pid))) return;
  if (pid === null && mode && mode !== 'srh') return;

  const shopId = 'PA01524832';
  const intentKey = 'uzura-vallad-cart-intent';
  const scheduleKey = 'uzura-vallad-schedule-v1';
  const logKey = 'uzura-vallad-run-log-v1';
  const watchMs = 120000;
  const pollMs = 300;
  const catalogUrl = new URL('/', url.origin);
  catalogUrl.searchParams.set('mode', 'srh');
  const productUrl = id => new URL('/?pid=' + id, url.origin);
  const normalize = value => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toUpperCase();
  const productName = value => normalize(String(value ?? '').replace(/[\u200B-\u200D\uFEFF]/g, ''))
    .replace(/\s*×\s*|\s+X\s+/g, 'X');
  const matchesName = (actual, expected) => productName(actual) === productName(expected);
  const validQuantity = quantity => Number.isInteger(quantity) && quantity >= 1 && quantity <= 20;
  const loadLog = () => {
    try {
      const entries = JSON.parse(localStorage.getItem(logKey) || '[]');
      return Array.isArray(entries) ? entries : [];
    } catch { return []; }
  };
  let entries = loadLog();
  const logView = () => document.querySelector('#uzura-vallad [data-run-log]');
  function log(message) {
    const time = new Date(Date.now() + 9 * 3600000).toISOString().slice(11, 19);
    entries = [...entries.slice(-24), time + ' ' + message];
    try { localStorage.setItem(logKey, JSON.stringify(entries)); } catch {}
    const view = logView();
    if (view) view.textContent = entries.join('\n');
  }

  function readProduct(doc, id = pid) {
    const form = doc.querySelector('form[name="product_form"]');
    const fields = form?.elements;
    const action = form && new URL(form.getAttribute('action'), url);
    if (!action || action.origin !== url.origin || action.pathname !== '/cart/proxy/basket/items/add' ||
        form.method !== 'post' || fields.namedItem('shop_id')?.value !== shopId ||
        fields.namedItem('shop_domain')?.value !== host || fields.namedItem('product_id')?.value !== id ||
        !fields.namedItem('reference_token')?.value) {
      throw new Error('VALLADの商品フォームを確認できません');
    }

    const data = Array.from(doc.scripts, script => script.textContent.match(/^\s*var Colorme = (\{[^\n]*\});\s*$/m)?.[1]).find(Boolean);
    const product = data && JSON.parse(data).product;
    if (!product || product.shop_uid !== shopId || String(product.id) !== id || !Array.isArray(product.variants)) {
      throw new Error('VALLADの商品情報を確認できません');
    }

    const sizeField = form.querySelector('select[name="option1"]');
    if (form.querySelector('select[name="option2"], input[name="option"]') || (sizeField && !product.variants.length)) {
      throw new Error('この商品のオプション形式は未対応です');
    }
    const sizes = product.variants.length ? product.variants.map(variant => ({
      name: variant.option1_value,
      stock: variant.stock_num,
      option: sizeField && Array.from(sizeField.options).find(option => option.text.trim() === variant.option1_value),
    })) : [{ name: '', stock: product.stock_num }];
    return { product, sizes, sizeField, qtyField: form.querySelector('input[name="product_num"]'),
      button: form.querySelector('button[type="submit"].btn-addcart, button[type="submit"].button--addcart') };
  }

  function available(item, size, quantity) {
    const variant = item.sizes.find(value => value.name === size);
    if (!variant || !Number.isInteger(variant.stock)) throw new Error('指定サイズの在庫情報を確認できません');
    return variant.stock >= quantity && !!item.button && !item.button.matches(':disabled') && !!item.qtyField &&
      (!size || !!variant.option && !variant.option.disabled && /^\d+,\d+$/.test(variant.option.value));
  }

  function parseTarget(value, by) {
    const code = normalize(value);
    if (by === 'name') {
      if (productName(value) && code.length <= 200) return { name: code };
      throw new Error('ショップ表記どおりの商品名を入力してください');
    }
    if (/^\d+$/.test(code)) return { id: code };
    if (/^https:\/\//i.test(value.trim())) {
      const address = new URL(value.trim());
      const id = address.searchParams.get('pid');
      if (address.origin === url.origin && address.pathname === '/' && /^\d+$/.test(id || '')) return { id };
    } else if (/^[A-Z0-9][A-Z0-9._/-]{0,63}$/.test(code)) {
      return { model: code };
    }
    throw new Error('商品ID・VALLADの商品URL・英数字の型番を入力してください');
  }

  function scheduledChoice(item, task) {
    if (task.id && String(item.product.id) !== task.id) return null;
    if (task.name && !matchesName(item.product.name, task.name)) return null;
    const modelMatch = !task.model || normalize(item.product.model_number) === task.model;
    const candidates = item.sizes.filter((size, index) =>
      (modelMatch || normalize(item.product.variants[index]?.model_number) === task.model) &&
      (task.size ? normalize(size.name) === task.size : !size.name || !modelMatch));
    return candidates.length === 1 ? candidates[0] : null;
  }

  async function fetchPage(address, signal, deadline) {
    const request = new AbortController();
    const abort = () => request.abort();
    if (signal.aborted || Date.now() >= deadline) throw new Error('確認を終了しました');
    signal.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, Math.min(8000, deadline - Date.now()));
    try {
      const response = await fetch(address.href, { cache: 'no-store', credentials: 'same-origin', signal: request.signal });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('サイトの応答により停止しました（HTTP ' + response.status + '）');
      const landed = new URL(response.url);
      if (landed.origin !== address.origin || landed.pathname !== '/' ||
          landed.searchParams.get('pid') !== address.searchParams.get('pid') ||
          landed.searchParams.get('mode') !== address.searchParams.get('mode')) return null;
      const charset = response.headers.get('content-type')?.match(/charset\s*=\s*([^;\s]+)/i)?.[1] || document.characterSet;
      const text = new TextDecoder(charset).decode(await response.arrayBuffer());
      return new DOMParser().parseFromString(text, 'text/html');
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener('abort', abort);
    }
  }

  function catalogIds(doc, name) {
    const ids = new Set();
    for (const link of doc?.querySelectorAll('.prd-lst-name a[href], a.box__inner[href]') || []) {
      const title = link.querySelector('.box__name')?.textContent ?? link.textContent;
      if (name && !matchesName(title, name)) continue;
      const address = new URL(link.getAttribute('href'), catalogUrl);
      const id = address.searchParams.get('pid');
      if (address.origin !== url.origin || address.pathname !== '/' || !/^\d+$/.test(id || '')) continue;
      ids.add(id);
      if (!name && ids.size === 12) break;
    }
    return [...ids];
  }

  async function findScheduledItem(task, signal, report) {
    const deadline = task.at + watchMs;
    const newest = new URL(catalogUrl);
    newest.searchParams.set('sort', 'n');
    const ids = task.id ? [task.id] : catalogIds(await fetchPage(newest, signal, deadline), task.name);
    if (task.name && ids.length > 1) throw new Error('一致する商品が複数あります。商品IDを指定してください');
    if (task.name && !ids.length) report('新着一覧に一致する商品名がありません。掲載を待っています。');
    const matches = [];
    for (const [index, id] of ids.entries()) {
      if (index) await new Promise(resolve => setTimeout(resolve, pollMs));
      if (signal.aborted || Date.now() >= deadline) return null;
      const doc = await fetchPage(productUrl(id), signal, deadline);
      if (!doc?.querySelector('form[name="product_form"]')) {
        if (task.name) report('一覧では一致しました（商品ID ' + id + '）。商品詳細の公開を待っています。');
        continue;
      }
      const item = readProduct(doc, id);
      const choice = scheduledChoice(item, task);
      if (choice) matches.push({ id, item, choice });
      else if (task.id || (task.name && matchesName(item.product.name, task.name))) {
        throw new Error(item.sizes.every(size => !size.name)
          ? 'この商品はサイズ指定なしです。サイズ欄を空にして実行してください'
          : (task.size ? '指定サイズがありません。' : 'サイズを入力してください。') +
            ' 選択肢 ' + item.sizes.map(size => size.name).join(' / '));
      }
      else if (task.name) report('一覧と商品詳細の名前が一致しません（商品ID ' + id + '）。');
    }
    if (matches.length > 1) throw new Error('一致する商品が複数あります。商品IDを指定してください');
    const match = matches[0];
    return match ? { ...match, ready: available(match.item, match.choice.name, task.quantity) } : null;
  }

  function makePanel() {
    const panel = document.createElement('details');
    panel.id = 'uzura-vallad';
    panel.style.cssText = 'position:fixed;right:10px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:2147483647;background:#10213b;color:#fff;border-radius:12px;padding:12px;width:min(300px,calc(100vw - 44px));max-height:65vh;overflow:auto;font:16px system-ui;box-shadow:0 3px 14px #0005';
    return panel;
  }

  function mountPanel(panel) {
    const style = document.createElement('style');
    style.textContent = `
      #uzura-vallad :is(input, select, button) {
        color: #10213b !important;
        -webkit-text-fill-color: #10213b !important;
        background: #fff !important;
        border: 1px solid #9aafc9 !important;
        border-radius: 8px !important;
        font-size: 16px !important;
        color-scheme: light;
        min-height: 36px;
        padding: 4px 8px;
        box-sizing: border-box;
      }
      #uzura-vallad input::placeholder {
        color: #56677d !important;
        -webkit-text-fill-color: #56677d !important;
        opacity: 1 !important;
      }
      #uzura-vallad :is(input, select, button):disabled {
        color: #3f4d60 !important;
        -webkit-text-fill-color: #3f4d60 !important;
        background: #e4ebf4 !important;
        opacity: 1 !important;
      }
      #uzura-vallad button:not(:disabled) { cursor: pointer; }
    `;
    const history = document.createElement('details');
    history.innerHTML = '<summary>実行ログ（日本時間）</summary><pre data-run-log style="white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px"></pre>';
    history.style.marginTop = '10px';
    history.querySelector('pre').textContent = entries.join('\n') || 'この版での実行ログはまだありません。';
    panel.append(style, history);
    document.body.append(panel);
    document.dispatchEvent(new Event('uzura-vallad-panel-mounted'));
  }

  function showGuide(message) {
    const panel = makePanel();
    panel.innerHTML = '<summary>うずら BOT · VALLAD</summary><p data-status role="status"></p><a data-catalog style="color:#fff">商品一覧を開く</a>';
    panel.querySelector('[data-status]').textContent = message;
    const link = panel.querySelector('[data-catalog]');
    link.href = catalogUrl.href;
    link.hidden = mode === 'srh' && pid === null;
    mountPanel(panel);
  }

  function showSchedule() {
    const panel = makePanel();
    panel.innerHTML = '<summary>うずら BOT · VALLAD</summary>' +
      '<p><label>指定方法 <select data-by style="font-size:16px"><option value="code">商品コード</option><option value="name">商品名</option></select></label><br>' +
      '<input data-code type="text" placeholder="商品ID・商品URL・型番" aria-label="商品コードまたは商品名" autocapitalize="off" style="width:95%;font-size:16px"></p>' +
      '<p><label>サイズ <input data-size type="text" placeholder="例 M" style="width:5em;font-size:16px"></label> ' +
      '<label>数量 <input data-qty type="number" min="1" max="20" value="1" style="width:4em;font-size:16px"></label></p>' +
      '<p><label>発売日時（日本時間）<br><input data-at type="datetime-local" style="max-width:100%;font-size:16px"></label></p>' +
      '<p><button type="button" data-arm>発売時刻に開始</button> <button type="button" data-now>すぐ実行</button> ' +
      '<button type="button" data-stop disabled>停止</button></p><p data-status role="status"></p>' +
      '<small>商品IDは商品URLの pid= に続く数字。商品名は色名まで入力。型番は新着一覧の先頭12商品を確認します。サイズ展開がない商品はサイズ欄を空欄にします。</small>';
    const field = name => panel.querySelector('[data-' + name + ']');
    const by = field('by'), code = field('code'), size = field('size'), qty = field('qty'), at = field('at');
    at.value = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10) + 'T20:00';
    const arm = field('arm'), now = field('now'), stop = field('stop');
    const say = message => {
      const status = field('status');
      if (status.textContent !== message) log(message);
      status.textContent = message;
    };
    let timer, controller;
    function active(value) {
      for (const input of [by, code, size, qty, at, arm, now]) input.disabled = value;
      stop.disabled = !value;
    }
    function clear() {
      clearTimeout(timer);
      controller?.abort();
      controller = null;
      sessionStorage.removeItem(scheduleKey);
      active(false);
    }
    async function run(task) {
      const current = new AbortController();
      controller = current;
      let foundName;
      let attempts = 0;
      log('実行開始（' + (task.name ? '商品名' : '商品コード') + '） ' + task.code +
        ' / サイズ ' + (task.size || '指定なし') + ' / 数量 ' + task.quantity);
      say(task.name ? '新着一覧から商品名を検索中…' : '指定商品とサイズの在庫を確認中…');
      function expire() {
        clear();
        say((foundName ? foundName + '：商品は見つかりましたが、指定数量をカートに入れられず2分で終了しました。'
          : '2分で終了しました。指定した商品が見つかりませんでした。商品名・商品IDを確認してください。') + '（確認 ' + attempts + ' 回）');
      }
      try {
        while (!current.signal.aborted && Date.now() < task.at + watchMs) {
          attempts++;
          const match = await findScheduledItem(task, current.signal, message => {
            if (!current.signal.aborted) say(message);
          });
          if (current.signal.aborted || Date.now() >= task.at + watchMs) break;
          if (match?.ready) {
            sessionStorage.setItem(intentKey, JSON.stringify({ pid: match.id, name: match.choice.name,
              quantity: task.quantity, expires: task.at + watchMs, scheduled: task }));
            sessionStorage.removeItem(scheduleKey);
            say('対象商品が見つかりました（商品ID ' + match.id + '）。商品詳細へ移動します。');
            location.assign(productUrl(match.id).href);
            return;
          }
          if (match) {
            foundName = match.item.product.name;
            say(foundName + '：指定数量をカートに入れられる状態を待っています。');
          }
          await new Promise(resolve => setTimeout(resolve, pollMs));
        }
        if (!current.signal.aborted) expire();
      } catch (error) {
        if (!current.signal.aborted) {
          if (Date.now() >= task.at + watchMs) { expire(); return; }
          clear();
          say(error.message || '確認を停止しました');
        }
      }
    }
    function schedule(task) {
      active(true);
      if (Date.now() >= task.at) { run(task); return; }
      say('開始待ち。発売時刻までこのタブを開いてください。');
      timer = setTimeout(() => schedule(task), Math.min(task.at - Date.now(), 60000));
    }
    function start(immediate) {
      try {
        const when = immediate ? Date.now() : Date.parse(at.value + '+09:00');
        if (!Number.isFinite(when) || (!immediate && when <= Date.now())) throw new Error('未来の発売日時を入力してください');
        if (!validQuantity(qty.valueAsNumber)) throw new Error('数量は1〜20で入力してください');
        const task = { ...parseTarget(code.value, by.value), by: by.value, code: code.value.trim(), size: normalize(size.value),
          quantity: qty.valueAsNumber, at: when, inputTime: at.value };
        sessionStorage.setItem(scheduleKey, JSON.stringify(task));
        schedule(task);
      } catch (error) { say(error.message || '開始できませんでした'); }
    }
    arm.onclick = () => start(false);
    now.onclick = () => start(true);
    stop.onclick = () => { clear(); say('停止しました'); };
    by.onchange = () => { code.placeholder = by.value === 'name' ? '色名まで含めた正式な商品名' : '商品ID・商品URL・型番'; };
    window.addEventListener('pagehide', () => { clearTimeout(timer); controller?.abort(); });
    window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
    function restore() {
      let task;
      try { task = JSON.parse(sessionStorage.getItem(scheduleKey) || 'null'); } catch { return; }
      if (!task) { active(false); return; }
      panel.open = true;
      by.value = task.by === 'name' ? 'name' : 'code';
      by.onchange();
      code.value = task.code;
      size.value = task.size;
      qty.value = String(task.quantity);
      at.value = task.inputTime;
      if (!Number.isFinite(task.at) || !validQuantity(task.quantity) || Date.now() >= task.at + watchMs) {
        clear();
        say('開始から2分が経過しました。');
        return;
      }
      schedule(task);
    }
    mountPanel(panel);
    restore();
  }

  function boot() {
    if (document.getElementById('uzura-vallad')) return;
    if (pid === null) {
      showSchedule();
      return;
    }
    let resume = null;
    try {
      resume = JSON.parse(sessionStorage.getItem(intentKey) || 'null');
      sessionStorage.removeItem(intentKey);
    } catch { /* A blocked session store only prevents resuming a stock watch. */ }

    let item;
    try { item = readProduct(document); }
    catch (error) { showGuide(error.message); return; }

    const panel = makePanel();
    panel.innerHTML = '<summary>うずら BOT · VALLAD</summary><p data-product></p><p><label>サイズ <select data-size></select></label> <label>数量 <input data-qty type="number" min="1" max="20" value="1" style="width:4em"></label></p><p><button type="button" data-add>カートに入れる</button> <button type="button" data-watch>在庫を待つ</button></p><p data-status role="status"></p><a data-catalog style="color:#fff">商品一覧</a>';
    const find = name => panel.querySelector('[data-' + name + ']');
    const size = find('size'), qty = find('qty'), status = find('status');
    const add = find('add'), watch = find('watch');
    find('product').textContent = item.product.name;
    find('catalog').href = catalogUrl.href;
    for (const choice of item.sizes) {
      const option = document.createElement('option');
      option.value = choice.name;
      option.textContent = choice.name || 'サイズ指定なし';
      size.append(option);
    }
    if (item.sizes.length > 1) {
      const prompt = document.createElement('option');
      prompt.textContent = '選択してください';
      prompt.disabled = true;
      prompt.selected = true;
      size.prepend(prompt);
    }
    mountPanel(panel);

    let submitted = false;
    let controller = null;
    const say = text => { status.textContent = text; };
    const showError = error => say(error.message || '処理を停止しました');
    const select = () => {
      const selected = size.options[size.selectedIndex];
      const quantity = qty.valueAsNumber;
      if (!selected || selected.disabled || !validQuantity(quantity)) {
        throw new Error('サイズを選び、数量を1〜20で入力してください');
      }
      return { name: selected.value, quantity };
    };
    function submit(choice) {
      if (submitted) return;
      if (!available(item, choice.name, choice.quantity)) throw new Error('指定のサイズ・数量は現在カートに入れられません');
      if (item.sizeField) item.sizeField.value = item.sizes.find(value => value.name === choice.name).option.value;
      item.qtyField.value = String(choice.quantity);
      submitted = true;
      add.disabled = watch.disabled = true;
      say('カートへの追加を送信しました。ショップの表示で結果を確認してください。');
      item.button.click();
    }
    add.onclick = () => {
      if (controller) return;
      try { submit(select()); } catch (error) { showError(error); }
    };
    watch.onclick = async () => {
      if (controller) { controller.abort(); return; }
      if (submitted) return;
      try {
        const choice = select();
        if (available(item, choice.name, choice.quantity)) { submit(choice); return; }
        const run = new AbortController();
        controller = run;
        watch.textContent = '停止';
        add.disabled = size.disabled = qty.disabled = true;
        const expires = Date.now() + 120000;
        say('指定サイズ・数量の在庫を最大2分確認します');
        while (!run.signal.aborted && Date.now() < expires) {
          const timeout = setTimeout(() => run.abort(), 8000);
          let text;
          try {
            const response = await fetch(url.origin + '/?pid=' + pid, {
              cache: 'no-store', credentials: 'same-origin', signal: run.signal,
            });
            const landed = new URL(response.url);
            if (!response.ok || landed.origin !== url.origin || landed.searchParams.get('pid') !== pid) {
              throw new Error('在庫確認を停止しました（HTTP ' + response.status + '）');
            }
            const charset = response.headers.get('content-type')?.match(/charset\s*=\s*([^;\s]+)/i)?.[1] || document.characterSet;
            text = new TextDecoder(charset).decode(await response.arrayBuffer());
          } finally { clearTimeout(timeout); }
          if (run.signal.aborted || Date.now() >= expires) break;
          const current = readProduct(new DOMParser().parseFromString(text, 'text/html'));
          if (available(current, choice.name, choice.quantity)) {
            sessionStorage.setItem(intentKey, JSON.stringify({ ...choice, pid, expires }));
            location.reload();
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        say(run.signal.aborted ? '在庫確認を停止しました' : '2分で在庫確認を終了しました');
      } catch (error) {
        if (controller?.signal.aborted) say('在庫確認を停止しました');
        else showError(error);
      } finally {
        controller = null;
        watch.textContent = '在庫を待つ';
        if (!submitted) add.disabled = size.disabled = qty.disabled = false;
      }
    };
    window.addEventListener('pagehide', () => controller?.abort(), { once: true });

    if (resume?.pid === pid && resume.expires > Date.now() && typeof resume.name === 'string' &&
      validQuantity(resume.quantity)) {
      panel.open = true;
      size.value = resume.name;
      qty.value = String(resume.quantity);
      try {
        if (resume.scheduled && scheduledChoice(item, resume.scheduled)?.name !== resume.name) {
          throw new Error('商品コードまたはサイズが変わったため停止しました');
        }
        submit(select());
        log('カートへの追加を送信（商品ID ' + pid + '）。');
      } catch (error) { showError(error); log(error.message || 'カートへの追加を停止しました'); }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

// Customized for うずら from SYNOVAJOY; original functionality and author attribution retained.
// ===== Ban GOP (thu nghiem): Mellojoy BOT 2.1.43 + SYNOVA Shop BOT 1.9.8 =====
(function () {
  'use strict';
  // ---- BOT Shop: nhu ban rieng (document-end) ----
  var runShop = function () {
    if (/^(?:(?:test|www)\.)?valladstudio\.com$/i.test(location.hostname)) return;

// (kh\u00f4ng c\u00f3 @noframes: \u00f4 s\u1ed1 th\u1ebb c\u1ee7a Shopify n\u1eb1m trong khung checkout.pci.shopifyinc.com -> script ph\u1ea3i ch\u1ea1y trong khung \u0111\u00f3)

// ===================== Ng\u00f4n ng\u1eef (build.py t\u1ea1o 2 b\u1ea3n: ja / vi) =====================
const SYNOVA_LANG = 'ja';
const L = (ja, vi) => (SYNOVA_LANG === 'vi' ? vi : ja);
// C\u00e0i c\u1ea3 b\u1ea3n Nh\u1eadt l\u1eabn b\u1ea3n Vi\u1ec7t -> ch\u1ec9 b\u1ea3n ch\u1ea1y tr\u01b0\u1edbc ho\u1ea1t \u0111\u1ed9ng
const SYNOVA_DUP = !!window.__synovashop;
window.__synovashop = true;

// ===================== Discord webhook (gi\u1ed1ng BOT Mellojoy) =====================
const SYNOVA_WEBHOOK = ''; // Author's fixed notification destination disabled.
const SYNOVA_LOGO_B64 = '';
const SYNOVA_NAME = 'うずら BOT';
const SYNOVA_VERSION = '1.9.8';
const SYNOVA_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNiIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjQwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTAyMTNiIj5VPC90ZXh0Pjwvc3ZnPg==";
const SYNOVA_TITLE = '';
const ICON_TAG = `<img src="${SYNOVA_ICON}" alt="" style="width:40px;height:40px;flex:none;mix-blend-mode:screen">`;
const TITLE_TAG = `<span style="font:900 20px/1.3 -apple-system,sans-serif;color:#ffffff">うずら BOT</span>`;

const HOOK_RE = /^https:\/\/(discord|discordapp)\.com\/api\/webhooks\/\d+\/[\w-]+$/;
// g\u1eedi t\u1edbi webhook SYNOVAJOY (d\u00f9ng chung v\u1edbi BOT Mellojoy) + webhook ri\u00eang ng\u01b0\u1eddi d\u00f9ng t\u1ef1 nh\u1eadp (extra)
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
function synovaNotify(embeds, extra, priv) {
  window.dispatchEvent(new CustomEvent('uzura-purchase-success', {detail:JSON.stringify({embeds})}));
  return; // Purchase-success only; old notification destinations are disabled.
  if (HOOK_RE.test(SYNOVA_WEBHOOK)) synovaPost(SYNOVA_WEBHOOK, embeds);
  if (extra && HOOK_RE.test(extra.trim())) {
    const pf = (priv || []).filter((f) => f[1]);
    synovaPost(extra.trim(), pf.length ? embeds.map((e) => ({ ...e, fields: [...(e.fields || []).slice(0, -1), ...pf, ...(e.fields || []).slice(-1)] })) : embeds);
  }
}
// m\u00e3 \u0111\u01a1n tr\u00ean trang c\u1ea3m \u01a1n: Shopify \u300c\u78ba\u8a8d\u756a\u53f7 ABC123\u300d\u300c\u6ce8\u6587\u756a\u53f7 #1001\u300d/ "Confirmation #ABC123" / "Order #1001", SFCC / Global-e \u300c\u3054\u6ce8\u6587\u756a\u53f7 \u2026\u300d
function findOrderNo(text) {
  const m = (text || '').match(/(?:\u3054\u6ce8\u6587\u756a\u53f7|\u6ce8\u6587\u756a\u53f7|\u78ba\u8a8d\u756a\u53f7|\u6ce8\u6587\s*[#\uff03]|Order\s*(?:number|No\.?)?\s*[#\uff03]?|Confirmation\s*(?:number)?\s*[#\uff03]?)\s*[:\uff1a#\uff03]?\s*([A-Z0-9][A-Z0-9-]{3,})/i);
  return m ? m[1] : '';
}
function synovaPost(hookUrl, embeds) {
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
    fetch(hookUrl, { method: 'POST', mode: 'no-cors', body: fd, keepalive: true }).catch(() => {});
  } catch (e) {}
}

function synovaBubble(id, onShow) {
  let b = document.getElementById(id);
  if (!b) {
    const host = document.createElement('div');
    host.id = id + 'h';
    host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0';
    const root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'position:fixed;right:10px;z-index:2147483647;width:52px;height:52px;border-radius:50%;background:#0d1b32;' +
      'border:2px solid #ffffff;box-shadow:0 4px 16px #000c;display:none;align-items:center;justify-content:center;cursor:pointer';
    b.innerHTML = `<img src="${SYNOVA_ICON}" alt="" style="width:40px;height:40px;mix-blend-mode:screen;pointer-events:none">` +
      '<span style="position:absolute;right:1px;top:1px;width:12px;height:12px;border-radius:50%;border:2px solid #0d1b32"></span>';
    b.onclick = onShow;
    root.appendChild(b);
    document.body.appendChild(host);
  }
  return {
    show(top, active) {
      b.style.top = top ? 'calc(env(safe-area-inset-top) + 60px)' : 'auto';
      b.style.bottom = top ? 'auto' : 'calc(env(safe-area-inset-bottom) + 90px)';
      b.lastChild.style.background = active ? '#2ecc71' : '#777';
      b.style.display = 'flex';
    },
    hide() { b.style.display = 'none'; },
  };
}

const HOST = location.hostname;
const IS_PCI = HOST === 'checkout.pci.shopifyinc.com';
const IN_FRAME = window.top !== window;
const IS_PAL = /^(?:checkout\.)?jp\.palaceskateboards\.com$/.test(HOST);
const IS_PAL_STORE = HOST === 'jp.palaceskateboards.com';
const IS_SUP = /(^|\.)supreme\.com$/.test(HOST);
const IS_HM = /(^|\.)humanmade\.jp$/.test(HOST);
const IS_BUF = /(^|\.)buffering\.jp$/.test(HOST);
// Shop Shopify b\u1ea5t k\u1ef3: nh\u1eadn ra b\u1eb1ng d\u1ea5u v\u1ebft trong HTML (kh\u00f4ng d\u00f9ng window.Shopify: Userscripts c\u00f3 th\u1ec3 ch\u1ea1y script \u1edf
// "content world" kh\u00f4ng th\u1ea5y bi\u1ebfn c\u1ee7a trang). Mellojoy c\u00f3 BOT ri\u00eang -> b\u1ecf qua.
const IS_SHOPAPP = /(^|\.)shop\.app$/.test(HOST);
const IS_SHOPCOM = /(^|\.)shop\.com$/.test(HOST);     // ch\u1ee3 c\u1ee7a Shop (trang ch\u1ee7 shop.app chuy\u1ec3n sang) \u2013 kh\u00f4ng ph\u1ea3i shop
const IS_GEN = !UZURA_PENDING_HOSTS.includes(HOST.replace(/^www\./, '')) && !IS_PAL && !IS_SUP && !IS_HM && !IS_BUF && !IS_PCI && !IS_SHOPAPP && !IS_SHOPCOM && !/mellojoy/i.test(HOST) && !/\.global-e\.com$/.test(HOST) &&
  (!!UZURA_CURRENT || !!document.querySelector('script#shopify-features, meta[name="shopify-checkout-api-token"], meta[name="shopify-digital-wallet"], ' +
    'link[href*="cdn.shopify.com"], script[src*="cdn.shopify.com"], script[src*="/cdn/shop/"], link[href*="/cdn/shop/"]'));
const IS_SHOPIFY = IS_PAL || IS_SUP || IS_GEN;
const SHOP_ROOT = IS_GEN ? uzuraLocaleRoot(location.pathname) : '/';
const shopPath = path => SHOP_ROOT + String(path).replace(/^\//, '');
// trang thanh to\u00e1n KOMOJU (\u9280\u884c\u632f\u8fbc / \u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08 c\u1ee7a nhi\u1ec1u shop Shopify chuy\u1ec3n sang \u0111\u00e2y sau khi b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046)
const IS_KOMOJU = /(^|\.)komoju\.com$/.test(HOST);
// kho GM c\u1ee7a Userscripts d\u00f9ng chung cho M\u1eccI trang script ch\u1ea1y -> shop ghi t\u00ean katakana / \u0111i\u1ec7n tho\u1ea1i / m\u00f3n \u0111ang mua,
// trang KOMOJU \u0111\u1ecdc ra (localStorage c\u1ee7a shop th\u00ec komoju.com kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c). Kh\u00f4ng c\u00f3 GM (tr\u00ecnh qu\u1ea3n l\u00fd kh\u00e1c) -> b\u1ecf qua.
const GMS = (typeof GM !== 'undefined' && GM && GM.setValue && GM.getValue) ? GM : null;
const gmSet = (k, v) => { try { if (GMS) GMS.setValue(k, JSON.stringify(v)).catch(() => {}); } catch (e) {} };
const gmGet = async (k) => { try { if (!GMS) return null; const v = await GMS.getValue(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
const komojuInfo = (b) => ({ klast: b.klast || '', kfirst: b.kfirst || '', phone: b.phone || '', kstore: b.kstore || 'seven',
  last: b.last || '', first: b.first || '', email: b.email || '', uwh: b.uwh || '', at: Date.now() });
const KSTORES = [['seven', '\u30bb\u30d6\u30f3-\u30a4\u30ec\u30d6\u30f3', /\u30bb\u30d6\u30f3|7-?eleven/i], ['lawson', '\u30ed\u30fc\u30bd\u30f3', /\u30ed\u30fc\u30bd\u30f3|lawson/i], ['family', '\u30d5\u30a1\u30df\u30ea\u30fc\u30de\u30fc\u30c8', /\u30d5\u30a1\u30df\u30ea\u30fc\u30de\u30fc\u30c8|familymart/i],
  ['ministop', '\u30df\u30cb\u30b9\u30c8\u30c3\u30d7', /\u30df\u30cb\u30b9\u30c8\u30c3\u30d7|ministop/i], ['daily', '\u30c7\u30a4\u30ea\u30fc\u30e4\u30de\u30b6\u30ad', /\u30c7\u30a4\u30ea\u30fc|daily/i], ['seico', '\u30bb\u30a4\u30b3\u30fc\u30de\u30fc\u30c8', /\u30bb\u30a4\u30b3\u30fc\u30de\u30fc\u30c8|seicomart/i]];
const SITE_KEY = IS_PAL ? 'pal' : IS_SUP ? 'sup' : IS_HM ? 'hm' : IS_BUF ? 'buf' : 'shp';
const SHOP = IS_PAL ? 'PALACE JP' : IS_SUP ? 'Supreme JP' : IS_HM ? 'HUMAN MADE' : IS_BUF ? 'Buffer' : UZURA_CURRENT?.name || HOST.replace(/^www\./, '');
const ON_CHECKOUT = /\/checkouts?\b|\/checkout\//i.test(location.pathname);
const K_CART = 'sxb_cart_snap';             // gi\u1ecf h\u00e0ng l\u00fac v\u00e0o trang thanh to\u00e1n (\u0111\u01a1n kh\u00f4ng qua BOT v\u1eabn c\u00f3 \u1ea3nh + t\u00ean m\u00f3n)
const K_LAST = 'sxb_last';
if (IS_PAL && ON_CHECKOUT) gmGet('uzura_palace_last').then(v => { if(v && Date.now()-v.at<3*3600e3) localStorage.setItem(K_LAST,JSON.stringify(v)); });                  // m\u00f3n v\u1eeba th\u00eam gi\u1ecf -> b\u00e1o Discord khi thanh to\u00e1n xong
// th\u00f4ng tin giao h\u00e0ng / th\u1ebb / c\u00e1ch thanh to\u00e1n c\u1ee7a t\u1eebng shop (ch\u1ec9 l\u01b0u tr\u00ean m\u00e1y n\u00e0y)
const K_BUY = 'sxb_' + SITE_KEY + '_buy';
const PAYS = {
  card: ['\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9', 'Th\u1ebb t\u00edn d\u1ee5ng', /^basic-creditCards$|\u30af\u30ec\u30b8\u30c3\u30c8|credit/i],
  cod: ['\u4ee3\u91d1\u5f15\u63db', '\u4ee3\u91d1\u5f15\u63db (tr\u1ea3 khi nh\u1eadn)', /\u4ee3\u91d1\u5f15\u63db|\u4ee3\u5f15|cash on delivery|\bcod\b|paymentOnDelivery/i],
  konbini: ['\u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08', '\u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08 (konbini)', /\u30b3\u30f3\u30d3\u30cb|konbini|convenience/i],
  bank: ['\u9280\u884c\u632f\u8fbc', '\u9280\u884c\u632f\u8fbc (chuy\u1ec3n kho\u1ea3n)', /\u9280\u884c\u632f\u8fbc|\u632f\u8fbc|bank/i],
};
// webhook ri\u00eang + c\u00e1ch thanh to\u00e1n v\u1eeba d\u00f9ng (\u0111\u1ecdc l\u00fac b\u00e1o Discord)
function emailUsed() {
  try { const u = JSON.parse(localStorage.getItem('sxb_pay_used')); if (u && u.email && Date.now() - u.at < 3 * 3600e3) return u.email; } catch (e) {}
  return (buyInfo().email || '').trim();
}
const buyInfo = () => { try { return JSON.parse(localStorage.getItem(K_BUY)) || {}; } catch (e) { return {}; } };
function payUsed() {
  try { const u = JSON.parse(localStorage.getItem('sxb_pay_used')); if (u && Date.now() - u.at < 3 * 3600e3) return u.label; } catch (e) {}
  const b = buyInfo(); return PAYS[b.pay || 'card'] ? PAYS[b.pay || 'card'][0] : '';
}
const orderFresh = (v) => !!(v && v.items && v.items.length && Date.now() - v.at < 3 * 3600e3);
const cartSnap = () => { try { const v = JSON.parse(localStorage.getItem(K_CART)); return orderFresh(v) ? v : null; } catch (e) { return null; } };
// M\u00f3n c\u1ee7a \u0111\u01a1n: \u01b0u ti\u00ean m\u00f3n BOT v\u1eeba th\u00eam gi\u1ecf, kh\u00f4ng c\u00f3 th\u00ec l\u1ea5y gi\u1ecf h\u00e0ng \u0111\u00e3 l\u01b0u \u1edf trang thanh to\u00e1n; m\u00f3n thi\u1ebfu \u1ea3nh l\u1ea5y \u1ea3nh t\u1eeb gi\u1ecf \u0111\u00e3 l\u01b0u
function orderSource(last) {
  const snap = cartSnap();
  if (!orderFresh(last)) return snap;
  if (!snap) return last;
  return { ...last, items: last.items.map((it) => {
    if (it.image) return it;
    const m = snap.items.find((x) => x.url === it.url || x.title === it.title);
    return m ? { ...it, image: m.image } : it;
  }) };
}
// l\u01b0u gi\u1ecf h\u00e0ng hi\u1ec7n t\u1ea1i (Shopify /cart.js); \u0111\u01a1n \u0111\u1eb7t xong gi\u1ecf r\u1ed7ng -> gi\u1eef b\u1ea3n \u0111\u00e3 l\u01b0u
async function saveCartSnap() {
  try {
    const r = await fetch(shopPath('cart.js'), { credentials: 'same-origin', headers: { accept: 'application/json' } });
    if (!r.ok) return false;
    const c = await r.json();
    if (!c || !c.items || !c.items.length) return false;
    localStorage.setItem(K_CART, JSON.stringify({ site: HOST, at: Date.now(), items: c.items.map((x) => ({
      title: x.product_title || x.title || '', url: new URL(x.url || '/', location.origin).href, image: synovaThumb(x.image || (x.featured_image && x.featured_image.url)),
      size: x.variant_title || '-', price: IS_GEN && c.currency ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency: c.currency }).format((x.final_price != null ? x.final_price : x.price || 0) / 100) : '\u00a5' + Math.round((x.final_price != null ? x.final_price : x.price || 0) / 100).toLocaleString('ja-JP'), qty: x.quantity })) }));
    return true;
  } catch (e) { return false; }
}
const orderEmbeds = (last) => {
  const src = orderSource(last);
  return src
    ? src.items.map((it) => ({ author: '\u2705 Checkout Successful', title: it.title, url: it.url, thumb: it.image || synovaPageImg(), site: src.site,
      fields: [['Size', it.size], ['\u4fa1\u683c', it.price], ['Quantity', it.qty], ['\u652f\u6255\u3044\u65b9\u6cd5', payUsed()], ['Site', src.site, false]] }))
    : [{ author: '\u2705 Checkout Successful', title: SHOP, url: location.origin, thumb: synovaPageImg(), fields: [['\u652f\u6255\u3044\u65b9\u6cd5', payUsed()], ['Site', HOST, false]] }];
};
const PREFS = ['\u5317\u6d77\u9053', '\u9752\u68ee\u770c', '\u5ca9\u624b\u770c', '\u5bae\u57ce\u770c', '\u79cb\u7530\u770c', '\u5c71\u5f62\u770c', '\u798f\u5cf6\u770c', '\u8328\u57ce\u770c', '\u6803\u6728\u770c', '\u7fa4\u99ac\u770c', '\u57fc\u7389\u770c', '\u5343\u8449\u770c', '\u6771\u4eac\u90fd', '\u795e\u5948\u5ddd\u770c',
  '\u65b0\u6f5f\u770c', '\u5bcc\u5c71\u770c', '\u77f3\u5ddd\u770c', '\u798f\u4e95\u770c', '\u5c71\u68a8\u770c', '\u9577\u91ce\u770c', '\u5c90\u961c\u770c', '\u9759\u5ca1\u770c', '\u611b\u77e5\u770c', '\u4e09\u91cd\u770c', '\u6ecb\u8cc0\u770c', '\u4eac\u90fd\u5e9c', '\u5927\u962a\u5e9c', '\u5175\u5eab\u770c', '\u5948\u826f\u770c',
  '\u548c\u6b4c\u5c71\u770c', '\u9ce5\u53d6\u770c', '\u5cf6\u6839\u770c', '\u5ca1\u5c71\u770c', '\u5e83\u5cf6\u770c', '\u5c71\u53e3\u770c', '\u5fb3\u5cf6\u770c', '\u9999\u5ddd\u770c', '\u611b\u5a9b\u770c', '\u9ad8\u77e5\u770c', '\u798f\u5ca1\u770c', '\u4f50\u8cc0\u770c', '\u9577\u5d0e\u770c', '\u718a\u672c\u770c', '\u5927\u5206\u770c',
  '\u5bae\u5d0e\u770c', '\u9e7f\u5150\u5cf6\u770c', '\u6c96\u7e04\u770c'];

// ===================== Khung BOT (m\u1ecdi trang, tr\u1eeb trang thanh to\u00e1n) =====================
if (!SYNOVA_DUP && !IN_FRAME && !IS_PCI && !ON_CHECKOUT && (IS_PAL_STORE || IS_SUP || IS_HM || IS_BUF || IS_GEN)) (function sxbMain() {
  'use strict';
  if (!document.body) { setTimeout(sxbMain, 200); return; }   // v\u00e0i shop d\u1ef1ng trang ch\u1eadm: ch\u01b0a c\u00f3 <body> th\u00ec ch\u1edd

  const WATCH_FROM_SEC = 2;           // b\u1eaft \u0111\u1ea7u qu\u00e9t 2 gi\u00e2y tr\u01b0\u1edbc gi\u1edd m\u1edf (10:59:58)
  // quanh gi\u1edd m\u1edf (-2s \u2192 +30s): c\u1ee9 FAST_MS g\u1eedi 1 l\u01b0\u1ee3t, KH\u00d4NG ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc tr\u1ea3 l\u1eddi (t\u1ed1i \u0111a MAX_INFLIGHT l\u01b0\u1ee3t c\u00f9ng l\u00fac)
  // -> m\u1ea1ng ch\u1eadm (danh s\u00e1ch Supreme ~1MB m\u1ea5t 0,7\u20134 gi\u00e2y) v\u1eabn c\u00f3 k\u1ebft qu\u1ea3 m\u1edbi m\u1ed7i ~0,35 gi\u00e2y. B\u1ecb 429 th\u00ec t\u1ef1 gi\u00e3n.
  const FAST_MS = 200, MAX_INFLIGHT = 5;      // gi\u1edd m\u1edf b\u00e1n: 0,2 gi\u00e2y/l\u01b0\u1ee3t, t\u1ed1i \u0111a 5 l\u01b0\u1ee3t c\u00f9ng l\u00fac
  const NOW_MS = 300, NOW_INFLIGHT = 4;       // "Ch\u1ea1y Ngay" / canh l\u00e2u: 0,3 gi\u00e2y/l\u01b0\u1ee3t, 4 l\u01b0\u1ee3t c\u00f9ng l\u00fac (tr\u01b0\u1edbc: 0,8 gi\u00e2y, ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc xong)
  const FAST_FOR_MS = 30000;
  // b\u1ecb 429: nh\u1ecbp t\u1ef1 gi\u00e3n (\u00d71,6 m\u1ed7i l\u1ea7n, t\u1ed1i \u0111a \u00d78), qu\u00e9t \u0111\u01b0\u1ee3c l\u1ea1i th\u00ec nhanh d\u1ea7n v\u1ec1 nh\u1ecbp g\u1ed1c
  let pace = 1;
  const BACKOFF_MIN = 1000, BACKOFF_MAX = 8000;   // 429: ngh\u1ec9 1 \u2192 2 \u2192 4 \u2192 8 gi\u00e2y
  const GIVE_UP_MIN = 15;             // h\u1eb9n gi\u1edd: qu\u00e1 gi\u1edd m\u1edf 15 ph\u00fat ch\u01b0a c\u00f3 h\u00e0ng th\u00ec d\u1eebng
  const MAX_KW = 6, MAX_QTY = 3;
  const K = 'sxb_' + SITE_KEY;
  const K_CFG = K + '_cfg', K_ST = K + '_st', K_UI = K + '_ui', K_LOG = K + '_log';

  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pad = (n) => String(n).padStart(2, '0');
  const jstNow = () => new Date(Date.now() + 9 * 3600e3);

  // cfg.items: [{kw, color, size, qty}] ; cfg.open: "HH:MM" gi\u1edd Nh\u1eadt ; cfg.grid: link danh s\u00e1ch SFCC
  const cfg = load(K_CFG, { items: [], open: '11:00', kwCount: 3 });
  while (cfg.items.length < MAX_KW) cfg.items.push({ kw: '', color: '', size: '', qty: 1 });
  const st = load(K_ST, { active: false });

  function msToOpen() {
    const [h, m] = (cfg.open || '').split(':').map(Number);
    const n = jstNow();
    let t = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), h, m, 0) - n;
    if (t < -GIVE_UP_MIN * 60e3) t += 86400e3;
    return t;
  }

  // ---------- Kh\u1edbp t\u1eeb kh\u00f3a / size ----------
  const norm = (s) => (s || '').normalize('NFKC').toLowerCase();
  // b\u1ecf \u00ae\u2122\u00a9 v\u00e0 d\u1ea5u c\u00e2u: "Faux Fur WINDSTOPPER\u00ae Vest" -> "faux fur windstopper vest"
  const words = (s) => norm(s).replace(/[\u00ae\u2122\u00a9]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  // sai/thi\u1ebfu 1 k\u00fd t\u1ef1 v\u1edbi ch\u1eef d\u00e0i \u2265 5 v\u1eabn nh\u1eadn (windstoper, polatec\u2026)
  function near(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, diff = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++diff > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return diff + (a.length - i) + (b.length - j) <= 1;
  }
  // T\u1eeb kh\u00f3a: c\u00e1ch nhau d\u1ea5u c\u00e1ch = ph\u1ea3i c\u00f3 T\u1ea4T C\u1ea2 c\u00e1c ch\u1eef, th\u1ee9 t\u1ef1 n\u00e0o c\u0169ng \u0111\u01b0\u1ee3c, vi\u1ebft t\u1eaft / thi\u1ebfu \u00ae / hoa th\u01b0\u1eddng \u0111\u1ec1u \u0111\u01b0\u1ee3c.
  //   "faux fur" -> Faux Fur WINDSTOPPER\u00ae Vest ; "polartec jacket" -> Spellout Embroidered Polartec\u00ae Jacket
  //   "tshirt" kh\u1edbp "T-Shirt" (b\u1ecf d\u1ea5u c\u00e1ch / g\u1ea1ch n\u1ed1i khi so) ; ch\u1eef \u2265 5 k\u00fd t\u1ef1 sai 1 k\u00fd t\u1ef1 v\u1eabn kh\u1edbp
  function match(text, kw) {
    const t = words(text), flat = t.replace(/ /g, ''), tw = t.split(' ');
    const ws = words(kw).split(' ').filter(Boolean);
    return ws.length > 0 && ws.every((w) => t.includes(w) || flat.includes(w) || (w.length >= 5 && tw.some((x) => near(x, w))));
  }
  // \u00f4 M\u00e0u: "black" kh\u1edbp Black ; "black,white" = \u01b0u ti\u00ean theo th\u1ee9 t\u1ef1 ; tr\u1ed1ng = m\u00e0u n\u00e0o c\u0169ng \u0111\u01b0\u1ee3c
  const wantColors = (s) => (s || '').split(/[,\u3001/|]/).map((x) => words(x)).filter(Boolean);
  const colorOk = (val, want) => { const v = words(val); return v === want || v.includes(want) || v.replace(/ /g, '').includes(want.replace(/ /g, '')); };
  const RANDOM = ['', 'random', 'any', '\u30e9\u30f3\u30c0\u30e0', '*', 'all', 'free'];
  const SZ = { '2xlarge':'xxlarge', 'onesize':'onesize', 'os':'onesize', xs: 'xsmall', s: 'small', m: 'medium', l: 'large', xl: 'xlarge', xxl: 'xxlarge', '2xl': 'xxlarge', xxxl: 'xxxlarge', '3xl': 'xxxlarge' };
  const sz = (s) => norm(s).replace(/[\s\-_.]/g, '');
  // "M" kh\u1edbp "Medium" (Supreme) v\u00e0 "2(M)" (HUMAN MADE / Buffer); "2" kh\u1edbp "2(M)"
  function sizeOk(val, want) {
    const v = sz(val), w = sz(want);
    if (!w || v === w || (SZ[v] || v) === (SZ[w] || w)) return true;
    const inner = (v.match(/\(([^)]+)\)/) || [])[1];
    if (inner && (inner === w || (SZ[inner] && SZ[inner] === SZ[w]))) return true;
    return v.split('(')[0] === w;
  }
  // \u00f4 Size: "M,L" = \u01b0u ti\u00ean theo th\u1ee9 t\u1ef1 ; tr\u1ed1ng / random = size n\u00e0o c\u00f2n c\u0169ng \u0111\u01b0\u1ee3c
  const wantSizes = (s) => { const p = (s || '').split(/[,\u3001/|]/).map((x) => x.trim()).filter(Boolean); return p.length && !p.some((x) => RANDOM.includes(sz(x))) ? p : null; };
  function pickSize(opts, want) {             // opts: [{size, ok}] -> ch\u1ecdn 1 c\u00e1i c\u00f2n h\u00e0ng
    const avail = opts.filter((o) => o.ok);
    if (!avail.length) return null;
    const ws = wantSizes(want);
    if (!ws) return avail[Math.floor(Math.random() * avail.length)];
    for (const w of ws) { const o = avail.find((x) => sizeOk(x.size, w)); if (o) return o; }
    return null;
  }

  // ---------- Th\u1ed1ng k\u00ea / tr\u1ea1ng th\u00e1i ----------
  const stats = { req: 0, ok: 0, r429: 0, err: 0 };
  let kwStat = [], adding = false, backoffUntil = 0, hits429 = 0, cfHits = 0;
  class Http429 extends Error { constructor(ra) { super('429'); this.retryAfter = ra; } }
  class Blocked extends Error { constructor(m) { super(m); this.blocked = true; } }

  async function get(url, opt) {
    stats.req++;
    const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 8000);
    try {
      const r = await fetch(url, { cache: 'no-store', credentials: 'same-origin', signal: ac.signal, ...(opt || {}) });
      if (r.status === 429) { stats.r429++; throw new Http429(parseFloat(r.headers.get('Retry-After')) || 0); }
      if (/queue-it\.net/.test(r.url)) throw new Blocked('Queue-it');
      const t = await r.text();
      if ((r.status === 403 || r.status === 503) && /Just a moment|cf-chl|challenge-platform|Access denied/i.test(t)) throw new Blocked('Cloudflare ' + r.status);
      stats.ok++;
      return { status: r.status, text: t };
    } catch (e) {
      if (!(e instanceof Http429) && !(e instanceof Blocked)) stats.err++;
      throw e.name === 'AbortError' ? new Error(L('\u5fdc\u7b54\u306a\u3057(8\u79d2)', 'kh\u00f4ng ph\u1ea3n h\u1ed3i (8 gi\u00e2y)')) : e;
    } finally { clearTimeout(tm); }
  }

  // ===================== Supreme (Shopify) =====================
  // /products.json, /products/x.js b\u1ecb ch\u1eb7n (403) -> \u0111\u1ecdc JSON n\u1eb1m s\u1eb5n trong HTML:
  //   /collections/all  : <script id="products-json"> (m\u1ecdi m\u00f3n, ~1MB)
  //   /products/<handle>: <script id="product-<handle>-json"> (1 m\u00f3n, ~65KB) -> d\u00f2 nhanh m\u00f3n \u0111\u00e3 kh\u1edbp t\u1eeb kh\u00f3a
  const sup = {
    focus: [], round: 0,
    cut(html, id) {
      const a = html.indexOf(`id="${id}">`);
      if (a < 0) return null;
      const s = a + id.length + 6, e = html.indexOf('</script>', s);
      try { return JSON.parse(html.slice(s, e)); } catch (x) { return null; }
    },
    conv(p) {
      return {
        key: p.handle, name: p.title + (p.color ? ' - ' + p.color : ''), text: p.title + ' ' + (p.color || ''), color: p.color || '',
        url: location.origin + '/products/' + p.handle, image: (p.image || '').replace(/^\/\//, 'https://'),
        limit: p.product_order_limit || 0,
        variants: (p.variants || []).map((v) => ({ id: v.id, size: v.title || v.option1 || '-', ok: !!v.available, price: v.price })),
      };
    },
    async list() {
      this.round++;
      // m\u00f3n \u0111\u00e3 kh\u1edbp t\u1eeb kh\u00f3a: 2/3 l\u01b0\u1ee3t ch\u1ec9 t\u1ea3i trang m\u00f3n \u0111\u00f3 (nh\u1eb9 ~15 l\u1ea7n), 1/3 l\u01b0\u1ee3t t\u1ea3i c\u1ea3 danh s\u00e1ch \u0111\u1ec3 th\u1ea5y m\u00f3n m\u1edbi
      if (this.focus.length && this.round % 3) {
        const rs = await Promise.all(this.focus.slice(0, 4).map(async (h) => {
          const r = await get('/products/' + h);
          const p = this.cut(r.text, `product-${h}-json`);
          return p ? this.conv(p) : null;
        }));
        return { products: rs.filter(Boolean), partial: true };
      }
      const r = await get('/collections/all');
      const j = this.cut(r.text, 'products-json');
      if (!j) throw new Error(L('\u5546\u54c1\u30ea\u30b9\u30c8\u3092\u8aad\u3081\u307e\u305b\u3093', 'kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c danh s\u00e1ch SP'));
      return { products: (j.products || []).map((p) => this.conv(p)), partial: false };
    },
    setFocus(keys) { this.focus = keys; },
    async variant(p, want) {
      const o = pickSize(p.variants, want);
      return o ? { id: o.id, size: o.size, price: '\u00a5' + Math.round(o.price / 100).toLocaleString('ja-JP') } : null;
    },
    async add(items) {
      const body = (list) => JSON.stringify({ items: list.map((x) => ({ id: x.id, quantity: x.qty })) });
      const post = (list) => fetch(shopPath('cart/add.js'), { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: body(list) });
      let r = await post(items);
      if (r.ok) return items;
      const ok = [];
      for (const x of items) {                    // c\u1ea3 l\u00f4 b\u1ecb t\u1eeb ch\u1ed1i (1 m\u00f3n h\u1ebft / qu\u00e1 gi\u1edbi h\u1ea1n) -> th\u00eam l\u1ebb, gi\u1ea3m c\u00f2n 1 c\u00e1i
        for (const q of [...new Set([x.qty, 1])]) {
          r = await post([{ ...x, qty: q }]);
          if (r.ok) { ok.push({ ...x, qty: q }); break; }
          if (q === 1) { const j = await r.json().catch(() => ({})); log(L('\u8ffd\u52a0\u5931\u6557: ', 'Th\u00eam th\u1ea5t b\u1ea1i: ') + x.name.slice(0, 24) + ' ' + (j.description || r.status)); }
        }
      }
      return ok;
    },
    // gi\u1ecf ch\u1ec9 c\u00f2n \u0111\u00fang c\u00e1c m\u00f3n BOT v\u1eeba th\u00eam (\u0111\u00fang s\u1ed1 l\u01b0\u1ee3ng): m\u00f3n kh\u00e1c -> 0, m\u00f3n c\u1ee7a BOT b\u1ecb c\u1ed9ng d\u1ed3n -> v\u1ec1 \u0111\u00fang s\u1ed1
    async prune(ok) {
      const want = new Map(ok.map((x) => [String(x.id), x.qty]));
      const c = await (await fetch(shopPath('cart.js'), { cache: 'no-store', credentials: 'same-origin', headers: { Accept: 'application/json' } })).json();
      const upd = {}, extra = [];
      for (const it of c.items || []) {
        const w = want.get(String(it.variant_id));
        if (w == null) { upd[it.key] = 0; extra.push(it.product_title || it.title); } else if (it.quantity > w) upd[it.key] = w;
      }
      if (Object.keys(upd).length) {
        await fetch(shopPath('cart/update.js'), { method: 'POST', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ updates: upd }) });
      }
      return extra;
    },
    async clearAll() {
      const c = await (await fetch(shopPath('cart.js'), { cache: 'no-store', credentials: 'same-origin', headers: { Accept: 'application/json' } })).json();
      if (!(c.items || []).length) return 0;
      await fetch(shopPath('cart/clear.js'), { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' } });
      return c.items.length;
    },
    checkout: '/checkout',
  };

  // ===================== Shop Shopify kh\u00e1c (t\u1ef1 nh\u1eadn) =====================
  // /products.json (250 m\u00f3n m\u1edbi nh\u1ea5t). M\u00f3n \u0111\u00e3 kh\u1edbp t\u1eeb kh\u00f3a: /products/<handle>.js (nh\u1eb9) 2/3 s\u1ed1 l\u01b0\u1ee3t.
  // Shop ch\u1eb7n products.json (VD 403 nh\u01b0 Supreme) -> \u0111\u1ecdc <script id="products-json"> trong /collections/all n\u1ebfu theme c\u00f3.
  const gen = {
    focus: [], round: 0, mode: 'json', currency: '', ready: null,
    async ensureReady() {
      if (this.ready) return this.ready;
      this.ready = (async () => {
        const r = await get(shopPath('cart.js'), { headers: { Accept: 'application/json' } });
        if (r.status === 403) throw new Blocked('この店舗のカートへのアクセスが拒否されました');
        if (r.status !== 200) throw new Error('カート情報を取得できません: HTTP ' + r.status);
        let c; try { c = JSON.parse(r.text); } catch { throw new Error('カートが標準Shopify形式ではありません'); }
        if (!c || !Array.isArray(c.items) || !/^[A-Z]{3}$/.test(c.currency || '')) throw new Error('カート形式・通貨を確認できません');
        this.currency = c.currency;
        return c;
      })().catch(e => { this.ready = null; throw e; });
      return this.ready;
    },
    conv(p, cents) {
      const opts = (p.options || []).map(o => typeof o === 'string' ? o : o.name || '');
      const ci = opts.findIndex(o => /colou?r|カラー|色/i.test(o));
      const si = opts.findIndex(o => /size|サイズ|寸/i.test(o));
      const im = p.images?.[0]?.src || p.images?.[0] || p.featured_image || p.image?.src || p.image || '';
      if (!p.handle || !p.title || !Array.isArray(p.variants)) throw new Error('商品の形式を確認できません');
      return {
        key: p.handle, name: p.title, text: [p.title, p.product_type, p.vendor, ...(Array.isArray(p.tags) ? p.tags : String(p.tags || '').split(','))].filter(Boolean).join(' '),
        url: location.origin + shopPath('products/' + encodeURIComponent(p.handle)), image: String(im).replace(/^\/\//, 'https://'), limit: 0,
        variants: p.variants.map(v => {
          if (!/^\d+$/.test(String(v.id)) || typeof v.available !== 'boolean') throw new Error('商品のID・在庫形式が未対応です');
          const o = Array.isArray(v.options) ? v.options : [v.option1, v.option2, v.option3];
          const size = si >= 0 ? o[si] : ci >= 0 ? o.filter((x, i) => i !== ci && x).join(' / ') : v.title;
          return { id: v.id, ok: v.available, color: ci >= 0 ? o[ci] || '' : '', size: size || '-', price: cents ? Number(v.price) / 100 : parseFloat(v.price) };
        }),
      };
    },
    async list() {
      await this.ensureReady();
      this.round++;
      if (this.focus.length && this.round % 3) {
        const products = [];
        for (const handle of this.focus.slice(0, 4)) {
          const r = await get(shopPath('products/' + encodeURIComponent(handle) + '.js'), { headers: { Accept: 'application/json' } });
          if (r.status === 403) throw new Blocked('商品情報へのアクセスが拒否されました');
          if (r.status === 404) continue;
          if (r.status !== 200) throw new Error('商品情報 HTTP ' + r.status);
          products.push(this.conv(JSON.parse(r.text), true));
        }
        return { products, partial: true };
      }
      if (this.mode === 'json') {
        const activeCollection = HOST === 'jp.stussy.com' &&
          /^\/collections\/([a-z0-9-]+)\/?$/i.exec(location.pathname)?.[1];
        const collection = activeCollection || UZURA_CURRENT?.collection;
        const path = 'products.json?limit=250&_=' + Date.now();
        const options = { headers: { Accept: 'application/json' } };
        let r = await get(shopPath(collection ? 'collections/' + encodeURIComponent(collection) + '/' + path : path), options);
        if (activeCollection && r.status === 404) r = await get(shopPath(path), options);
        if (r.status === 403) throw new Blocked('商品一覧へのアクセスが拒否されました');
        if (r.status === 200) {
          let j; try { j = JSON.parse(r.text); } catch { throw new Error('商品一覧がJSONではありません'); }
          if (!Array.isArray(j.products)) throw new Error('商品一覧の形式が未対応です');
          return { products: j.products.map(p => this.conv(p, false)), partial: false };
        }
        if (r.status !== 404) throw new Error('商品一覧 HTTP ' + r.status);
        this.mode = 'html';
      }
      const r = await get(shopPath('collections/all'));
      if (r.status === 403) throw new Blocked('商品一覧へのアクセスが拒否されました');
      const m = /<script\b[^>]*\bid=["']products-json["'][^>]*>([\s\S]*?)<\/script>/i.exec(r.text);
      if (!m) throw new Error('この店舗の商品一覧は未対応です。商品番号を手動で確認してください');
      const j = JSON.parse(m[1]);
      if (!Array.isArray(j.products)) throw new Error('商品一覧の形式が未対応です');
      return { products: j.products.map(p => this.conv(p, true)), partial: false };
    },
    setFocus(keys) { this.focus = keys; },
    async variant(p, want, kw, wantColor) {
      let vs = p.variants;
      const wc = wantColors(wantColor);
      if (wc.length) {
        if (vs.some(v => v.color)) {
          let f = [];
          for (const w of wc) { f = vs.filter(v => colorOk(v.color, w)); if (f.some(v => v.ok)) break; }
          vs = f;
        } else if (!wc.some(w => colorOk(p.text, w))) return null;
      }
      const o = pickSize(vs, want);
      if (!o) return null;
      const price = Number.isFinite(o.price) && this.currency ? new Intl.NumberFormat('ja-JP', { style: 'currency', currency: this.currency }).format(o.price) : '価格未確認';
      return { id: o.id, size: [o.color, o.size].filter(x => x && x !== '-').join(' / ') || '-', price };
    },
    async add(items) {
      await this.ensureReady();
      if (!items.length || !items.every(x => /^\d+$/.test(String(x.id)) && Number.isInteger(Number(x.qty)) && Number(x.qty) > 0)) throw new Error('商品ID・数量を確認してください');
      let r; try { r = await fetch(shopPath('cart/add.js'), { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: items.map(x => ({ id: x.id, quantity: Number(x.qty) })) }) }); } catch { throw new Blocked('通信結果が不明です。再実行せずカートを手動で確認してください'); }
      if (r.status === 403) throw new Blocked('カートへのアクセスが拒否されました');
      if (r.status === 429) throw new Http429(parseFloat(r.headers.get('Retry-After')) || 0);
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error('カート追加失敗: ' + (j.description || j.message || r.status)); }
      let j; try { j = await r.json(); } catch { throw new Blocked('追加結果を確認できません。再実行せずカートを手動で確認してください'); }
      const added = Array.isArray(j.items) ? j.items : [j];
      if (!items.every(x => added.some(a => String(a.id || a.variant_id) === String(x.id) && Number(a.quantity) === Number(x.qty)))) throw new Blocked('追加された商品・数量を確認できません。カートを手動で確認してください');
      return items;
    },
    prune: ok => sup.prune(ok),
    async clearAll() { await this.ensureReady(); return sup.clearAll(); },
    checkout: shopPath('checkout'),
  };

  // ===================== HUMAN MADE / Buffer (Salesforce Commerce Cloud) =====================
  const SITE_ID = IS_HM ? 'HUMANMADE' : 'BUFFER';
  const C = `/on/demandware.store/Sites-${SITE_ID}-Site/ja_JP`;
  const sfcc = {
    focus: [], round: 0, info: {},
    gridUrl() {
      const u = cfg.grid || `${C}/Search-UpdateGrid?cgid=all`;
      return u.replace(/([?&])(start|sz)=\d+/g, '$1').replace(/[?&]+$/, '') + (u.includes('?') ? '&' : '?') + 'start=0&sz=48';
    },
    async list() {
      this.round++;
      if (this.focus.length && this.round % 3) return { products: this.focus.map((k) => this.info[k]).filter(Boolean), partial: true };
      const r = await get(this.gridUrl(), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      if (r.status >= 400) throw new Error('HTTP ' + r.status);
      const d = new DOMParser().parseFromString(r.text, 'text/html');
      const out = [];
      for (const el of d.querySelectorAll('.product[data-pid]')) {
        const tile = el.querySelector('.product-tile') || el;
        let name = '';
        try { name = JSON.parse(tile.getAttribute('data-gtm') || '{}').name || ''; } catch (e) {}
        if (!name) name = (el.querySelector('.pdp-link a, .product-name, img[alt]') || {}).textContent || (el.querySelector('img[alt]') || {}).alt || '';
        const a = el.querySelector('a[href]');
        const img = el.querySelector('img[src], source[srcset]');
        const so = el.querySelector('.sold-out-overlay');
        const p = {
          key: el.getAttribute('data-pid'), name: name.trim(), text: name,
          url: a ? new URL(a.getAttribute('href'), location.origin).href : location.origin,
          image: img ? (img.getAttribute('src') || (img.getAttribute('srcset') || '').split(' ')[0]) : '',
          soldOut: !!(so && !so.classList.contains('d-none')),
        };
        this.info[p.key] = p;
        out.push(p);
      }
      if (!out.length) throw new Error(L('\u5546\u54c1\u30ea\u30b9\u30c8\u304c\u7a7a\u3067\u3059\uff08\u4e00\u89a7\u30da\u30fc\u30b8\u3092\u958b\u3044\u3066\u304b\u3089\u958b\u59cb\uff09', 'danh s\u00e1ch tr\u1ed1ng (m\u1edf trang danh s\u00e1ch SP r\u1ed3i m\u1edbi B\u1eadt)'));
      return { products: out, partial: false };
    },
    setFocus(keys) { this.focus = keys; },
    async pv(master, color, size) {
      let q = `pid=${encodeURIComponent(master)}&quantity=1`;
      if (color) q += `&dwvar_${master}_color=${encodeURIComponent(color)}`;
      if (size) q += `&dwvar_${master}_size=${encodeURIComponent(size)}`;
      const r = await get(`${C}/Product-Variation?${q}`, { headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } });
      let j;
      try { j = JSON.parse(r.text); } catch (e) { throw new Error(L('\u5728\u5eabAPI\u306e\u5fdc\u7b54\u304c\u4e0d\u6b63', 'API kho tr\u1ea3 kh\u00f4ng ph\u1ea3i JSON')); }
      return j;
    },
    attr: {},
    // Product-Variation: ch\u1ecdn m\u00e0u (\u00f4 M\u00e0u / ch\u1eef trong t\u1eeb kh\u00f3a / m\u00e0u \u0111ang ch\u1ecdn) + size c\u00f2n h\u00e0ng -> m\u00e3 bi\u1ebfn th\u1ec3.
    // L\u1ea7n \u0111\u1ea7u h\u1ecfi 2 l\u1ea7n (danh s\u00e1ch m\u00e0u/size, r\u1ed3i bi\u1ebfn th\u1ec3); c\u00e1c l\u01b0\u1ee3t sau nh\u1edb danh s\u00e1ch n\u00ean h\u1ecfi th\u1eb3ng bi\u1ebfn th\u1ec3 = 1 l\u1ea7n.
    async variant(p, want, kw, wantColor) {
      let attrs = this.attr[p.key];
      if (!attrs) {
        const pr = (await this.pv(p.key)).product || {};
        if (pr.LotteryExclusive) { p.lottery = true; return null; }
        attrs = {};
        for (const a of pr.variationAttributes || []) attrs[a.id] = a.values || [];
        this.attr[p.key] = attrs;
      }
      const colors = (attrs.color || []).filter((v) => v.selectable !== false);
      const kwn = words(kw), wc = wantColors(wantColor);
      let color;
      if (wc.length) {                               // \u00f4 M\u00e0u: theo th\u1ee9 t\u1ef1 \u01b0u ti\u00ean, kh\u00f4ng c\u00f3 m\u00e0u n\u00e0o kh\u1edbp -> b\u1ecf m\u00f3n n\u00e0y
        for (const w of wc) { const c = colors.find((v) => colorOk(v.displayValue || v.value, w) || colorOk(v.value, w)); if (c) { color = c.value; break; } }
        if (!color && (attrs.color || []).length) return null;
      } else color = (colors.find((v) => kwn.includes(words(v.displayValue || v.value))) || colors.find((v) => v.selected) || colors[0] || {}).value;
      const sizeList = (a) => (a.size || []).map((v) => ({ size: v.value, label: v.displayValue || v.value, ok: v.selectable !== false }));
      let sizes = sizeList(attrs), size = '';
      // size \u0111o\u00e1n tr\u01b0\u1edbc theo l\u1ea7n h\u1ecfi g\u1ea7n nh\u1ea5t (k\u1ec3 c\u1ea3 size \u0111ang h\u1ebft: c\u00f3 th\u1ec3 v\u1eeba c\u00f3 l\u1ea1i)
      if (sizes.length) { const o = pickSize(sizes, want) || pickSize(sizes.map((x) => ({ ...x, ok: true })), want); if (!o) return null; size = o.size; }
      let v = (await this.pv(p.key, color, size)).product || {};
      if (v.LotteryExclusive) { p.lottery = true; return null; }
      const fresh = {};
      for (const a of v.variationAttributes || []) fresh[a.id] = a.values || [];
      if (Object.keys(fresh).length) this.attr[p.key] = fresh;
      const ready = (x) => x.id && !(x.id === p.key && sizes.length) && x.available && x.orderable !== false && x.readyToOrder !== false;
      if (!ready(v) && sizes.length) {                // size \u0111o\u00e1n \u0111\u00e3 h\u1ebft -> ch\u1ecdn size kh\u00e1c \u0111ang c\u00f2n theo k\u1ebft qu\u1ea3 m\u1edbi
        const o = pickSize(sizeList(fresh), want);
        if (!o || o.size === size) return null;
        size = o.size;
        v = (await this.pv(p.key, color, size)).product || {};
      }
      if (!v.id || v.id === p.key && sizes.length) return null;
      const sell = v.sellStartDate ? Date.parse(v.sellStartDate) : 0;
      if (sell && sell > Date.now() + 3000) { p.notYet = true; return null; }
      if (!(v.available && v.orderable !== false && v.readyToOrder !== false)) return null;
      p.notYet = false;
      return { id: v.id, size: [color, size].filter(Boolean).join(' / ') || '-', limit: v.purchaseQtyLimitProduct || v.maxOrderQuantity || 0,
        price: (v.price && v.price.sales && v.price.sales.formatted) || '' };
    },
    async add(items) {
      const ok = [];
      await Promise.all(items.map(async (x) => {     // nhi\u1ec1u m\u00f3n: g\u1eedi c\u00f9ng l\u00fac
        for (const q of [...new Set([x.qty, 1])]) {
          const r = await fetch(`${C}/Cart-AddProduct`, { method: 'POST', credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', Accept: 'application/json' },
            body: new URLSearchParams({ pid: x.id, quantity: String(q), options: '[]' }) });
          const j = await r.json().catch(() => ({ error: true, message: 'HTTP ' + r.status }));
          if (r.ok && !j.error) { ok.push({ ...x, qty: q }); if (j.cart) this.lastCart = j.cart; break; }
          if (q === 1) log(L('\u8ffd\u52a0\u5931\u6557: ', 'Th\u00eam th\u1ea5t b\u1ea1i: ') + x.name.slice(0, 24) + ' ' + (j.message || r.status));
        }
      }));
      return ok;
    },
    // d\u00f2ng trong gi\u1ecf: [{pid, uuid, qty, name, removeUrl}] \u2014 \u0111\u1ecdc trang /cart/ ng\u1ea7m (n\u00fat xo\u00e1 c\u00f3 data-action / pid / uuid)
    async lines() {
      const r = await fetch('/cart/', { cache: 'no-store', credentials: 'same-origin', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const d = new DOMParser().parseFromString(await r.text(), 'text/html');
      const seen = new Set(), out = [];
      for (const b of d.querySelectorAll('button.remove-product, .remove-product')) {
        const k = b.dataset.uuid || b.dataset.pid;
        if (!b.dataset.action || !b.dataset.pid || seen.has(k)) continue;
        seen.add(k);
        out.push({ pid: b.dataset.pid, uuid: b.dataset.uuid || '', name: b.dataset.name || b.dataset.pid, removeUrl: b.dataset.action });
      }
      return out;
    },
    async removeLines(ls) {
      await Promise.all(ls.map((x) => fetch(x.removeUrl + (x.removeUrl.includes('?') ? '&' : '?') + 'pid=' + encodeURIComponent(x.pid) + '&uuid=' + encodeURIComponent(x.uuid),
        { credentials: 'same-origin', headers: { 'X-Requested-With': 'XMLHttpRequest' } })));
    },
    async prune(ok) {
      const want = new Set(ok.map((x) => String(x.id)));
      // nhanh: Cart-AddProduct tr\u1ea3 k\u00e8m gi\u1ecf (cart.items + actionUrls) -> kh\u00f4ng c\u1ea7n t\u1ea3i trang gi\u1ecf
      const c = this.lastCart;
      let ls = null;
      if (c && Array.isArray(c.items) && c.actionUrls && c.actionUrls.removeProductLineItemUrl && ok.every((x) => c.items.some((it) => String(it.id) === String(x.id)))) {
        ls = c.items.map((it) => ({ pid: String(it.id), uuid: it.UUID || '', name: it.productName || it.id, removeUrl: c.actionUrls.removeProductLineItemUrl }));
      } else ls = await this.lines();
      const extra = ls.filter((x) => !want.has(String(x.pid)));
      if (extra.length) await this.removeLines(extra);
      return extra.map((x) => x.name);
    },
    async clearAll() {
      const ls = await this.lines();
      if (ls.length) await this.removeLines(ls);
      return ls.length;
    },
    checkout: '/checkout/',
  };

  // Palace Hydrogen / React Router data adapter. Never evaluate page scripts.
  function decodePalace(html) {
    const m = /streamController\.enqueue\(("(?:[^"\\]|\\.)*")\)/.exec(html);
    if (!m) throw new Error('Palaceの商品データ形式を確認できません');
    const arr=JSON.parse(JSON.parse(m[1]));
    if(!Array.isArray(arr))throw new Error('Palaceデータ形式が不正です');
    const memo=new Map();
    function dec(i){
      if(typeof i!=='number')return i;
      if(i<0)return null;
      if(i>=arr.length)throw new Error('Palaceデータの参照が不正です');
      if(memo.has(i))return memo.get(i);
      const v=arr[i];
      if(Array.isArray(v)){
        if(typeof v[0]==='string')return null;
        const out=[];memo.set(i,out);for(const x of v)out.push(dec(x));return out;
      }
      if(v&&typeof v==='object'){
        const out={};memo.set(i,out);for(const [k,x] of Object.entries(v)){
          const key=arr[Number(k.slice(1))];
          if(typeof key==='string'&&!['__proto__','constructor','prototype'].includes(key))out[key]=dec(x);
        }return out;
      }
      return v;
    }
    return dec(0);
  }
  function palaceProducts(data) {
    const loaders=Object.values(data.loaderData||{}).filter(Boolean);
    const root=data.loaderData?.root;
    if(root?.locale?.country!=='JP'||root?.locale?.currency!=='JPY')throw new Blocked('Palaceが日本向け・円表示ではありません。Japanを選択してください');
    const collection=loaders.find(v=>v.collection?.products)?.collection;
    if(!collection)throw new Error('Palaceの新着一覧がありません');
    const origin=new URL(root.shopifyDomain);
    if(origin.protocol!=='https:'||origin.hostname!=='checkout.jp.palaceskateboards.com')throw new Blocked('Palace日本の購入先ドメインを確認できません。手動で購入してください');
    const products=(collection.products.edges||[]).map(({node:p})=>({
      key:p.handle,name:p.title,text:p.title,color:'',url:'https://jp.palaceskateboards.com/products/'+p.handle,
      image:p.variants?.nodes?.[0]?.image?.url||'',
      variants:(p.variants?.nodes||[]).map(v=>{
        if(v.price?.currencyCode!=='JPY')throw new Blocked('Palace商品の通貨がJPYではありません');
        const opts=v.selectedOptions||[];
        return {id:String(v.id).split('/').pop(),ok:!!v.availableForSale,
          size:opts.find(o=>/size/i.test(o.name))?.value||opts.map(o=>o.value).join(' / ')||'One Size',
          color:opts.find(o=>/colou?r/i.test(o.name))?.value||'',price:Number(v.price.amount)};
      })
    }));
    return {products,checkoutOrigin:origin.origin,nextCursor:collection.products.pageInfo?.hasNextPage?collection.products.pageInfo.endCursor:null};
  }
  const palace = {
    focus:[],checkoutUrl:'',checkoutOrigin:'',
    setFocus(keys){this.focus=keys;},
    async list(){
      const out=[];let cursor='';
      for(let page=0;page<2;page++){
        if(page)await sleep(1500);
        const r=await get('/collections/new'+(cursor?'?direction=next&cursor='+encodeURIComponent(cursor):'?_='+Date.now()));
        if(r.status>=400)throw new Blocked('Palace HTTP '+r.status);
        const parsed=palaceProducts(decodePalace(r.text));
        this.checkoutOrigin=parsed.checkoutOrigin;out.push(...parsed.products);
        cursor=parsed.nextCursor;if(!cursor)break;
      }
      return {products:out,partial:false};
    },
    async variant(p,want,kw,color){return gen.variant(p,want,kw,color);},
    async add(items){
      if(!this.checkoutOrigin)throw new Error('Palace購入先が未確認です');
      if(items.some(x=>!/^\d+$/.test(String(x.id))||!Number.isInteger(x.qty)||x.qty<1))throw new Error('商品番号・数量を確認してください');
      this.checkoutUrl=this.checkoutOrigin+'/cart/'+items.map(x=>x.id+':'+x.qty).join(',');
      return items; // The permalink performs cart insertion after navigation, not here.
    },
    async prune(){return [];},async clearAll(){return 0;},
    get checkout(){return this.checkoutUrl;}
  };

  const shop = IS_PAL ? palace : IS_SUP ? sup : IS_GEN ? gen : sfcc;

  // ---------- 1 l\u01b0\u1ee3t qu\u00e9t: t\u00ecm m\u00f3n kh\u1edbp t\u1eeb kh\u00f3a, ch\u1ecdn size c\u00f2n h\u00e0ng ----------
  const blindAt = {}, blindSt = {};            // th\u00eam gi\u1ecf th\u1eb3ng b\u1eb1ng variant ID: l\u1ea7n th\u1eed g\u1ea7n nh\u1ea5t / k\u1ebft qu\u1ea3
  async function scan() {
    const { products, partial } = await shop.list();
    hits429 = 0; cfHits = 0;
    const rows = cfg.items.slice(0, cfg.kwCount).map((it, i) => ({ ...it, i })).filter((it) => it.kw.trim());
    const focus = new Set();
    // m\u1ed7i t\u1eeb kh\u00f3a d\u00f2 song song (HUMAN MADE / Buffer ph\u1ea3i h\u1ecfi kho t\u1eebng m\u00f3n: tr\u01b0\u1edbc \u0111\u00e2y h\u1ecfi l\u1ea7n l\u01b0\u1ee3t -> ch\u1eadm)
    // ---- \u00f4 t\u1eeb kh\u00f3a l\u00e0 M\u00c3 BI\u1ebeN TH\u1ec2 ----
    // Shopify: variant ID (ch\u1ec9 s\u1ed1, VD 42728889876830) ; HUMAN MADE / Buffer: m\u00e3 h\u00e0ng (VD BF31TE050BK903 / HM29CS001)
    const vidOf = (kw) => { const k = kw.trim(); return IS_SHOPIFY ? (/^\d{8,}$/.test(k) ? k : '') : (/^[A-Z0-9]{8,}$/i.test(k) && /\d/.test(k) && /[A-Z]/i.test(k) ? k.toUpperCase() : ''); };
    // nhi\u1ec1u m\u00e3 n\u1ed1i b\u1eb1ng & (d\u1ea5u ph\u1ea9y / kho\u1ea3ng tr\u1eafng c\u0169ng \u0111\u01b0\u1ee3c), VD 111&222&333 -> m\u1ed7i \u00f4 v\u1eabn ch\u1ec9 ra 1 m\u00f3n, ch\u1ecdn NG\u1eaaU NHI\u00caN 1 m\u00e3 (user y\u00eau c\u1ea7u 2/11)
    const vidsOf = (kw) => { const a = kw.split(/[&,\s]+/).filter(Boolean).map(vidOf); return a.length && a.every(Boolean) ? [...new Set(a)] : []; };
    const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
    const listedV = (id) => { for (const p of products) { const v = (p.variants || []).find((x) => String(x.id) === id); if (v) return v; } return null; };
    function pickVid(vids) {
      if (vids.length === 1 || !IS_SHOPIFY) return pickOne(vids);
      // Shopify / Supreme: \u01b0u ti\u00ean m\u00e3 \u0111ang c\u00f3 h\u00e0ng trong danh s\u00e1ch SP
      const avail = vids.filter((id) => { const v = listedV(id); return v && v.ok; });
      if (avail.length) return pickOne(avail);
      // ch\u01b0a m\u00e3 n\u00e0o c\u00f3 h\u00e0ng: th\u00eam gi\u1ecf th\u1eb3ng 1 m\u00e3 ch\u01b0a l\u00ean danh s\u00e1ch; c\u1ea3 nh\u00f3m v\u1eabn ch\u1ec9 1 l\u1ea7n / 1,5 gi\u00e2y (kh\u00f4ng t\u0103ng request gi\u1ecf)
      const last = Math.max(0, ...vids.map((id) => blindAt[id] || 0));
      if (Date.now() - last < 1500) return vids.find((id) => (blindAt[id] || 0) === last);
      const blind = vids.filter((id) => !listedV(id));
      return pickOne(blind.length ? blind : vids);
    }
    async function byVid(it, vid) {
      const qtyOf = (lim) => Math.max(1, lim ? Math.min(it.qty, lim) : it.qty);
      if (IS_SHOPIFY) {
        // 1) c\u00f3 trong danh s\u00e1ch SP (danh s\u00e1ch ch\u1ee9a ID m\u1ecdi bi\u1ebfn th\u1ec3) -> bi\u1ebft t\u00ean / size / c\u00f2n h\u00e0ng
        const p = products.find((x) => (x.variants || []).some((v) => String(v.id) === vid));
        if (p) {
          focus.add(p.key);
          const v = p.variants.find((x) => String(x.id) === vid);
          if (!v.ok) return { it, s: 'out', hit: null };
          return { it, s: 'in', hit: { id: v.id, qty: qtyOf(p.limit), name: p.name, url: p.url, image: p.image,
            size: [v.color, v.size].filter((x) => x && x !== '-').join(' / ') || '-', price: '\u00a5' + Math.round(IS_SUP ? v.price / 100 : v.price).toLocaleString('ja-JP') } };
        }
        if (IS_PAL) return { it, s: 'none', hit: null }; // No blind Shopify cart API requests on Palace.
        // 2) ch\u01b0a l\u00ean danh s\u00e1ch: th\u1eed th\u00eam gi\u1ecf th\u1eb3ng b\u1eb1ng ID (1,5 gi\u00e2y / l\u1ea7n \u0111\u1ec3 kh\u00f4ng b\u1ecb ch\u1eb7n)
        if (Date.now() - (blindAt[vid] || 0) < 1500) return { it, s: blindSt[vid] || 'none', hit: null };
        blindAt[vid] = Date.now();
        const r = await fetch('/cart/add.js', { method: 'POST', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ items: [{ id: +vid, quantity: it.qty }] }) });
        if (r.status === 429) throw new Http429(parseFloat(r.headers.get('Retry-After')) || 0);
        const j = await r.json().catch(() => ({}));
        if (r.ok) {
          const x = (j.items || [])[0] || {};
          return { it, s: 'in', hit: { id: +vid, qty: x.quantity || it.qty, name: x.product_title || x.title || ('Variant ' + vid), url: location.origin + (x.url || ''),
            image: x.image || x.featured_image && x.featured_image.url || '', size: x.variant_title || '-', price: '\u00a5' + Math.round((x.price || 0) / 100).toLocaleString('ja-JP'), added: true } };
        }
        // 422 "\u58f2\u308a\u5207\u308c" = c\u00f3 m\u00e3 nh\u01b0ng h\u1ebft ; 404 / "\u898b\u3064\u304b\u308a\u307e\u305b\u3093" = m\u00e3 ch\u01b0a c\u00f3 tr\u00ean shop
        blindSt[vid] = r.status === 422 && !/\u898b\u3064\u304b\u308a|not found|cannot find/i.test(j.description || j.message || '') ? 'out' : 'none';
        return { it, s: blindSt[vid], hit: null };
      }
      // SFCC: h\u1ecfi kho th\u1eb3ng m\u00e3 h\u00e0ng; m\u00e3 bi\u1ebfn th\u1ec3 (\u0111\u1ee7 m\u00e0u + size) -> mua \u0111\u00fang m\u00e3 \u0111\u00f3, m\u00e3 master -> ch\u1ecdn m\u00e0u / size theo \u00f4
      const pr = (await sfcc.pv(vid)).product || {};
      if (!pr.id) return { it, s: 'none', hit: null };
      if (pr.LotteryExclusive) return { it, s: 'lottery', hit: null };
      const img = pr.images && pr.images.large && pr.images.large[0] ? pr.images.large[0].url : '';
      const url = pr.selectedProductUrl ? new URL(pr.selectedProductUrl, location.origin).href : location.origin;
      const isVar = pr.productType === 'variant' || (pr.id === vid && (pr.variationAttributes || []).length && (pr.variationAttributes || []).every((a) => (a.values || []).some((v) => v.selected)));
      if (isVar) {
        const sell = pr.sellStartDate ? Date.parse(pr.sellStartDate) : 0;
        if (sell && sell > Date.now() + 3000) return { it, s: 'soon', hit: null };
        if (!(pr.available && pr.orderable !== false && pr.readyToOrder !== false)) return { it, s: 'out', hit: null };
        const sel = (pr.variationAttributes || []).map((a) => ((a.values || []).find((v) => v.selected) || {}).displayValue).filter(Boolean).join(' / ');
        return { it, s: 'in', hit: { id: pr.id, qty: qtyOf(pr.purchaseQtyLimitProduct || pr.maxOrderQuantity), name: pr.productName || vid, url, image: img, size: sel || '-',
          price: (pr.price && pr.price.sales && pr.price.sales.formatted) || '' } };
      }
      const p = { key: pr.id, name: pr.productName || vid, text: pr.productName || '', url, image: img };
      const v = await sfcc.variant(p, it.size, it.kw, it.color);
      if (!v) return { it, s: p.lottery ? 'lottery' : p.notYet ? 'soon' : 'out', hit: null };
      return { it, s: 'in', hit: { id: v.id, qty: qtyOf(v.limit), name: p.name, url, image: img, size: v.size, price: v.price } };
    }
    const res = await Promise.all(rows.map(async (it) => {
      const vids = vidsOf(it.kw);
      if (vids.length) return byVid(it, pickVid(vids));
      let ps = products.filter((p) => match(p.text, it.kw));
      ps.forEach((p) => focus.add(p.key));
      const wc = wantColors(it.color);
      if (IS_SUP && wc.length) {                    // Supreme: m\u1ed7i m\u00e0u l\u00e0 1 m\u00f3n ri\u00eang -> l\u1ecdc + x\u1ebfp theo m\u00e0u \u01b0u ti\u00ean
        ps = wc.flatMap((w) => ps.filter((p) => colorOk(p.color, w)));
      }
      let s = ps.length ? 'out' : 'none';
      for (const p of ps) {
        if (IS_SHOPIFY ? !p.variants.some((v) => v.ok) : p.soldOut && !partial && !sfcc.focus.includes(p.key)) continue;
        const v = await shop.variant(p, it.size, it.kw, it.color);
        if (p.lottery) s = 'lottery';
        if (p.notYet && s !== 'lottery') s = 'soon';
        if (!v) continue;
        return { it, s: 'in', hit: { id: v.id, qty: Math.max(1, v.limit ? Math.min(it.qty, v.limit) : it.qty), name: p.name, url: p.url, image: p.image, size: v.size, price: v.price } };
      }
      return { it, s, hit: null };
    }));
    const picked = [], seen = new Set(), stat = [];
    for (const { it, s, hit } of res) {
      const dup = hit && seen.has(hit.id);
      if (hit && !dup) { seen.add(hit.id); picked.push(hit); }
      stat.push({ label: `KW${it.i + 1}`, kw: it.kw + (it.color ? ` / ${it.color}` : '') + (it.size ? ` [${it.size}]` : ''), st: hit ? 'in' : s });
    }
    // danh s\u00e1ch \u0111\u1ea7y \u0111\u1ee7 m\u1edbi c\u1eadp nh\u1eadt m\u00f3n c\u1ea7n theo d\u00f5i nhanh (l\u01b0\u1ee3t ch\u1ec9 t\u1ea3i m\u00f3n \u0111\u00e3 bi\u1ebft th\u00ec gi\u1eef nguy\u00ean)
    if (!partial) shop.setFocus([...focus].slice(0, 6));
    kwStat = stat;
    return picked;
  }

  async function buy(items) {
    adding = true;
    const t0 = performance.now();
    let ok = [];
    try {
      const pre = items.filter((x) => x.added), rest = items.filter((x) => !x.added);
      ok = [...pre, ...(rest.length ? await shop.add(rest) : [])];
    } catch (e) { log(L('\u30ab\u30fc\u30c8\u8ffd\u52a0\u30a8\u30e9\u30fc: ', 'L\u1ed7i th\u00eam gi\u1ecf: ') + e.message); }
    if (ok.length) {
      // gi\u1ecf c\u00f2n m\u00f3n kh\u00e1c (th\u00eam tay t\u1eeb tr\u01b0\u1edbc / l\u01b0\u1ee3t c\u0169) -> xo\u00e1, \u0111\u1ec3 trang thanh to\u00e1n ch\u1ec9 c\u00f3 m\u00f3n trong KW
      try {
        const extra = await shop.prune(ok);
        if (extra.length) log(L('\u30ab\u30fc\u30c8\u306e\u4e0d\u8981\u306a\u5546\u54c1\u3092\u524a\u9664: ', '\u0110\u00e3 x\u00f3a m\u00f3n th\u1eeba trong gi\u1ecf: ') + extra.map((x) => String(x).slice(0, 20)).join(', '));
      } catch (e) { log(L('\u30ab\u30fc\u30c8\u6574\u7406\u30a8\u30e9\u30fc: ', 'L\u1ed7i d\u1ecdn gi\u1ecf: ') + e.message); }
      // mua xong: D\u1eeaNG H\u1eb2N (kh\u00f4ng t\u1ef1 b\u1eadt l\u1ea1i khi quay v\u1ec1 trang shop / t\u1ea3i l\u1ea1i trang)
      st.active = false; st.now = false; st.boughtAt = Date.now(); st.reloads = []; save(K_ST, st);
      setStatus(L('\u30ab\u30fc\u30c8\u8ffd\u52a0\u5b8c\u4e86 \u2192 \u8cfc\u5165\u753b\u9762\u3078\uff08BOT\u505c\u6b62\uff09', '\u0110\u00e3 v\u00e0o gi\u1ecf \u2192 sang thanh to\u00e1n (BOT \u0111\u00e3 d\u1eebng)'));
      if (IS_PAL) setStatus('Palaceの在庫を確認 → カートリンクへ進みます。投入結果・金額・注文内容を確認してください。');
      try { localStorage.removeItem('sxb_pay_used'); } catch (e) {}
      save(K_LAST, { shop: SHOP, site: HOST, at: Date.now(), items: ok.map((x) => ({ title: x.name, url: x.url, image: synovaThumb(x.image), size: x.size, price: x.price, qty: x.qty })) });
      gmSet('sxb_bot_buy', { at: Date.now(), host: HOST });
      if (IS_PAL) gmSet('uzura_palace_last', { shop: SHOP, site: HOST, at: Date.now(), items: ok.map(x => ({title:x.name,url:x.url,image:x.image,size:x.size,price:x.price,qty:x.qty})) });
      location.href = shop.checkout;               // chuy\u1ec3n trang NGAY, ghi log sau
      log(L('\u5728\u5eab\u3042\u308a \u2192 \u30ab\u30fc\u30c8\u306b\u8ffd\u52a0 \u2192 \u8cfc\u5165\u753b\u9762\u3078: ', 'C\u00f3 h\u00e0ng \u2192 \u0111\u00e3 v\u00e0o gi\u1ecf \u2192 sang thanh to\u00e1n: ') +
        ok.map((x) => `${x.name.slice(0, 22)} (${x.size})\u00d7${x.qty}`).join(', ') + ` \u00b7 ${Math.round(performance.now() - t0)}ms`);
      beep();
      return true;
    }
    adding = false;
    setStatus(L('\u30ab\u30fc\u30c8\u8ffd\u52a0\u3067\u304d\u305a \u2192 \u76e3\u8996\u3092\u7d9a\u3051\u307e\u3059', 'Kh\u00f4ng th\u00eam \u0111\u01b0\u1ee3c v\u00e0o gi\u1ecf \u2192 qu\u00e9t ti\u1ebfp'));
    return false;
  }

  let ticker = null;
  function startTicker() {
    if (ticker) return;
    let sec = 0, prev = { ...stats };
    const ST = { in: L('\u5728\u5eab\u3042\u308a\u2705', 'c\u00f2n h\u00e0ng \u2705'), out: L('\u58f2\u308a\u5207\u308c', 'h\u1ebft h\u00e0ng'), none: L('\u672a\u63b2\u8f09', 'ch\u01b0a l\u00ean k\u1ec7'),
      soon: L('\u8ca9\u58f2\u524d', 'ch\u01b0a t\u1edbi gi\u1edd b\u00e1n'), lottery: L('\u62bd\u9078\u8ca9\u58f2\uff08BOT\u5bfe\u8c61\u5916\uff09', 'b\u00e1n b\u1ed1c th\u0103m (BOT kh\u00f4ng mua)') };
    ticker = setInterval(() => {
      if (!st.active) { clearInterval(ticker); ticker = null; return; }
      sec++;
      if (sec > 60 && sec % 10) return;              // sau 1 ph\u00fat: 10 gi\u00e2y ghi 1 l\u1ea7n
      const d = { ok: stats.ok - prev.ok, err: stats.err - prev.err };
      prev = { ...stats };
      if (d.err && !d.ok) log(L('\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30a8\u30e9\u30fc', 'l\u1ed7i m\u1ea1ng'));
      for (const k of [...kwStat].reverse()) log(`[${k.label}] ${k.kw} \u00b7 ${ST[k.st]}`);
      if (adding) log(L('\u5728\u5eab\u3042\u308a \u2192 \u30ab\u30fc\u30c8\u306b\u8ffd\u52a0\u4e2d\u2026', 'C\u00f3 h\u00e0ng \u2192 \u0111ang th\u00eam v\u00e0o gi\u1ecf\u2026'));
    }, 1000);
  }

  // 1 l\u01b0\u1ee3t qu\u00e9t + mua n\u1ebfu c\u00f3 h\u00e0ng; l\u1ed7i x\u1eed l\u00fd t\u1ea1i \u0111\u00e2y (ch\u1ea1y \u0111\u01b0\u1ee3c song song nhi\u1ec1u l\u01b0\u1ee3t)
  let inflight = 0;
  async function scanOnce() {
    if (!st.active) return;
    inflight++;
    try {
      const items = await scan();
      pace = Math.max(1, pace * 0.93);
      if (items.length && !adding && st.active) await buy(items);
    } catch (e) {
      if (e instanceof Http429) {
        if (Date.now() >= backoffUntil) {           // nhi\u1ec1u l\u01b0\u1ee3t c\u00f9ng tr\u1ea3 429 -> ch\u1ec9 t\u00ednh 1 l\u1ea7n
          hits429++;
          pace = Math.min(8, pace * 1.6);
          let wait = Math.min(BACKOFF_MAX, BACKOFF_MIN * 2 ** (hits429 - 1));
          if (e.retryAfter > 0) wait = Math.min(BACKOFF_MAX, Math.max(BACKOFF_MIN, e.retryAfter * 1000));
          backoffUntil = Date.now() + wait;
          if (hits429 === 1) log(L('\u30a2\u30af\u30bb\u30b9\u5236\u9650(429) \u2192 \u5c11\u3057\u5f85\u3063\u3066\u518d\u958b', 'B\u1ecb gi\u1edbi h\u1ea1n (429) \u2192 ch\u1edd ch\u00fat r\u1ed3i qu\u00e9t ti\u1ebfp'));
        }
      } else if (e.blocked) {
        if (IS_PAL) { finish(e.message); return; }
        // Cloudflare / Queue-it: tr\u00ecnh duy\u1ec7t th\u1eadt t\u1ef1 qua khi t\u1ea3i l\u1ea1i trang -> BOT ch\u1ea1y ti\u1ebfp sau khi t\u1ea3i l\u1ea1i
        cfHits++;
        log(L(`${e.message} \u691c\u51fa \u2192 \u30da\u30fc\u30b8\u518d\u8aad\u307f\u8fbc\u307f`, `G\u1eb7p ${e.message} \u2192 t\u1ea3i l\u1ea1i trang`) + ` (${cfHits})`);
        if (cfHits >= 2 && st.active) {
          // t\u1ea3i l\u1ea1i t\u1ed1i \u0111a 4 l\u1ea7n / 3 ph\u00fat; qu\u00e1 th\u00ec d\u1eebng (tr\u01b0\u1edbc \u0111\u00e2y t\u1ea3i l\u1ea1i m\u00e3i = "BOT c\u1ee9 t\u1ef1 b\u1eadt l\u1ea1i")
          st.reloads = (st.reloads || []).filter((t) => Date.now() - t < 180e3).concat(Date.now());
          if (st.reloads.length > 4) { finish(L('Cloudflare / Queue-it \u304c\u7d9a\u304f\u305f\u3081\u505c\u6b62', 'B\u1ecb Cloudflare / Queue-it ch\u1eb7n li\u00ean t\u1ee5c \u2013 d\u1eebng')); return; }
          save(K_ST, st); await sleep(1500);
          if (st.active) location.reload();
          return;
        }
        backoffUntil = Date.now() + 2000;
      } else setStatus(L('\u30a8\u30e9\u30fc: ', 'L\u1ed7i: ') + e.message);
    } finally { inflight--; }
  }

  async function run() {
    adding = false; hits429 = 0; cfHits = 0; backoffUntil = 0; inflight = 0; pace = 1;
    let opened = false;
    while (st.active) {
      const t0 = Date.now();
      const left = st.now ? -1 : msToOpen();
      if (left > WATCH_FROM_SEC * 1000) {
        if (opened) { finish(L(`${GIVE_UP_MIN}\u5206\u904e\u304e\u3066\u3082\u5728\u5eab\u306a\u3057 \u2192 \u505c\u6b62`, `Qu\u00e1 ${GIVE_UP_MIN} ph\u00fat ch\u01b0a c\u00f3 h\u00e0ng \u2013 d\u1eebng`)); return; }
        const s = Math.ceil(left / 1000);
        setStatus(L(`${cfg.open}\uff08\u65e5\u672c\u6642\u9593\uff09\u307e\u3067: `, `C\u00f2n t\u1edbi ${cfg.open} gi\u1edd Nh\u1eadt: `) + `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`);
        await sleep(Math.min(1000, left - WATCH_FROM_SEC * 1000));
        continue;
      }
      opened = true;
      startTicker();
      if (adding || Date.now() < backoffUntil) { await sleep(40); continue; }
      setStatus(L('\u5728\u5eab\u76e3\u8996\u4e2d\u2026', '\u0110ang canh h\u00e0ng\u2026') + (pace > 1.05 ? ` (\u00d7${pace.toFixed(1)})` : ''));
      // c\u00e1c l\u01b0\u1ee3t ch\u1ed3ng l\u00ean nhau (kh\u00f4ng ch\u1edd l\u01b0\u1ee3t tr\u01b0\u1edbc tr\u1ea3 l\u1eddi): m\u1ea1ng ch\u1eadm v\u1eabn c\u00f3 k\u1ebft qu\u1ea3 m\u1edbi li\u00ean t\u1ee5c
      const fast = !st.now && left > -FAST_FOR_MS;
      if (IS_PAL || IS_GEN) { if (!inflight) await scanOnce(); await sleep(Math.max(1500, backoffUntil-Date.now())); continue; }
      if (inflight < (fast ? MAX_INFLIGHT : NOW_INFLIGHT)) scanOnce();
      await sleep(Math.max(20, (fast ? FAST_MS : NOW_MS) * pace + Math.random() * 40 - (Date.now() - t0)));
    }
  }

  function start(now) {
    readCfg();
    if (!cfg.items.slice(0, cfg.kwCount).some((i) => i.kw.trim())) { log(L('\u30ad\u30fc\u30ef\u30fc\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp t\u1eeb kh\u00f3a')); return; }
    if (!now && !/^\d{1,2}:\d{2}$/.test(cfg.open || '')) { log(L('\u8ca9\u58f2\u958b\u59cb\u6642\u523b\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp gi\u1edd m\u1edf b\u00e1n')); return; }
    if (IS_HM || IS_BUF) {                         // SFCC: d\u00f9ng trang danh s\u00e1ch \u0111ang m\u1edf (New / All / danh m\u1ee5c) l\u00e0m ngu\u1ed3n qu\u00e9t
      const g = document.querySelector('[data-url*="Search-UpdateGrid"]');
      if (g) { cfg.grid = g.getAttribute('data-url'); save(K_CFG, cfg); }
      log(L('\u76e3\u8996\u30da\u30fc\u30b8: ', 'Trang qu\u00e9t: ') + decodeURIComponent((cfg.grid || 'cgid=all').replace(/^.*Search-UpdateGrid\??/, '')));
    }
    st.active = true; st.now = !!now; st.boughtAt = 0; st.reloads = []; save(K_ST, st); keepAwake();
    if (IS_GEN) {
      shop.clearAll().then(n => {
        if (n) log('開始前にカートを空にしました（' + n + '件）');
        if (st.active) run();
      }).catch(e => finish('開始できません: ' + e.message));
      return;
    }
    shop.clearAll().then((n) => { if (n) log(L(`\u958b\u59cb\u524d\u306b\u30ab\u30fc\u30c8\u3092\u7a7a\u306b\u3057\u307e\u3057\u305f\uff08${n}\u4ef6\uff09`, `\u0110\u00e3 d\u1ecdn gi\u1ecf tr\u01b0\u1edbc khi ch\u1ea1y (${n} m\u00f3n)`)); }).catch(() => {});
    log(now ? L(`${SHOP}: \u4eca\u3059\u3050\u76e3\u8996`, `${SHOP}: canh h\u00e0ng ngay`) : L(`${SHOP}: ${cfg.open}\uff08\u65e5\u672c\u6642\u9593\uff09\u307e\u3067\u5f85\u6a5f`, `${SHOP}: ch\u1edd t\u1edbi ${cfg.open} gi\u1edd Nh\u1eadt`));
    run();
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
    const el = $('sxblog'); if (el && el.getClientRects().length) el.textContent = logBuf.join('\n');
    const n = $('sxblogn'); if (n) n.textContent = logCount();
  }
  function setStatus(s) { const el = $('sxbst'); if (el) el.textContent = s; }
  function readCfg() {
    for (let i = 0; i < MAX_KW; i++) {
      cfg.items[i].kw = $('sxbk' + i).value.trim();
      cfg.items[i].color = $('sxbc' + i).value.trim();
      cfg.items[i].size = $('sxbs' + i).value.trim();
      cfg.items[i].qty = +$('sxbq' + i).value;
    }
    cfg.open = $('sxbopen').value;
    save(K_CFG, cfg);
  }
  let sxRoot = null;                          // Shadow DOM ch\u1ee9a khung BOT
  const $ = (id) => (sxRoot ? sxRoot.getElementById(id) : null);

  const ui = load(K_UI, { top: true, hide: IS_GEN });
  const box = document.createElement('div');
  box.id = 'sxbbox';
  const goLabel = (t) => (t ? L(`${t} \u306b\u4e88\u7d04\u30fb\u81ea\u52d5\u30b9\u30bf\u30fc\u30c8`, `H\u1eb9n \u0111\u1ebfn ${t} T\u1ef1 B\u1eadt`) : L('\u8ca9\u58f2\u958b\u59cb\u6642\u523b\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044', 'H\u00e3y nh\u1eadp gi\u1edd m\u1edf b\u00e1n'));
  const qtySel = (id) => `<select id="${id}">${Array.from({ length: MAX_QTY }, (_, i) => `<option>${i + 1}</option>`).join('')}</select>`;
  const DESC = IS_GEN
    ? L(`${SHOP} : Shopify\u5e97\u8217\u3092\u81ea\u52d5\u8a8d\u8b58\u3002\u5148\u306b\u4f4f\u6240\u30fb\u652f\u6255\u3044\u60c5\u5831\u3092\u6e96\u5099\u3002\u30ad\u30fc\u30ef\u30fc\u30c9\uff08\u5546\u54c1\u540d\u306e\u4e00\u90e8\uff09\uff0b\u8272\uff0b\u30b5\u30a4\u30ba\uff0b\u500b\u6570 \u2192 \u6642\u523b\u4e88\u7d04 \u307e\u305f\u306f\u300c\u3059\u3050\u5b9f\u884c\u300d\u3002`,
        `${SHOP} : t\u1ef1 nh\u1eadn shop Shopify. Chu\u1ea9n b\u1ecb s\u1eb5n \u0111\u1ecba ch\u1ec9 + thanh to\u00e1n. Nh\u1eadp t\u1eeb kh\u00f3a (1 ph\u1ea7n t\u00ean SP) + m\u00e0u + size + s\u1ed1 l\u01b0\u1ee3ng \u2192 h\u1eb9n gi\u1edd ho\u1eb7c "Ch\u1ea1y Ngay".`)
    : IS_SUP
    ? L('Supreme JP : \u5148\u306b\u914d\u9001\u5148\u30fb\u652f\u6255\u3044\u60c5\u5831\u3092\u6e96\u5099\u3002\u30ad\u30fc\u30ef\u30fc\u30c9\uff08\u5546\u54c1\u540d\u30fb\u8272\u3001\u30b9\u30da\u30fc\u30b9\u533a\u5207\u308a\u3067\u5168\u90e8\u542b\u3080\uff09\uff0b\u30b5\u30a4\u30ba\uff0b\u500b\u6570 \u2192 \u4e88\u7d04\uff08\u6bce\u9031\u6728\u66dc 11:00 \u65e5\u672c\u6642\u9593\uff09\u3002',
        'Supreme JP : chu\u1ea9n b\u1ecb s\u1eb5n \u0111\u1ecba ch\u1ec9 + thanh to\u00e1n. Nh\u1eadp t\u1eeb kh\u00f3a (t\u00ean SP / m\u00e0u, c\u00e1ch nhau d\u1ea5u c\u00e1ch = ph\u1ea3i ch\u1ee9a h\u1ebft) + size + s\u1ed1 l\u01b0\u1ee3ng \u2192 h\u1eb9n gi\u1edd (th\u1ee9 N\u0103m 11:00 gi\u1edd Nh\u1eadt).')
    : L(`${SHOP} : \u5148\u306b\u30ed\u30b0\u30a4\u30f3\u30fb\u4f4f\u6240\u8a2d\u5b9a\u3002\u76e3\u8996\u3057\u305f\u3044\u4e00\u89a7\u30da\u30fc\u30b8\uff08New / All \u306a\u3069\uff09\u3092\u958b\u3044\u3066\u304b\u3089\u958b\u59cb\u3002\u30ad\u30fc\u30ef\u30fc\u30c9\uff08\u5546\u54c1\u540d\u30fb\u8272\uff09\uff0b\u30b5\u30a4\u30ba\uff0b\u500b\u6570\u3002\u62bd\u9078\u8ca9\u58f2\u306f\u5bfe\u8c61\u5916\u3002`,
        `${SHOP} : login + c\u00e0i \u0111\u1ecba ch\u1ec9 tr\u01b0\u1edbc. M\u1edf trang danh s\u00e1ch mu\u1ed1n canh (New / All\u2026) r\u1ed3i m\u1edbi B\u1eadt. Nh\u1eadp t\u1eeb kh\u00f3a (t\u00ean SP / m\u00e0u) + size + s\u1ed1 l\u01b0\u1ee3ng. H\u00e0ng b\u1ed1c th\u0103m BOT kh\u00f4ng mua.`);
  // ---------- Supreme: th\u00f4ng tin giao h\u00e0ng + th\u1ebb + c\u00e1ch thanh to\u00e1n (t\u1ef1 \u0111i\u1ec1n \u1edf trang thanh to\u00e1n) ----------
  const buyCfg = load(K_BUY, { fill: true, auto: false, pay: 'card' });
  const fi = (id, ph, extra) => `<input id="sxbi_${id}" placeholder="${ph}" ${extra || ''}>`;
  const BUY_HTML = `<div class="r"><button id="sxbbuyb">\u2699\ufe0f ${L('\u914d\u9001\u5148\u30fb\u652f\u6255\u3044\uff08\u81ea\u52d5\u5165\u529b\uff09', 'Th\u00f4ng tin giao h\u00e0ng & thanh to\u00e1n')}</button></div>
  <div class="sec" id="sxbbuy" style="display:none">
    <b>${L('\u914d\u9001\u5148', '\u0110\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng')}</b>
    <div class="r">${fi('last', L('\u59d3', 'H\u1ecd (\u59d3)'))}${fi('first', L('\u540d', 'T\u00ean (\u540d)'))}</div>
    <div class="r"${IS_SHOPIFY ? '' : ' style="display:none"'}>${fi('klast', L('\u30bb\u30a4\uff08\u30ab\u30bf\u30ab\u30ca\uff09', 'H\u1ecd katakana (\u30bb\u30a4)'))}${fi('kfirst', L('\u30e1\u30a4\uff08\u30ab\u30bf\u30ab\u30ca\uff09', 'T\u00ean katakana (\u30e1\u30a4)'))}</div>
    <div class="r"${IS_SHOPIFY ? '' : ' style="display:none"'}>${fi('email', L('\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9', 'Email'), 'type="email" autocomplete="email"')}</div>
    <div class="r">${fi('phone', L('\u643a\u5e2f\u96fb\u8a71\uff08\u4f8b 09012345678\uff09', '\u0110i\u1ec7n tho\u1ea1i (VD 09012345678)'), 'type="tel" inputmode="tel"')}</div>
    <div class="r">${fi('zip', L('\u90f5\u4fbf\u756a\u53f7', 'M\u00e3 b\u01b0u \u0111i\u1ec7n (\u3012)'), 'inputmode="numeric"')}<select id="sxbi_pref"><option value="">${L('\u90fd\u9053\u5e9c\u770c', 'T\u1ec9nh')}</option>${PREFS.map((x, i) => `<option value="${i + 1}">${x}</option>`).join('')}</select></div>
    <div class="r">${fi('city', L('\u5e02\u533a\u753a\u6751', 'Qu\u1eadn / th\u00e0nh ph\u1ed1 (\u5e02\u533a\u753a\u6751)'))}</div>
    <div class="r">${fi('addr1', L('\u4f4f\u6240\uff08\u756a\u5730\uff09', '\u0110\u1ecba ch\u1ec9 (\u756a\u5730)'))}</div>
    <div class="r">${fi('addr2', L('\u5efa\u7269\u540d\u30fb\u90e8\u5c4b\u756a\u53f7\uff08\u4efb\u610f\uff09', 'T\u00f2a nh\u00e0, ph\u00f2ng (kh\u00f4ng b\u1eaft bu\u1ed9c)'))}</div>
    <b style="display:block;margin-top:8px">${L('\u652f\u6255\u3044\u65b9\u6cd5', 'C\u00e1ch thanh to\u00e1n')}</b>
    <div class="r"${IS_SHOPIFY ? '' : ' style="display:none"'}><select id="sxbi_pay" style="flex:1">${Object.entries(PAYS).filter(([k]) => IS_SHOPIFY || k === 'card').map(([k, v]) => `<option value="${k}">${L(v[0], v[1])}</option>`).join('')}</select></div>
    <div class="r" id="sxbkstore"${IS_SHOPIFY ? '' : ' style="display:none"'}><span class="lb">\ud83c\udfea</span><select id="sxbi_kstore" style="flex:1">${KSTORES.map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></div>
    <div class="desc"${IS_SHOPIFY ? '' : ' style="display:none"'}>${L('\u5e97\u8217\u306b\u306a\u3044\u652f\u6255\u3044\u65b9\u6cd5\u3092\u9078\u3076\u3068\u81ea\u52d5\u8cfc\u5165\u3057\u307e\u305b\u3093\u3002\u9280\u884c\u632f\u8fbc\u30fb\u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08\u3067 KOMOJU \u306e\u753b\u9762\u306b\u79fb\u308b\u5e97\u8217\u306f\u3001\u30ab\u30bf\u30ab\u30ca\u540d\u30fb\u96fb\u8a71\u756a\u53f7\u30fb\u30b3\u30f3\u30d3\u30cb\u5e97\u8217\u3092\u81ea\u52d5\u5165\u529b\u3057\u3066\u300c\u652f\u6255\u3044\u300d\u307e\u3067\u9032\u307f\u307e\u3059\uff08KOMOJU\u753b\u9762\u3067\u4e00\u5ea6\u300c\u8cbc\u308a\u4ed8\u3051\u300d\u304c\u5fc5\u8981\uff09\u3002',
      'Shop kh\u00f4ng c\u00f3 c\u00e1ch thanh to\u00e1n \u0111\u00e3 ch\u1ecdn th\u00ec BOT kh\u00f4ng t\u1ef1 \u0111\u1eb7t. \u9280\u884c\u632f\u8fbc / \u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08 chuy\u1ec3n sang trang KOMOJU: BOT t\u1ef1 \u0111i\u1ec1n t\u00ean katakana, \u0111i\u1ec7n tho\u1ea1i, ch\u1ecdn c\u1eeda h\u00e0ng konbini r\u1ed3i b\u1ea5m \u652f\u6255\u3044 (l\u1ea7n \u0111\u1ea7u b\u1ea5m "D\u00e1n" \u1edf trang KOMOJU).')}</div>
    <div id="sxbcard">
      <div class="r">${fi('cnum', L('\u30ab\u30fc\u30c9\u756a\u53f7', 'S\u1ed1 th\u1ebb'), 'inputmode="numeric" autocomplete="off"')}</div>
      <div class="r">${fi('cexp', 'MM/YY', 'inputmode="numeric" autocomplete="off"')}${fi('ccvv', L('\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30b3\u30fc\u30c9', 'CVV'), 'inputmode="numeric" autocomplete="off"')}</div>
      <div class="r">${fi('cname', L('\u30ab\u30fc\u30c9\u540d\u7fa9\uff08\u4f8b TARO YAMADA\uff09', 'T\u00ean tr\u00ean th\u1ebb (VD TARO YAMADA)'), 'autocomplete="off"')}</div>
      <div class="r"><button id="sxbi_cclr">${L('\u30ab\u30fc\u30c9\u60c5\u5831\u3092\u6d88\u53bb', 'X\u00f3a th\u00f4ng tin th\u1ebb')}</button></div>
      <div class="desc">${L('\u30ab\u30fc\u30c9\u60c5\u5831\u306f\u3053\u306eiPhone\u306eSafari\u5185\uff08\u3053\u306e\u30b5\u30a4\u30c8\uff09\u306b\u3060\u3051\u4fdd\u5b58\u3055\u308c\u3001\u8cfc\u5165\u753b\u9762\u306e\u5165\u529b\u6b04\u306b\u3060\u3051\u6e21\u3057\u307e\u3059\u3002', 'Th\u00f4ng tin th\u1ebb ch\u1ec9 l\u01b0u trong Safari c\u1ee7a m\u00e1y n\u00e0y (trang n\u00e0y), ch\u1ec9 chuy\u1ec3n v\u00e0o \u00f4 nh\u1eadp c\u1ee7a trang thanh to\u00e1n.')}</div>
    </div>
    <b style="display:block;margin-top:8px">${L('\u81ea\u5206\u306e Discord Webhook\uff08\u4efb\u610f\uff09', 'Webhook Discord ri\u00eang (kh\u00f4ng b\u1eaft bu\u1ed9c)')}</b>
    <div class="r">${fi('uwh', 'https://discord.com/api/webhooks/\u2026', 'autocomplete="off"')}<button id="sxbi_uwht">${L('\u30c6\u30b9\u30c8', 'Th\u1eed')}</button></div>
    <div class="desc">${L('購入成功通知は右下の「通知」から設定してください。この旧欄は使用しません。', 'Mua th\u00e0nh c\u00f4ng s\u1ebd b\u00e1o c\u1ea3 k\u00eanh SYNOVAJOY l\u1eabn webhook ri\u00eang c\u1ee7a b\u1ea1n.')}</div>
    <b style="display:block;margin-top:8px">${L('\u60c5\u5831\u306e\u30b3\u30d4\u30fc / \u8cbc\u308a\u4ed8\u3051\uff08\u4ed6\u306e\u5e97\u8217\u3078\uff09', 'Sao ch\u00e9p / d\u00e1n th\u00f4ng tin (sang shop kh\u00e1c)')}</b>
    <div class="r"><button id="sxbi_copy">\ud83d\udccb ${L('\u30b3\u30d4\u30fc', 'Sao ch\u00e9p')}</button><button id="sxbi_paste">\ud83d\udce5 ${L('\u8cbc\u308a\u4ed8\u3051', 'D\u00e1n')}</button></div>
    <label class="ck"><input type="checkbox" id="sxbi_wcard">${L('\u30ab\u30fc\u30c9\u60c5\u5831\u3082\u542b\u3081\u308b', 'K\u00e8m th\u00f4ng tin th\u1ebb')}</label>
    <div class="desc" id="sxbi_cmsg">${L('\u914d\u9001\u5148\u30fbWebhook\u30fb\u652f\u6255\u3044\u65b9\u6cd5\u3092\u30b3\u30d4\u30fc \u2192 \u4ed6\u306e\u5e97\u8217\u306eBOT\u3067\u300c\u8cbc\u308a\u4ed8\u3051\u300d\u3002', 'Ch\u00e9p \u0111\u1ecba ch\u1ec9, webhook, c\u00e1ch thanh to\u00e1n \u2192 m\u1edf BOT \u1edf shop kh\u00e1c b\u1ea5m "D\u00e1n".')}</div>
    <div class="desc">${L('BOT\u304c\u30ab\u30fc\u30c8\u306b\u5165\u308c\u305f\u6ce8\u6587\u306f\u3001\u8cfc\u5165\u753b\u9762\u3067\u81ea\u52d5\u5165\u529b\u3057\u3066\u6700\u5f8c\u306e\u30dc\u30bf\u30f3\u307e\u3067\u81ea\u52d5\u3067\u62bc\u3057\u307e\u3059\uff08\u5b9f\u969b\u306b\u8cfc\u5165\u3055\u308c\u307e\u3059\uff09\u3002', '\u0110\u01a1n BOT cho v\u00e0o gi\u1ecf: BOT t\u1ef1 \u0111i\u1ec1n trang thanh to\u00e1n v\u00e0 t\u1ef1 b\u1ea5m n\u00fat \u0111\u1eb7t h\u00e0ng cu\u1ed1i c\u00f9ng (mua th\u1eadt).')}</div>
  </div>`;
  const BUY_KEYS = ['last', 'first', 'email', 'phone', 'zip', 'pref', 'city', 'addr1', 'addr2', 'pay', 'cnum', 'cexp', 'ccvv', 'cname', 'uwh', 'klast', 'kfirst', 'kstore'];
  const CARD_KEYS = ['cnum', 'cexp', 'ccvv', 'cname'];
  function readBuy() {
    for (const k of BUY_KEYS) buyCfg[k] = $('sxbi_' + k).value.trim();
    buyCfg.fill = true; buyCfg.auto = true;
    $('sxbcard').style.display = (buyCfg.pay || 'card') === 'card' ? '' : 'none';
    if (IS_SHOPIFY) $('sxbkstore').style.display = buyCfg.pay === 'konbini' ? '' : 'none';
    save(K_BUY, buyCfg);
    if (IS_SHOPIFY) gmSet('sxb_komoju_info', komojuInfo(buyCfg));
  }
  box.innerHTML = `
<style>
#sxbbox,#sxbbox *{box-sizing:border-box;line-height:1.35;text-transform:none;letter-spacing:normal}
#sxbbox button{width:auto;height:auto;min-height:0;min-width:0;max-width:none;display:inline-block;text-align:center;cursor:pointer}
#sxbbox input,#sxbbox select{height:auto;min-height:0;max-width:none;width:auto;display:block}
#sxbbox img{max-width:100%;border:0}
#sxbbox{position:fixed;left:8px;right:8px;z-index:2147483647;background:#0d1b32;color:#f2f2f2;border:1px solid #527198;border-radius:16px;
  box-shadow:0 6px 24px #000c;padding:10px 12px;font:13px -apple-system,"Hiragino Sans",sans-serif;text-align:left;letter-spacing:0;text-transform:none}
#sxbbox.top{top:calc(env(safe-area-inset-top) + 6px)} #sxbbox.bot{bottom:calc(env(safe-area-inset-bottom) + 10px)}
#sxbbox .hd{display:flex;gap:6px;align-items:center;font-weight:700}
#sxbbox .hd button{padding:6px 7px;font-size:12px;white-space:nowrap;flex:none}
#sxbbox .ttl{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
#sxbbox .ver{font-size:10px;font-weight:600;color:#b7c8df;letter-spacing:.5px;margin-top:1px;line-height:1}
#sxbbox button{border:1px solid #527198;background:#203a5d;color:#ffffff;border-radius:10px;padding:7px 10px;font-size:13px;font-weight:700;text-shadow:none;box-shadow:none;margin:0}
#sxbbox .btns{flex-wrap:wrap} #sxbbox .btns button{flex:1;white-space:nowrap} #sxbbox .btns button.main{flex:1 1 100%}
#sxbbox button.main{font-size:14px;padding:9px 10px;background:linear-gradient(180deg,#e8f0fc,#ffffff);color:#10213b;border:0;box-shadow:0 2px 10px #ffffff40}
#sxbbox .r{display:flex;gap:6px;margin-top:6px;align-items:center}
#sxbbox input{flex:1;min-width:0;font-size:16px;padding:6px 8px;border:1px solid #527198;border-radius:8px;background:#162a46;color:#fff;margin:0;height:auto}
#sxbbox input.sz{flex:0 0 64px} #sxbbox .kw{border-top:1px solid #1f1d24;margin-top:6px} #sxbbox .kw .r{margin-top:4px}
#sxbbox .sec{border:1px solid #385573;border-radius:10px;padding:4px 8px 8px;margin-top:8px} #sxbbox .sec b{color:#ffffff;font-size:12px}
#sxbbox label.ck{display:flex;gap:8px;align-items:center;margin-top:6px;font-size:13px} #sxbbox label.ck input{flex:none;width:20px;height:20px;padding:0;border:0;background:none;-webkit-appearance:checkbox;appearance:auto;accent-color:#ffffff}
#sxbbox input::placeholder{color:#a9bed8}
#sxbbox input:focus,#sxbbox select:focus{outline:none;border-color:#ffffff;box-shadow:0 0 0 2px #ffffff40}
#sxbbox select{-webkit-appearance:none;appearance:none;font-size:16px;padding:6px 22px 6px 10px;border-radius:8px;background:#162a46 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='2' fill='none'/%3E%3C/svg%3E") no-repeat right 7px center;color:#fff;border:1px solid #527198;font-weight:700;margin:0;height:auto}
#sxbbox input[type=time]{flex:0 0 auto;width:110px;color-scheme:dark}
#sxbbox .lb{width:34px;font-size:11px;color:#ffffff;font-weight:700;flex:none}
#sxbbox .desc{font-size:12px;color:#c2d1e5;margin-top:4px} #sxbbox .st{font-size:12px;color:#ffffff;font-weight:700;margin-top:3px}
#sxbbox .body{max-height:calc(100vh - 160px);overflow-y:auto;-webkit-overflow-scrolling:touch}
#sxbbox button:disabled{opacity:.35}
#sxbbox button,#sxbbox input,#sxbbox select{font-family:-apple-system,"Hiragino Sans",sans-serif}
#sxblog{display:block;max-height:220px;overflow:auto;white-space:pre-wrap;font:11px ui-monospace,monospace;background:#10213b;color:#cfdeef;border:1px solid #385573;border-radius:8px;padding:6px;margin-top:6px}
</style>
<div class="hd">${ICON_TAG}<b class="ttl">${TITLE_TAG}<span class="ver">${SHOP} \u00b7 v${SYNOVA_VERSION}</span></b><button id="sxbpos">${L('\u4e0a\u4e0b', 'L\u00ean/Xu\u1ed1ng')}</button><button id="sxbhide">${L('\u96a0\u3059', '\u1ea8n')}</button></div>
<div class="st" id="sxbst">${st.active ? L('\u5f85\u6a5f\u4e2d', '\u0110ang ch\u1edd') : L('\u505c\u6b62\u4e2d', '\u0110ang t\u1eaft')}</div>
<div class="body">
  <div class="desc">${DESC}</div>${UZURA_CURRENT ? `<div class="desc">対応店舗: ${SHOP} ／ 商品取得形式を確認済み・実購入は未検証</div>` : ''}
  <div class="r"><span class="lb">\u23f0</span><input type="time" id="sxbopen"><span class="desc" style="margin:0">${L('\u8ca9\u58f2\u958b\u59cb\uff08\u65e5\u672c\u6642\u9593\uff09', 'Gi\u1edd m\u1edf b\u00e1n (gi\u1edd Nh\u1eadt)')}</span></div>
  ${Array.from({ length: MAX_KW }, (_, i) => `<div class="kw" id="sxbr${i}"><div class="r"><span class="lb">KW${i + 1}</span><input id="sxbk${i}" placeholder="${IS_SUP ? L('\u4f8b: polartec jacket', 'VD: polartec jacket') : L('\u4f8b: tee', 'VD: tee')}"></div>` +
    `<div class="r"><span class="lb"></span><input id="sxbc${i}" placeholder="${L('\u8272\uff08\u4f8b: black\uff09', 'M\u00e0u (VD: black)')}"><input class="sz" id="sxbs${i}" placeholder="${L('\u30b5\u30a4\u30ba', 'Size')}">${qtySel('sxbq' + i)}</div></div>`).join('')}
  <div class="r"><button id="sxbadd">\uff0b ${L('\u30ad\u30fc\u30ef\u30fc\u30c9\u8ffd\u52a0', 'Th\u00eam t\u1eeb kh\u00f3a')}</button><button id="sxbdel">\uff0d</button><span class="desc" id="sxbcnt" style="margin:0"></span></div>
  <div class="desc">${L('\u30ad\u30fc\u30ef\u30fc\u30c9: \u5546\u54c1\u540d\u306e\u4e00\u90e8\u3067OK\uff08\u4f8b: faux fur / polartec jacket\uff09\u3002\u8272\u30fb\u30b5\u30a4\u30ba:\u300cblack,white\u300d\u300cM,L\u300d= \u512a\u5148\u9806\u3001\u7a7a\u6b04 = \u5728\u5eab\u306e\u3042\u308b\u3082\u306e',
    'T\u1eeb kh\u00f3a: ch\u1ec9 c\u1ea7n 1 ph\u1ea7n t\u00ean (VD faux fur / polartec jacket). M\u00e0u / Size: "black,white" "M,L" = \u01b0u ti\u00ean theo th\u1ee9 t\u1ef1, \u0111\u1ec3 tr\u1ed1ng = c\u00e1i n\u00e0o c\u00f2n c\u0169ng mua')}<br>${IS_SHOPIFY
      ? L('\u30d0\u30ea\u30a2\u30f3\u30c8ID\uff08\u6570\u5b57\u306e\u307f \u4f8b 42728889876830\uff09\u3092\u5165\u308c\u308b\u3068\u3001\u305d\u306e\u5546\u54c1\u30fb\u30b5\u30a4\u30ba\u3092\u76f4\u63a5\u8cfc\u5165\u3057\u307e\u3059\u3002', 'Nh\u1eadp variant ID (ch\u1ec9 s\u1ed1, VD 42728889876830) = mua th\u1eb3ng \u0111\u00fang m\u00f3n + size \u0111\u00f3.')
      : L('\u5546\u54c1\u30b3\u30fc\u30c9\uff08\u4f8b BF31TE050BK903\uff09\u3092\u5165\u308c\u308b\u3068\u3001\u305d\u306e\u30b3\u30fc\u30c9\u3092\u76f4\u63a5\u8cfc\u5165\u3057\u307e\u3059\u3002', 'Nh\u1eadp m\u00e3 h\u00e0ng (VD BF31TE050BK903) = mua th\u1eb3ng \u0111\u00fang m\u00e3 \u0111\u00f3.')}</div>
  ${BUY_HTML}
  <div class="r btns"><button class="main" id="sxbgo">${goLabel(cfg.open)}</button><button id="sxbnow">${L('\u3059\u3050\u5b9f\u884c', 'Ch\u1ea1y Ngay')}</button><button id="sxbstop">${L('\u505c\u6b62', 'D\u1eebng')}</button><button id="sxblogb">${L('\u30ed\u30b0\u3092\u898b\u308b', 'Xem Log')}</button></div>
  <div id="sxblogw" style="display:none"><div class="r"><button id="sxbclr">${L('\u30ed\u30b0\u6d88\u53bb', 'X\u00f3a log')}</button><button id="sxbcopy">${L('\u30ed\u30b0\u3092\u30b3\u30d4\u30fc', 'Sao ch\u00e9p log')}</button><span class="desc" id="sxblogn" style="margin:0"></span></div><div id="sxblog"></div></div>
</div>`;
  const sxHost = document.createElement('div');
  sxHost.id = 'sxbhost';
  // all:initial: ch\u1eb7n c\u1ea3 thu\u1ed9c t\u00ednh k\u1ebf th\u1eeba (font, letter-spacing, text-transform\u2026) c\u1ee7a trang l\u1ecdt v\u00e0o khung
  sxHost.style.cssText = 'all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0';
  sxRoot = sxHost.attachShadow({ mode: 'open' });
  sxRoot.appendChild(box);
  document.body.appendChild(sxHost);
  const bub = synovaBubble('sxbbub', () => { ui.hide = false; apply(); });
  const apply = () => {
    box.className = ui.top ? 'top' : 'bot';
    box.style.display = ui.hide ? 'none' : '';
    if (ui.hide) bub.show(ui.top, st.active); else bub.hide();
    save(K_UI, ui);
  };
  apply();
  for (let i = 0; i < MAX_KW; i++) { $('sxbk' + i).value = cfg.items[i].kw; $('sxbc' + i).value = cfg.items[i].color || ''; $('sxbs' + i).value = cfg.items[i].size || ''; $('sxbq' + i).value = String(Math.min(MAX_QTY, cfg.items[i].qty || 1)); }
  const showRows = () => {
    for (let i = 0; i < MAX_KW; i++) $('sxbr' + i).style.display = i < cfg.kwCount ? '' : 'none';
    $('sxbcnt').textContent = `${cfg.kwCount}/${MAX_KW}`;
    $('sxbadd').disabled = cfg.kwCount >= MAX_KW;
    $('sxbdel').disabled = cfg.kwCount <= 1;
  };
  showRows();
  $('sxbadd').onclick = () => { if (cfg.kwCount < MAX_KW) { cfg.kwCount++; save(K_CFG, cfg); showRows(); $('sxbk' + (cfg.kwCount - 1)).focus(); } };
  $('sxbdel').onclick = () => {
    if (cfg.kwCount <= 1) return;
    cfg.kwCount--;
    $('sxbk' + cfg.kwCount).value = ''; $('sxbc' + cfg.kwCount).value = ''; $('sxbs' + cfg.kwCount).value = ''; $('sxbq' + cfg.kwCount).value = '1';
    readCfg(); showRows();
  };
  $('sxbopen').value = cfg.open || '';
  // \u0111\u1ed5i ch\u1eef n\u00fat khi g\u00f5 gi\u1edd ('input', kh\u00f4ng d\u00f9ng 'change' \u2013 Safari b\u1ecf m\u1ea5t c\u00fa b\u1ea5m khi \u00f4 m\u1ea5t focus)
  $('sxbopen').addEventListener('input', () => { const t = goLabel($('sxbopen').value); if ($('sxbgo').textContent !== t) $('sxbgo').textContent = t; });
  {
    for (const k of BUY_KEYS) $('sxbi_' + k).value = buyCfg[k] || (k === 'pay' ? 'card' : '');
    buyCfg.fill = true; buyCfg.auto = true; save(K_BUY, buyCfg);
    if (!$('sxbi_pay').value) $('sxbi_pay').value = 'card';      // shop kh\u00f4ng c\u00f3 c\u00e1ch \u0111\u00e3 l\u01b0u (VD \u4ee3\u5f15\u304d \u1edf HUMAN MADE) -> th\u1ebb
    $('sxbcard').style.display = ($('sxbi_pay').value || 'card') === 'card' ? '' : 'none';
    if (!$('sxbi_kstore').value) $('sxbi_kstore').value = 'seven';
    if (IS_SHOPIFY) $('sxbkstore').style.display = $('sxbi_pay').value === 'konbini' ? '' : 'none';
    // ---- sao ch\u00e9p / d\u00e1n: m\u00e3 d\u1ea1ng SYNOVA1:<base64 JSON> (Safari m\u1ed7i shop l\u01b0u ri\u00eang, \u0111\u00e2y l\u00e0 c\u00e1ch chuy\u1ec3n sang shop kh\u00e1c) ----
    const cmsg = (m) => { $('sxbi_cmsg').textContent = m; };
    $('sxbi_copy').onclick = () => {
      readBuy();
      const o = {};
      for (const k of BUY_KEYS) if (buyCfg[k] && ($('sxbi_wcard').checked || !CARD_KEYS.includes(k))) o[k] = buyCfg[k];
      const code = 'SYNOVA1:' + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
      const ok = () => cmsg(L('\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f \u2192 \u4ed6\u306e\u5e97\u8217\u3067\u300c\u8cbc\u308a\u4ed8\u3051\u300d', '\u0110\u00e3 ch\u00e9p \u2192 sang shop kh\u00e1c b\u1ea5m "D\u00e1n"') + ($('sxbi_wcard').checked ? L('\uff08\u30ab\u30fc\u30c9\u60c5\u5831\u5165\u308a\uff1a\u8cbc\u308a\u4ed8\u3051\u5f8c\u306f\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u3092\u4e0a\u66f8\u304d\u3057\u3066\u304f\u3060\u3055\u3044\uff09', ' (c\u00f3 th\u1ebb: d\u00e1n xong n\u00ean ch\u00e9p th\u1ee9 kh\u00e1c \u0111\u00e8 l\u00ean)') : ''));
      const old = () => { const t = document.createElement('textarea'); t.value = code; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;opacity:0';
        document.body.appendChild(t); t.select(); t.setSelectionRange(0, code.length); try { document.execCommand('copy'); ok(); } catch (e) {} t.remove(); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, old); else old();
    };
    function applyCode(txt) {
      const m = (txt || '').trim().match(/SYNOVA1:([A-Za-z0-9+/=]+)/);
      if (!m) { cmsg(L('\u30b3\u30fc\u30c9\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093', 'Kh\u00f4ng th\u1ea5y m\u00e3 th\u00f4ng tin')); return; }
      let o;
      try { o = JSON.parse(decodeURIComponent(escape(atob(m[1])))); } catch (e) { cmsg(L('\u30b3\u30fc\u30c9\u304c\u58ca\u308c\u3066\u3044\u307e\u3059', 'M\u00e3 b\u1ecb l\u1ed7i')); return; }
      let n = 0;
      for (const k of BUY_KEYS) if (o[k] != null && $('sxbi_' + k)) { $('sxbi_' + k).value = o[k]; n++; }
      if (!$('sxbi_pay').value) $('sxbi_pay').value = 'card';
      for (const k of ['cexp', 'cnum']) $('sxbi_' + k).dispatchEvent(new Event('input'));
      readBuy();
      cmsg(L(`${n}\u9805\u76ee\u3092\u8cbc\u308a\u4ed8\u3051\u307e\u3057\u305f`, `\u0110\u00e3 d\u00e1n ${n} m\u1ee5c`) + (CARD_KEYS.some((k) => o[k]) ? L('\uff08\u30ab\u30fc\u30c9\u60c5\u5831\u3042\u308a\uff09', ' (c\u00f3 th\u1ebb)') : ''));
    }
    $('sxbi_paste').onclick = () => {
      const manual = () => applyCode(prompt(L('\u30b3\u30d4\u30fc\u3057\u305f\u30b3\u30fc\u30c9\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044', 'D\u00e1n m\u00e3 \u0111\u00e3 sao ch\u00e9p v\u00e0o \u0111\u00e2y')) || '');
      if (navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then((t) => (/SYNOVA1:/.test(t) ? applyCode(t) : manual()), manual); else manual();
    };
    $('sxbi_uwht').onclick = () => {
      readBuy();
      if (!HOOK_RE.test(buyCfg.uwh || '')) { cmsg(L('Webhook URL \u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093', 'URL webhook kh\u00f4ng \u0111\u00fang')); return; }
      synovaPost(buyCfg.uwh, [{ author: '\ud83d\udd14 Webhook Test', title: SHOP, url: location.origin, color: 0xe0a63a, fields: [['Site', HOST, false]] }]);
      cmsg(L('\u30c6\u30b9\u30c8\u9001\u4fe1\u3057\u307e\u3057\u305f\uff08Discord\u3092\u78ba\u8a8d\uff09', '\u0110\u00e3 g\u1eedi th\u1eed (xem Discord)'));
    };
    $('sxbbuyb').onclick = () => { const w = $('sxbbuy'); w.style.display = w.style.display === 'block' ? 'none' : 'block'; };
    // b\u00e0n ph\u00edm s\u1ed1 c\u1ee7a iPhone kh\u00f4ng c\u00f3 d\u1ea5u "/" -> g\u00f5 0330 t\u1ef1 th\u00e0nh 03/30 ; s\u1ed1 th\u1ebb t\u1ef1 c\u00e1ch 4 s\u1ed1 cho d\u1ec5 \u0111\u1ecdc
    $('sxbi_cexp').addEventListener('input', (e) => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 4);
      const v = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      if (e.target.value !== v) e.target.value = v;
    });
    $('sxbi_cnum').addEventListener('input', (e) => {
      const v = e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
      if (e.target.value !== v) e.target.value = v;
    });
    for (const k of ['cexp', 'cnum']) $('sxbi_' + k).dispatchEvent(new Event('input'));   // gi\u00e1 tr\u1ecb \u0111\u00e3 l\u01b0u (VD 0330) hi\u1ec7n l\u1ea1i d\u1ea1ng 03/30
    $('sxbi_cclr').onclick = () => { for (const k of ['cnum', 'cexp', 'ccvv', 'cname']) $('sxbi_' + k).value = ''; readBuy(); log(L('\u30ab\u30fc\u30c9\u60c5\u5831\u3092\u6d88\u53bb\u3057\u307e\u3057\u305f', '\u0110\u00e3 x\u00f3a th\u00f4ng tin th\u1ebb')); };
    $('sxbbuy').querySelectorAll('input,select').forEach((e) => e.addEventListener('change', readBuy));
  }
  box.querySelectorAll('input,select').forEach((e) => { if (!e.id.startsWith('sxbi_')) e.addEventListener('change', readCfg); });
  $('sxbpos').onclick = () => { ui.top = !ui.top; apply(); };
  $('sxbhide').onclick = () => { ui.hide = true; apply(); };
  setInterval(() => { if (ui.hide) bub.show(ui.top, st.active); }, 1000);
  $('sxbgo').onclick = () => { if (!st.active) start(false); };
  $('sxbnow').onclick = () => {
    if (!st.active) { start(true); return; }
    if (!st.now) { readCfg(); st.now = true; save(K_ST, st); log(L('\u5f85\u6a5f\u3092\u3084\u3081\u3066\u4eca\u3059\u3050\u76e3\u8996', 'B\u1ecf ch\u1edd gi\u1edd \u2013 canh h\u00e0ng ngay')); }
  };
  $('sxbstop').onclick = () => { stopAutoBuy(); finish(L('\u505c\u6b62\u3057\u307e\u3057\u305f\uff08\u81ea\u52d5\u8cfc\u5165\u3082\u505c\u6b62\uff09', '\u0110\u00e3 d\u1eebng (t\u1eaft c\u1ea3 t\u1ef1 mua \u1edf trang thanh to\u00e1n)')); };
  $('sxblogb').onclick = () => {
    const w = $('sxblogw'); w.style.display = w.style.display === 'block' ? 'none' : 'block';
    $('sxblog').textContent = logBuf.join('\n'); $('sxblogn').textContent = logCount();
  };
  $('sxbcopy').onclick = () => {
    const txt = logBuf.join('\n'), b = $('sxbcopy'), ok = () => { b.textContent = L('\u30b3\u30d4\u30fc\u6e08\u307f \u2713', '\u0110\u00e3 ch\u00e9p \u2713'); setTimeout(() => { b.textContent = L('\u30ed\u30b0\u3092\u30b3\u30d4\u30fc', 'Sao ch\u00e9p log'); }, 1500); };
    const old = () => { const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;opacity:0';
      document.body.appendChild(t); t.select(); t.setSelectionRange(0, txt.length); try { document.execCommand('copy'); ok(); } catch (e) {} t.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, old); else old();
  };
  $('sxbclr').onclick = () => { logBuf = []; logFlush(); $('sxblog').textContent = ''; $('sxblogn').textContent = L('0\u884c', '0 d\u00f2ng'); };

  // CAPTCHA hi\u1ec7n ra (kh\u1ed1i sxbCaptchaYield b\u00e1o): \u0111\u00f3ng ph\u1ea7n c\u00e0i \u0111\u1eb7t + thu g\u1ecdn b\u1ea3ng cho kh\u1ecfi che; gi\u1ea3i xong m\u1edf l\u1ea1i nh\u01b0 c\u0169
  let capPrev = null;
  window.addEventListener('sxb-captcha', (e) => {
    const body = box.querySelector('.body');
    if (e.detail) {
      if (capPrev) return;
      capPrev = { body: body.style.display, buy: $('sxbbuy').style.display, logw: $('sxblogw').style.display };
      $('sxbbuy').style.display = 'none'; $('sxblogw').style.display = 'none'; body.style.display = 'none';
      log(L('CAPTCHA \u304c\u51fa\u305f\u306e\u3067\u8a2d\u5b9a\u3092\u9589\u3058\u307e\u3057\u305f\uff08\u89e3\u304d\u7d42\u308f\u308b\u307e\u3067\u3088\u3051\u3066\u3044\u307e\u3059\uff09', 'C\u00f3 CAPTCHA \u2192 \u0111\u00e3 \u0111\u00f3ng c\u00e0i \u0111\u1eb7t, BOT tr\u00e1nh ch\u1ed7 t\u1edbi khi b\u1ea1n gi\u1ea3i xong'));
    } else if (capPrev) {
      body.style.display = capPrev.body; $('sxbbuy').style.display = capPrev.buy; $('sxblogw').style.display = capPrev.logw; capPrev = null;
      log(L('CAPTCHA \u304c\u6d88\u3048\u305f\u306e\u3067\u30d1\u30cd\u30eb\u3092\u623b\u3057\u307e\u3057\u305f', 'CAPTCHA \u0111\u00e3 xong \u2192 tr\u1ea3 b\u1ea3ng BOT v\u1ec1 nh\u01b0 c\u0169'));
    }
  });

  if (st.active) run();                         // t\u1ea3i l\u1ea1i trang (Cloudflare / Queue-it) -> ch\u1ea1y ti\u1ebfp
})();

// ===================== Supreme: t\u1ef1 \u0111i\u1ec1n trang thanh to\u00e1n (Shopify checkout) =====================
// \u00d4 \u0111\u1ecba ch\u1ec9 \u1edf trang ch\u00ednh (React: ph\u1ea3i g\u00e1n value b\u1eb1ng setter g\u1ed1c + b\u1eafn input/change, g\u00e1n th\u1eb3ng .value React kh\u00f4ng nh\u1eadn).
// \u00d4 th\u1ebb n\u1eb1m trong khung checkout.pci.shopifyinc.com (kh\u00e1c t\u00ean mi\u1ec1n, kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c localStorage c\u1ee7a Supreme)
// -> g\u1eedi s\u1ed1 th\u1ebb qua postMessage, CH\u1ec8 t\u1edbi \u0111\u00fang t\u00ean mi\u1ec1n \u0111\u00f3; script ch\u1ea1y trong khung t\u1ef1 \u0111i\u1ec1n \u00f4 c\u1ee7a n\u00f3 (xem ph\u1ea7n d\u01b0\u1edbi).
const PCI_ORIGIN = 'https://checkout.pci.shopifyinc.com';
// t\u1eaft t\u1ef1 mua: xo\u00e1 d\u1ea5u "BOT v\u1eeba cho h\u00e0ng v\u00e0o gi\u1ecf" \u1edf shop + kho chung (KOMOJU / shop.app c\u0169ng th\u00f4i t\u1ef1 b\u1ea5m)
function stopAutoBuy() {
  try { localStorage.removeItem(K_LAST); } catch (e) {}
  gmSet('sxb_bot_buy', null);
  gmSet('sxb_komoju_order', null);
}
function synovaBanner(onStop) {
  const host = document.createElement('div');
  host.id = 'sxbbanner';
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;left:0;right:0;bottom:0;height:0';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>.b{position:fixed;left:8px;right:8px;bottom:calc(env(safe-area-inset-bottom) + 8px);display:flex;gap:8px;align-items:center;background:#0d1b32;color:#ffffff;
    border:1px solid #527198;border-radius:12px;padding:7px 8px 7px 10px;font:600 12px -apple-system,"Hiragino Sans",sans-serif;box-shadow:0 4px 16px #000a;box-sizing:border-box}
    .t{flex:1;line-height:1.35} button{flex:none;border:1px solid #6b2a2a;background:#2b1416;color:#ff8a80;border-radius:9px;padding:6px 9px;font:700 12px -apple-system,sans-serif}</style>
    <div class="b"><span class="t" id="t">うずら BOT</span><button id="x">\u23f9 ${L('\u505c\u6b62', 'D\u1eebng')}</button></div>`;
  root.getElementById('x').onclick = () => { onStop(); root.getElementById('x').style.display = 'none'; };
  return {
    say(m) { if (!host.isConnected && document.body) document.body.appendChild(host); root.getElementById('t').textContent = 'うずら BOT \u00b7 ' + m; },
    text: () => root.getElementById('t').textContent,
    remove: () => host.remove(),
    hideStop: () => { root.getElementById('x').style.display = 'none'; },
  };
}
const SHOPIFY_CO = /\/checkouts\/(cn|c|co)?\/?[A-Za-z0-9]/.test(location.pathname) && (IS_SHOPIFY || (() => { try { return !!localStorage.getItem(K_BUY); } catch (e) { return false; } })());
if (!SYNOVA_DUP && !IN_FRAME && !IS_HM && !IS_BUF && SHOPIFY_CO) (function () {
  'use strict';
  let c = {}, last = null;
  try { c = JSON.parse(localStorage.getItem(K_BUY)) || {}; } catch (e) {}
  try { last = JSON.parse(localStorage.getItem(K_LAST)); } catch (e) {}
  const byBot = !!(last && Date.now() - last.at < 10 * 60e3);
  let auto = byBot;                               // t\u1ef1 \u0111\u1eb7t h\u00e0ng khi BOT v\u1eeba cho h\u00e0ng v\u00e0o gi\u1ecf (10 ph\u00fat)
  const exp = (s) => { const d = (s || '').replace(/\D/g, ''); return d.length >= 4 ? d.slice(0, 2) + d.slice(-2) : d; };   // "12/28" "1228" "12/2028" -> 1228
  const PAY = c.pay && PAYS[c.pay] ? c.pay : 'card';
  let expandTried = false, guestTried = false;
  gmSet('sxb_komoju_info', komojuInfo(c));
  let gmOrderSig = '';
  // \u0111\u01a1n kh\u00f4ng qua BOT: l\u01b0u gi\u1ecf \u0111\u1ec3 b\u00e1o Discord \u0111\u1ee7 \u1ea3nh + t\u00ean m\u00f3n (k\u1ec3 c\u1ea3 \u0111\u01a1n \u0111i qua KOMOJU)
  if (!/thank[-_]you/i.test(location.pathname)) saveCartSnap().then((ok) => { if (ok) gmOrderSig = ''; });
  // n\u00fat ch\u1ecdn c\u00e1ch thanh to\u00e1n: id "basic-creditCards" / "basic-\u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08" / "basic-\u9280\u884c\u632f\u8fbc" / "basic-\u30b9\u30de\u30db\u6c7a\u6e08 (QR\u30b3\u30fc\u30c9)" / "basic-paymentOnDelivery"
  const payRadio = () => [...document.querySelectorAll('input[type=radio][name="basic"], input[type=radio][id^="basic-"]')]
    .find((r) => PAYS[PAY][2].test(r.id + ' ' + ((r.labels && r.labels[0] && r.labels[0].innerText) || '')));
  const card = PAY === 'card' && (c.cnum || '').replace(/\D/g, '').length >= 12
    ? { number: c.cnum.replace(/\D/g, ''), expiry: exp(c.cexp), verification_value: (c.ccvv || '').replace(/\D/g, ''), name: c.cname || '' } : null;

  // \u23f9 D\u1eebng ngay tr\u00ean trang thanh to\u00e1n: th\u00f4i t\u1ef1 b\u1ea5m mua (\u0111\u01a1n n\u00e0y + KOMOJU / shop.app)
  const ban = synovaBanner(() => { stopAutoBuy(); auto = false; ban.say(L('\u81ea\u52d5\u8cfc\u5165\u3092\u505c\u6b62\u3057\u307e\u3057\u305f\uff08\u81ea\u5206\u3067\u64cd\u4f5c\u3057\u3066\u304f\u3060\u3055\u3044\uff09', '\u0110\u00e3 d\u1eebng t\u1ef1 mua \u2013 b\u1ea1n t\u1ef1 thao t\u00e1c')); });
  const bn = { remove: () => ban.remove() };
  const say = (m) => ban.say(m);
  if (!auto) ban.hideStop();

  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const q = (sel) => [...document.querySelectorAll(sel)].find((e) => !/^autofill/.test(e.id) && vis(e));
  function setVal(el, v) {
    const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }
  // m\u1ecdi \u00f4 t\u00edch \u0111\u1ed3ng \u00fd \u0111ang hi\u1ec7n c\u1ee7a Supreme (id japan-\u2026-confirmation); kh\u00f4ng \u0111\u1ee5ng \u00f4 "l\u01b0u th\u00f4ng tin" / nh\u1eadn tin
  const confirms = () => [...document.querySelectorAll('input[type=checkbox][id^="japan-"][id$="-confirmation"]')].filter((b) => vis(b) || (b.labels && b.labels[0] && vis(b.labels[0])));
  const FIELDS = [['email', 'email'], ['lastName', 'last'], ['firstName', 'first'], ['postalCode', 'zip'], ['city', 'city'], ['address1', 'addr1'], ['address2', 'addr2'], ['phone', 'phone']];
  const cardOk = {};
  window.addEventListener('message', (e) => {
    if (e.origin !== PCI_ORIGIN || !e.data || !card) return;
    if (e.data.synova === 'pci-ready') e.source.postMessage({ synova: 'card', card }, PCI_ORIGIN);
    if (e.data.synova === 'pci-filled') cardOk[e.data.field] = true;
  });
  let lastSend = 0, clicks = 0, lastClick = 0;
  const t0 = Date.now();
  const timer = setInterval(() => {
    const now = Date.now();
    if (auto && !localStorage.getItem(K_LAST)) { auto = false; ban.hideStop(); }   // \u0111\u00e3 b\u1ea5m D\u1eebng \u1edf khung BOT
    if (now - t0 > 180e3 || /thank[-_]you|processing/i.test(location.pathname)) { clearInterval(timer); bn.remove(); return; }
    {
      for (const [name, k] of FIELDS) { const el = q(`input[name="${name}"]`); if (el && c[k] && !el.value) setVal(el, c[k]); }
      const zone = q('select[name="zone"]');
      if (zone && c.pref && !zone.value) setVal(zone, 'JP-' + String(c.pref).padStart(2, '0'));
      const r = payRadio();
      if (r && !r.checked) r.click();
      if (card && now - lastSend > 1000) {          // khung th\u1ebb c\u00f3 th\u1ec3 t\u1ea3i sau / b\u1ecb d\u1ef1ng l\u1ea1i -> g\u1eedi l\u1ea1i m\u1ed7i gi\u00e2y t\u1edbi khi \u0111i\u1ec1n xong
        lastSend = now;
        document.querySelectorAll('iframe[src^="' + PCI_ORIGIN + '"]').forEach((f) => { try { f.contentWindow.postMessage({ synova: 'card', card }, PCI_ORIGIN); } catch (e) {} });
      }
      // \u00f4 \u0111\u1ed3ng \u00fd: japan-terms-confirmation (\u0111i\u1ec1u kho\u1ea3n) + japan-cod-confirmation (ph\u00ed \u4ee3\u5f15\u304d, ch\u1ec9 hi\u1ec7n khi ch\u1ecdn \u4ee3\u91d1\u5f15\u63db) \u2026
      for (const b of confirms()) if (!b.checked) b.click();
    }
    // s\u1eb5n s\u00e0ng: \u00f4 b\u1eaft bu\u1ed9c c\u00f3 ch\u1eef, \u0111\u00e3 ch\u1ecdn t\u1ec9nh, \u0111\u00e3 t\u00edch m\u1ecdi \u00f4 \u0111\u1ed3ng \u00fd, \u0111\u00fang c\u00e1ch thanh to\u00e1n, th\u1ebb \u0111\u00e3 \u0111i\u1ec1n (ho\u1eb7c \u4ee3\u91d1\u5f15\u63db / th\u1ebb \u0111\u00e3 l\u01b0u)
    const need = ['email', 'lastName', 'firstName', 'postalCode', 'city', 'address1', 'phone'].map((n) => q(`input[name="${n}"]`)).filter(Boolean);
    const zone = q('select[name="zone"]');
    const pciFrames = [...document.querySelectorAll('iframe[src^="' + PCI_ORIGIN + '"]')].filter(vis);
    const cardReady = PAY !== 'card' || !pciFrames.length || (cardOk.number && cardOk.expiry && cardOk.verification_value);
    const missing = need.filter((e) => !e.value).map((e) => e.name);
    if (zone && !zone.value) missing.push('zone');
    if (confirms().some((b) => !b.checked)) missing.push(L('\u540c\u610f\u30c1\u30a7\u30c3\u30af', '\u00f4 \u0111\u1ed3ng \u00fd'));
    // CH\u1ed0T AN TO\u00c0N: ch\u1ec9 b\u1ea5m khi TH\u1ea4Y \u0111\u00fang c\u00e1ch thanh to\u00e1n \u0111\u00e3 c\u00e0i \u0111ang \u0111\u01b0\u1ee3c ch\u1ecdn.
    // T\u00e0i kho\u1ea3n Shop \u0111\u00e3 l\u01b0u th\u1ebb / \u0111\u1ecba ch\u1ec9: trang r\u00fat g\u1ecdn "\u304a\u652f\u6255\u3044 Visa \u00b7\u00b7\u00b7\u00b7 4423", kh\u00f4ng c\u00f3 n\u00fat ch\u1ecdn c\u00e1ch thanh to\u00e1n
    // -> tr\u01b0\u1edbc \u0111\u00e2y BOT v\u1eabn b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046 = tr\u1ea3 b\u1eb1ng th\u1ebb \u0111\u00e3 l\u01b0u d\u00f9 c\u00e0i \u30b3\u30f3\u30d3\u30cb (user b\u00e1o). Gi\u1edd: th\u1eed m\u1edf m\u1ee5c \u304a\u652f\u6255\u3044;
    // v\u1eabn kh\u00f4ng th\u1ea5y th\u00ec KH\u00d4NG b\u1ea5m. Ri\u00eang "th\u1ebb": kh\u00f4ng c\u00f3 n\u00fat ch\u1ecdn nh\u01b0ng c\u00f3 \u00f4 nh\u1eadp th\u1ebb (shop ch\u1ec9 nh\u1eadn th\u1ebb) th\u00ec v\u1eabn \u0111\u01b0\u1ee3c.
    const payR = payRadio(), radios = document.querySelectorAll('input[type=radio][name="basic"]').length;
    if (!radios && !expandTried && now - t0 > 1200) {
      expandTried = true;
      const ex = [...document.querySelectorAll('button, [role=button], summary')].find((b) => vis(b) && b.getAttribute('aria-expanded') === 'false' &&
        /^(\u304a\u652f\u6255\u3044|\u652f\u6255\u3044\u65b9\u6cd5|Payment)/i.test((b.innerText || b.getAttribute('aria-label') || '').trim()));
      if (ex) ex.click();
    }
    if (!radios && auto && !guestTried && clickGuest()) { guestTried = true; say(L('\u30b2\u30b9\u30c8\u3068\u3057\u3066\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8\u306b\u5207\u308a\u66ff\u3048\u2026', 'Chuy\u1ec3n sang \u300c\u30b2\u30b9\u30c8\u3068\u3057\u3066\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8\u300d\u2026')); return; }
    const cardFormOnly = PAY === 'card' && !radios && pciFrames.length > 0;
    if (!payR && !cardFormOnly) {
      missing.push(radios ? L(`\u3053\u306e\u5e97\u8217\u306b\u300c${PAYS[PAY][0]}\u300d\u304c\u3042\u308a\u307e\u305b\u3093`, `shop kh\u00f4ng c\u00f3 \u300c${PAYS[PAY][0]}\u300d`)
        : L(`\u4fdd\u5b58\u6e08\u307f\u306e\u652f\u6255\u3044\uff08Shop Pay \u7b49\uff09\u3067\u300c${PAYS[PAY][0]}\u300d\u3092\u9078\u3079\u306a\u3044\u305f\u3081\u81ea\u52d5\u8cfc\u5165\u3057\u307e\u305b\u3093`, `trang \u0111ang d\u00f9ng thanh to\u00e1n \u0111\u00e3 l\u01b0u (Shop Pay\u2026), kh\u00f4ng ch\u1ecdn \u0111\u01b0\u1ee3c \u300c${PAYS[PAY][0]}\u300d \u2192 BOT kh\u00f4ng b\u1ea5m`));
    } else if (payR && !payR.checked) missing.push(L('\u652f\u6255\u3044\u65b9\u6cd5', 'c\u00e1ch thanh to\u00e1n'));
    // c\u00e1ch thanh to\u00e1n \u0111ang ch\u1ecdn tr\u00ean trang -> ghi l\u1ea1i \u0111\u1ec3 b\u00e1o Discord
    const chk = [...document.querySelectorAll('input[type=radio][name="basic"]')].find((x) => x.checked);
    if (chk) { const lb = ((chk.labels && chk.labels[0] && chk.labels[0].innerText) || chk.id.replace(/^basic-/, '')).trim().split('\n')[0].replace(/^credit card$/i, '\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9').replace(/^creditCards$/, '\u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9');
      const em = q('input[name="email"]');
      try { localStorage.setItem('sxb_pay_used', JSON.stringify({ label: lb, email: em ? em.value : '', at: Date.now() })); } catch (e) {}
      const sig = lb + '|' + (em ? em.value : '');
      if (sig !== gmOrderSig) {                      // \u0111\u01a1n \u0111i qua KOMOJU: m\u00f3n + c\u00e1ch thanh to\u00e1n + email \u0111\u1ec3 KOMOJU b\u00e1o Discord \u0111\u1ea7y \u0111\u1ee7
        gmOrderSig = sig;
        gmSet('sxb_komoju_order', { at: Date.now(), shop: HOST, pay: lb, email: em ? em.value : '', items: byBot && last && last.items ? last.items : ((cartSnap() || {}).items || []) });
      } }
    if (!cardReady) missing.push(L('\u30ab\u30fc\u30c9', 'th\u1ebb'));
    if (missing.length) { say(L('\u5165\u529b\u4e2d\u2026 \u672a\u5165\u529b: ', '\u0110ang \u0111i\u1ec1n\u2026 c\u00f2n thi\u1ebfu: ') + missing.join(', ')); return; }
    if (!auto) { say(IS_SUP ? L('\u5165\u529b\u5b8c\u4e86 \u2192\u300c\u8cfc\u5165\u3059\u308b\u300d\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\uff08\u81ea\u52d5\u8cfc\u5165\u30aa\u30d5\uff09', '\u0110\u00e3 \u0111i\u1ec1n xong \u2192 b\u1ea5m \u300c\u8cfc\u5165\u3059\u308b\u300d (t\u1ef1 mua \u0111ang t\u1eaft)') : L('\u5165\u529b\u5b8c\u4e86 \u2192 \u652f\u6255\u3044\u30dc\u30bf\u30f3\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\uff08\u81ea\u52d5\u8cfc\u5165\u30aa\u30d5\uff09', '\u0110\u00e3 \u0111i\u1ec1n xong \u2192 b\u1ea5m n\u00fat thanh to\u00e1n (t\u1ef1 mua \u0111ang t\u1eaft)')); return; }
    if (clicks >= 2 || now - lastClick < 10000) return;   // b\u1ea5m l\u1ea1i ch\u1ec9 khi 10 gi\u00e2y sau n\u00fat v\u1eabn b\u1ea5m \u0111\u01b0\u1ee3c (l\u1ea7n 1 kh\u00f4ng \u0103n)
    const btn = [...document.querySelectorAll('button')].find((b) => vis(b) && !b.disabled && b.getAttribute('aria-disabled') !== 'true' &&
      /^(\u8cfc\u5165\u3059\u308b|\u6ce8\u6587\u3092\u78ba\u5b9a|\u6ce8\u6587\u3092\u5b8c\u4e86|\u4eca\u3059\u3050\u652f\u6255\u3046|Pay now|Complete order)/.test((b.innerText || '').trim()));
    if (!btn) { say(L('\u300c\u8cfc\u5165\u3059\u308b\u300d\u30dc\u30bf\u30f3\u5f85\u3061\u2026', 'Ch\u1edd n\u00fat \u300c\u8cfc\u5165\u3059\u308b\u300d\u2026')); return; }
    clicks++; lastClick = now;
    say(L(`\u300c${(btn.innerText || '').trim().split('\n')[0]}\u300d\u3092\u62bc\u3057\u307e\u3057\u305f (${clicks})`, `\u0110\u00e3 b\u1ea5m \u300c${(btn.innerText || '').trim().split('\n')[0]}\u300d (${clicks})`));
    btn.click();
  }, 150);
})();

// ===================== shop.app (Shop Pay \u0111\u00e3 \u0111\u0103ng nh\u1eadp, th\u1ebb / \u0111\u1ecba ch\u1ec9 l\u01b0u s\u1eb5n) =====================
// \u0110\u01a1n BOT v\u1eeba cho v\u00e0o gi\u1ecf -> b\u1ea5m \u300c\u30b2\u30b9\u30c8\u3068\u3057\u3066\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8\u3057\u307e\u3059\u300d \u0111\u1ec3 v\u1ec1 trang thanh to\u00e1n th\u01b0\u1eddng (\u0111\u1ee7 c\u00e1ch thanh to\u00e1n, BOT ch\u1ecdn
// \u0111\u00fang c\u00e1ch \u0111\u00e3 c\u00e0i). \u0110\u01a1n t\u1ef1 mua (kh\u00f4ng c\u00f3 d\u1ea5u BOT) -> kh\u00f4ng \u0111\u1ee5ng.
const GUEST_RE = /\u30b2\u30b9\u30c8\u3068\u3057\u3066(\u30c1\u30a7\u30c3\u30af\u30a2\u30a6\u30c8|\u8cfc\u5165|\u7d9a\u884c)|check\s*out as (a )?guest|continue as (a )?guest/i;
function clickGuest() {
  const g = [...document.querySelectorAll('a, button, [role=button]')].find((b) => {
    const r = b.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && GUEST_RE.test((b.innerText || b.getAttribute('aria-label') || '').trim());
  });
  if (g) g.click();
  return !!g;
}
if (!SYNOVA_DUP && !IN_FRAME && IS_SHOPAPP) (async function sxbShopApp() {
  // \u0111\u01a1n do BOT Mellojoy m\u1edf (#synova-pay-\u2026): BOT Mellojoy t\u1ef1 b\u1ea5m \u4eca\u3059\u3050\u652f\u6255\u3046 \u1edf \u0111\u00e2y -> kh\u00f4ng b\u1ea5m "\u30b2\u30b9\u30c8" chen v\u00e0o (b\u1ea3n g\u1ed9p ch\u1ea1y c\u1ea3 2)
  let mj = /synova-pay-\d+/.test(location.hash);
  try { mj = mj || !!sessionStorage.getItem('synova_pay'); } catch (e) {}
  if (mj) return;
  const bb = await gmGet('sxb_bot_buy');
  if (!bb || Date.now() - bb.at > 10 * 60e3) return;
  const t0 = Date.now();
  const timer = setInterval(() => {
    if (Date.now() - t0 > 60e3 || clickGuest()) clearInterval(timer);
  }, 250);
})();

// ===================== Khung \u00f4 th\u1ebb c\u1ee7a Shopify (checkout.pci.shopifyinc.com) =====================
// M\u1ed7i \u00f4 th\u1ebb l\u00e0 1 khung ri\u00eang: number-ltr / expiry-ltr / verification_value-ltr / name-ltr. Ch\u1ec9 nh\u1eadn d\u1eef li\u1ec7u t\u1eeb jp.supreme.com.
if (!SYNOVA_DUP && IS_PCI && IN_FRAME) (function () {
  const F = (location.pathname.match(/\/(number|expiry|verification_value|name)-/) || [])[1];
  if (!F) return;
  // g\u00f5 t\u1eebng k\u00fd t\u1ef1 (\u00f4 th\u1ebb t\u1ef1 \u0111\u1ecbnh d\u1ea1ng "1234 5678\u2026" / "MM / YY" theo t\u1eebng l\u1ea7n g\u00f5)
  function type(el, v) {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    el.focus();
    set.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    let cur = '';
    for (const ch of v) {
      cur += ch;
      el.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
      set.call(el, cur);
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: ch }));
      el.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
      cur = el.value;                              // l\u1ea5y l\u1ea1i gi\u00e1 tr\u1ecb \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u1ecbnh d\u1ea1ng
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
  }
  const same = (a, b) => (a || '').replace(/[\s/]/g, '').toLowerCase() === (b || '').replace(/[\s/]/g, '').toLowerCase();
  window.addEventListener('message', (e) => {
    if (!/^https:\/\//.test(e.origin) || !e.data || e.data.synova !== 'card' || !e.data.card) return;
    const v = String(e.data.card[F] || '');
    const el = document.getElementById(F);
    if (!el || !v) return;
    if (!same(el.value, v)) type(el, v);
    if (same(el.value, v) || (F === 'expiry' && el.value.replace(/\D/g, '') === v)) {
      try { e.source.postMessage({ synova: 'pci-filled', field: F }, e.origin); } catch (x) {}
    }
  });
  try { window.top.postMessage({ synova: 'pci-ready', field: F }, '*'); } catch (e) {}   // tin b\u00e1o kh\u00f4ng k\u00e8m d\u1eef li\u1ec7u
})();

// ===================== HUMAN MADE / Buffer: t\u1ef1 \u0111i\u1ec1n trang thanh to\u00e1n Global-e =====================
// Trang /checkout/ c\u1ee7a shop ch\u1ec9 ch\u1ee9a khung Global-e (*.global-e.com): form \u0111\u1ecba ch\u1ec9 \u1edf 1 khung, \u00f4 th\u1ebb \u1edf khung con
// secure-<shop>.global-e.com/payments/\u2026 -> trang ch\u00ednh kh\u00f4ng \u0111\u1ecdc / \u0111i\u1ec1n \u0111\u01b0\u1ee3c. C\u00e1ch l\u00e0m:
//   trang ch\u00ednh h\u1ecfi "ai \u0111\u00f3?" (kh\u00f4ng k\u00e8m d\u1eef li\u1ec7u) -> khung Global-e tr\u1ea3 l\u1eddi -> CH\u1ec8 g\u1eedi d\u1eef li\u1ec7u t\u1edbi \u0111\u00fang khung \u0111\u00e3 tr\u1ea3 l\u1eddi,
//   v\u1edbi targetOrigin = t\u00ean mi\u1ec1n *.global-e.com c\u1ee7a khung \u0111\u00f3; khung t\u1ef1 \u0111i\u1ec1n r\u1ed3i b\u00e1o l\u1ea1i c\u00f2n thi\u1ebfu \u00f4 n\u00e0o / c\u00f3 n\u00fat \u6ce8\u6587\u306e\u78ba\u5b9a kh\u00f4ng.
const GE_ORIGIN = /^https:\/\/[a-z0-9-]+\.global-e\.com$/;
const GE_SHOP = /^https:\/\/(www\.)?(humanmade|buffering)\.jp$/;
if (!SYNOVA_DUP && !IN_FRAME && (IS_HM || IS_BUF) && /\/checkout/i.test(location.pathname)) (function () {
  'use strict';
  let c = {}, last = null;
  try { c = JSON.parse(localStorage.getItem(K_BUY)) || {}; } catch (e) {}
  try { last = JSON.parse(localStorage.getItem(K_LAST)); } catch (e) {}
  const byBot = !!(last && Date.now() - last.at < 10 * 60e3);
  let auto = byBot;
  const zd = (c.zip || '').replace(/\D/g, ''), ed = (c.cexp || '').replace(/\D/g, '');
  const yy = ed.length >= 4 ? ed.slice(-2) : '';
  const data = {
    fill: true,
    addr: { last: c.last, first: c.first, zip: zd.length === 7 ? zd.slice(0, 3) + '-' + zd.slice(3) : c.zip, pref: c.pref ? PREFS[+c.pref - 1] : '',
      city: c.city, addr1: c.addr1, addr2: c.addr2, phone: (c.phone || '').replace(/[^\d+]/g, '') },
    card: (c.cnum || '').replace(/\D/g, '').length >= 12
      ? { number: c.cnum.replace(/\D/g, ''), mm: ed.slice(0, 2), yy, yyyy: yy ? '20' + yy : '', cvv: (c.ccvv || '').replace(/\D/g, ''), name: c.cname || '' } : null,
  };
  // \u23f9 D\u1eebng ngay tr\u00ean trang thanh to\u00e1n: th\u00f4i t\u1ef1 b\u1ea5m mua (\u0111\u01a1n n\u00e0y + KOMOJU / shop.app)
  const ban = synovaBanner(() => { stopAutoBuy(); auto = false; ban.say(L('\u81ea\u52d5\u8cfc\u5165\u3092\u505c\u6b62\u3057\u307e\u3057\u305f\uff08\u81ea\u5206\u3067\u64cd\u4f5c\u3057\u3066\u304f\u3060\u3055\u3044\uff09', '\u0110\u00e3 d\u1eebng t\u1ef1 mua \u2013 b\u1ea1n t\u1ef1 thao t\u00e1c')); });
  const bn = { remove: () => ban.remove() };
  const say = (m) => ban.say(m);
  if (!auto) ban.hideStop();
  const known = new Map();                          // khung Global-e \u0111\u00e3 tr\u1ea3 l\u1eddi -> {origin, st, at}
  window.addEventListener('message', (e) => {
    if (!GE_ORIGIN.test(e.origin) || !e.data || typeof e.data !== 'object' || !e.source) return;
    if (e.data.synova === 'ge-ready') {
      if (!known.has(e.source)) known.set(e.source, { origin: e.origin });
      e.source.postMessage({ synova: 'ge-fill', data }, e.origin);
    }
    if (e.data.synova === 'ge-st') {
      known.set(e.source, { origin: e.origin, st: e.data, at: Date.now() });
      if (e.data.email) geEmail = e.data.email;
      if (e.data.done) geDone(e.data.orderNo || '');
    }
  });
  // \u0111\u1eb7t h\u00e0ng xong (l\u1eddi c\u1ea3m \u01a1n hi\u1ec7n TRONG khung Global-e, \u0111\u1ecba ch\u1ec9 trang c\u00f3 th\u1ec3 kh\u00f4ng \u0111\u1ed5i) -> b\u00e1o Discord 1 l\u1ea7n
  let sent = false;
  let geEmail = '';
  function geDone(orderNo) {
    if (sent) return;
    sent = true;
    try { if (localStorage.getItem('synova_sent_ge_' + (last && last.at))) return; localStorage.setItem('synova_sent_ge_' + (last && last.at), '1'); } catch (e) {}
    synovaNotify(orderEmbeds(last), buyInfo().uwh, [['Email', geEmail || emailUsed()], ['\u6ce8\u6587\u756a\u53f7', orderNo]]);
    try {
      localStorage.removeItem(K_LAST);
      const k = 'sxb_' + SITE_KEY + '_st', v = JSON.parse(localStorage.getItem(k) || '{}');
      v.active = false; v.boughtAt = Date.now(); localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
    say(L('\u6ce8\u6587\u5b8c\u4e86 \u2192 Discord\u306b\u901a\u77e5\u3057\u307e\u3057\u305f', '\u0110\u1eb7t h\u00e0ng xong \u2192 \u0111\u00e3 b\u00e1o Discord'));
  }
  const walk = (w, out) => { for (let i = 0; i < w.frames.length; i++) { out.push(w.frames[i]); walk(w.frames[i], out); } return out; };
  let clicks = 0, lastClick = 0;
  const t0 = Date.now();
  const timer = setInterval(() => {
    const now = Date.now();
    if (auto && !localStorage.getItem(K_LAST)) { auto = false; ban.hideStop(); }   // \u0111\u00e3 b\u1ea5m D\u1eebng \u1edf khung BOT
    if (now - t0 > 300e3 || /order-?confirm|confirmation|thank/i.test(location.href)) { clearInterval(timer); bn.remove(); return; }
    // h\u1ecfi m\u1ecdi khung (c\u1ea3 khung l\u1ed3ng nhau); tin h\u1ecfi kh\u00f4ng k\u00e8m d\u1eef li\u1ec7u n\u00ean g\u1eedi '*' c\u0169ng kh\u00f4ng l\u1ed9 g\u00ec
    for (const w of walk(window, [])) { try { w.postMessage({ synova: 'ge-hello' }, '*'); } catch (e) {} }
    for (const [w, k] of known) { try { w.postMessage({ synova: 'ge-fill', data }, k.origin); } catch (e) { known.delete(w); } }
    const sts = [...known.values()].filter((k) => k.st && now - k.at < 3000).map((k) => k.st);
    if (sent) { clearInterval(timer); return; }
    if (!sts.length) { say(L('\u8cfc\u5165\u753b\u9762\u306e\u8aad\u307f\u8fbc\u307f\u5f85\u3061\u2026', 'Ch\u1edd trang thanh to\u00e1n Global-e t\u1ea3i\u2026')); return; }
    const missing = [...new Set(sts.flatMap((s) => s.missing || []))];
    const cardFilled = sts.some((s) => s.card === 'filled'), cardEmpty = sts.some((s) => s.card === 'empty');
    if (!cardFilled || cardEmpty) missing.push(L('\u30ab\u30fc\u30c9', 'th\u1ebb'));
    if (missing.length) { say(L('\u5165\u529b\u4e2d\u2026 \u672a\u5165\u529b: ', '\u0110ang \u0111i\u1ec1n\u2026 c\u00f2n thi\u1ebfu: ') + missing.join(', ')); return; }
    if (!auto) { say(L('\u5165\u529b\u5b8c\u4e86 \u2192\u300c\u6ce8\u6587\u306e\u78ba\u5b9a\u300d\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\uff08\u81ea\u52d5\u8cfc\u5165\u30aa\u30d5\uff09', '\u0110\u00e3 \u0111i\u1ec1n xong \u2192 b\u1ea5m \u300c\u6ce8\u6587\u306e\u78ba\u5b9a\u300d (t\u1ef1 mua \u0111ang t\u1eaft)')); return; }
    const cf = [...known.entries()].find(([, k]) => k.st && k.st.confirm && now - k.at < 3000);
    if (!cf) { say(L('\u300c\u6ce8\u6587\u306e\u78ba\u5b9a\u300d\u30dc\u30bf\u30f3\u5f85\u3061\u2026', 'Ch\u1edd n\u00fat \u300c\u6ce8\u6587\u306e\u78ba\u5b9a\u300d\u2026')); return; }
    if (clicks >= 2 || now - lastClick < 10000) return;
    clicks++; lastClick = now;
    say(L(`\u300c\u6ce8\u6587\u306e\u78ba\u5b9a\u300d\u3092\u62bc\u3057\u307e\u3057\u305f (${clicks})`, `\u0110\u00e3 b\u1ea5m \u300c\u6ce8\u6587\u306e\u78ba\u5b9a\u300d (${clicks})`));
    cf[0].postMessage({ synova: 'ge-click' }, cf[1].origin);
  }, 250);
})();

// ===================== Khung Global-e (*.global-e.com): \u0111i\u1ec1n form \u0111\u1ecba ch\u1ec9 / \u00f4 th\u1ebb c\u1ee7a ch\u00ednh khung n\u00e0y =====================
if (!SYNOVA_DUP && IN_FRAME && /\.global-e\.com$/.test(HOST)) (function () {
  'use strict';
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const attrs = (e) => [e.id, e.name, e.getAttribute('autocomplete'), e.getAttribute('placeholder'), e.getAttribute('aria-label'), e.getAttribute('data-fieldtype')].join(' ').toLowerCase();
  const CARDISH = /card|cc-|cvv|cvc|cvd|security|expir|\u30ab\u30fc\u30c9|\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3|\u6709\u52b9\u671f\u9650/;
  // ch\u1eef nh\u00e3n c\u1ee7a \u00f4: <label for>, kh\u00f4ng th\u00ec ch\u1eef c\u1ee7a h\u00e0ng ch\u1ee9a \u00f4 (b\u1ecf \u2605 \u203b *)
  function labelOf(e) {
    let t = (e.labels && e.labels[0] && e.labels[0].innerText) || '';
    // kh\u00f4ng c\u00f3 <label>: l\u1ea5y ch\u1eef c\u1ee7a kh\u1ed1i bao g\u1ea7n nh\u1ea5t CH\u1ec8 ch\u1ee9a \u0111\u00fang \u00f4 n\u00e0y (kh\u1ed1i to h\u01a1n s\u1ebd l\u1eabn nh\u00e3n c\u1ee7a \u00f4 kh\u00e1c)
    for (let a = e.parentElement, i = 0; !t && a && i < 4; a = a.parentElement, i++) {
      if (a.querySelectorAll('input:not([type=hidden]), select').length > 1) break;
      t = a.innerText || '';
    }
    return t.replace(/[\u2605\uff0a*\u203b\s]/g, '');
  }
  const boxes = () => [...document.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]):not([type=submit]):not([type=button]), select')].filter(vis);
  function find(list, idRe, labRe, wantSelect) {
    let el = list.find((e) => (wantSelect === undefined || (e.tagName === 'SELECT') === wantSelect) && idRe && idRe.test(attrs(e)));
    if (!el && labRe) el = list.find((e) => (wantSelect === undefined || (e.tagName === 'SELECT') === wantSelect) && labRe.test(labelOf(e)));
    return el;
  }
  function setVal(el, v) {
    const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    el.focus && el.focus();
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    for (const t of ['input', 'change', 'keyup']) el.dispatchEvent(new Event(t, { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }
  // ch\u1ecdn option theo ch\u1eef ("\u6771\u4eac\u90fd" / "\u6771\u4eac") ho\u1eb7c theo s\u1ed1 ("06" kh\u1edbp "6", n\u0103m "2031" kh\u1edbp "31")
  function pick(sel, want, num) {
    const o = [...sel.options].find((x) => {
      if (num) { const a = parseInt((x.value || '').replace(/\D/g, ''), 10), b = parseInt((x.text || '').replace(/\D/g, ''), 10), w = parseInt(want, 10); return a === w || b === w || (w > 100 && (a === w % 100 || b === w % 100) && x.value.replace(/\D/g, '').length <= 2); }
      const t = (x.text || '').trim(); const s = want.replace(/[\u90fd\u9053\u5e9c\u770c]$/, '');
      return t === want || x.value === want || (s && t.startsWith(s));
    });
    if (!o) return false;
    if (sel.value !== o.value) setVal(sel, o.value);
    return true;
  }
  const empty = (e) => (e.tagName === 'SELECT' ? e.selectedIndex <= 0 && !/\d/.test(e.value) : !e.value.trim());
  const ADDR = [
    ['zip', /zip|postal/, /\u90f5\u4fbf\u756a\u53f7/, false, true], ['pref', /county|state|prefecture|region|province/, /\u90fd\u9053\u5e9c\u770c/, true, true],
    ['last', /last.?name|surname|family/, /^\u59d3/, false, true], ['first', /first.?name|given/, /^\u540d/, false, true],
    ['city', /city|town/, /\u5e02\u533a\u753a\u6751/, false, true], ['addr1', /address.?1|address.?line.?1|street/, /\u4f4f\u62401/, false, true],
    ['addr2', /address.?2|address.?line.?2/, /\u4f4f\u62402/, false, false], ['phone', /phone|mobile|tel(?!e)/, /\u96fb\u8a71/, false, true],
  ];
  let topWin = null, topOrigin = '', lastEmail = '';
  function run(d) {
    const all = boxes();
    const addrBoxes = all.filter((e) => !CARDISH.test(attrs(e)) && !CARDISH.test(labelOf(e)));
    const missing = [];
    for (const [k, idRe, labRe, isSel, req] of ADDR) {
      const el = find(addrBoxes, idRe, labRe, isSel);
      if (!el || !empty(el)) continue;               // kh\u00f4ng c\u00f3 \u00f4 / t\u00e0i kho\u1ea3n \u0111\u00e3 c\u00f3 s\u1eb5n -> gi\u1eef nguy\u00ean
      const v = d.addr && d.addr[k];
      if (d.fill && v) { if (isSel) pick(el, v, false); else setVal(el, v); }
      if (req && empty(el)) missing.push(labRe.source.replace(/[\^\\]/g, ''));
    }
    // \u00f4 th\u1ebb
    let card = 'none';
    const cb = all.filter((e) => CARDISH.test(attrs(e)) || CARDISH.test(labelOf(e)));
    const num = find(cb, /cc-number|card.?num|cardno|card_no|encryptedcardnumber/, /\u30ab\u30fc\u30c9\u756a\u53f7/, false);
    if (num) {
      const cv = find(cb, /cc-csc|cvv|cvc|cvd|securitycode|security.?code/, /\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3/, false);
      const nm = find(cb, /cc-name|holder|cardowner|cardname|nameoncard/, /\u540d\u7fa9/, false);
      const exp1 = find(cb, /cc-exp(?!-)|expiry(?!.*(month|year))|expdate/, null, false);
      const mon = find(cb, /cc-exp-month|exp.*month|month/, null, undefined) || cb.filter((e) => /\u6709\u52b9\u671f\u9650/.test(labelOf(e)))[0];
      const yr = find(cb, /cc-exp-year|exp.*year|year/, null, undefined) || cb.filter((e) => /\u6709\u52b9\u671f\u9650/.test(labelOf(e)))[1];
      const k = d.card;
      if (d.fill && k) {
        if (num.value.replace(/\D/g, '') !== k.number) setVal(num, k.number);
        if (exp1 && empty(exp1)) setVal(exp1, k.mm + '/' + k.yy);
        if (mon && mon !== exp1) { if (mon.tagName === 'SELECT') pick(mon, k.mm, true); else if (empty(mon)) setVal(mon, k.mm); }
        if (yr && yr !== exp1 && yr !== mon) { if (yr.tagName === 'SELECT') pick(yr, k.yyyy, true); else if (empty(yr)) setVal(yr, (yr.maxLength === 2 ? k.yy : k.yyyy)); }
        if (cv && empty(cv)) setVal(cv, k.cvv);
        if (nm && empty(nm) && k.name) setVal(nm, k.name.toUpperCase());
      }
      card = num.value.replace(/\D/g, '').length >= 12 && (!cv || cv.value) ? 'filled' : 'empty';
    }
    const confirm = !!confirmBtn();
    const bt = document.body ? document.body.innerText : '';
    const done = /\u3054\u6ce8\u6587\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e|\u3054\u6ce8\u6587\u3092\u627f\u308a\u307e\u3057\u305f|\u3054\u6ce8\u6587\u756a\u53f7|\u6ce8\u6587\u756a\u53f7|Thank you for your order|Order Number/i.test(bt);
    const em = all.find((e) => /mail/i.test(attrs(e)) && /@/.test(e.value));
    if (em) lastEmail = em.value;
    if (topWin) try { topWin.postMessage({ synova: 'ge-st', missing, card, confirm, done, orderNo: done ? findOrderNo(bt) : '', email: lastEmail }, topOrigin); } catch (e) {}
  }
  function confirmBtn() {
    return [...document.querySelectorAll('button, input[type=submit], input[type=button], a[role=button]')].find((b) => vis(b) && !b.disabled &&
      /\u6ce8\u6587\u306e\u78ba\u5b9a|\u6ce8\u6587\u3092\u78ba\u5b9a|\u3054\u6ce8\u6587\u3092\u78ba\u5b9a|\u6ce8\u6587\u3059\u308b$|\u8cfc\u5165\u3059\u308b$|Place Order|PLACE ORDER/.test((b.innerText || b.value || '').trim()));
  }
  window.addEventListener('message', (e) => {
    if (!GE_SHOP.test(e.origin) || !e.data || typeof e.data !== 'object') return;
    if (e.data.synova === 'ge-hello') { try { e.source.postMessage({ synova: 'ge-ready' }, e.origin); } catch (x) {} return; }
    if (e.data.synova === 'ge-fill' && e.data.data) { topWin = e.source; topOrigin = e.origin; run(e.data.data); }
    if (e.data.synova === 'ge-click') { const b = confirmBtn(); if (b) b.click(); }
  });
})();

// ===================== Trang thanh to\u00e1n KOMOJU (komoju.com) =====================
// \u9280\u884c\u632f\u8fbc: \u0111i\u1ec1n \u59d3/\u540d (\u30ab\u30bf\u30ab\u30ca) + \u96fb\u8a71\u756a\u53f7 ; \u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08: ch\u1ecdn c\u1eeda h\u00e0ng ; r\u1ed3i b\u1ea5m \u300c\u652f\u6255\u3044\u300d.
// komoju.com l\u00e0 t\u00ean mi\u1ec1n kh\u00e1c shop -> kh\u00f4ng \u0111\u1ecdc \u0111\u01b0\u1ee3c th\u00f4ng tin l\u01b0u \u1edf shop: l\u1ea7n \u0111\u1ea7u b\u1ea5m "D\u00e1n" (m\u00e3 SYNOVA1 ch\u00e9p t\u1eeb \u2699\ufe0f c\u1ee7a shop),
// th\u00f4ng tin l\u01b0u l\u1ea1i tr\u00ean komoju.com d\u00f9ng cho M\u1eccI shop \u0111i qua KOMOJU.
if (!SYNOVA_DUP && !IN_FRAME && IS_KOMOJU) (async function sxbKomoju() {
  'use strict';
  if (!document.body) { setTimeout(sxbKomoju, 200); return; }
  const KK = 'sxb_komoju';
  let c = {};
  try { c = JSON.parse(localStorage.getItem(KK)) || {}; } catch (e) {}
  // th\u00f4ng tin giao h\u00e0ng c\u1ee7a shop (kho chung) \u0111\u00e8 l\u00ean b\u1ea3n l\u01b0u tr\u00ean komoju.com
  const gi = await gmGet('sxb_komoju_info');
  if (gi) for (const k of ['klast', 'kfirst', 'phone', 'kstore', 'last', 'first', 'email', 'uwh']) if (gi[k]) c[k] = gi[k];
  const gOrder = await gmGet('sxb_komoju_order');
  const order = gOrder && Date.now() - gOrder.at < 30 * 60e3 ? gOrder : null;
  const keep = () => { try { localStorage.setItem(KK, JSON.stringify(c)); } catch (e) {} };
  // ch\u1ec9 T\u1ef0 B\u1ea4M khi t\u1edbi \u0111\u00e2y t\u1eeb trang thanh to\u00e1n c\u1ee7a shop (kh\u00f4ng ph\u1ea3i m\u1edf l\u1ea1i link KOMOJU c\u0169)
  let ref = '';
  try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
  const botBuy = await gmGet('sxb_bot_buy');
  // t\u1ef1 b\u1ea5m: \u0111i t\u1eeb shop sang + (c\u00f3 kho chung) \u0111\u01a1n do BOT cho v\u00e0o gi\u1ecf trong 30 ph\u00fat v\u00e0 ch\u01b0a b\u1ea5m D\u1eebng
  const fromShop = !!ref && !/komoju\.com$/.test(ref) && (!GMS || !!(botBuy && Date.now() - botBuy.at < 30 * 60e3));

  // ---- khung nh\u1ecf (Shadow DOM) ----
  const host = document.createElement('div');
  host.id = 'sxbkomoju';
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;left:0;right:0;bottom:0;height:0';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>
  .w{position:fixed;left:8px;right:8px;bottom:calc(env(safe-area-inset-bottom) + 8px);background:#0d1b32;color:#f2f2f2;border:1px solid #527198;border-radius:12px;
    padding:8px 10px;font:600 12px -apple-system,"Hiragino Sans",sans-serif;box-shadow:0 4px 16px #000a;box-sizing:border-box}
  .h{display:flex;gap:6px;align-items:center} .st{flex:1;color:#ffffff;line-height:1.35}
  button{border:1px solid #527198;background:#203a5d;color:#ffffff;border-radius:9px;padding:6px 9px;font:700 12px -apple-system,sans-serif}
  .f{display:none;margin-top:6px} .f.on{display:block} .r{display:flex;gap:6px;margin-top:6px;align-items:center}
  input,select{flex:1;min-width:0;font-size:16px;padding:6px 8px;border:1px solid #527198;border-radius:8px;background:#162a46;color:#fff;box-sizing:border-box}
  label{display:flex;gap:6px;align-items:center;margin-top:6px} label input{flex:none;width:20px;height:20px;accent-color:#ffffff}
  </style>
  <div class="w"><div class="h"><span class="st" id="st">うずら BOT</span><button id="cfg">\u2699\ufe0f</button></div>
  <div class="f" id="f">
    <div class="r"><input id="klast" placeholder="${L('\u30bb\u30a4\uff08\u30ab\u30bf\u30ab\u30ca\uff09', 'H\u1ecd katakana (\u30bb\u30a4)')}"><input id="kfirst" placeholder="${L('\u30e1\u30a4\uff08\u30ab\u30bf\u30ab\u30ca\uff09', 'T\u00ean katakana (\u30e1\u30a4)')}"></div>
    <div class="r"><input id="phone" type="tel" placeholder="${L('\u96fb\u8a71\u756a\u53f7', '\u0110i\u1ec7n tho\u1ea1i')}"></div>
    <div class="r"><select id="kstore">${KSTORES.map(([k, n]) => `<option value="${k}">${n}</option>`).join('')}</select></div>
    <div class="r"><button id="paste">\ud83d\udce5 ${L('\u8cbc\u308a\u4ed8\u3051', 'D\u00e1n')}</button><button id="save">\ud83d\udcbe ${L('\u4fdd\u5b58', 'L\u01b0u')}</button></div>
  </div></div>`;
  document.body.appendChild(host);
  const $k = (id) => root.getElementById(id);
  const show = () => { for (const k of ['klast', 'kfirst', 'phone']) $k(k).value = c[k] || ''; $k('kstore').value = c.kstore || 'seven'; };
  const read = () => { for (const k of ['klast', 'kfirst', 'phone']) c[k] = $k(k).value.trim(); c.kstore = $k('kstore').value; keep(); };
  show();
  // c\u00f3 th\u00f4ng tin (t\u1eeb \u2699\ufe0f c\u1ee7a shop) -> ch\u1ec9 hi\u1ec7n 1 d\u00f2ng tr\u1ea1ng th\u00e1i, kh\u00f4ng hi\u1ec7n n\u00fat / b\u1ea3ng. Thi\u1ebfu th\u00ec m\u1edbi hi\u1ec7n \u0111\u1ec3 t\u1ef1 nh\u1eadp / d\u00e1n
  const hasInfo = !!(c.klast || c.phone);
  if (hasInfo) { $k('cfg').style.display = 'none'; root.querySelector('.w').style.pointerEvents = 'none'; }
  else $k('f').classList.add('on');
  $k('cfg').onclick = () => $k('f').classList.toggle('on');
  $k('save').onclick = () => { read(); say(L('\u4fdd\u5b58\u3057\u307e\u3057\u305f', '\u0110\u00e3 l\u01b0u')); };
  root.querySelectorAll('input,select').forEach((e) => e.addEventListener('change', read));
  function applyCode(txt) {
    const m = (txt || '').match(/SYNOVA1:([A-Za-z0-9+/=]+)/);
    if (!m) { say(L('\u30b3\u30fc\u30c9\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\uff08\u5e97\u8217\u306e\u2699\ufe0f\u3067\u300c\u30b3\u30d4\u30fc\u300d\uff09', 'Kh\u00f4ng th\u1ea5y m\u00e3 (b\u1ea5m "Sao ch\u00e9p" \u1edf \u2699\ufe0f c\u1ee7a shop)')); return; }
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      for (const k of ['klast', 'kfirst', 'phone', 'kstore', 'last', 'first', 'email', 'uwh']) if (o[k]) c[k] = o[k];
      keep(); show(); say(L('\u8cbc\u308a\u4ed8\u3051\u307e\u3057\u305f', '\u0110\u00e3 d\u00e1n th\u00f4ng tin'));
    } catch (e) { say(L('\u30b3\u30fc\u30c9\u304c\u58ca\u308c\u3066\u3044\u307e\u3059', 'M\u00e3 b\u1ecb l\u1ed7i')); }
  }
  $k('paste').onclick = () => {
    const manual = () => applyCode(prompt(L('\u30b3\u30d4\u30fc\u3057\u305f\u30b3\u30fc\u30c9\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044', 'D\u00e1n m\u00e3 \u0111\u00e3 sao ch\u00e9p v\u00e0o \u0111\u00e2y')) || '');
    if (navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then((t) => (/SYNOVA1:/.test(t) ? applyCode(t) : manual()), manual); else manual();
  };
  const say = (m) => { $k('st').textContent = 'うずら BOT \u00b7 ' + m; };

  // ---- \u0111i\u1ec1n form KOMOJU ----
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  function labelOf(e) {
    let t = (e.labels && e.labels[0] && e.labels[0].innerText) || e.getAttribute('aria-label') || e.placeholder || '';
    for (let a = e.parentElement, i = 0; !t && a && i < 4; a = a.parentElement, i++) {
      if (a.querySelectorAll('input:not([type=hidden]), select').length > 1) break;
      t = a.innerText || '';
    }
    return (t + ' ' + (e.name || '') + ' ' + (e.id || '')).replace(/\s+/g, '');
  }
  function setVal(el, v) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v);
    for (const t of ['input', 'change']) el.dispatchEvent(new Event(t, { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }
  const KANA = /\u30ab\u30bf\u30ab\u30ca|\u30ab\u30ca|\u30d5\u30ea\u30ac\u30ca|\uff8c\uff98\uff76\uff9e\uff85|kana/i;
  const FIELDS = [
    ['klast', (l) => KANA.test(l) && /\u59d3|\u30bb\u30a4|last|family/i.test(l)],
    ['kfirst', (l) => KANA.test(l) && /\u540d|\u30e1\u30a4|first|given/i.test(l) && !/\u59d3|\u30bb\u30a4|last|family/i.test(l)],
    ['phone', (l) => /\u96fb\u8a71|phone|tel/i.test(l) && !KANA.test(l)],
    ['last', (l) => !KANA.test(l) && /^(\u59d3|lastname|familyname)/i.test(l)],
    ['first', (l) => !KANA.test(l) && /^(\u540d|firstname|givenname)/i.test(l)],
    ['email', (l) => /\u30e1\u30fc\u30eb|mail/i.test(l)],
  ];
  // ---- b\u00e1o Discord ngay tr\u00ean KOMOJU ----
  // B\u1ea5m \u652f\u6255\u3044 xong, KOMOJU hi\u1ec7n trang h\u01b0\u1edbng d\u1eabn (s\u1ed1 ti\u1ec1n, m\u00e3 thanh to\u00e1n \u30b3\u30f3\u30d3\u30cb / t\u00e0i kho\u1ea3n \u632f\u8fbc) v\u00e0 ng\u01b0\u1eddi mua th\u01b0\u1eddng KH\u00d4NG
  // quay l\u1ea1i trang c\u1ea3m \u01a1n c\u1ee7a shop -> tr\u01b0\u1edbc \u0111\u00e2y kh\u00f4ng c\u00f3 webhook. Gi\u1edd: l\u00fac b\u1ea5m \u652f\u6255\u3044 ghi "\u0111\u01a1n \u0111ang ch\u1edd"; trang sau c\u00f3 ch\u1eef
  // h\u01b0\u1edbng d\u1eabn / ho\u00e0n t\u1ea5t -> g\u1eedi webhook (k\u00eanh SYNOVAJOY + webhook ri\u00eang: th\u00eam Email + m\u00e3 thanh to\u00e1n).
  const KP = 'sxb_komoju_pending';
  const pend = () => { try { const v = JSON.parse(localStorage.getItem(KP)); return v && Date.now() - v.at < 60 * 60e3 ? v : null; } catch (e) { return null; } };
  if (fromShop) { try { localStorage.setItem('sxb_komoju_shop', JSON.stringify({ host: ref, at: Date.now() })); } catch (e) {} }
  const shopHost = () => { try { const v = JSON.parse(localStorage.getItem('sxb_komoju_shop')); return v && Date.now() - v.at < 3 * 3600e3 ? v.host : ''; } catch (e) { return ''; } };
  function markPending(btn, storeRadios) {
    const text = document.body.innerText || '';
    const amt = (text.match(/[\u00a5\uffe5]\s?[\d,]{3,}/) || [''])[0].replace(/\s/g, '');
    const st = storeRadios.find((x) => x.checked);
    const em = [...document.querySelectorAll('input')].find((e) => /mail/i.test(e.type + e.name + e.id + labelOf(e)) && /@/.test(e.value));
    const v = { at: Date.now(), url: location.href, shop: shopHost() || (order && order.shop) || '', amount: amt, email: em ? em.value : (c.email || ''),
      method: storeRadios.length ? '\u30b3\u30f3\u30d3\u30cb\u6c7a\u6e08' + (st ? '\uff08' + labelOf(st).replace(/[^\u3040-\u30ff\u30fc\u4e00-\u9fffA-Za-z-]/g, '') + '\uff09' : '') : '\u9280\u884c\u632f\u8fbc' };
    try { localStorage.setItem(KP, JSON.stringify(v)); } catch (e) {}
  }
  const DONE_RE = /\u6255\u8fbc\u7968|\u3054?\u6ce8\u6587\u3042\u308a\u304c\u3068\u3046|\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306b\u3064\u3044\u3066|\u632f\u8fbc\u5148\u53e3\u5ea7|\u652f\u6255\u671f\u9650|\u304a\u652f\u6255\u3044\u671f\u9650|\u304a\u632f\u8fbc\u5148|\u632f\u8fbc\u5148|\u632f\u8fbc\u671f\u9650|\u53d7\u4ed8\u756a\u53f7|\u304a\u652f\u6255\u3044\u756a\u53f7|\u6255\u8fbc\u7968\u756a\u53f7|\u78ba\u8a8d\u756a\u53f7|\u30aa\u30f3\u30e9\u30a4\u30f3\u6c7a\u6e08\u756a\u53f7|\u304a\u5ba2\u69d8\u756a\u53f7|\u6255\u8fbc\u756a\u53f7|\u304a\u652f\u6255\u3044\u306e\u624b\u7d9a\u304d|\u304a\u652f\u6255\u3044\u65b9\u6cd5\u306e\u6848\u5185|\u304a\u652f\u6255\u3044\u304c\u5b8c\u4e86|payment instructions|payment (is )?complete|thank you/i;
  const RECEIPT_RE = /(\u53d7\u4ed8\u756a\u53f7|\u304a\u652f\u6255\u3044\u756a\u53f7|\u6255\u8fbc\u7968\u756a\u53f7|\u78ba\u8a8d\u756a\u53f7|\u30aa\u30f3\u30e9\u30a4\u30f3\u6c7a\u6e08\u756a\u53f7|\u304a\u5ba2\u69d8\u756a\u53f7|\u6255\u8fbc\u756a\u53f7|\u53e3\u5ea7\u756a\u53f7)[^\d\n]{0,8}([\d-]{4,})/;
  let sentDone = false;
  function checkDone(payBtnVisible) {
    const pv = pend();
    if (sentDone || !pv) return false;
    const text = document.body.innerText || '';
    if (!DONE_RE.test(text) || (payBtnVisible && location.href === pv.url)) return false;   // c\u00f2n \u1edf form, n\u00fat \u652f\u6255\u3044 c\u00f2n \u0111\u00f3 -> ch\u01b0a xong
    sentDone = true;
    try { localStorage.removeItem(KP); } catch (e) {}
    gmSet('sxb_komoju_order', null);
    const rc = text.match(RECEIPT_RE);
    const host = pv.shop || shopHost();
    const its = order && order.items && order.items.length ? order.items : null;
    synovaNotify(its ? its.map((it) => ({ author: '\u2705 Checkout Successful', title: it.title, url: it.url, thumb: it.image, site: host,
      fields: [['Size', it.size], ['\u4fa1\u683c', it.price], ['Quantity', it.qty], ['\u652f\u6255\u3044\u65b9\u6cd5', pv.method], ['Site', host || order.shop, false]] }))
      : [{ author: '\u2705 Checkout Successful', title: host || 'KOMOJU', url: host ? 'https://' + host : location.origin,
        fields: [['\u4fa1\u683c', pv.amount], ['\u652f\u6255\u3044\u65b9\u6cd5', pv.method], ['Site', (host || 'komoju.com') + ' (KOMOJU)', false]] }],
      c.uwh, [['Email', pv.email], ['\u6ce8\u6587\u756a\u53f7', rc ? rc[1] + ' ' + rc[2] : '']]);
    say(L('\u6ce8\u6587\u5b8c\u4e86 \u2192 Discord\u306b\u901a\u77e5\u3057\u307e\u3057\u305f', '\u0110\u1eb7t h\u00e0ng xong \u2192 \u0111\u00e3 b\u00e1o Discord'));
    return true;
  }
  // ng\u01b0\u1eddi mua t\u1ef1 b\u1ea5m \u652f\u6255\u3044 (kh\u00f4ng qua BOT) c\u0169ng ghi l\u1ea1i
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button, input[type=submit]');
    if (b && /^(\u652f\u6255\u3044|\u304a\u652f\u6255\u3044|Pay\b|Submit payment)/i.test((b.innerText || b.value || '').trim())) {
      const rs = [...document.querySelectorAll('input[type=radio]')].filter((r) => KSTORES.some(([, , re]) => re.test(labelOf(r) + ' ' + (r.value || ''))));
      markPending(b, rs);
    }
  }, true);
  let clicks = 0, lastClick = 0;
  const t0 = Date.now();
  const timer = setInterval(() => {
    if (Date.now() - t0 > 300e3) { clearInterval(timer); return; }
    const payBtn = [...document.querySelectorAll('button, input[type=submit]')].find((b) => vis(b) && /^(\u652f\u6255\u3044|\u304a\u652f\u6255\u3044|Pay\b|Submit payment)/i.test((b.innerText || b.value || '').trim()));
    if (checkDone(!!payBtn)) { clearInterval(timer); return; }
    if (pend() && !payBtn) { say(L('\u304a\u652f\u6255\u3044\u51e6\u7406\u4e2d\u2026', '\u0110ang x\u1eed l\u00fd thanh to\u00e1n\u2026')); return; }
    const boxes = [...document.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]):not([type=submit])')].filter(vis);
    for (const el of boxes) {
      if (el.value) continue;
      const l = labelOf(el);
      for (const [k, test] of FIELDS) if (c[k] && test(l)) { setVal(el, k === 'phone' ? c[k].replace(/[^\d+]/g, '') : c[k]); break; }
    }
    // c\u1eeda h\u00e0ng konbini
    const radios = [...document.querySelectorAll('input[type=radio]')];
    const st = KSTORES.find(([k]) => k === (c.kstore || 'seven'));
    const storeRadios = radios.filter((r) => KSTORES.some(([, , re]) => re.test(labelOf(r) + ' ' + (r.value || ''))));
    if (storeRadios.length && st) {
      const r = storeRadios.find((x) => st[2].test(labelOf(x) + ' ' + (x.value || '')));
      if (r && !r.checked) r.click();
    }
    const empty = boxes.filter((e) => !e.value && (e.required || e.getAttribute('aria-required') === 'true' || !/\u4efb\u610f|optional/i.test(labelOf(e))));
    const storeOk = !storeRadios.length || storeRadios.some((x) => x.checked);
    if (empty.length || !storeOk) {
      say(L('\u5165\u529b\u4e2d\u2026 \u672a\u5165\u529b: ', '\u0110ang \u0111i\u1ec1n\u2026 c\u00f2n thi\u1ebfu: ') + empty.map((e) => labelOf(e).slice(0, 12)).concat(storeOk ? [] : [L('\u30b3\u30f3\u30d3\u30cb', 'c\u1eeda h\u00e0ng')]).join(', ') +
        (!c.klast && !c.phone ? L('\uff08\u2699\ufe0f\u3067\u300c\u8cbc\u308a\u4ed8\u3051\u300d\uff09', ' (b\u1ea5m \u2699\ufe0f \u2192 D\u00e1n)') : ''));
      return;
    }
    const btn = [...document.querySelectorAll('button, input[type=submit]')].find((b) => vis(b) && !b.disabled && b.getAttribute('aria-disabled') !== 'true' &&
      /^(\u652f\u6255\u3044|\u304a\u652f\u6255\u3044|Pay\b|Submit payment)/i.test((b.innerText || b.value || '').trim()));
    if (!fromShop) { say(L('\u5165\u529b\u5b8c\u4e86 \u2192\u300c\u652f\u6255\u3044\u300d\u3092\u62bc\u3057\u3066\u304f\u3060\u3055\u3044\uff08\u5e97\u8217\u304b\u3089\u6765\u3066\u3044\u306a\u3044\u305f\u3081\uff09', '\u0110\u00e3 \u0111i\u1ec1n xong \u2192 b\u1ea5m \u300c\u652f\u6255\u3044\u300d (kh\u00f4ng \u0111i t\u1eeb shop sang)')); return; }
    if (!btn) { say(L('\u300c\u652f\u6255\u3044\u300d\u30dc\u30bf\u30f3\u5f85\u3061\u2026', 'Ch\u1edd n\u00fat \u300c\u652f\u6255\u3044\u300d\u2026')); return; }
    if (clicks >= 2 || Date.now() - lastClick < 10000) return;
    clicks++; lastClick = Date.now();
    say(L(`\u300c\u652f\u6255\u3044\u300d\u3092\u62bc\u3057\u307e\u3057\u305f (${clicks})`, `\u0110\u00e3 b\u1ea5m \u300c\u652f\u6255\u3044\u300d (${clicks})`));
    btn.click();
  }, 250);
})();

// ===================== CAPTCHA hi\u1ec7n ra \u2192 d\u1eddi khung BOT cho kh\u1ecfi che (user y\u00eau c\u1ea7u 3/11) =====================
// KH\u00d4NG gi\u1ea3i captcha: th\u1ea5y khung hCaptcha / reCAPTCHA / Turnstile \u0111ang hi\u1ec7n th\u00ec d\u1eddi c\u00e1c khung SYNOVA \u0111ang che n\u00f3 sang m\u00e9p
// c\u00f2n tr\u1ed1ng (kh\u00f4ng c\u00f2n ch\u1ed7 th\u00ec t\u1ea1m \u1ea9n), \u0111\u00f3ng ph\u1ea7n c\u00e0i \u0111\u1eb7t c\u1ee7a b\u1ea3ng BOT, hi\u1ec7n 1 d\u00f2ng b\u00e1o; captcha bi\u1ebfn m\u1ea5t th\u00ec tr\u1ea3 v\u1ec1 nh\u01b0 c\u0169.
if (!SYNOVA_DUP && !IN_FRAME && !IS_PCI && (IS_PAL || IS_SUP || IS_HM || IS_BUF || IS_GEN || SHOPIFY_CO || IS_KOMOJU || IS_SHOPAPP)) (function sxbCaptchaYield() {
  const CAP_RE = /hcaptcha\.com|\/recaptcha\/(api2|enterprise)\/(anchor|bframe)|challenges\.cloudflare\.com/i;
  const HOSTS = ['sxbhost', 'sxbbubh', 'sxbbanner', 'sxbkomoju'];
  const GAP = 6;
  const EDGES = [['calc(env(safe-area-inset-top) + 6px)', 'auto'], ['auto', 'calc(env(safe-area-inset-bottom) + 8px)']];
  const saved = new Map();                      // khung \u0111\u00e3 d\u1eddi -> style c\u0169
  let on = false, toast = null;
  function capRects() {
    const out = [];
    for (const f of document.querySelectorAll('iframe')) {
      const src = f.src || f.getAttribute('data-src') || '';
      if (!CAP_RE.test(src) || /size=invisible/.test(src)) continue;      // huy hi\u1ec7u reCAPTCHA \u1ea9n (v3) kh\u00f4ng t\u00ednh
      const r = f.getBoundingClientRect();
      if (r.width < 40 || r.height < 40 || r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
      const cs = getComputedStyle(f);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      out.push(r);
    }
    return out;
  }
  const hit = (a, rs) => a.width > 0 && rs.some((r) => a.left < r.right + GAP && a.right > r.left - GAP && a.top < r.bottom + GAP && a.bottom > r.top - GAP);
  function panels() {
    const els = [];
    for (const id of HOSTS) {
      const h = document.getElementById(id), root = h && (h.shadowRoot || h);
      if (root) for (const el of root.children) if (el.tagName !== 'STYLE' && getComputedStyle(el).position === 'fixed') els.push(el);
    }
    return els;
  }
  function restore() {
    for (const [el, o] of saved) { el.style.top = o.top; el.style.bottom = o.bottom; el.style.visibility = o.vis; el.style.pointerEvents = o.pe; }
    saved.clear();
  }
  function move(el, rs) {
    if (!hit(el.getBoundingClientRect(), rs)) return;
    saved.set(el, { top: el.style.top, bottom: el.style.bottom, vis: el.style.visibility, pe: el.style.pointerEvents });
    if (el.id !== 'sxbbub') {                   // bong b\u00f3ng t\u1ef1 \u0111\u1eb7t l\u1ea1i top/bottom m\u1ed7i gi\u00e2y -> ch\u1ec9 \u1ea9n
      for (const [t, b] of EDGES) { el.style.top = t; el.style.bottom = b; if (!hit(el.getBoundingClientRect(), rs)) return; }
    }
    el.style.visibility = 'hidden'; el.style.pointerEvents = 'none';
  }
  function say(rs) {
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sxbcaptoast';
      toast.style.cssText = 'all:initial;position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0';
      const root = toast.attachShadow({ mode: 'open' });
      root.innerHTML = `<div style="position:fixed;left:8px;right:8px;background:#0d1b32;color:#ffffff;border:1px solid #527198;border-radius:10px;padding:6px 10px;
        font:600 12px -apple-system,'Hiragino Sans',sans-serif;line-height:1.35;box-shadow:0 4px 16px #000a;box-sizing:border-box;pointer-events:none">うずら BOT \u00b7 ${
        L('CAPTCHA \u304c\u51fa\u305f\u306e\u3067\u8a2d\u5b9a\u3092\u9589\u3058\u307e\u3057\u305f\u3002\u89e3\u304d\u7d42\u308f\u308b\u307e\u3067\u3088\u3051\u3066\u3044\u307e\u3059', 'C\u00f3 CAPTCHA \u2192 \u0111\u00e3 \u0111\u00f3ng c\u00e0i \u0111\u1eb7t, BOT tr\u00e1nh ch\u1ed7 t\u1edbi khi b\u1ea1n gi\u1ea3i xong')}</div>`;
      document.body.appendChild(toast);
    }
    const el = toast.shadowRoot.firstElementChild;
    el.style.visibility = '';
    for (const [t, b] of EDGES) { el.style.top = t; el.style.bottom = b; if (!hit(el.getBoundingClientRect(), rs)) return; }
    el.style.bottom = 'auto';                     // 2 m\u00e9p \u0111\u1ec1u b\u1eadn: t\u00ecm khe tr\u1ed1ng \u1edf gi\u1eefa
    for (let y = 6; y < innerHeight - 40; y += 20) { el.style.top = y + 'px'; if (!hit(el.getBoundingClientRect(), rs)) return; }
    el.style.visibility = 'hidden';               // captcha cho\u00e1n c\u1ea3 m\u00e0n h\u00ecnh: th\u00f4i kh\u00f4ng b\u00e1o
  }
  setInterval(() => {
    if (!document.body) return;
    const els = panels();
    const rs = els.length ? capRects() : [];
    const now = rs.length > 0;
    if (now !== on) { on = now; try { window.dispatchEvent(new CustomEvent('sxb-captcha', { detail: on })); } catch (e) {} }
    restore();                                    // \u0111o l\u1ea1i m\u1ed7i l\u01b0\u1ee3t (captcha \u0111\u1ed5i t\u1eeb \u00f4 tick sang khung ch\u1ecdn h\u00ecnh) \u2013 c\u00f9ng 1 l\u01b0\u1ee3t n\u00ean kh\u00f4ng nh\u00e1y
    if (!on) { if (toast) { toast.remove(); toast = null; } return; }
    for (const el of els) move(el, rs);
    // d\u00f2ng b\u00e1o tr\u00e1nh c\u1ea3 captcha l\u1eabn khung BOT c\u00f2n hi\u1ec7n
    say(rs.concat(els.filter((el) => el.style.visibility !== 'hidden').map((el) => el.getBoundingClientRect()).filter((r) => r.width > 0)));
  }, 400);
})();

// ===================== Thanh to\u00e1n xong \u2192 Discord =====================
// Supreme: Shopify /checkouts/.../thank-you ; HUMAN MADE / Buffer: trang x\u00e1c nh\u1eadn \u0111\u01a1n c\u1ee7a SFCC (Order-Confirm / confirmation)
if (!SYNOVA_DUP && !IN_FRAME && !IS_PCI && (IS_PAL || IS_SUP || IS_HM || IS_BUF || IS_GEN || SHOPIFY_CO)) (function () {
  const isThanks = () => /thank[-_]you|\/orders\/[0-9a-z]{16,}|order-?confirm|Order-Confirm|\/confirmation/i.test(location.pathname + location.search);
  let tries = 0;
  const timer = setInterval(() => {
    if (++tries > 1800) return clearInterval(timer);
    if (!isThanks() || !document.body) return;
    const text = document.body.innerText || '';
    if (!/\u3042\u308a\u304c\u3068\u3046|Thank you|\u3054\u6ce8\u6587|\u6ce8\u6587\u756a\u53f7|order/i.test(text)) return;
    const orderNo = findOrderNo(text) || findOrderNo(document.title);
    if (!orderNo && tries < 12) return;              // m\u00e3 \u0111\u01a1n th\u01b0\u1eddng hi\u1ec7n sau v\u00e0i gi\u00e2y -> ch\u1edd t\u1ed1i \u0111a ~12 gi\u00e2y
    clearInterval(timer);
    const key = 'synova_sent_' + location.pathname;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch (e) {}
    let last = null;
    try { last = JSON.parse(localStorage.getItem(K_LAST)); } catch (e) {}
    // t\u1eeb trang KOMOJU quay v\u1ec1 (\u30b3\u30f3\u30d3\u30cb / \u9280\u884c\u632f\u8fbc): KOMOJU \u0111\u00e3 b\u00e1o Discord l\u00fac b\u1ea5m \u652f\u6255\u3044 -> kh\u00f4ng b\u00e1o l\u1ea7n 2
    if (!/komoju\.com/i.test(document.referrer || '')) synovaNotify(orderEmbeds(last), buyInfo().uwh, [['Email', emailUsed()], ['\u6ce8\u6587\u756a\u53f7', orderNo]]);
    try { localStorage.removeItem(K_LAST); localStorage.removeItem(K_CART); localStorage.removeItem('sxb_pay_used'); } catch (e) {}
    try {                                            // \u0111\u1eb7t h\u00e0ng xong: BOT c\u1ee7a shop n\u00e0y ch\u1eafc ch\u1eafn \u1edf tr\u1ea1ng th\u00e1i t\u1eaft
      const k = 'sxb_' + SITE_KEY + '_st';
      const v = JSON.parse(localStorage.getItem(k) || '{}'); v.active = false; v.boughtAt = Date.now(); localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }, 1000);
})();

  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runShop, { once: true });
  else runShop();
})();
