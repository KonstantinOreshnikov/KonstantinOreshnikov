# Modular source — Caribbean Merchant v1.1

**Current code in main:** `game.js` contains v1.1 contracts, priority offers, delivery handling, empire-wide auto-sale and all existing v1.0 rules. `index.html` and the standalone distribution display **v1.1** in the browser title and footer.

- [**Download standalone v1.1 HTML**](../play/CaribbeanMerchant_v1.1.html) — latest offline playable build.
- [Previous v1.0 standalone](../play/CaribbeanMerchant_v1.0.html) — unchanged historical download.
- `index.html` — HTML shell and SVG map.
- `styles.css` — responsive interface.
- `game.js` — JavaScript engine, three-language UI and persistence. Source matches embedded JS in v1.1 standalone HTML (byte-for-byte text equality).
- `assets/physical_map.webp` — geographical relief; see [attribution](../research/attribution.md).

For modular local development, run `python -m http.server 8000` from `src/` and open `http://localhost:8000/`. This is a dev workflow, not a claimed public backend.

**Provenance:** the v1.1 modular JS and standalone were imported from `fix/caribbean-contracts-bulk-autosale-20261119`. Portfolio synchronization corrected only obsolete *visible* v1.0 version labels; it did not change gameplay algorithms. The synthetic regression QA was captured on the original v1.1 development branch before those harmless label edits. True Windows/Android browser file-open E2E is still not independently certified.

[v1.1 QA evidence](../testing/v1.1-contracts-autosale.md) · [How to play](../play/README.md)
