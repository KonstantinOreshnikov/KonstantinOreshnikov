# Kingdoms of Ember v1.1 — 20 November 2026 QA

**Build SHA-256** `7fb760eafdc23c5ce21eb80fb1fea529822e25bc66b3d6f90fc586aaeb33887e`
**Original v1 SHA-256** `00e1670c9471904d6a0f4fbdf6fe7fa67fbd37415b05d1341c6612c8dcd4ba01`

**Automated:** 41 PASS / 0 FAIL. **Full-game simulation:** 12/12 games reached win/lose before 260 rounds, all 4 scenarios × 3 difficulties, no invalid states or page exceptions. Player-side AI 3 wins / 9 losses (simulation completion is not evidence of fair balance).

## Tested PASS
Canvas bootstrap and standalone dependency check; original v1 save schema import; RU/EN/AZ UI and screenshot; threat overlay; mouse click movement; illegal moves; friendly pass-through without overlap; weapon min/max range; terrain defense; spear counter against cavalry; real retaliation with exact forecast despite defender acted; counterattack excluded when out of range; experience level-up; capture income accounting once; single castle recruit and debit once; zero-cost commander ban; phase income idempotence; unique win awards; defeat trigger; save/restore; corrupted JSON state validation; negative resources and duplicated recruitment slots rejected; HTML log escaping; complete AI turn and state invariants; button-driven AI turn; 12 complete simulated games; no uncaught JS exceptions.

## Evidence
Downloadable `KingdomsOfEmber_v1.1_sources.zip` bundles:
`tests/qa_playwright.py`, `qa_results.json`, `screenshots/desktop_ru.png`, `desktop_en.png`, `desktop_az.png`, `threat_zones.png`, and the original v1 baseline HTML.
Visual review at 1536×930 confirms drawn terrain, map, units, overlay alignment and correct side indicators. Long vertical layout and large recruit panel remain UX opportunities.

## Restrictions / gates
| Status | Gate |
|---|---|
| **BLOCKED** | Sandbox Chromium denied direct file:// and localhost navigation; Playwright used `page.set_content` and test-only in-memory replacement of `localStorage`. Real offline launch and browser-restart disk save must be rechecked outside sandbox. |
| **BLOCKED** | Original v1 sources ZIP found in Library, raw bytes unavailable; original actual v1 HTML recovered and used. |
| **NOT TESTED** | Mobile UI, keyboard-only accessibility, Firefox/Safari cross-engine E2E. |
| **NOT TESTED** | Large-seed statistically significant AI competitive balance. |
| **NOT TESTED** | Importing every historical user-specific save; one generated v1 actual game state accepted. |
| **FAIL** | 0 among executed cases. |

Run from complete source archive: `python tools/build.py`, then `python tests/qa_playwright.py`, with Python Playwright and Chromium available. The HTML itself runs without Python, Playwright or internet.

## Migration addendum — 2026-11-21
The original v1.0 source ZIP was subsequently recovered from Library and `unzip -t` passed; its previous access blocker is resolved. The v1.1 source ZIP referenced above was not located in inspected sources. Existing 41/41 and 12/12 results are historical reported QA, not independent migration retests.
