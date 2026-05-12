// config.js
// Shared tunable constants for index.html and play.html.
// This removes the old play.html string-replace patching path.

(function () {
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
    droneModelPath: "/models/drone.glb"
  };

  window.GAME_CONFIG = Object.assign({}, defaults, window.GAME_CONFIG || {});

  // Remove the full-screen title splash page immediately.
  // The game should open straight to the start guidance/camera control screen.
  const injectRemoveTitleSplash = () => {
    if (document.querySelector('style[data-remove-title-splash="hand-drone-xs"]')) return;
    const style = document.createElement('style');
    style.dataset.removeTitleSplash = 'hand-drone-xs';
    style.textContent = `
      #title-splash,
      .splash {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  injectRemoveTitleSplash();

  // Premium cockpit visual identity pass.
  // Loaded through config.js so both index.html and play.html receive the same theme
  // without touching gameplay, MediaPipe, movement, collision, or renderer logic.
  const injectPremiumTheme = () => {
    if (document.querySelector('link[data-premium-theme="hand-drone-xs"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'premium.css';
    link.dataset.premiumTheme = 'hand-drone-xs';
    document.head.appendChild(link);
  };

  const injectProceduralSfx = () => {
    if (document.querySelector('script[data-procedural-sfx="hand-drone-xs"]')) return;
    const script = document.createElement('script');
    script.src = 'audio-sfx.js';
    script.defer = true;
    script.dataset.proceduralSfx = 'hand-drone-xs';
    document.head.appendChild(script);
  };

  // Startup guidance + real visible loading progress.
  // UX-only layer. Does not change gameplay, tracking math, camera access, movement,
  // collision, renderer, or controls.
  const injectStartupGuidanceAndLoading = () => {
    if (document.querySelector('style[data-startup-guidance="hand-drone-xs"]')) return;

    const style = document.createElement('style');
    style.dataset.startupGuidance = 'hand-drone-xs';
    style.textContent = `
      #start-screen {
        width: min(540px, calc(100vw - 28px)) !important;
      }

      .startup-guidance-card {
        margin: 18px auto 6px;
        padding: 16px;
        border-radius: 18px;
        background: linear-gradient(180deg, rgba(12,24,42,.72), rgba(4,8,18,.58));
        border: 1px solid rgba(110,231,255,.24);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 18px 44px rgba(0,0,0,.22);
        text-align: left;
      }

      .startup-guidance-title {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        font: 800 13px Rajdhani, system-ui, sans-serif;
        letter-spacing: .16em;
        color: #e8faff;
        text-transform: uppercase;
      }

      .startup-guidance-palm {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: radial-gradient(circle at 50% 28%, rgba(110,231,255,.32), rgba(110,231,255,.08) 62%, transparent 100%);
        border: 1px solid rgba(110,231,255,.28);
        color: #6ee7ff;
        font-size: 25px;
        box-shadow: 0 0 22px rgba(110,231,255,.14);
      }

      .startup-guidance-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .startup-guidance-step {
        min-height: 104px;
        padding: 12px 10px;
        border-radius: 14px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.08);
      }

      .startup-guidance-step strong {
        display: block;
        margin-bottom: 6px;
        font: 800 12px Rajdhani, system-ui, sans-serif;
        letter-spacing: .12em;
        color: #6ee7ff;
        text-transform: uppercase;
      }

      .startup-guidance-step span {
        display: block;
        font: 600 12px Space Grotesk, system-ui, sans-serif;
        line-height: 1.35;
        color: rgba(232,250,255,.76);
      }

      .startup-guidance-note {
        margin-top: 12px;
        font: 700 11px Rajdhani, system-ui, sans-serif;
        letter-spacing: .1em;
        color: rgba(255,209,102,.86);
        text-transform: uppercase;
        text-align: center;
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
        box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 22px rgba(110,231,255,.1);
      }

      #loading .loading-progress-fill {
        width: 8%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, rgba(110,231,255,.4), rgba(255,209,102,.88), rgba(110,231,255,.75));
        box-shadow: 0 0 18px rgba(110,231,255,.45);
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
        #start-screen { width: min(430px, calc(100vw - 24px)) !important; }
        .startup-guidance-card { padding: 13px; margin-top: 14px; }
        .startup-guidance-grid { grid-template-columns: 1fr; gap: 8px; }
        .startup-guidance-step { min-height: auto; padding: 10px; }
        .startup-guidance-title { font-size: 12px; margin-bottom: 10px; }
        .startup-guidance-palm { width: 36px; height: 36px; font-size: 21px; border-radius: 12px; }
      }
    `;
    document.head.appendChild(style);

    const enhanceStart = () => {
      const start = document.getElementById('start-screen');
      if (!start || start.querySelector('.startup-guidance-card')) return;

      const button = start.querySelector('#start-button');
      const card = document.createElement('div');
      card.className = 'startup-guidance-card';
      card.innerHTML = `
        <div class="startup-guidance-title">
          <div class="startup-guidance-palm" aria-hidden="true">✋</div>
          <div>How to pilot with your palm</div>
        </div>
        <div class="startup-guidance-grid">
          <div class="startup-guidance-step">
            <strong>1. Show palm</strong>
            <span>Place your open palm in front of the device camera.</span>
          </div>
          <div class="startup-guidance-step">
            <strong>2. Move hand</strong>
            <span>Move your hand left, right, up, and down to guide the drone.</span>
          </div>
          <div class="startup-guidance-step">
            <strong>3. Collect rings</strong>
            <span>Fly through gold rings and avoid trees or obstacles.</span>
          </div>
        </div>
        <div class="startup-guidance-note">Good light and a clear palm improve tracking.</div>
      `;

      if (button) start.insertBefore(card, button);
      else start.appendChild(card);
    };

    const enhanceLoading = () => {
      const loading = document.getElementById('loading');
      if (!loading || loading.querySelector('.loading-progress-wrap')) return;

      const wrap = document.createElement('div');
      wrap.className = 'loading-progress-wrap';
      wrap.innerHTML = `
        <div class="loading-progress-track" aria-label="Loading progress">
          <div class="loading-progress-fill"></div>
        </div>
        <div class="loading-progress-meta">
          <span class="loading-progress-label">Preparing flight systems</span>
          <span class="loading-progress-percent">8%</span>
        </div>
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
        { p: 22, label: 'Loading MediaPipe', status: 'Downloading vision runtime and hand model...', hint: 'This can take longer on mobile networks' },
        { p: 44, label: 'Preparing camera', status: 'Waiting for browser camera permission...', hint: 'Tap Allow if your browser asks' },
        { p: 68, label: 'Starting webcam', status: 'Connecting video stream to hand tracker...', hint: 'Keep your palm visible in the camera' },
        { p: 84, label: 'Calibrating hand lock', status: 'Almost ready. Show your hand clearly.', hint: 'Good light improves tracking' },
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

      const timer = window.setInterval(() => {
        if (!document.body.contains(loading)) {
          window.clearInterval(timer);
          return;
        }

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

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhance, { once: true });
    } else {
      enhance();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectPremiumTheme();
      injectProceduralSfx();
      injectStartupGuidanceAndLoading();
    }, { once: true });
  } else {
    injectPremiumTheme();
    injectProceduralSfx();
    injectStartupGuidanceAndLoading();
  }
})();
