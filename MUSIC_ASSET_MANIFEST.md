# MUSIC ASSET MANIFEST

## Selected music style

The selected music direction for Hand Drone XS is **soft cinematic sci-fi cockpit ambient pulse**.

This is the most convenient style for the current app because the game is hand-tracked, drone-based, mobile-friendly, and visually styled like a premium cockpit HUD. The music should support concentration and motion without distracting from camera tracking, ring collection, or obstacle avoidance.

## Approved music sources only

Future imported music must come only from these approved sources:

- Kenney Music Jingles: https://kenney.nl/assets/music-jingles
- Kenney Audio Category: https://kenney.nl/assets/category:Audio
- OpenGameArt CC0 Music: https://opengameart.org/content/cc0-music
- OpenGameArt Public Domain Music: https://opengameart.org/content/public-domain-music
- OpenGameArt Music Pack 11: https://opengameart.org/content/music-11
- Pixabay Music: https://pixabay.com/music/
- Pixabay License Summary: https://pixabay.com/service/license-summary/
- Pixabay Terms: https://pixabay.com/service/terms/
- Free Music Archive: https://freemusicarchive.org/
- Free Music Archive License Guide: https://freemusicarchive.org/License_Guide
- Mixkit Free Stock Music: https://mixkit.co/free-stock-music/
- Incompetech Royalty-Free Music: https://incompetech.com/music/
- Incompetech Licenses: https://incompetech.com/music/royalty-free/licenses/

## Runtime implementation decision

No external music file is currently linked in runtime.

Reason:

- Stable browser-safe direct file URLs were not verified for the exact selected tracks during implementation.
- Some approved sources require per-track license checks, attribution review, or manual download.
- Remote hotlinking may be blocked by CORS or disallowed by source terms.
- The implementation avoids invented URLs, scraped links, or unclear-license files.

The current runtime music uses lightweight procedural WAV data URIs generated in `play.html` and played through Howler after user interaction.

## Current live procedural music

### menu

- Track name: `menu`
- Exact source URL: Procedural fallback generated in `play.html`
- Source site: Not applicable
- Author/composer: Project-generated procedural music
- License: Project-owned procedural audio, no external source asset
- Format: Runtime-generated WAV data URI
- Where used: Menu/start ambience after Music is enabled
- Loop behaviour: Loops continuously until gameplay starts or music is muted
- Reason chosen: Soft cinematic drone-cockpit bed that is lightweight, mobile-safe, and does not depend on remote files

### gameplay

- Track name: `gameplay`
- Exact source URL: Procedural fallback generated in `play.html`
- Source site: Not applicable
- Author/composer: Project-generated procedural music
- License: Project-owned procedural audio, no external source asset
- Format: Runtime-generated WAV data URI
- Where used: Active gameplay flight loop
- Loop behaviour: Loops continuously while gameplay is active and music is enabled
- Reason chosen: Low-intensity pulse supports forward motion and concentration without overwhelming hand-tracking gameplay

### victory

- Track name: `victory`
- Exact source URL: Procedural fallback generated in `play.html`
- Source site: Not applicable
- Author/composer: Project-generated procedural stinger
- License: Project-owned procedural audio, no external source asset
- Format: Runtime-generated WAV data URI
- Where used: Milestone reward stinger, currently triggered every 100 score points if music is enabled
- Loop behaviour: One-shot
- Reason chosen: Short bright reward cue under 2 seconds, mobile-safe and responsive

### failure

- Track name: `failure`
- Exact source URL: Procedural fallback generated in `play.html`
- Source site: Not applicable
- Author/composer: Project-generated procedural stinger
- License: Project-owned procedural audio, no external source asset
- Format: Runtime-generated WAV data URI
- Where used: Mission failure / game over transition
- Loop behaviour: One-shot
- Reason chosen: Soft descending cue that communicates failure without sounding like a generic explosion

## Future approved-source candidates for manual import

The following approved sources are suitable candidates for manually imported music. Exact files should be selected, downloaded, compressed if needed, and stored locally in `/public/music/` only after confirming license and file size.

### Kenney Music Jingles

- Track name: Future menu loop / short transition candidates
- Exact source URL: https://kenney.nl/assets/music-jingles
- Source site: Kenney
- Author/composer: Kenney
- License: Verify on the asset page before import
- Format: Usually game-friendly audio files, exact format must be checked per download
- Where used: Menu theme, UI transitions, short stingers
- Loop behaviour: Use short loops or one-shots only
- Reason chosen: Kenney is an official game asset source with lightweight game-oriented packs
- TODO: Select exact file, verify license, download manually, add to `/public/music/`, then update this manifest with exact file name and license

### OpenGameArt CC0 Music

- Track name: Future gameplay loop candidates
- Exact source URL: https://opengameart.org/content/cc0-music
- Source site: OpenGameArt
- Author/composer: Per selected asset
- License: Verify exact license on each asset page; prefer CC0
- Format: Varies by asset
- Where used: Gameplay loop, low-intensity ambient bed
- Loop behaviour: Only use short seamless loops after local testing
- Reason chosen: CC0 candidates can be commercially safer if verified per asset
- TODO: Select exact track, verify author/license, download manually, compress to OGG/MP3 if needed, add to `/public/music/`

### OpenGameArt Public Domain Music

- Track name: Future public-domain ambient candidates
- Exact source URL: https://opengameart.org/content/public-domain-music
- Source site: OpenGameArt
- Author/composer: Per selected asset
- License: Verify exact public-domain status on asset page
- Format: Varies
- Where used: Menu ambience or subtle gameplay bed
- Loop behaviour: Use only short, mobile-safe loops
- Reason chosen: Public-domain material can be useful, but every track still needs verification
- TODO: Select exact file and document exact asset page, author, license, format, and file size

### OpenGameArt Music 11 Pack

- Track name: Future game loop candidates
- Exact source URL: https://opengameart.org/content/music-11
- Source site: OpenGameArt
- Author/composer: Per asset pack page
- License: Verify exact license on the page before import
- Format: Varies
- Where used: Optional gameplay loop or menu cue
- Loop behaviour: Test seamless looping before use
- Reason chosen: Prepackaged game music may include suitable short loops
- TODO: Confirm exact license and file names before importing

### Pixabay Music

- Track name: Future cinematic ambient drone candidates
- Exact source URL: https://pixabay.com/music/
- Source site: Pixabay
- Author/composer: Per selected asset page
- License: Verify using https://pixabay.com/service/license-summary/ and https://pixabay.com/service/terms/
- Format: Usually MP3
- Where used: Menu ambience, cinematic transition, gameplay bed
- Loop behaviour: Avoid long full-length songs unless edited/compressed locally
- Reason chosen: Pixabay often has compressed browser-friendly music, but each track must be verified
- TODO: Select exact track page, verify license, author, format, file size, and local import permission

### Mixkit Free Stock Music

- Track name: Future soft electronic / ambient candidates
- Exact source URL: https://mixkit.co/free-stock-music/
- Source site: Mixkit
- Author/composer: Mixkit / per selected page if listed
- License: Verify exact Mixkit license and usage permissions before import
- Format: Usually MP3
- Where used: Menu theme or transition music
- Loop behaviour: Use manually edited short loop if allowed
- Reason chosen: Polished production music source suitable for premium UI feel
- TODO: Select exact track page, verify license, download manually, store locally, document exact file

### Incompetech Royalty-Free Music

- Track name: Future ambient/cinematic candidates if attribution/license is acceptable
- Exact source URL: https://incompetech.com/music/
- Source site: Incompetech
- Author/composer: Kevin MacLeod / Incompetech, depending on selected track
- License: Verify using https://incompetech.com/music/royalty-free/licenses/
- Format: Varies by track/download
- Where used: Menu theme or gameplay loop if stylistically suitable
- Loop behaviour: Use only if edited/compressed and license conditions are met
- Reason chosen: Large royalty-free catalog, but attribution/license terms must be respected
- TODO: Select exact track, confirm license, attribution requirements, file format, and local import path

### Free Music Archive

- Track name: Future experimental ambient candidates only after strict per-track license review
- Exact source URL: https://freemusicarchive.org/
- Source site: Free Music Archive
- Author/composer: Per selected track
- License: Verify using https://freemusicarchive.org/License_Guide and the exact track page
- Format: Varies
- Where used: Only if license is commercial-safe and no vocals/copyright complications exist
- Loop behaviour: Avoid full songs unless edited and licensed properly
- Reason chosen: Broad catalog, but not all tracks are suitable or commercial-safe
- TODO: Select exact track, verify commercial use, attribution, derivatives, and local import permission

## Runtime controls

- SFX toggle: `Enable SFX` / `SFX On`
- Music toggle: `Music Off` / `Music On`
- Music volume slider: range 0 to 1, default 0.38
- Music starts only after user interaction.
- No autoplay music is used.
- No gameplay, camera, controls, mobile behavior, VR behavior, MediaPipe tracking, or collision logic is changed by this music pass.
