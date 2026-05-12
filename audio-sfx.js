// audio-sfx.js
// Premium procedural SFX only for Hand Drone XS.
// Music ownership lives only in audio-start-unlock.js.

(function () {
  'use strict';

  // ===== SECTION: CONSTANTS =====
  const SFX_POLL_MS = 100;
  const LOCK_COOLDOWN_MS = 900;

  // ===== SECTION: GLOBAL STATE =====
  let ctx;
  let enabled = false;
  let lastScore = 0;
  let lastHandLocked = false;
  let lastLockAt = 0;
  let lastGameOver = false;
  let pollTimer = null;
  let masterBus;
  let masterComp;

  // ===== SECTION: AUDIO GRAPH HELPERS =====
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

  function now() {
    return getCtx().currentTime;
  }

  function envGain(c, start, attack, hold, release, peak) {
    const g = c.createGain();
    const min = 0.0001;
    g.gain.setValueAtTime(min, start);
    g.gain.exponentialRampToValueAtTime(Math.max(min, peak), start + attack);
    g.gain.setValueAtTime(Math.max(min, peak), start + attack + hold);
    g.gain.exponentialRampToValueAtTime(min, start + attack + hold + release);
    return g;
  }

  function makeFilter(c, type, freq, q) {
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  function makePan(c, pan) {
    if (!c.createStereoPanner) return null;
    const p = c.createStereoPanner();
    p.pan.value = pan;
    return p;
  }

  function connectChain(source, nodes) {
    let prev = source;
    nodes.filter(Boolean).forEach((node) => {
      prev.connect(node);
      prev = node;
    });
    prev.connect(masterBus);
  }

  // ===== SECTION: SFX SYNTHESIS =====
  function tone({ freq = 440, to = freq, dur = 0.14, type = 'sine', vol = 0.08, at = 0, pan = 0, filter = 4200, q = 0.8, attack = 0.006, release = 0.12 }) {
    if (!enabled) return;
    const c = getCtx();
    const t = now() + at;
    const o = c.createOscillator();
    const f = makeFilter(c, 'lowpass', filter, q);
    const p = makePan(c, pan);
    const g = envGain(c, t, attack, 0.002, release, vol);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    connectChain(o, [f, p, g]);
    o.start(t);
    o.stop(t + dur + release + 0.04);
  }

  function metallicPing({ freq = 880, dur = 0.16, vol = 0.06, at = 0, pan = 0 }) {
    tone({ freq, to: freq * 1.02, dur, type: 'sine', vol, at, pan, filter: 7200, q: 1.2, release: dur });
    tone({ freq: freq * 1.505, to: freq * 1.48, dur: dur * 0.86, type: 'triangle', vol: vol * 0.42, at: at + 0.006, pan: -pan * 0.6, filter: 6400, q: 0.9, release: dur * 0.7 });
    tone({ freq: freq * 2.01, to: freq * 1.86, dur: dur * 0.55, type: 'sine', vol: vol * 0.22, at: at + 0.012, pan: pan * 0.8, filter: 8400, q: 0.7, release: dur * 0.5 });
  }

  function noiseBurst({ dur = 0.18, vol = 0.045, at = 0, pan = 0, filter = 2400, type = 'bandpass', q = 0.9, attack = 0.004, release = 0.14 }) {
    if (!enabled) return;
    const c = getCtx();
    const t = now() + at;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const p = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - p, 2.2);
    }
    const src = c.createBufferSource();
    const f = makeFilter(c, type, filter, q);
    const p = makePan(c, pan);
    const g = envGain(c, t, attack, 0.001, release, vol);
    src.buffer = buffer;
    connectChain(src, [f, p, g]);
    src.start(t);
    src.stop(t + dur + release + 0.04);
  }

  function subDrop({ from = 120, to = 42, dur = 0.42, vol = 0.09, at = 0 }) {
    tone({ freq: from, to, dur, type: 'sine', vol, at, pan: 0, filter: 360, q: 0.7, attack: 0.012, release: dur * 0.8 });
  }

  // ===== SECTION: SFX CUES =====
  const sfx = {
    boot() {
      subDrop({ from: 74, to: 118, dur: 0.42, vol: 0.11 });
      noiseBurst({ dur: 0.42, vol: 0.015, filter: 3600, type: 'bandpass', pan: -0.18, release: 0.26 });
      metallicPing({ freq: 520, dur: 0.22, vol: 0.038, at: 0.08, pan: -0.18 });
      metallicPing({ freq: 760, dur: 0.24, vol: 0.032, at: 0.2, pan: 0.16 });
      tone({ freq: 1480, to: 1180, dur: 0.13, type: 'sine', vol: 0.014, at: 0.36, pan: 0.22, filter: 9000, release: 0.12 });
    },
    start() {
      subDrop({ from: 92, to: 142, dur: 0.28, vol: 0.078 });
      noiseBurst({ dur: 0.16, vol: 0.025, filter: 5200, type: 'bandpass', pan: -0.12, release: 0.12 });
      metallicPing({ freq: 620, dur: 0.18, vol: 0.044, at: 0.035, pan: -0.1 });
      metallicPing({ freq: 1040, dur: 0.16, vol: 0.03, at: 0.11, pan: 0.14 });
      tone({ freq: 2100, to: 1560, dur: 0.12, type: 'sine', vol: 0.012, at: 0.18, pan: 0.2, filter: 9200, release: 0.08 });
    },
    sweep() {
      noiseBurst({ dur: 0.28, vol: 0.016, filter: 6200, type: 'bandpass', pan: 0.18, release: 0.2 });
      tone({ freq: 1400, to: 360, dur: 0.24, type: 'sine', vol: 0.02, at: 0.02, pan: -0.12, filter: 7600, release: 0.14 });
    },
    lock() {
      metallicPing({ freq: 840, dur: 0.13, vol: 0.038, pan: -0.08 });
      tone({ freq: 1560, to: 1320, dur: 0.1, type: 'sine', vol: 0.018, at: 0.045, pan: 0.12, filter: 7600, release: 0.09 });
      noiseBurst({ dur: 0.08, vol: 0.006, filter: 5000, type: 'highpass', at: 0.03, release: 0.08 });
    },
    collect() {
      metallicPing({ freq: 760, dur: 0.15, vol: 0.044, pan: -0.14 });
      metallicPing({ freq: 1160, dur: 0.16, vol: 0.034, at: 0.042, pan: 0.18 });
      tone({ freq: 1880, to: 2360, dur: 0.12, type: 'sine', vol: 0.012, at: 0.075, pan: 0.08, filter: 9600, release: 0.1 });
      noiseBurst({ dur: 0.1, vol: 0.009, filter: 7600, type: 'highpass', at: 0.016, pan: 0.12, release: 0.08 });
    },
    crash() {
      noiseBurst({ dur: 0.36, vol: 0.075, filter: 1500, type: 'lowpass', pan: -0.08, release: 0.32 });
      subDrop({ from: 156, to: 38, dur: 0.58, vol: 0.085, at: 0.02 });
      tone({ freq: 340, to: 98, dur: 0.42, type: 'sawtooth', vol: 0.035, at: 0.03, pan: 0.08, filter: 680, release: 0.35 });
      noiseBurst({ dur: 0.62, vol: 0.018, filter: 420, type: 'lowpass', at: 0.16, pan: 0.04, release: 0.5 });
    }
  };

  // ===== SECTION: GAME DOM HELPERS =====
  function setEnabled(next) {
    enabled = Boolean(next);
    if (enabled) getCtx();
  }

  function getGameDocument() {
    const frame = document.getElementById('game-frame');
    if (!frame) return document;
    try {
      return frame.contentDocument || frame.contentWindow?.document || document;
    } catch (_) {
      return document;
    }
  }

  function hookAudioControls() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle || soundToggle.dataset.premiumSfxHooked === 'true') return;
    soundToggle.dataset.premiumSfxHooked = 'true';
    soundToggle.addEventListener('click', () => {
      const willEnable = !soundToggle.classList.contains('is-on');
      setEnabled(willEnable);
      if (willEnable) sfx.boot();
    }, true);
  }

  function hookStartButton(doc) {
    const start = doc?.getElementById?.('start-button');
    if (!start || start.dataset.premiumSfxHooked === 'true') return;
    start.dataset.premiumSfxHooked = 'true';
    start.addEventListener('click', () => {
      setEnabled(true);
      sfx.start();
      setTimeout(() => sfx.sweep(), 70);
    }, true);
  }

  function pollGameEvents() {
    const doc = getGameDocument();
    hookStartButton(doc);

    const score = Number(doc.getElementById('score')?.textContent || 0);
    if (score > lastScore) sfx.collect();
    lastScore = score;

    const hand = doc.getElementById('hand-status');
    const locked = Boolean(hand?.classList.contains('locked'));
    const t = performance.now();
    if (locked && !lastHandLocked && t - lastLockAt > LOCK_COOLDOWN_MS) {
      sfx.lock();
      lastLockAt = t;
    }
    lastHandLocked = locked;

    const over = doc.getElementById('game-over');
    const isOver = Boolean(over && getComputedStyle(over).display !== 'none');
    if (isOver && !lastGameOver) sfx.crash();
    lastGameOver = isOver;
  }

  // ===== SECTION: INIT / CLEANUP =====
  function init() {
    hookAudioControls();
    hookStartButton(getGameDocument());
    const frame = document.getElementById('game-frame');
    if (frame) frame.addEventListener('load', () => hookStartButton(getGameDocument()));
    pollTimer = window.setInterval(pollGameEvents, SFX_POLL_MS);
    window.addEventListener('pagehide', shutdown, { once: true });
  }

  function shutdown() {
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = null;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
