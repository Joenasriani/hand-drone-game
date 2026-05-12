// audio-start-unlock.js
// Reliability patch: unlocks sound and starts the local music file from the real Start Game click.

(function () {
  const TAG = '[Hand Drone Audio]';
  const MUSIC_URLS = [
    './public/music/Battlefield%20Ascent.mp3',
    './public/music/Battlefield Ascent.mp3',
    '/hand-drone-game/public/music/Battlefield%20Ascent.mp3',
    '/hand-drone-game/public/music/Battlefield Ascent.mp3'
  ];

  let ctx = null;
  let music = null;
  let musicReady = false;
  let musicStarted = false;
  let currentMusicIndex = 0;

  function log(...args) {
    console.info(TAG, ...args);
  }

  function warn(...args) {
    console.warn(TAG, ...args);
  }

  function getAudioContext() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume().catch((err) => warn('AudioContext resume failed', err));
    return ctx;
  }

  function createMusic() {
    if (music) return music;
    music = document.createElement('audio');
    music.preload = 'auto';
    music.loop = true;
    music.volume = 0.55;
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
    const el = createMusic();
    if (musicStarted) return;
    try {
      el.currentTime = 0;
      await el.play();
      musicStarted = true;
      log('Music started:', el.currentSrc || el.src, 'ready:', musicReady);
    } catch (err) {
      warn('Music play blocked or failed:', err);
    }
  }

  function hookButton(button, label) {
    if (!button || button.dataset.audioStartUnlock === 'true') return;
    button.dataset.audioStartUnlock = 'true';
    button.addEventListener('click', startAudio, true);
    log('Hooked Start Game audio unlock:', label);
  }

  function scan() {
    hookButton(document.getElementById('start-button'), 'current document');

    const frame = document.getElementById('game-frame');
    if (frame) {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        hookButton(doc?.getElementById('start-button'), 'iframe document');
      } catch (err) {
        warn('Cannot access iframe for audio hook:', err);
      }
    }
  }

  function init() {
    createMusic();
    scan();
    const frame = document.getElementById('game-frame');
    if (frame) frame.addEventListener('load', scan);
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
    setInterval(scan, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
