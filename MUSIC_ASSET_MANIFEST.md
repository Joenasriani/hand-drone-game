# MUSIC ASSET MANIFEST

## Current runtime music

The current game loads a local file named `Battlefield Ascent.mp3` from the repository root. Runtime references to that filename exist in `index.html`, `audio-sfx.js`, and `audio-start-unlock.js`.

### Battlefield Ascent.mp3

- Repository file: `Battlefield Ascent.mp3`
- Runtime status: active gameplay music asset
- Format: MP3
- Repository history: earlier commits referenced the file under `public/music/`; it was later moved/renamed to the repository root
- Author/composer: **unknown from repository evidence**
- Original source URL: **unknown from repository evidence**
- Licence: **unknown from repository evidence**
- Attribution requirement: **unknown**
- Commercial-use status: **not established by repository evidence**
- Modification/derivative permission: **not established by repository evidence**

The repository must not represent the source-code MIT licence as establishing rights to this audio file. The file should be treated as provenance-unresolved until an original source or ownership record establishes the applicable rights.

## Repository-history evidence

The following history is observable in Git:

- `4dfc30ba...` — runtime code was changed to prioritize `public/music/Battlefield Ascent.mp3`.
- `45f63c75...` — audio startup logic was changed to preload and play the local track.
- `d89f4aac...` — `public/music/Battlefield Ascent.mp3` was renamed/moved to `Battlefield Ascent.mp3`.
- `45ecf3b7...` — runtime references were relinked to the root-folder file.

These commits establish use and file movement. They do **not** establish authorship, source, or licence.

## Procedural sound boundary

Sound effects in `audio-sfx.js` are generated with Web Audio and are separate from the MP3 music asset. The procedural SFX implementation does not establish provenance for `Battlefield Ascent.mp3`.

## Approved sources for any future imported music

Future imported music should be recorded with the exact asset page, author/composer, licence, attribution requirement, downloaded filename, repository path, and date checked before it becomes a runtime dependency.

Candidate sources previously identified for manual review include:

- Kenney Music / Audio: https://kenney.nl/assets/category:Audio
- OpenGameArt CC0 Music: https://opengameart.org/content/cc0-music
- OpenGameArt Public Domain Music: https://opengameart.org/content/public-domain-music
- Pixabay Music: https://pixabay.com/music/
- Pixabay licence summary: https://pixabay.com/service/license-summary/
- Mixkit Free Stock Music: https://mixkit.co/free-stock-music/
- Incompetech Royalty-Free Music: https://incompetech.com/music/
- Free Music Archive: https://freemusicarchive.org/

A source appearing in this list is not itself approval for a specific track. Each imported asset still requires exact per-asset verification.

## Runtime controls

- Music begins only after user interaction.
- The runtime attempts local paths for `Battlefield Ascent.mp3`.
- SFX are generated separately through Web Audio.
- No claim is made here about the MP3's ownership or licence beyond what can be established from repository evidence.
