# QA Technical Audit - Hand Drone Game

## 1. Diagnostic Scan

### Current runtime files

- `index.html`
  - Main game runtime.
  - Loads `config.js` before the module game script.
  - Imports Three.js from Skypack CDN.
  - Imports MediaPipe Tasks Vision from jsDelivr CDN.
  - Creates scene, drone, objects, hand tracking, camera stream, animation loop, collision, scoring, and restart logic.

- `play.html`
  - Wrapper page that loads `index.html` in an iframe.
  - Owns the visible audio controls.
  - Now only acts as a wrapper and configuration layer.
  - Removed the old duplicate Howler/procedural audio engine to avoid competing audio systems.

- `config.js`
  - Shared configuration and UX bootstrap.
  - Injects premium theme CSS.
  - Injects `audio-sfx.js`.
  - Injects `audio-start-unlock.js`.
  - Injects startup guidance and loading progress enhancements.
  - Hides the old title splash.

- `premium.css`
  - Visual styling layer.

- `audio-sfx.js`
  - Premium procedural Web Audio SFX engine.
  - Handles boot, start, collect, lock, crash, and sweep cues.

- `audio-start-unlock.js`
  - Dedicated audio unlock and local music startup bootstrap.
  - Hooks the real Start Game button in both direct `index.html` mode and `play.html` iframe mode.
  - Preloads and plays `public/music/Battlefield Ascent.mp3` from GitHub Pages-compatible paths.

- `public/music/Battlefield Ascent.mp3`
  - Local gameplay music asset used by the audio unlock bootstrap.

### Load order dependencies

1. Browser loads `index.html` directly, or `play.html` wrapper.
2. `config.js` must load before runtime enhancements are expected.
3. `config.js` injects theme, SFX, audio unlock, and guidance layers.
4. `index.html` module script imports Three.js and MediaPipe.
5. Scene initializes immediately.
6. MediaPipe and camera initialize only after Start Game.
7. Audio unlock and local music playback initialize only after Start Game or audio-control interaction.

### Issues found

#### Critical

- `play.html` contained a second full audio engine using Howler-generated WAV data URIs while `audio-sfx.js` and `audio-start-unlock.js` also handled audio. This created duplicate responsibility and could cause missing, doubled, or race-condition-prone audio.

#### High

- `play.html` loaded `config.js` before wrapper-specific `GAME_CONFIG` overrides. Any config-injected scripts could initialize before iframe tuning values existed.
- Audio unlock depended on iframe timing. If the iframe loaded before the hook attached or mobile browser gesture policy blocked the chain, music/SFX could fail silently.

#### Medium

- `audio-start-unlock.js` scanned repeatedly without centralized cleanup.
- Console diagnostics were always active, creating noise in production.
- `play.html` still carried a full splash animation that was later hidden globally through CSS.

#### Low

- `index.html` is still a single-file game module. It works, but future maintainability would benefit from splitting into dedicated files after gameplay stabilizes.

## 2. Structural Reorganization Applied

### `play.html`

Reorganized into clear sections:

- Base Layout
- Audio Controls
- Config Overrides
- Game Host

Removed:

- duplicate Howler CDN dependency
- duplicate procedural sound generation
- duplicate procedural music generation
- duplicate score/hand/game-over polling
- redundant splash markup

Result:

- `play.html` is now a clean wrapper.
- Audio responsibility is centralized in `audio-sfx.js` and `audio-start-unlock.js`.

### `audio-start-unlock.js`

Reorganized into clear sections:

- Purpose
- Constants
- Global State
- Helpers
- Music Loading
- SFX Fallback
- Event Hooking
- Init / Cleanup

Added:

- centralized `init()`
- centralized `shutdown()`
- cleanup for interval and MutationObserver
- gated debug logging through `GAME_CONFIG.debugAudio`
- direct Start Game hook for current document and iframe document

## 3. Load Order Validation

### Validated path: direct `index.html`

1. `index.html` loads `config.js`.
2. `config.js` injects `audio-sfx.js` and `audio-start-unlock.js`.
3. `audio-start-unlock.js` scans current document for `#start-button`.
4. User clicks Start Game.
5. Browser gesture unlocks Web Audio and `<audio>` playback.
6. `public/music/Battlefield Ascent.mp3` starts.
7. Main game initializes MediaPipe and camera.

### Validated path: `play.html`

1. `play.html` defines wrapper-specific `GAME_CONFIG` first.
2. `play.html` loads `config.js` after the overrides.
3. `config.js` injects shared scripts.
4. `play.html` loads `index.html` iframe.
5. `audio-start-unlock.js` hooks the iframe Start Game button.
6. User clicks Start Game inside iframe.
7. Parent document audio unlock starts music and SFX.
8. Iframe game initializes MediaPipe and camera.

## 4. Error Handling and Fallbacks

Existing protections retained:

- MediaPipe load failures show a user-facing error.
- Camera unsupported path shows a user-facing error.
- Camera permission denial shows a user-facing error.
- Drone GLB loader failure falls back to procedural drone.
- Audio music path failure tries multiple known GitHub Pages-safe paths.

Added/cleaned:

- Music start failures are caught.
- AudioContext resume failures are caught.
- Iframe access failures are caught.
- Audio scan interval and observer are cleaned up on `pagehide`.

## 5. Cleanup and Performance

### Removed

- Duplicate Howler dependency from `play.html`.
- Duplicate generated WAV audio system from `play.html`.
- Duplicate music state machine from `play.html`.
- Duplicate score/hand/game-over polling from `play.html`.
- Redundant splash HTML in `play.html`.

### Improved

- Reduced JavaScript weight on the wrapper page.
- Reduced duplicate audio event listeners.
- Reduced probability of duplicate sounds.
- Reduced race risk between iframe loading and audio hooks.
- Added cleanup for observer/timer in `audio-start-unlock.js`.

## 6. Final Load Sequence

### Direct game URL

1. Browser opens `index.html`.
2. `config.js` applies shared config and injects runtime helpers.
3. Three.js scene initializes.
4. Start screen is shown.
5. Audio unlock script hooks Start Game.
6. User clicks Start Game.
7. Music and SFX unlock immediately.
8. MediaPipe loads.
9. Camera permission is requested.
10. Webcam stream starts.
11. Hand tracking starts.
12. Game loop becomes active.

### Wrapper URL

1. Browser opens `play.html`.
2. Wrapper config overrides are applied before `config.js`.
3. `config.js` injects shared helpers.
4. `index.html` loads inside iframe.
5. Start Game inside iframe is hooked by `audio-start-unlock.js`.
6. User clicks Start Game.
7. Parent audio context/music unlocks.
8. Iframe game initializes MediaPipe and camera.
9. Gameplay starts.

## Remaining architectural note

`index.html` remains a large single-file game module. It is currently acceptable for a static CDN-hosted prototype, but a future production hardening pass should split it into:

- `game-config.js`
- `scene.js`
- `hand-tracking.js`
- `world.js`
- `effects.js`
- `game-state.js`
- `ui.js`

That split should be done carefully in a separate PR because it carries higher regression risk than this load-order cleanup.
