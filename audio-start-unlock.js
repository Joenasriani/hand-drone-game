// audio-start-unlock.js
// ===== SECTION: PURPOSE =====
// Reliable audio bootstrap for Hand Drone XS.
// Starts audio only from a user gesture on the real Start Game button.
// Supports both direct index.html use and play.html iframe use.

(function () {
  'use strict';

  // ===== SECTION: CONSTANTS =====
  const TAG = '[Hand Drone Audio]';
  const SCAN_INTERVAL_MS = 500;
  const DEFAULT_MUSIC_VOLUME = 0.45;
  const MUSIC_URLS = [
    './public/music/Battlefield%20Ascent.mp3',
    './public/music/Battlefield Ascent.mp3',
    '/hand-drone-game/public/music/Battlefield%20Ascent.mp3',
    '/hand-drone-game/public/music/Battlefield Ascent.mp3'
  ];

  // ===== SECTION: GLOBAL STATE =====
  let ctx = null;
  let music = null;
  let musicReady = false;
  let musicStarted = false;
  let musicEnabled = true;
  let currentMusicIndex = 0;
  let scanTimer = null;
  let observer = null;

  // ===== SECTION: HELPERS =====
  function log(...args) {
    if (window.GAME_CONFIG?.debugAudio) console.info(TAG, ...args);
  }

  function warn(...args) {
    console.warn(TAG, ...args);
  }

  function getAudioContext() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume().catch((err) => warn('AudioContext resume failed', err));
    return ctx;
  }

  function getMusicVolume() {
    const slider = document.getElementById('music-volume');
    const value = Number(slider?.value ?? DEFAULT_MUSIC_VOLUME);
    return Number.isFinite(value) ? value : DEFAULT_MUSIC_VOLUME;
  }

  // ===== SECTION: MUSIC LOADING =====
  function createMusic() {
    if (music) return music;

    music = document.createElement('audio');
    music.preload = 'auto';
    music.loop = true;
    music.volume = getMusicVolume();
    music.style.display = 'none';
    document.body.appendChild(music);

    music.addEventListener('canplaythrough', () => {
      musicReady = true;
      log('Music buffered:', music.currentSrc || music.src);
    });

    music.addEventListener('error', () => {
      currentMusicIndex += 1;
      if (currentMusicIndex >= MUSIC_URLS.length) {
        warn('Music failed to load from all known local paths.');
        return;
      }
      music.src = MUSIC_URLS[currentMusicIndex];
      log('Trying next music path:', music.src);
      music.load();
    });

    music.src = MUSIC_URLS[currentMusicIndex];
    log('Preloading music:', music.src);
    music.load();
    return music;
  }

  async function playMusicFromStartGesture() {
    if (!musicEnabled || musicStarted) return;
    const el = createMusic();
    el.volume = getMusicVolume();

    try {
      el.currentTime = 0;
      await el.play();
      musicStarted = true;
      log('Music started:', el.currentSrc || el.src, 'ready:', musicReady);
    } catch (err) {
      warn('Music play blocked or failed:', err);
    }
  }

  function stopMusic() {
    if (!music) return;
    music.pause();
    musicStarted = false;
  }

  // ===== SECTION: SFX FALLBACK =====
  function premiumClick() {
    const c = getAudioContext();
    const t = c.currentTime;
    const gain = c.createGain();
    const comp = c.createDynamicsCompressor();
    const osc1 = c.createOscillator();
    const osc2 = c.createOscillator();
    const filter = c.createBiquadFilter();

    comp.threshold.value = -18;
    comp.ratio.value = 3;
    filter.type = 'lowpass';
    filter.frequency.value = 5200;

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(120, t);
    osc1.frequency.exponentialRampToValueAtTime(210, t + 0.2);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(620, t + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(1120, t + 0.22);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(comp).connect(c.destination);

    osc1.start(t);
    osc2.start(t + 0.03);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  async function startAudio() {
    getAudioContext();
    premiumClick();
    await playMusicFromStartGesture();
  }

  // ===== SECTION: EVENT HOOKING =====
  function hookButton(button, label) {
    if (!button || button.dataset.audioStartUnlock === 'true') return;
    button.dataset.audioStartUnlock = 'true';
    button.addEventListener('click', startAudio, true);
    log('Hooked Start Game audio unlock:', label);
  }

  function getIframeDocument() {
    const frame = document.getElementById('game-frame');
    if (!frame) return null;
    try {
      return frame.contentDocument || frame.contentWindow?.document || null;
    } catch (err) {
      warn('Cannot access iframe for audio hook:', err);
      return null;
    }
  }

  function scan() {
    hookButton(document.getElementById('start-button'), 'current document');
    hookButton(getIframeDocument()?.getElementById('start-button'), 'iframe document');
  }

  function hookAudioControls() {
    const musicToggle = document.getElementById('music-toggle');
    const musicVolume = document.getElementById('music-volume');

    if (musicToggle && musicToggle.dataset.audioStartToggleHooked !== 'true') {
      musicToggle.dataset.audioStartToggleHooked = 'true';
      musicToggle.addEventListener('click', () => {
        musicEnabled = musicToggle.classList.contains('is-on') || musicToggle.textContent.toLowerCase().includes('on');
        if (!musicEnabled) stopMusic();
      });
    }

    if (musicVolume && musicVolume.dataset.audioStartVolumeHooked !== 'true') {
      musicVolume.dataset.audioStartVolumeHooked = 'true';
      musicVolume.addEventListener('input', () => {
        if (music) music.volume = getMusicVolume();
      });
    }
  }

  // ===== SECTION: INIT / CLEANUP =====
  function init() {
    createMusic();
    scan();
    hookAudioControls();

    const frame = document.getElementById('game-frame');
    if (frame) frame.addEventListener('load', scan);

    observer = new MutationObserver(() => {
      scan();
      hookAudioControls();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    scanTimer = window.setInterval(scan, SCAN_INTERVAL_MS);
    window.addEventListener('pagehide', shutdown, { once: true });
  }

  function shutdown() {
    if (scanTimer) window.clearInterval(scanTimer);
    scanTimer = null;
    if (observer) observer.disconnect();
    observer = null;
    stopMusic();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
