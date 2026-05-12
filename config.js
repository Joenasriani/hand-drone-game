// config.js
// Shared constants + lightweight bootstrap for Hand Drone XS.

(function () {
  'use strict';

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
    logoSplashSrc: 'public/1b5af8b6-75b6-4a87-a2ac-dbffcd68aabc.png',
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

  function addStyleOnce(key, css) {
    if (document.querySelector(`style[data-hdx-${key}]`)) return;
    const style = document.createElement('style');
    style.setAttribute(`data-hdx-${key}`, '1');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== SECTION: START / LOADING UI =====
  function setupStartUi() {
    addStyleOnce('startui', `
      body.hand-drone-starting #loading{display:none!important}
      #start-screen{width:min(520px,calc(100vw - 28px))!important;max-height:min(86vh,620px)!important;overflow:auto!important}
      #start-screen>p{display:none!important}
      .startup-guidance-card{margin:14px auto 0;text-align:left}
      .startup-guidance-title{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;font:800 13px Rajdhani,system-ui,sans-serif;letter-spacing:.14em;color:#e8faff;text-transform:uppercase;text-align:center}
      .startup-guidance-palm{width:38px;height:38px;display:grid;place-items:center;border-radius:13px;background:radial-gradient(circle at 50% 28%,rgba(110,231,255,.32),rgba(110,231,255,.08) 62%,transparent 100%);border:1px solid rgba(110,231,255,.28);color:#6ee7ff;font-size:23px}
      .startup-guidance-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
      .startup-guidance-step{min-height:88px;padding:11px 9px;border-radius:14px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08)}
      .startup-guidance-step strong{display:block;margin-bottom:6px;font:800 11px Rajdhani,system-ui,sans-serif;letter-spacing:.1em;color:#6ee7ff;text-transform:uppercase}
      .startup-guidance-step span{display:block;font:600 11px Space Grotesk,system-ui,sans-serif;line-height:1.35;color:rgba(232,250,255,.76)}
      .startup-guidance-note{margin-top:11px;font:700 10px Rajdhani,system-ui,sans-serif;letter-spacing:.09em;color:rgba(255,209,102,.86);text-transform:uppercase;text-align:center}
      #start-button{margin-top:16px!important}
      #loading .loading-progress-wrap{margin:20px auto 12px;width:min(340px,100%)}
      #loading .loading-progress-track{height:10px;overflow:hidden;border-radius:999px;background:rgba(110,231,255,.12);border:1px solid rgba(110,231,255,.26)}
      #loading .loading-progress-fill{width:8%;height:100%;border-radius:inherit;background:linear-gradient(90deg,rgba(110,231,255,.4),rgba(255,209,102,.88),rgba(110,231,255,.75));transition:width 280ms ease}
      #loading .loading-progress-meta{display:flex;justify-content:space-between;gap:12px;margin-top:9px;font:700 11px Rajdhani,system-ui,sans-serif;letter-spacing:.12em;color:rgba(232,250,255,.72);text-transform:uppercase}
      #loading .loading-progress-status{margin-top:10px;font:600 12px Space Grotesk,system-ui,sans-serif;color:rgba(232,250,255,.78);line-height:1.45}
      #loading .loading-progress-hint{margin-top:6px;font:700 11px Rajdhani,system-ui,sans-serif;letter-spacing:.08em;color:rgba(255,156,175,.82);text-transform:uppercase}
      @media(max-width:640px){.startup-guidance-grid{grid-template-columns:1fr}.startup-guidance-step{min-height:auto}}
    `);

    const start = document.getElementById('start-screen');
    if (start && !start.querySelector('.startup-guidance-card')) {
      document.body.classList.add('hand-drone-starting');
      const button = start.querySelector('#start-button');
      const card = document.createElement('div');
      card.className = 'startup-guidance-card';
      card.innerHTML = '<div class="startup-guidance-title"><div class="startup-guidance-palm">✋</div><div>Play with your palm</div></div><div class="startup-guidance-grid"><div class="startup-guidance-step"><strong>Show palm</strong><span>Place your open palm in front of the camera.</span></div><div class="startup-guidance-step"><strong>Guide drone</strong><span>Move hand left, right, up, and down to fly.</span></div><div class="startup-guidance-step"><strong>Collect rings</strong><span>Fly through gold rings and avoid obstacles.</span></div></div><div class="startup-guidance-note">Good light and a clear palm improve tracking.</div>';
      if (button) start.insertBefore(card, button); else start.appendChild(card);
      if (button) button.addEventListener('click', () => document.body.classList.remove('hand-drone-starting'), { once: true, capture: true });
    }

    const loading = document.getElementById('loading');
    if (loading && !loading.querySelector('.loading-progress-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'loading-progress-wrap';
      wrap.innerHTML = '<div class="loading-progress-track"><div class="loading-progress-fill"></div></div><div class="loading-progress-meta"><span class="loading-progress-label">Preparing flight systems</span><span class="loading-progress-percent">8%</span></div><div class="loading-progress-status">Loading hand tracking model...</div><div class="loading-progress-hint">Camera permission may appear next</div>';
      loading.appendChild(wrap);
      const fill = wrap.querySelector('.loading-progress-fill');
      const pct = wrap.querySelector('.loading-progress-percent');
      const steps = [8, 28, 52, 76, 94];
      let i = 0;
      window.setInterval(() => {
        if (!document.body.contains(loading) || getComputedStyle(loading).display === 'none') { i = 0; fill.style.width = '8%'; pct.textContent = '8%'; return; }
        i = Math.min(i + 1, steps.length - 1);
        fill.style.width = `${steps[i]}%`;
        pct.textContent = `${steps[i]}%`;
      }, 850);
    }
  }

  // ===== SECTION: BOOTSTRAP =====
  function bootstrap() {
    loadStyle('premium.css', 'premium');
    loadScript('logo-splash.js', 'logo-splash');
    if (isTopWindow) {
      loadScript('audio-sfx.js', 'sfx');
      loadScript('audio-start-unlock.js', 'music');
    }
    setupStartUi();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  else bootstrap();
})();
