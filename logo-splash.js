// logo-splash.js
// Shows the uploaded game logo before the normal Start Game intro menu.
// Also keeps the logo visible on the intro menu and patches game-over copy.

(function () {
  'use strict';

  const LOGO_FILE = '1b5af8b6-75b6-4a87-a2ac-dbffcd68aabc.png';
  const LOGO_PATHS = [
    `./public/${LOGO_FILE}`,
    `public/${LOGO_FILE}`,
    `/hand-drone-game/public/${LOGO_FILE}`
  ];
  const SHOW_MS = 3400;
  const FADE_MS = 650;

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
        padding: clamp(52px, 10vw, 140px);
        box-sizing: border-box;
        background:
          radial-gradient(circle at 50% 42%, rgba(14, 165, 233, 0.2), transparent 38%),
          radial-gradient(circle at 50% 58%, rgba(255, 49, 95, 0.1), transparent 42%),
          #03050d;
        opacity: 1;
        transition: opacity ${FADE_MS}ms ease;
      }

      #hdx-logo-splash.is-fading {
        opacity: 0;
      }

      .hdx-logo-splash-card {
        width: min(56vw, 540px);
        max-width: calc(100vw - clamp(104px, 20vw, 280px));
        aspect-ratio: 1 / 1;
        display: grid;
        place-items: center;
        filter: drop-shadow(0 0 30px rgba(110, 231, 255, 0.34)) drop-shadow(0 0 58px rgba(255, 49, 95, 0.16));
        transform: scale(0.9);
        opacity: 0;
        animation: hdxLogoEnter 900ms cubic-bezier(.2,.85,.22,1) forwards;
      }

      .hdx-logo-splash-card img,
      .hdx-intro-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .hdx-intro-logo {
        width: min(300px, 72vw);
        aspect-ratio: 1 / 1;
        margin: -18px auto 8px;
        display: grid;
        place-items: center;
        filter: drop-shadow(0 0 18px rgba(110, 231, 255, 0.3));
      }

      .hdx-intro-logo + h2 {
        margin-top: -12px !important;
      }

      @keyframes hdxLogoEnter {
        from { transform: scale(0.86); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      @media (max-width: 640px) {
        #hdx-logo-splash {
          padding: clamp(60px, 18vw, 110px);
        }
        .hdx-logo-splash-card {
          width: min(76vw, 360px);
          max-width: calc(100vw - 110px);
        }
        .hdx-intro-logo {
          width: min(220px, 66vw);
          margin-top: -12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function patchGameOverCopy() {
    const title = document.querySelector('#game-over h1');
    const button = document.querySelector('#game-over button');
    if (title) title.textContent = 'YOU KINDA HIT A TREE THERE!';
    if (button) button.textContent = 'RESTART';
  }

  function resolveLogoSrc() {
    return new Promise((resolve) => {
      let index = 0;
      const tryNext = () => {
        if (index >= LOGO_PATHS.length) {
          resolve(LOGO_PATHS[0]);
          return;
        }
        const src = LOGO_PATHS[index++];
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = tryNext;
        img.src = src;
      };
      tryNext();
    });
  }

  function addIntroLogo(src) {
    const start = document.getElementById('start-screen');
    if (!start || start.querySelector('.hdx-intro-logo')) return;
    const logo = document.createElement('div');
    logo.className = 'hdx-intro-logo';
    logo.innerHTML = `<img src="${src}" alt="Hand Drone XS" decoding="async" />`;
    start.insertBefore(logo, start.firstChild);
  }

  async function showSplash() {
    injectStyle();
    patchGameOverCopy();

    if (document.getElementById('hdx-logo-splash')) return;
    const logoSrc = await resolveLogoSrc();
    addIntroLogo(logoSrc);

    document.body.classList.add('hdx-logo-splash-active');

    const splash = document.createElement('div');
    splash.id = 'hdx-logo-splash';
    splash.innerHTML = `
      <div class="hdx-logo-splash-card">
        <img src="${logoSrc}" alt="Hand Drone XS" decoding="async" />
      </div>
    `;
    document.body.appendChild(splash);

    window.setTimeout(() => {
      splash.classList.add('is-fading');
      window.setTimeout(() => {
        splash.remove();
        document.body.classList.remove('hdx-logo-splash-active');
      }, FADE_MS + 80);
    }, SHOW_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showSplash, { once: true });
  } else {
    showSplash();
  }
})();
