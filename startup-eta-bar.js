// startup-eta-bar.js
// Adds a bottom-positioned real ETA bar to the logo splash/loading gate.
// It does not change gameplay, controls, camera, music, or SFX logic.

(function () {
  'use strict';

  const MAX_EXPECTED_MS = 9000;
  const MIN_EXPECTED_MS = 2000;
  const POLL_MS = 120;
  let startedAt = performance.now();
  let timer = null;
  let observer = null;

  function injectStyle() {
    if (document.querySelector('style[data-hdx-eta-bar="true"]')) return;

    const style = document.createElement('style');
    style.dataset.hdxEtaBar = 'true';
    style.textContent = `
      #hdx-startup-gate .hdx-startup-inner {
        min-height: 100%;
        width: 100%;
        max-width: none;
        justify-content: center;
        padding-bottom: clamp(88px, 12vh, 140px);
        box-sizing: border-box;
      }

      #hdx-startup-gate .hdx-startup-logo {
        width: min(300px, 58vw, 44vh);
      }

      .hdx-startup-bottom {
        position: fixed;
        left: 50%;
        bottom: max(24px, env(safe-area-inset-bottom));
        transform: translateX(-50%);
        width: min(520px, calc(100vw - 36px));
        z-index: 10002;
        padding: 14px 16px 13px;
        border-radius: 18px;
        box-sizing: border-box;
        background:
          linear-gradient(180deg, rgba(7, 16, 32, 0.76), rgba(2, 5, 13, 0.92)),
          radial-gradient(circle at 18% 20%, rgba(110, 231, 255, 0.16), transparent 42%),
          radial-gradient(circle at 82% 60%, rgba(255, 49, 95, 0.12), transparent 46%);
        border: 1px solid rgba(110, 231, 255, 0.24);
        box-shadow:
          0 0 22px rgba(110, 231, 255, 0.10),
          0 16px 46px rgba(0, 0, 0, 0.42),
          inset 0 0 18px rgba(110, 231, 255, 0.045);
        backdrop-filter: blur(10px);
      }

      .hdx-startup-bottom .hdx-startup-track {
        width: 100% !important;
        height: 11px !important;
        margin: 0 !important;
        border-radius: 999px !important;
        background: rgba(110, 231, 255, 0.10) !important;
        border: 1px solid rgba(110, 231, 255, 0.30) !important;
        box-shadow: inset 0 0 12px rgba(0,0,0,.34), 0 0 20px rgba(110,231,255,.08) !important;
      }

      .hdx-startup-bottom .hdx-startup-fill {
        min-width: 8%;
        box-shadow: 0 0 18px rgba(255, 209, 102, 0.38);
      }

      .hdx-startup-bottom .hdx-startup-meta {
        width: 100% !important;
        margin-top: 10px;
        align-items: center;
        color: rgba(232, 250, 255, 0.78) !important;
      }

      .hdx-startup-bottom .hdx-startup-status {
        margin-top: 8px;
        min-height: 16px;
        color: rgba(255, 209, 102, 0.95) !important;
        text-align: center;
      }

      .hdx-startup-eta {
        margin-top: 7px;
        font: 800 10px Courier New, monospace;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: rgba(110, 231, 255, 0.82);
        text-align: center;
      }

      .hdx-startup-eta strong {
        color: rgba(255, 209, 102, 0.98);
        font-weight: 900;
      }

      @media (max-width: 640px) {
        .hdx-startup-bottom {
          bottom: max(16px, env(safe-area-inset-bottom));
          width: min(420px, calc(100vw - 26px));
          padding: 12px 13px 11px;
          border-radius: 16px;
        }

        #hdx-startup-gate .hdx-startup-inner {
          padding-bottom: clamp(104px, 18vh, 148px);
        }
      }

      @media (max-height: 560px) {
        .hdx-startup-bottom {
          bottom: max(10px, env(safe-area-inset-bottom));
          padding: 10px 12px 9px;
        }

        #hdx-startup-gate .hdx-startup-inner {
          padding-bottom: 88px;
        }

        .hdx-startup-bottom .hdx-startup-status,
        .hdx-startup-eta {
          margin-top: 5px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function getPercent() {
    const percentEl = document.querySelector('.hdx-startup-percent');
    const raw = percentEl?.textContent || '0';
    const value = Number(raw.replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  }

  function estimateSeconds(percent) {
    const elapsed = performance.now() - startedAt;

    if (percent >= 98) return 0;
    if (percent <= 8) return Math.ceil((MAX_EXPECTED_MS - elapsed) / 1000);

    const progressRatio = Math.max(0.08, percent / 100);
    const estimatedTotal = Math.max(MIN_EXPECTED_MS, Math.min(MAX_EXPECTED_MS, elapsed / progressRatio));
    const remaining = Math.max(0, estimatedTotal - elapsed);

    return Math.ceil(remaining / 1000);
  }

  function mountBottomBar() {
    const gate = document.getElementById('hdx-startup-gate');
    if (!gate) return false;

    let bottom = gate.querySelector('.hdx-startup-bottom');
    if (!bottom) {
      bottom = document.createElement('div');
      bottom.className = 'hdx-startup-bottom';
      gate.appendChild(bottom);
    }

    const track = gate.querySelector('.hdx-startup-track');
    const meta = gate.querySelector('.hdx-startup-meta');
    const status = gate.querySelector('.hdx-startup-status');

    if (track && track.parentNode !== bottom) bottom.appendChild(track);
    if (meta && meta.parentNode !== bottom) bottom.appendChild(meta);
    if (status && status.parentNode !== bottom) bottom.appendChild(status);

    let eta = gate.querySelector('.hdx-startup-eta');
    if (!eta) {
      eta = document.createElement('div');
      eta.className = 'hdx-startup-eta';
      bottom.appendChild(eta);
    }

    return true;
  }

  function updateEta() {
    const gate = document.getElementById('hdx-startup-gate');
    if (!gate) {
      stop();
      return;
    }

    mountBottomBar();

    const eta = gate.querySelector('.hdx-startup-eta');
    if (!eta) return;

    const percent = getPercent();
    const seconds = estimateSeconds(percent);

    eta.innerHTML = seconds <= 0
      ? 'ETA: <strong>Ready</strong>'
      : `ETA: <strong>${seconds}s</strong> - loading assets`;
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (observer) observer.disconnect();
    observer = null;
  }

  function init() {
    injectStyle();
    startedAt = performance.now();

    observer = new MutationObserver(() => {
      mountBottomBar();
      updateEta();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    timer = window.setInterval(updateEta, POLL_MS);
    updateEta();

    window.addEventListener('pagehide', stop, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
