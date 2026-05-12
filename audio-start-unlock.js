// audio-start-unlock.js
// ===== SECTION: PURPOSE =====
// Reliable music-only bootstrap for Hand Drone XS.
// Starts local music only from a user gesture on the real Start Game button.
// SFX ownership lives only in audio-sfx.js.

(function () {
  'use strict';

  // ===== SECTION: CONSTANTS =====
  const TAG = '[Hand Drone Music]';
  const SCAN_INTERVAL_MS = 500;
  const DEFAULT_MUSIC_VOLUME = 0.45;
  const MUSIC_URLS = [
    './Battlefield%20Ascent.mp3',
    './Battlefield Ascent.mp3',
    'Battlefield%20Ascent.mp3',
    'Battlefield Ascent.mp3',
    '/hand-drone-game/Battlefield%20Ascent.mp3',
    '/hand-drone-game/Battlefield Ascent.mp3',
    './public/music/Battlefield%20Ascent.mp3',
    './public/music/Battlefield Ascent.mp3',
    '/hand-drone-game/public/music/Battlefield%20Ascent.mp3',
    '/hand-drone-game/public/music/Battlefield Ascent.mp3'
  ];

  // ===== SECTION: GLOBAL STATE =====
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

  function getMusicVolume() {
    const slider = document.getElementById('music-volume');
    const value = Number(slider?.value ?? DEFAULT_MUSIC_VOLUME);
    return Number.isFinite(value) ? value : DEFAULT_MUSIC_VOLUME;
  }

  function getIframeDocument() {
    const frame = document.getElementById('game-frame');
    if (!frame) return null;
    try {
      return frame.contentDocument || frame.contentWindow?.document || null;
    } catch (err) {
      warn('Cannot access iframe for music hook:', err);
      return null;
    }
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

  // ===== SECTION: EVENT HOOKING =====
  function hookButton(button, label) {
    if (!button || button.dataset.musicStartUnlock === 'true') return;
    button.dataset.musicStartUnlock = 'true';
    button.addEventListener('click', playMusicFromStartGesture, true);
    log('Hooked Start Game music unlock:', label);
  }

  function scan() {
    hookButton(document.getElementById('start-button'), 'current document');
    hookButton(getIframeDocument()?.getElementById('start-button'), 'iframe document');
  }

  function hookAudioControls() {
    const musicToggle = document.getElementById('music-toggle');
    const musicVolume = document.getElementById('music-volume');

    if (musicToggle && musicToggle.dataset.musicToggleHooked !== 'true') {
      musicToggle.dataset.musicToggleHooked = 'true';
      musicToggle.addEventListener('click', () => {
        const textSaysOn = musicToggle.textContent.toLowerCase().includes('on');
        musicEnabled = musicToggle.classList.contains('is-on') || textSaysOn;
        if (!musicEnabled) stopMusic();
      });
    }

    if (musicVolume && musicVolume.dataset.musicVolumeHooked !== 'true') {
      musicVolume.dataset.musicVolumeHooked = 'true';
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
