// audio-sfx.js
// Browser-safe procedural SFX fallback for Hand Drone XS.
// No external or unverified audio URLs are used here.
// This file exists because approved source pages did not provide verified direct
// browser-safe OGG/MP3 hotlinks during implementation.

(function () {
  let ctx;
  let enabled = false;
  let lastScore = 0;
  let lastHandLocked = false;
  let lastLockAt = 0;
  let lastGameOver = false;
  let pollTimer = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function gainNode(ctx, volume, start) {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.018);
    return gain;
  }

  function osc({ freq = 440, end = freq, duration = 0.16, type = 'sine', volume = 0.12, delay = 0 }) {
    if (!enabled) return;
    const c = getCtx();
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    const g = gainNode(c, volume, t);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + duration);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + duration + 0.03);
  }

  function noise({ duration = 0.22, volume = 0.08, filter = 1200, delay = 0 }) {
    if (!enabled) return;
    const c = getCtx();
    const t = c.currentTime + delay;
    const len = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const p = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - p, 1.7);
    }
    const src = c.createBufferSource();
    const f = c.createBiquadFilter();
    const g = gainNode(c, volume, t);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(filter, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(60, filter * 0.35), t + duration);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.buffer = buffer;
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
    src.stop(t + duration + 0.03);
  }

  const sfx = {
    boot() {
      osc({ freq: 86, end: 180, duration: 0.42, type: 'sine', volume: 0.18 });
      osc({ freq: 430, end: 690, duration: 0.34, type: 'triangle', volume: 0.07, delay: 0.08 });
      noise({ duration: 0.48, volume: 0.026, filter: 1800 });
    },
    start() {
      osc({ freq: 140, end: 210, duration: 0.22, type: 'sine', volume: 0.14 });
      osc({ freq: 620, end: 980, duration: 0.18, type: 'triangle', volume: 0.08, delay: 0.05 });
      noise({ duration: 0.16, volume: 0.025, filter: 3600, delay: 0.02 });
    },
    lock() {
      osc({ freq: 780, end: 760, duration: 0.11, type: 'sine', volume: 0.07 });
      osc({ freq: 1220, end: 980, duration: 0.14, type: 'sine', volume: 0.05, delay: 0.035 });
    },
    collect() {
      osc({ freq: 740, end: 1260, duration: 0.16, type: 'sine', volume: 0.09 });
      osc({ freq: 1180, end: 1880, duration: 0.21, type: 'triangle', volume: 0.055, delay: 0.03 });
    },
    crash() {
      noise({ duration: 0.46, volume: 0.11, filter: 1200 });
      osc({ freq: 170, end: 58, duration: 0.5, type: 'sawtooth', volume: 0.1 });
    }
  };

  function setEnabled(next) {
    enabled = Boolean(next);
    if (enabled) getCtx();
  }

  function hookParentControls() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle || soundToggle.dataset.proceduralSfxHooked === 'true') return;
    soundToggle.dataset.proceduralSfxHooked = 'true';
    soundToggle.addEventListener('click', () => {
      const willEnable = !soundToggle.classList.contains('is-on');
      setEnabled(willEnable);
      if (willEnable) setTimeout(() => sfx.boot(), 0);
    }, true);
  }

  function hookFrame() {
    const frame = document.getElementById('game-frame');
    if (!frame || pollTimer) return;

    frame.addEventListener('load', () => {
      const doc = frame.contentDocument || frame.contentWindow?.document;
      const start = doc?.getElementById('start-button');
      if (start && start.dataset.proceduralSfxHooked !== 'true') {
        start.dataset.proceduralSfxHooked = 'true';
        start.addEventListener('click', () => {
          setEnabled(true);
          setTimeout(() => sfx.start(), 0);
        }, true);
      }
    });

    pollTimer = window.setInterval(() => {
      const doc = frame.contentDocument || frame.contentWindow?.document;
      if (!doc) return;

      const scoreEl = doc.getElementById('score');
      const score = Number(scoreEl?.textContent || 0);
      if (score > lastScore) sfx.collect();
      lastScore = score;

      const hand = doc.getElementById('hand-status');
      const locked = Boolean(hand?.classList.contains('locked'));
      const now = performance.now();
      if (locked && !lastHandLocked && now - lastLockAt > 900) {
        sfx.lock();
        lastLockAt = now;
      }
      lastHandLocked = locked;

      const over = doc.getElementById('game-over');
      const isOver = Boolean(over && getComputedStyle(over).display !== 'none');
      if (isOver && !lastGameOver) sfx.crash();
      lastGameOver = isOver;
    }, 100);
  }

  function init() {
    hookParentControls();
    hookFrame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
