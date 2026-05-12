// logo-splash.js
// Shows the uploaded game logo before the normal Start Game intro menu.

(function () {
  'use strict';

  const LOGO_SRC = 'public/1b5af8b6-75b6-4a87-a2ac-dbffcd68aabc.png';
  const SHOW_MS = 1800;
  const FADE_MS = 520;

  if (window.__HAND_DRONE_LOGO_SPLASH__) return;
  window.__HAND_DRONE_LOGO_SPLASH__ = true;

  function injectStyle() {
    if (document.querySelector('style[data-logo-splash="hand-drone-xs"]')) return;
    const style = document.createElement('style');
    style.dataset.logoSplash = 'hand-drone-xs';
    style.textContent = `
      body.hdx-logo-splash-active #start-screen {
        opacity: 0 !important;
        pointer-events: none !important;
      }

      #hdx-logo-splash {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: clamp(42px, 9vw, 120px);
        box-sizing: border-box;
        background:
          radial-gradient(circle at 50% 42%, rgba(14, 165, 233, 0.18), transparent 38%),
          radial-gradient(circle at 50% 58%, rgba(255, 49, 95, 0.09), transparent 42%),
          #03050d;
        opacity: 1;
        transition: opacity ${FADE_MS}ms ease;
      }

      #hdx-logo-splash.is-fading {
        opacity: 0;
      }

      .hdx-logo-splash-card {
        width: min(58vw, 560px);
        max-width: calc(100vw - clamp(84px, 18vw, 240px));
        aspect-ratio: 1 / 1;
        display: grid;
        place-items: center;
        filter: drop-shadow(0 0 28px rgba(110, 231, 255, 0.28)) drop-shadow(0 0 52px rgba(255, 49, 95, 0.13));
        transform: scale(0.94);
        animation: hdxLogoEnter 900ms cubic-bezier(.2,.85,.22,1) forwards;
      }

      .hdx-logo-splash-card img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      @keyframes hdxLogoEnter {
        from { transform: scale(0.88); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      @media (max-width: 640px) {
        #hdx-logo-splash {
          padding: clamp(48px, 16vw, 96px);
        }
        .hdx-logo-splash-card {
          width: min(74vw, 360px);
          max-width: calc(100vw - 96px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function showSplash() {
    if (document.getElementById('hdx-logo-splash')) return;
    injectStyle();
    document.body.classList.add('hdx-logo-splash-active');

    const splash = document.createElement('div');
    splash.id = 'hdx-logo-splash';
    splash.innerHTML = `
      <div class="hdx-logo-splash-card">
        <img src="${LOGO_SRC}" alt="Hand Drone XS" decoding="async" />
      </div>
    `;
    document.body.appendChild(splash);

    window.setTimeout(() => {
      splash.classList.add('is-fading');
      window.setTimeout(() => {
        splash.remove();
        document.body.classList.remove('hdx-logo-splash-active');
      }, FADE_MS + 60);
    }, SHOW_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showSplash, { once: true });
  } else {
    showSplash();
  }
})();
