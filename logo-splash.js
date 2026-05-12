// logo-splash.js
// Root logo start flow for Hand Drone XS.
// Uses logo.png and removes the old camera-control intro from the visible UI.

(function () {
  'use strict';

  const LOGO_PATHS = ['./logo.png', 'logo.png', '/hand-drone-game/logo.png'];
  const SPLASH_SHOW_MS = 2000;
  const FADE_MS = 420;

  if (window.__HAND_DRONE_LOGO_SPLASH__) return;
  window.__HAND_DRONE_LOGO_SPLASH__ = true;

  function injectStyle() {
    if (document.querySelector('style[data-logo-splash="hand-drone-xs"]')) return;
    const style = document.createElement('style');
    style.dataset.logoSplash = 'hand-drone-xs';
    style.textContent = `
      #start-screen{display:none!important;opacity:0!important;pointer-events:none!important}
      body.hdx-start-ready:not(.hdx-logo-splash-active) #start-screen.hdx-logo-start{display:flex!important;opacity:1!important;pointer-events:auto!important}
      body.hdx-logo-splash-active #start-screen{display:none!important;opacity:0!important;pointer-events:none!important}
      #start-screen h2,#start-screen p,#start-screen .warning,.startup-guidance-card,.startup-guidance-title,.startup-guidance-grid,.startup-guidance-note{display:none!important}
      #hdx-logo-splash{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:clamp(44px,9vw,128px);box-sizing:border-box;background:radial-gradient(circle at 50% 42%,rgba(14,165,233,.2),transparent 38%),radial-gradient(circle at 50% 58%,rgba(255,49,95,.1),transparent 42%),#03050d;opacity:1;transition:opacity ${FADE_MS}ms ease;overflow:hidden}
      #hdx-logo-splash.is-fading{opacity:0}
      .hdx-logo-splash-card{width:min(48vw,460px);max-width:calc(100vw - 88px);max-height:calc(100vh - 88px);aspect-ratio:1/1;display:grid;place-items:center;filter:drop-shadow(0 0 30px rgba(110,231,255,.34)) drop-shadow(0 0 58px rgba(255,49,95,.16));animation:hdxLogoEnter 800ms cubic-bezier(.2,.85,.22,1) forwards;opacity:0;transform:scale(.9)}
      .hdx-logo-splash-card img,.hdx-intro-logo img{width:100%;height:100%;object-fit:contain;display:block}
      #start-screen.hdx-logo-start{width:min(500px,calc(100vw - 32px))!important;height:auto!important;min-height:0!important;max-height:calc(100vh - 32px)!important;padding:clamp(14px,2.4vw,24px)!important;box-sizing:border-box!important;overflow:hidden!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:clamp(8px,1.4vh,14px)!important}
      .hdx-intro-logo{width:min(300px,58vw,52vh);max-width:100%;aspect-ratio:1/1;margin:0 auto;display:grid;place-items:center;filter:drop-shadow(0 0 20px rgba(110,231,255,.3));flex:0 1 auto;min-height:0}
      #start-screen.hdx-logo-start #start-button{margin-top:0!important;flex:0 0 auto;white-space:nowrap;max-width:100%;font-size:clamp(14px,2.1vw,18px)!important;padding:clamp(11px,1.7vh,15px) clamp(22px,4vw,30px)!important}
      @keyframes hdxLogoEnter{from{transform:scale(.86);opacity:0}to{transform:scale(1);opacity:1}}
      @media(max-width:640px){#hdx-logo-splash{padding:clamp(42px,14vw,90px)}.hdx-logo-splash-card{width:min(68vw,300px);max-width:calc(100vw - 84px);max-height:calc(100vh - 84px)}#start-screen.hdx-logo-start{width:min(390px,calc(100vw - 24px))!important;max-height:calc(100vh - 24px)!important;padding:16px!important;gap:10px!important}.hdx-intro-logo{width:min(230px,62vw,46vh)}#start-screen.hdx-logo-start #start-button{font-size:14px!important;padding:11px 22px!important}}
      @media(max-height:560px){#start-screen.hdx-logo-start{padding:10px 14px!important;gap:8px!important}.hdx-intro-logo{width:min(220px,45vw,42vh)}#start-screen.hdx-logo-start #start-button{padding:9px 20px!important;font-size:13px!important}}
    `;
    document.head.appendChild(style);
  }

  function resolveLogoSrc() {
    return new Promise((resolve) => {
      let index = 0;
      const tryNext = () => {
        if (index >= LOGO_PATHS.length) { resolve(LOGO_PATHS[0]); return; }
        const src = LOGO_PATHS[index++];
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = tryNext;
        img.src = src;
      };
      tryNext();
    });
  }

  function cleanupOldIntro() {
    document.querySelectorAll('.startup-guidance-card,.startup-guidance-title,.startup-guidance-grid,.startup-guidance-note').forEach((node) => node.remove());
    const start = document.getElementById('start-screen');
    if (start) start.querySelectorAll('h2,p,.warning').forEach((node) => node.remove());
  }

  function patchGameOverCopy() {
    const title = document.querySelector('#game-over h1');
    const button = document.querySelector('#game-over button');
    if (title) title.textContent = 'YOU KINDA HIT A TREE THERE!';
    if (button) button.textContent = 'RESTART';
  }

  function hideAllStartupOverlays() {
    const splash = document.getElementById('hdx-logo-splash');
    if (splash) splash.remove();
    cleanupOldIntro();
    document.body.classList.remove('hdx-logo-splash-active', 'hand-drone-starting', 'hdx-start-ready');
  }

  function replaceOldStartMenu(src) {
    const start = document.getElementById('start-screen');
    if (!start) return;
    cleanupOldIntro();
    start.classList.add('hdx-logo-start');

    let logo = start.querySelector('.hdx-intro-logo');
    if (!logo) {
      logo = document.createElement('div');
      logo.className = 'hdx-intro-logo';
      logo.innerHTML = '<img src="' + src + '" alt="Hand Drone XS" decoding="async" />';
      start.insertBefore(logo, start.firstChild);
    }

    const button = start.querySelector('#start-button');
    if (button && button.dataset.hdxOverlayCleanup !== 'true') {
      button.textContent = 'START GAME';
      button.dataset.hdxOverlayCleanup = 'true';
      button.addEventListener('click', hideAllStartupOverlays, true);
    } else if (button) {
      button.textContent = 'START GAME';
    }
  }

  async function boot() {
    injectStyle();
    patchGameOverCopy();
    cleanupOldIntro();
    const logoSrc = await resolveLogoSrc();
    replaceOldStartMenu(logoSrc);

    if (document.getElementById('hdx-logo-splash')) return;
    document.body.classList.add('hdx-logo-splash-active');

    const splash = document.createElement('div');
    splash.id = 'hdx-logo-splash';
    splash.innerHTML = '<div class="hdx-logo-splash-card"><img src="' + logoSrc + '" alt="Hand Drone XS" decoding="async" /></div>';
    document.body.appendChild(splash);

    window.setTimeout(() => {
      splash.classList.add('is-fading');
      window.setTimeout(() => {
        if (splash.parentNode) splash.remove();
        document.body.classList.remove('hdx-logo-splash-active');
        replaceOldStartMenu(logoSrc);
        document.body.classList.add('hdx-start-ready');
      }, FADE_MS + 80);
    }, SPLASH_SHOW_MS);

    const observer = new MutationObserver(() => {
      cleanupOldIntro();
      replaceOldStartMenu(logoSrc);
      patchGameOverCopy();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
