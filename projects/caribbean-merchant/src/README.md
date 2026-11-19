# Modular source (v1.0)

These files were **extracted directly from the released single-file HTML**, with the embedded WebP map separated into assets. The [standalone release](../play/CaribbeanMerchant_v1.0.html) remains the authoritative playable artifact and the recommended download.

Files:
- `index.html` — markup and SVG map overlay.
- `styles.css` — responsive UI styles.
- `game.js` — gameplay logic, 3-language UI and persistence.
- `assets/physical_map.webp` — geographical relief, see [attribution](../research/attribution.md).

Run locally with `python -m http.server 8000` from this directory, then open `http://localhost:8000/`. This is a source-development workflow, not an existing public deployment.

**Provenance:** the modular files are a source split of the working v1.0 HTML, not a newly rewritten or separately revalidated build. No original Port Royale source code or artwork is included.
