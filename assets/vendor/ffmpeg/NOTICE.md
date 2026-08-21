# Vendored: ffmpeg.wasm

Self-gehostet statt über CDN geladen (kein `unpkg`/`jsdelivr`-Aufruf zur Laufzeit),
damit `audio-extractor.html` ohne externe Abhängigkeit läuft.

- `ffmpeg-esm/`, `util-esm/` — `@ffmpeg/ffmpeg` v0.12.15, `@ffmpeg/util` v0.12.2
  (MIT-Lizenz), https://github.com/ffmpegwasm/ffmpeg.wasm
- `core-esm/` — `@ffmpeg/core` v0.12.10, Single-Thread-Build (kein `core-mt`,
  damit keine COOP/COEP-Header nötig sind — GitHub Pages kann diese nicht setzen)
  (LGPL, aus FFmpeg kompiliert), https://github.com/ffmpegwasm/ffmpeg-core

Version aktualisieren: `npm install @ffmpeg/ffmpeg@<ver> @ffmpeg/core@<ver>
@ffmpeg/util@<ver>` in einem Scratch-Ordner, `dist/esm/*` je Paket hierher
kopieren (`ffmpeg-esm`, `core-esm`, `util-esm`), `.d.ts`-Dateien können
gelöscht werden.
