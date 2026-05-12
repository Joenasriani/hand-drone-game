// config.js
// Shared constants + critical startup bootstrap for Hand Drone XS.

(function () {
  'use strict';

  // ===== SECTION: CRITICAL NO-FLASH CSS =====
  // This runs in the document head before index.html paints the old hardcoded modal.
  // It prevents the old CAMERA CONTROL popup from appearing even for one frame.
  const criticalStyle = document.createElement('style');
  criticalStyle.setAttribute('data-hdx-critical-startup', '1');
  criticalStyle.textContent = `
    #start-screen{display:none!important;opacity:0!important;pointer-events:none!important;overflow:hidden!important}
    #start-screen h2,#start-screen p,#start-screen .warning,.startup-guidance-card,.startup-guidance-title,.startup-guidance-grid,.startup-guidance-note{display:none!important}
    body.hdx-start-ready:not(.hdx-logo-splash-active) #start-screen.hdx-logo-start{display:flex!important;opacity:1!important;pointer-events:auto!important}
  `;
  document.head.appendChild(criticalStyle);

  // ===== SECTION: CONSTANTS =====
  const defaults = {
    handSmoothing: 0.12,
    handDeadZoneX: 0.6,
    handDeadZoneY: 0.4,
    targetLerpSpeed: 0.11,
    droneLerpSpeed: 0.095,
    initialSpeedLevel: 1,
    baseSpeed: 0.15,
    maxSpeedLevel: 8,
    ringsPerLevel: 20,
    speedIncrement: 0.12,
    maxBaseGameSpeed: 2.0,
    treeCount: 24,
    treeRecycleZ: 18,
    treeSpawnZ: -120,
    ringSpawnChance: 0.6,
    burstPoolSize: 20,
    burstLifeSeconds: 1.0,
    engineTrailPoolSize: 24,
    invincibilityMs: 1000,
    droneModelPath: '/models/drone.glb',
    logoSplashSrc: './logo.png',
    debugAudio: false
  };

  window.GAME_CONFIG = Object.assign({}, defaults, window.GAME_CONFIG || {});

  // ===== SECTION: HELPERS =====
  const isTopWindow = (() => {
    try { return window.parent === window; } catch (_) { return true; }
  })();

  function loadScript(src, key) {
    if (document.querySelector(`script[data-hdx-${key}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.setAttribute(`data-hdx-${key}`, '1');
    document.head.appendChild(script);
  }

  function loadStyle(href, key) {
    if (document.querySelector(`link[data-hdx-${key}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(`data-hdx-${key}`, '1');
    document.head.appendChild(link);
  }

  function cleanupOldStartupContent() {
    const start = document.getElementById('start-screen');
    if (start) {
      start.querySelectorAll('h2,p,.warning,.startup-guidance-card,.startup-guidance-title,.startup-guidance-grid,.startup-guidance-note').forEach((node) => node.remove());
    }
  }

  // ===== SECTION: BOOTSTRAP =====
  function bootstrap() {
    cleanupOldStartupContent();
    loadStyle('premium.css', 'premium');
    loadScript('logo-splash.js', 'logo-splash');
    if (isTopWindow) {
      loadScript('audio-sfx.js', 'sfx');
      loadScript('audio-start-unlock.js', 'music');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  else bootstrap();
})();
