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
})();
