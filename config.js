// config.js
// Shared tunable constants and lightweight bootstrap for index.html/play.html.

(function () {
  'use strict';

  // ===== SECTION: CONFIG CONSTANTS =====
  const defaults = {
    // Hand tracking
    handSmoothing: 0.12,
    handDeadZoneX: 0.6,
    handDeadZoneY: 0.4,
    targetLerpSpeed: 0.11,
    droneLerpSpeed: 0.095,

    // Speed
    initialSpeedLevel: 1,
    baseSpeed: 0.15,
    maxSpeedLevel: 8,
    ringsPerLevel: 20,
    speedIncrement: 0.12,
    maxBaseGameSpeed: 2.0,

    // World
    treeCount: 24,
    treeRecycleZ: 18,
    treeSpawnZ: -120,
    ringSpawnChance: 0.6,

    // Visual effects
    burstPoolSize: 20,
    burstLifeSeconds: 1.0,
    engineTrailPoolSize: 24,
    invincibilityMs: 1000,

    // Assets
    droneModelPath: '/models/drone.glb',

    // Debug
    debugAudio: false
  };

  window.GAME_CONFIG = Object.assign({}, defaults, window.GAME_CONFIG || {});

  // ===== SECTION: HELPERS =====
  const IS_TOP_WINDOW = (() => {
    try { return window.parent === window; } catch (_) { return true; }
  })();

  const loadScriptOnce = (src, marker) => {
    if (document.querySelector(`script[data-${marker}="hand-drone-xs"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset[marker.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = 'hand-drone-xs';
    document.head.appendChild(script);
  };

  const loadStyleOnce = (href, marker) => {
    if (document.querySelector(`link[data-${marker}="hand-drone-xs"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[marker.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = 'hand-drone-xs';
    document.head.appendChild(link);
  };

  // ===== SECTION: BASE VISUAL BOOTSTRAP =====
  const injectBaseVisualGuards = () => {
    if (document.querySelector('style[data-base-visual-guards="hand-drone-xs"]')) return;
    const style = document.createElement('style');
    style.dataset.baseVisualGuards = 'hand-drone-xs';
    style.textContent = `
      body.hand-drone-starting #loading {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  // ===== SECTION: SINGLE START CARD =====
  const injectSingleStartScreen = () => {
    if (document.querySelector('style[data-single-start-screen="hand-drone-xs"]')) return;

    const style = document.createElement('style');
    style.dataset.singleStartScreen = 'hand-drone-xs';
    style.textContent = `
      #start-screen {
        width: min(520px, calc(100vw - 28px)) !important;
        max-height: min(86vh, 620px) !important;
        overflow: auto !important;
      }

      #start-screen h2 {
        margin-bottom: 8px !important;
      }

      #start-screen > p {
        display: none !important;
      }

      .startup-guidance-card {
        margin: 14px auto 0;
        padding: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
        text-align: left;
      }

      .startup-guidance-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 12px;
        font: 800 13px Rajdhani, system-ui, sans-serif;
        letter-spacing: .14em;
        color: #e8faff;
        text-transform: uppercase;
        text-align: center;
      }

      .startup-guidance-palm {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: radial-gradient(circle at 50% 28%, rgba(110,231,255,.32), rgba(110,231,255,.08) 62%, transparent 100%);
        border: 1px solid rgba(110,231,255,.28);
        color: #6ee7ff;
        font-size: 23px;
      }

      .startup-guidance-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .startup-guidance-step {
        min-height: 88px;
        padding: 11px 9px;
        border-radius: 14px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.08);
      }

      .startup-guidance-step strong {
        display: block;
        margin-bottom: 6px;
        font: 800 11px Rajdhani, system-ui, sans-serif;
        letter-spacing: .1em;
        color: #6ee7ff;
        text-transform: uppercase;
      }

      .startup-guidance-step span {
        display: block;
        font: 600 11px Space Grotesk, system-ui, sans-serif;
        line-height: 1.35;
        color: rgba(232,250,255,.76);
      }

      .startup-guidance-note {
        margin-top: 11px;
        font: 700 10px Rajdhani, system-ui, sans-serif;
        letter-spacing: .09em;
        color: rgba(255,209,102,.86);
        text-transform: uppercase;
        text-align: center;
      }

      #start-button {
        margin-top: 16px !important;
      }

      #loading .loading-progress-wrap {
        margin: 20px auto 12px;
        width: min(340px, 100%);
      }

      #loading .loading-progress-track {
        position: relative;
        height: 10px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(110,231,255,.12);
        border: 1px solid rgba(110,231,255,.26);
      }

      #loading .loading-progress-fill {
        width: 8%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, rgba(110,231,255,.4), rgba(255,209,102,.88), rgba(110,231,255,.75));
        transition: width 280ms ease;
      }

      #loading .loading-progress-track::after {
        content: '';
        position: absolute;
        inset: 0;
        width: 42%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
        animation: loadingSweep 1.25s linear infinite;
      }

      #loading .loading-progress-meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 9px;
        font: 700 11px Rajdhani, system-ui, sans-serif;
        letter-spacing: .12em;
        color: rgba(232,250,255,.72);
        text-transform: uppercase;
      }

      #loading .loading-progress-status {
        margin-top: 10px;
        font: 600 12px Space Grotesk, system-ui, sans-serif;
        color: rgba(232,250,255,.78);
        line-height: 1.45;
      }

      #loading .loading-progress-hint {
        margin-top: 6px;
        font: 700 11px Rajdhani, system-ui, sans-serif;
        letter-spacing: .08em;
        color: rgba(255,156,175,.82);
        text-transform: uppercase;
      }

      @keyframes loadingSweep {
        from { transform: translateX(-120%); }
        to { transform: translateX(260%); }
      }

      @media (max-width: 640px) {
        #start-screen { width: min(420px, calc(100vw - 24px)) !important; }
        .startup-guidance-grid { grid-template-columns: 1fr; gap: 7px; }
        .startup-guidance-step { min-height: auto; padding: 9px; }
        .startup-guidance-title { font-size: 12px; margin-bottom: 9px; }
        .startup-guidance-palm { width: 34px; height: 34px; font-size: 20px; border-radius: 11px; }
      }
    `;
    document.head.appendChild(style);

    const enhanceStart = () => {
      const start = document.getElementById('start-screen');
      if (!start || start.querySelector('.startup-guidance-card')) return;

      document.body.classList.add('hand-drone-starting');
      const button = start.querySelector('#start-button');
      const card = document.createElement('div');
      card.className = 'startup-guidance-card';
      card.innerHTML = `
        <div class="startup-guidance-title">
          <div class="startup-guidance-palm" aria-hidden="true">✋</div>
          <div>Play with your palm</div>
        </div>
        <div class="startup-guidance-grid">
          <div class="startup-guidance-step"><strong>Show palm</strong><span>Place your open palm in front of the camera.</span></div>
          <div class="startup-guidance-step"><strong>Guide drone</strong><span>Move hand left, right, up, and down to fly.</span></div>
          <div class="startup-guidance-step"><strong>Collect rings</strong><span>Fly through gold rings and avoid obstacles.</span></div>
        </div>
        <div class="startup-guidance-note">Good light and a clear palm improve tracking.</div>
      `;

      if (button) start.insertBefore(card, button);
      else start.appendChild(card);

      if (button) {
        button.addEventListener('click', () => {
          document.body.classList.remove('hand-drone-starting');
        }, { once: true, capture: true });
      }
    };

    const enhanceLoading = () => {
      const loading = document.getElementById('loading');
      if (!loading || loading.querySelector('.loading-progress-wrap')) return;

      const wrap = document.createElement('div');
      wrap.className = 'loading-progress-wrap';
      wrap.innerHTML = `
        <div class="loading-progress-track" aria-label="Loading progress"><div class="loading-progress-fill"></div></div>
        <div class="loading-progress-meta"><span class="loading-progress-label">Preparing flight systems</span><span class="loading-progress-percent">8%</span></div>
        <div class="loading-progress-status">Loading hand tracking model...</div>
        <div class="loading-progress-hint">Camera permission may appear next</div>
      `;
      loading.appendChild(wrap);

      const fill = wrap.querySelector('.loading-progress-fill');
      const percent = wrap.querySelector('.loading-progress-percent');
      const label = wrap.querySelector('.loading-progress-label');
      const status = wrap.querySelector('.loading-progress-status');
      const hint = wrap.querySelector('.loading-progress-hint');
      const steps = [
        { p: 8, label: 'Preparing flight systems', status: 'Loading hand tracking model...', hint: 'Camera permission may appear next' },
        { p: 28, label: 'Loading MediaPipe', status: 'Downloading vision runtime and hand model...', hint: 'This can take longer on mobile networks' },
        { p: 52, label: 'Preparing camera', status: 'Waiting for browser camera permission...', hint: 'Tap Allow if your browser asks' },
        { p: 76, label: 'Starting webcam', status: 'Connecting video stream to hand tracker...', hint: 'Keep your palm visible in the camera' },
        { p: 94, label: 'Final checks', status: 'Finishing cockpit startup...', hint: 'If this takes long, check camera permission' }
      ];
      let i = 0;
      let visibleTicks = 0;

      const setStep = (step) => {
        fill.style.width = `${step.p}%`;
        percent.textContent = `${step.p}%`;
        label.textContent = step.label;
        status.textContent = step.status;
        hint.textContent = step.hint;
      };

      setStep(steps[0]);

      window.setInterval(() => {
        if (!document.body.contains(loading)) return;
        const isVisible = window.getComputedStyle(loading).display !== 'none';
        if (!isVisible) {
          visibleTicks = 0;
          i = 0;
          setStep(steps[0]);
          return;
        }
        visibleTicks += 1;
        if (i < steps.length - 1) {
          i += 1;
          setStep(steps[i]);
        } else if (visibleTicks > 10) {
          fill.style.width = '97%';
          percent.textContent = '97%';
          label.textContent = 'Still working';
          status.textContent = 'Hand tracking or camera access is taking longer than usual.';
          hint.textContent = 'Check permission, light, and network if it stays here';
        }
      }, 850);
    };

    const enhance = () => {
      enhanceStart();
      enhanceLoading();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, { once: true });
    else enhance();
  };

  // ===== SECTION: BOOTSTRAP =====
  const bootstrap = () => {
    injectBaseVisualGuards();
    loadStyleOnce('premium.css', 'premium-theme');

    // Audio ownership rule:
    // - top window owns music unlock and SFX polling for play.html wrapper mode
    // - direct index.html is also a top window, so it still gets both audio modules
    // - child iframe does not inject audio modules, preventing duplicate systems
    if (IS_TOP_WINDOW) {
      loadScriptOnce('audio-sfx.js', 'procedural-sfx');
      loadScriptOnce('audio-start-unlock.js', 'start-audio-unlock');
    }

    injectSingleStartScreen();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  else bootstrap();
})();
