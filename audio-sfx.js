// audio-sfx.js
// Startup loading gate + procedural SFX for Hand Drone XS.
// Keeps gameplay untouched. Music playback is triggered by index.html on START GAME.

(function () {
  'use strict';

  const MIN_SPLASH_MS = 2000;
  const MAX_WAIT_MS = 9000;
  const MUSIC_PATHS = [
    './Battlefield%20Ascent.mp3',
    './Battlefield Ascent.mp3',
    'Battlefield%20Ascent.mp3',
    'Battlefield Ascent.mp3'
  ];

  function injectGateStyle() {
    if (document.querySelector('style[data-hdx-startup-gate="true"]')) return;

    const style = document.createElement('style');
    style.dataset.hdxStartupGate = 'true';
    style.textContent = `
      body:not(.hdx-assets-ready) #start-screen{display:none!important;opacity:0!important;pointer-events:none!important}
      body:not(.hdx-assets-ready) #logo-splash{display:none!important}
      #hdx-startup-gate{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:clamp(44px,9vw,128px);box-sizing:border-box;background:radial-gradient(circle at 50% 42%,rgba(14,165,233,.22),transparent 38%),radial-gradient(circle at 50% 58%,rgba(255,49,95,.11),transparent 42%),#03050d;color:#e8faff;font-family:Segoe UI,Tahoma,sans-serif;overflow:hidden;transition:opacity 300ms ease}
      #hdx-startup-gate.is-fading{opacity:0}
      .hdx-startup-inner{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:clamp(90px,14vh,150px);box-sizing:border-box;text-align:center}
      .hdx-startup-logo{width:min(300px,58vw,44vh);aspect-ratio:1/1;display:grid;place-items:center;filter:drop-shadow(0 0 30px rgba(110,231,255,.34)) drop-shadow(0 0 58px rgba(255,49,95,.16));animation:hdxLogoEnter 520ms cubic-bezier(.2,.85,.22,1) forwards;opacity:0;transform:scale(.9)}
      .hdx-startup-logo img{width:100%;height:100%;object-fit:contain;display:block}
      .hdx-startup-bottom{position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(520px,calc(100vw - 36px));z-index:10002;padding:14px 16px 13px;border-radius:18px;box-sizing:border-box;background:linear-gradient(180deg,rgba(7,16,32,.76),rgba(2,5,13,.92)),radial-gradient(circle at 18% 20%,rgba(110,231,255,.16),transparent 42%),radial-gradient(circle at 82% 60%,rgba(255,49,95,.12),transparent 46%);border:1px solid rgba(110,231,255,.24);box-shadow:0 0 22px rgba(110,231,255,.10),0 16px 46px rgba(0,0,0,.42),inset 0 0 18px rgba(110,231,255,.045);backdrop-filter:blur(10px)}
      .hdx-startup-track{width:100%;height:11px;border-radius:999px;overflow:hidden;background:rgba(110,231,255,.10);border:1px solid rgba(110,231,255,.30);box-shadow:inset 0 0 12px rgba(0,0,0,.34),0 0 20px rgba(110,231,255,.08)}
      .hdx-startup-fill{width:8%;height:100%;min-width:8%;border-radius:inherit;background:linear-gradient(90deg,rgba(110,231,255,.42),rgba(255,209,102,.9),rgba(110,231,255,.78));box-shadow:0 0 18px rgba(255,209,102,.38);transition:width 220ms ease}
      .hdx-startup-meta{display:flex;justify-content:space-between;gap:12px;margin-top:10px;font:800 11px Courier New,monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(232,250,255,.78)}
      .hdx-startup-eta{margin-top:7px;font:800 10px Courier New,monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(110,231,255,.82);text-align:center}
      .hdx-startup-eta strong{color:rgba(255,209,102,.98);font-weight:900}
      @keyframes hdxLogoEnter{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}
      @media(max-width:640px){.hdx-startup-bottom{bottom:max(16px,env(safe-area-inset-bottom));width:min(420px,calc(100vw - 26px));padding:12px 13px 11px;border-radius:16px}.hdx-startup-inner{padding-bottom:clamp(104px,18vh,148px)}.hdx-startup-logo{width:min(230px,62vw,42vh)}}
      @media(max-height:560px){.hdx-startup-bottom{bottom:max(10px,env(safe-area-inset-bottom));padding:10px 12px 9px}.hdx-startup-inner{padding-bottom:88px}.hdx-startup-logo{width:min(220px,45vw,40vh)}.hdx-startup-eta{margin-top:5px}}
    `;
    document.head.appendChild(style);
  }

  function setProgress(percent) {
    const safe = Math.max(0, Math.min(100, Math.round(percent)));
    const fill = document.querySelector('.hdx-startup-fill');
    const pct = document.querySelector('.hdx-startup-percent');
    if (fill) fill.style.width = safe + '%';
    if (pct) pct.textContent = safe + '%';
  }

  function setEta(startTime, percent) {
    const eta = document.querySelector('.hdx-startup-eta');
    if (!eta) return;

    const elapsed = performance.now() - startTime;
    const ratio = Math.max(0.08, Math.min(1, percent / 100));
    const estimatedTotal = Math.max(MIN_SPLASH_MS, Math.min(MAX_WAIT_MS, elapsed / ratio));
    const seconds = percent >= 98 ? 0 : Math.max(0, Math.ceil((estimatedTotal - elapsed) / 1000));

    eta.innerHTML = seconds <= 0 ? 'ETA: <strong>Ready</strong>' : `ETA: <strong>${seconds}s</strong> - loading assets`;
  }

  function waitForImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.decoding = 'async';
      img.src = src;
    });
  }

  function waitForMusic(audio) {
    return new Promise((resolve) => {
      if (!audio) return resolve(false);

      let done = false;
      let index = 0;
      const finish = (result) => {
        if (done) return;
        done = true;
        cleanup();
        resolve(result);
      };
      const cleanup = () => {
        audio.removeEventListener('canplaythrough', onReady);
        audio.removeEventListener('canplay', onReady);
        audio.removeEventListener('loadeddata', onReady);
        audio.removeEventListener('error', onError);
      };
      const onReady = () => finish(true);
      const onError = () => {
        index += 1;
        if (index >= MUSIC_PATHS.length) return finish(false);
        audio.src = MUSIC_PATHS[index];
        try { audio.load(); } catch (_) {}
      };

      audio.preload = 'auto';
      audio.loop = true;
      audio.addEventListener('canplaythrough', onReady);
      audio.addEventListener('canplay', onReady);
      audio.addEventListener('loadeddata', onReady);
      audio.addEventListener('error', onError);

      if (!audio.getAttribute('src')) audio.src = MUSIC_PATHS[0];
      try { audio.load(); } catch (_) {}

      window.setTimeout(() => finish(false), MAX_WAIT_MS);
    });
  }

  async function startupGate() {
    injectGateStyle();

    const oldSplash = document.getElementById('logo-splash');
    if (oldSplash) oldSplash.style.display = 'none';

    const gate = document.createElement('div');
    gate.id = 'hdx-startup-gate';
    gate.innerHTML = '<div class="hdx-startup-inner"><div class="hdx-startup-logo"><img src="./logo.png" alt="Hand Drone XS" decoding="async"></div></div><div class="hdx-startup-bottom"><div class="hdx-startup-track"><div class="hdx-startup-fill"></div></div><div class="hdx-startup-meta"><span>Preparing game</span><span class="hdx-startup-percent">8%</span></div><div class="hdx-startup-eta">ETA: <strong>calculating</strong></div></div>';
    document.body.appendChild(gate);

    const start = performance.now();
    const tick = window.setInterval(() => setEta(start, Number((document.querySelector('.hdx-startup-percent')?.textContent || '8').replace(/[^0-9.]/g, ''))), 150);

    setProgress(16);
    await waitForImage('./logo.png');

    setProgress(48);
    await waitForMusic(document.getElementById('game-music'));

    setProgress(82);
    window.__HDX_SFX_READY__ = true;

    const elapsed = performance.now() - start;
    await new Promise((resolve) => window.setTimeout(resolve, Math.max(0, MIN_SPLASH_MS - elapsed)));

    setProgress(100);
    setEta(start, 100);
    window.clearInterval(tick);
    document.body.classList.add('hdx-assets-ready', 'hdx-start-ready');

    window.setTimeout(() => {
      gate.classList.add('is-fading');
      window.setTimeout(() => gate.remove(), 320);
    }, 140);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startupGate, { once: true });
  else startupGate();
})();

(function () {
  'use strict';

  const SFX_POLL_MS = 100;
  const LOCK_COOLDOWN_MS = 900;
  let ctx, masterBus, masterComp;
  let enabled = false;
  let lastScore = 0;
  let lastHandLocked = false;
  let lastLockAt = 0;
  let lastGameOver = false;
  let pollTimer = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterBus = ctx.createGain();
      masterBus.gain.value = 0.92;
      masterComp = ctx.createDynamicsCompressor();
      masterComp.threshold.value = -18;
      masterComp.knee.value = 18;
      masterComp.ratio.value = 3.4;
      masterComp.attack.value = 0.003;
      masterComp.release.value = 0.16;
      masterBus.connect(masterComp).connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function env(c, t, attack, hold, release, peak) {
    const g = c.createGain();
    const min = 0.0001;
    g.gain.setValueAtTime(min, t);
    g.gain.exponentialRampToValueAtTime(Math.max(min, peak), t + attack);
    g.gain.setValueAtTime(Math.max(min, peak), t + attack + hold);
    g.gain.exponentialRampToValueAtTime(min, t + attack + hold + release);
    return g;
  }

  function tone(freq, to, dur, type, vol, delay) {
    if (!enabled) return;
    const c = getCtx();
    const t = c.currentTime + (delay || 0);
    const o = c.createOscillator();
    const f = c.createBiquadFilter();
    const g = env(c, t, 0.006, 0.002, Math.max(0.08, dur), vol);
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to || freq), t + dur);
    f.type = 'lowpass';
    f.frequency.value = 7600;
    o.connect(f).connect(g).connect(masterBus);
    o.start(t);
    o.stop(t + dur + 0.18);
  }

  function noise(dur, vol, delay) {
    if (!enabled) return;
    const c = getCtx();
    const t = c.currentTime + (delay || 0);
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    const src = c.createBufferSource();
    const f = c.createBiquadFilter();
    const g = env(c, t, 0.004, 0.001, 0.16, vol);
    f.type = 'bandpass';
    f.frequency.value = 3600;
    f.Q.value = 0.9;
    src.buffer = buffer;
    src.connect(f).connect(g).connect(masterBus);
    src.start(t);
    src.stop(t + dur + 0.2);
  }

  const sfx = {
    start() { tone(92, 142, 0.28, 'sine', 0.078, 0); noise(0.16, 0.025, 0.02); tone(620, 640, 0.18, 'sine', 0.044, 0.035); tone(1040, 920, 0.16, 'triangle', 0.03, 0.11); },
    collect() { tone(760, 820, 0.15, 'sine', 0.044, 0); tone(1160, 1280, 0.16, 'triangle', 0.034, 0.042); noise(0.1, 0.009, 0.016); },
    lock() { tone(840, 920, 0.13, 'sine', 0.038, 0); tone(1560, 1320, 0.1, 'sine', 0.018, 0.045); },
    crash() { noise(0.36, 0.075, 0); tone(156, 38, 0.58, 'sine', 0.085, 0.02); tone(340, 98, 0.42, 'sawtooth', 0.035, 0.03); }
  };

  function setEnabled(next) {
    enabled = Boolean(next);
    if (enabled) getCtx();
  }

  function hookStartButton() {
    const start = document.getElementById('start-button');
    if (!start || start.dataset.premiumSfxHooked === 'true') return;
    start.dataset.premiumSfxHooked = 'true';
    start.addEventListener('click', () => { setEnabled(true); sfx.start(); }, true);
  }

  function poll() {
    hookStartButton();

    const score = Number(document.getElementById('score')?.textContent || 0);
    if (score > lastScore) sfx.collect();
    lastScore = score;

    const hand = document.getElementById('hand-status');
    const locked = Boolean(hand?.classList.contains('locked'));
    const now = performance.now();
    if (locked && !lastHandLocked && now - lastLockAt > LOCK_COOLDOWN_MS) {
      sfx.lock();
      lastLockAt = now;
    }
    lastHandLocked = locked;

    const over = document.getElementById('game-over');
    const isOver = Boolean(over && getComputedStyle(over).display !== 'none');
    if (isOver && !lastGameOver) sfx.crash();
    lastGameOver = isOver;
  }

  function init() {
    hookStartButton();
    pollTimer = window.setInterval(poll, SFX_POLL_MS);
    window.addEventListener('pagehide', () => {
      if (pollTimer) window.clearInterval(pollTimer);
      pollTimer = null;
    }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
