# AUDIO ASSET MANIFEST

## Runtime sound-effect style

The selected sound-effect direction is **soft sci-fi cockpit UI**: short, responsive, low-latency, non-harsh, and suitable for a hand-tracked drone game.

## Approved sources only

Future imported SFX must come only from these approved sources:

- Sonniss GDC: https://sonniss.com/gameaudiogdc/
- Sonniss GDC mirror: https://gdc.sonniss.com/
- Kenney Audio: https://kenney.nl/assets/category:Audio
- Freesound: https://freesound.org/
- Pixabay SFX: https://pixabay.com/sound-effects/
- Pixabay License Summary: https://pixabay.com/service/license-summary/
- OpenGameArt: https://opengameart.org/
- OpenGameArt CC0 Sound Effects: https://opengameart.org/content/cc0-sound-effects
- OpenGameArt Library of Game Sounds: https://opengameart.org/content/library-of-game-sounds
- Mixkit Free Sound Effects: https://mixkit.co/free-sound-effects/
- BBC Sound Effects: https://sound-effects.bbcrewind.co.uk/

## Runtime implementation decision

No external SFX file is currently linked at runtime.

Reason:

- The approved sources are valid, but stable direct browser-safe OGG/MP3 URLs were not verified during this implementation pass.
- Several approved sources require manual download, per-file license checks, or API use.
- Remote hotlinking can fail because of CORS or source terms.
- The app should not include invented URLs, scraped URLs, or unclear-license files.

Therefore, the live implementation uses a lightweight **procedural Web Audio fallback** in `audio-sfx.js`. This keeps SFX responsive, mobile-safe, and legally traceable without adding large files.

## Current live procedural SFX

### boot

- Sound name: `boot`
- Exact source URL: Procedural fallback generated in `audio-sfx.js`
- Source site: Not applicable
- Author/source: Project-generated procedural sound
- License: Project-owned procedural audio; no external source asset
- Format: Web Audio Oscillator/Noise graph, no downloaded file
- Where used: SFX enable / cockpit boot
- Why selected: Soft startup cue that confirms audio activation without a harsh arcade sound

### start

- Sound name: `start`
- Exact source URL: Procedural fallback generated in `audio-sfx.js`
- Source site: Not applicable
- Author/source: Project-generated procedural sound
- License: Project-owned procedural audio; no external source asset
- Format: Web Audio Oscillator/Noise graph, no downloaded file
- Where used: Start Game interaction
- Why selected: Short launch cue under 1 second, responsive and mobile-safe

### lock

- Sound name: `lock`
- Exact source URL: Procedural fallback generated in `audio-sfx.js`
- Source site: Not applicable
- Author/source: Project-generated procedural sound
- License: Project-owned procedural audio; no external source asset
- Format: Web Audio Oscillator graph, no downloaded file
- Where used: Hand tracking lock feedback
- Why selected: Soft confirmation cue for palm detection without distracting the player

### collect

- Sound name: `collect`
- Exact source URL: Procedural fallback generated in `audio-sfx.js`
- Source site: Not applicable
- Author/source: Project-generated procedural sound
- License: Project-owned procedural audio; no external source asset
- Format: Web Audio Oscillator graph, no downloaded file
- Where used: Ring collection
- Why selected: Fast reward cue, low-latency, short enough for repeated gameplay feedback

### crash

- Sound name: `crash`
- Exact source URL: Procedural fallback generated in `audio-sfx.js`
- Source site: Not applicable
- Author/source: Project-generated procedural sound/noise
- License: Project-owned procedural audio; no external source asset
- Format: Web Audio Oscillator/Noise graph, no downloaded file
- Where used: Collision / mission failure
- Why selected: Soft impact/failure sound that avoids generic explosion clichés

### sweep

- Sound name: `sweep`
- Exact source URL: Procedural fallback generated in `audio-sfx.js`
- Source site: Not applicable
- Author/source: Project-generated procedural sound/noise
- License: Project-owned procedural audio; no external source asset
- Format: Web Audio Oscillator/Noise graph, no downloaded file
- Where used: Start transition accent
- Why selected: Brief sci-fi sweep to support the transition into active play

## Approved-source candidates for future manual import

These are recommended candidates only. They are not used at runtime yet. Import them only after manually selecting the exact OGG/MP3 file, confirming the exact license, verifying file size, and testing browser playback.

### Kenney Audio

- Sound name: Future UI button, pickup, confirmation cues
- Exact source URL: https://kenney.nl/assets/category:Audio
- Source site: Kenney
- Author/source: Kenney
- License: Verify on exact selected asset page before use
- Format: Usually WAV/OGG depending on pack; prefer OGG/MP3 export for runtime
- Where used: Start, lock, collect, fail, UI buttons
- Why selected: Game-focused official asset source, typically lightweight and suitable for browser games
- TODO: Select exact file, verify license, compress to OGG/MP3 if needed, place in `/public/audio/`, and update this manifest

### Mixkit Free Sound Effects

- Sound name: Future polished UI sweeps / soft sci-fi transitions
- Exact source URL: https://mixkit.co/free-sound-effects/
- Source site: Mixkit
- Author/source: Mixkit / per selected asset page
- License: Verify exact Mixkit terms for selected asset and intended use
- Format: Usually MP3/WAV depending on asset
- Where used: Start transition, UI click, failure stinger
- Why selected: Polished UI/cinematic cues fit premium cockpit presentation
- TODO: Select exact track, confirm terms, test file size, import locally only if stable and allowed

### Pixabay SFX

- Sound name: Future compressed ambience / drone / UI candidates
- Exact source URL: https://pixabay.com/sound-effects/
- Source site: Pixabay
- Author/source: Per selected asset page
- License: Verify using https://pixabay.com/service/license-summary/
- Format: Usually MP3
- Where used: Ambience, startup, transitions, UI feedback
- Why selected: Browser-friendly compressed MP3 files are commonly available
- TODO: Select exact asset page, verify author/license, download manually, store in `/public/audio/`

### OpenGameArt CC0 Sound Effects

- Sound name: Future CC0 pickup/UI/failure alternatives
- Exact source URL: https://opengameart.org/content/cc0-sound-effects
- Source site: OpenGameArt
- Author/source: Per selected asset page
- License: Verify exact asset license; prefer CC0
- Format: Varies
- Where used: Collect, lock, fail, UI feedback
- Why selected: CC0 assets can be commercial-safe when verified per file
- TODO: Select exact sound, confirm license and author, compress to OGG/MP3 if needed, import locally

### OpenGameArt Library of Game Sounds

- Sound name: Future game SFX pack candidates
- Exact source URL: https://opengameart.org/content/library-of-game-sounds
- Source site: OpenGameArt
- Author/source: Per asset page
- License: Verify exact license before use
- Format: Varies
- Where used: UI feedback, collect, fail, transition
- Why selected: Game-oriented library source
- TODO: Verify exact file and license before import

### Freesound

- Sound name: Future unique sci-fi/technology cues
- Exact source URL: https://freesound.org/
- Source site: Freesound
- Author/source: Per selected sound
- License: Verify exact license per sound before use
- Format: Varies
- Where used: Only if license is commercial-safe and attribution requirements are acceptable
- Why selected: Large library of unique sounds, but requires strict per-sound verification
- TODO: Use asset page or API to verify license and author before local import

### Sonniss GDC

- Sound name: Future high-end cinematic/game sound candidates
- Exact source URL: https://sonniss.com/gameaudiogdc/
- Source site: Sonniss
- Author/source: Sonniss GDC bundle contributors
- License: Verify bundle license and contributor terms before use
- Format: Usually WAV in large packs; convert/compress selected clips to OGG/MP3 for runtime
- Where used: Cinematic transitions or premium failure cues
- Why selected: Professional game-audio source
- TODO: Manually download, select tiny clips only, compress, and document exact pack/file/contributor/license

### BBC Sound Effects

- Sound name: Not used
- Exact source URL: https://sound-effects.bbcrewind.co.uk/
- Source site: BBC Sound Effects
- Author/source: BBC
- License: Do not use commercially unless the exact license explicitly permits the intended game use
- Format: Varies
- Where used: Not currently used
- Why selected: High-quality archive, but license constraints require caution
- TODO: Avoid for commercial game use unless explicit permission is confirmed

## Build/runtime note

This repository is a static HTML/CDN app. There is no package build step in the repository. The SFX update adds only static files and browser-side scripts.
