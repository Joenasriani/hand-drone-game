// audio-sfx.js
// High-end browser-safe SFX + local music folder startup player for Hand Drone XS.
// SFX are generated through Web Audio so no unverified external URLs are used.
// Music is loaded from local /music or /public/music candidates and starts on Start Game.

(function () {
  let ctx;
  let enabled = false;
  let musicEnabled = true;
  let localMusicReady = false;
  let localMusicFailed = false;
  let localMusicStarted = false;
  let musicEl = null;
  let musicGain = 0.38;
  let lastScore = 0;
  let lastHandLocked = false;
  let lastLockAt = 0;
  let lastGameOver = false;
  let pollTimer = null;

  const MUSIC_CANDIDATES = [
    './music/gameplay.mp3',
    './music/gameplay.ogg',
    './music/music.mp3',
    './music/music.ogg',
    './music/background.mp3',
    './music/background.ogg',
    './music/Color%20Parade.mp3',
    './music/Color Parade.mp3',
    './music/1.mp3',
    './music/1.ogg',
    '/music/gameplay.mp3',
    '/music/gameplay.ogg',
    '/music/music.mp3',
    '/music/music.ogg',
    '/music/background.mp3',
    '/music/background.ogg',
    '/music/Color%20Parade.mp3',
    '/music/Color Parade.mp3',
    '/music/1.mp3',
    '/music/1.ogg',
    './public/music/gameplay.mp3',
    './public/music/gameplay.ogg',
    './public/music/music.mp3',
    './public/music/music.ogg',
    './public/music/background.mp3',
    './public/music/background.ogg',
    './public/music/Color%20Parade.mp3',
    './public/music/Color Parade.mp3',
    './public/music/1.mp3',
    './public/music/1.ogg',
    '/public/music/gameplay.mp3',
    '/public/music/gameplay.ogg',
    '/public/music/music.mp3',
    '/public/music/music.ogg',
    '/public/music/background.mp3',
    '/public/music/background.ogg',
    '/public/music/Color%20Parade.mp3',
    '/public/music/Color Parade.mp3',
    '/public/music/1.mp3',
    '/public/music/1.ogg'
  ];

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function createDynamicsChain(c) {
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -24;
    comp.knee.value = 22;
    comp.ratio.value = 4;
    comp.attack.value = 0.006;
    comp.release.value = 0.18;
    return comp;
  }

  function gainNode(c, volume, start) {
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.012);
    return gain;
  }

  function osc({ freq = 440, end = freq, duration = 0.16, type = 'sine', volume = 0.12, delay = 0, pan = 0, filter = 4200 }) {
    if (!enabled) return;
    const c = getCtx();
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    const f = c.createBiquadFilter();
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    const g = gainNode(c, volume, t);
    const comp = createDynamicsChain(c);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + duration);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(filter, t);
    f.Q.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    if (p) p.pan.setValueAtTime(pan, t);
    o.connect(f);
    if (p) f.connect(p).connect(g); else f.connect(g);
    g.connect(comp).connect(c.destination);
    o.start(t);
    o.stop(t + duration + 0.03);
  }

  function noise({ duration = 0.22, volume = 0.08, filter = 1200, delay = 0, pan = 0, type = 'lowpass' }) {
    if (!enabled) return;
    const c = getCtx();
    const t = c.currentTime + delay;
    const len = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const p = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - p, 1.8);
    }
    const src = c.createBufferSource();
    const f = c.createBiquadFilter();
    const panNode = c.createStereoPanner ? c.createStereoPanner() : null;
    const g = gainNode(c, volume, t);
    const comp = createDynamicsChain(c);
    f.type = type;
    f.frequency.setValueAtTime(filter, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(60, filter * 0.32), t + duration);
    f.Q.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    if (panNode) panNode.pan.setValueAtTime(pan, t);
    src.buffer = buffer;
    src.connect(f);
    if (panNode) f.connect(panNode).connect(g); else f.connect(g);
    g.connect(comp).connect(c.destination);
    src.start(t);
    src.stop(t + duration + 0.03);
  }

  const sfx = {
    boot() {
      osc({ freq: 64, end: 108, duration: 0.46, type: 'sine', volume: 0.15, filter: 900 });
      osc({ freq: 360, end: 620, duration: 0.34, type: 'triangle', volume: 0.052, delay: 0.08, pan: -0.18, filter: 2600 });
      osc({ freq: 910, end: 1320, duration: 0.2, type: 'sine', volume: 0.024, delay: 0.18, pan: 0.22, filter: 5400 });
      noise({ duration: 0.52, volume: 0.018, filter: 2400, type: 'bandpass' });
    },
    start() {
      osc({ freq: 96, end: 154, duration: 0.24, type: 'sine', volume: 0.12, filter: 720 });
      osc({ freq: 540, end: 920, duration: 0.2, type: 'triangle', volume: 0.065, delay: 0.04, pan: -0.1, filter: 3800 });
      osc({ freq: 1320, end: 1760, duration: 0.14, type: 'sine', volume: 0.025, delay: 0.08, pan: 0.16, filter: 6200 });
      noise({ duration: 0.18, volume: 0.018, filter: 4200, delay: 0.02, type: 'bandpass' });
    },
    lock() {
      osc({ freq: 720, end: 705, duration: 0.1, type: 'sine', volume: 0.052, pan: -0.08, filter: 3200 });
      osc({ freq: 1140, end: 960, duration: 0.14, type: 'sine', volume: 0.04, delay: 0.03, pan: 0.1, filter: 4600 });
    },
    collect() {
      osc({ freq: 690, end: 1180, duration: 0.13, type: 'sine', volume: 0.07, pan: -0.12, filter: 4500 });
      osc({ freq: 1080, end: 1740, duration: 0.18, type: 'triangle', volume: 0.045, delay: 0.025, pan: 0.16, filter: 6200 });
      noise({ duration: 0.12, volume: 0.012, filter: 6200, delay: 0.04, type: 'highpass' });
    },
    crash() {
      noise({ duration: 0.42, volume: 0.09, filter: 1400, type: 'lowpass' });
      osc({ freq: 146, end: 52, duration: 0.52, type: 'sawtooth', volume: 0.082, filter: 620 });
      osc({ freq: 48, end: 36, duration: 0.62, type: 'sine', volume: 0.07, delay: 0.03, filter: 220 });
    },
    sweep() {
      noise({ duration: 0.2, volume: 0.018, filter: 5200, type: 'bandpass' });
      osc({ freq: 980, end: 420, duration: 0.2, type: 'sine', volume: 0.022, filter: 5000 });
    }
  };

  function setEnabled(next) {
    enabled = Boolean(next);
    if (enabled) getCtx();
  }

  function createLocalMusicElement() {
    if (musicEl) return musicEl;
    musicEl = document.createElement('audio');
    musicEl.preload = 'auto';
    musicEl.loop = true;
    musicEl.crossOrigin = 'anonymous';
    musicEl.volume = musicGain;
    musicEl.style.display = 'none';
    document.body.appendChild(musicEl);
    return musicEl;
  }

  function preloadLocalMusic() {
    const el = createLocalMusicElement();
    if (localMusicReady || localMusicFailed) return;
    let index = 0;
    const tryNext = () => {
      if (index >= MUSIC_CANDIDATES.length) {
        localMusicFailed = true;
        console.warn('No playable local music file found in /music or /public/music. Procedural music fallback may continue.');
        return;
      }
      const src = MUSIC_CANDIDATES[index++];
      el.src = src;
      el.load();
    };
    el.addEventListener('canplaythrough', () => {
      localMusicReady = true;
      console.info('Local gameplay music buffered:', el.currentSrc || el.src);
    });
    el.addEventListener('error', tryNext);
    tryNext();
  }

  async function playLocalMusicOnStart() {
    if (!musicEnabled || localMusicStarted) return;
    const el = createLocalMusicElement();
    preloadLocalMusic();
    el.volume = musicGain;
    try {
      el.currentTime = 0;
      await el.play();
      localMusicStarted = true;
      // Stop the procedural Howler gameplay loop if it is active in play.html.
      if (window.Howler) {
        // Do not mute SFX globally. This local music simply plays alongside SFX.
      }
    } catch (err) {
      console.warn('Local music did not start; keeping procedural fallback.', err);
    }
  }

  function hookParentControls() {
    const soundToggle = document.getElementById('sound-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const musicVolume = document.getElementById('music-volume');

    if (soundToggle && soundToggle.dataset.highEndSfxHooked !== 'true') {
      soundToggle.dataset.highEndSfxHooked = 'true';
      soundToggle.addEventListener('click', () => {
        const willEnable = !soundToggle.classList.contains('is-on');
        setEnabled(willEnable);
        if (willEnable) setTimeout(() => sfx.boot(), 0);
      }, true);
    }

    if (musicToggle && musicToggle.dataset.localMusicHooked !== 'true') {
      musicToggle.dataset.localMusicHooked = 'true';
      musicToggle.addEventListener('click', () => {
        musicEnabled = !musicToggle.classList.contains('is-on');
        if (!musicEnabled && musicEl) {
          musicEl.pause();
          localMusicStarted = false;
        }
      }, true);
    }

    if (musicVolume && musicVolume.dataset.localMusicHooked !== 'true') {
      musicVolume.dataset.localMusicHooked = 'true';
      musicGain = Number(musicVolume.value || 0.38);
      musicVolume.addEventListener('input', () => {
        musicGain = Number(musicVolume.value || 0.38);
        if (musicEl) musicEl.volume = musicGain;
      });
    }

    preloadLocalMusic();
  }

  function hookFrame() {
    const frame = document.getElementById('game-frame');
    if (!frame || pollTimer) return;

    frame.addEventListener('load', () => {
      const doc = frame.contentDocument || frame.contentWindow?.document;
      const start = doc?.getElementById('start-button');
      if (start && start.dataset.highEndSfxHooked !== 'true') {
        start.dataset.highEndSfxHooked = 'true';
        start.addEventListener('click', () => {
          setEnabled(true);
          setTimeout(() => sfx.start(), 0);
          setTimeout(() => sfx.sweep(), 65);
          playLocalMusicOnStart();
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
      if (isOver && !lastGameOver) {
        sfx.crash();
        if (musicEl) {
          musicEl.pause();
          localMusicStarted = false;
        }
      }
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
