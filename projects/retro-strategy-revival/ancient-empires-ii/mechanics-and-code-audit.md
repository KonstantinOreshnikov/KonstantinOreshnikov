# Ancient Empires II (2005): Mechanics & available code — initial audit

## Original-game evidence (not assumptions from remake code)

- [GameSpot original review, 8 June 2005](https://www.gamespot.com/reviews/ancient-empires-ii-review/1900-6127192/): eight combat missions; tight map; move range highlighting; occupied units visibly disabled; unit progression; difficult opponent AI; troops occupying castles to control recruitment and gold.
- [Pocket Gamer review, 29 January 2006](https://www.pocketgamer.com/ancient-empires-2/review/): distinct skirmish and campaign, varied win conditions, hot-seat modes, strengths/weaknesses of ranged, infantry, siege, magic, supernatural units.
- [MobyGames entry](https://www.mobygames.com/game/173668/ancient-empires-ii/): June 2005 J2ME, eight missions, houses/castles produce gold and heal units (secondary metadata).
- [The Guardian contemporary account, 7 June 2005](https://www.theguardian.com/technology/gamesblog/2005/jun/07/ancientempire): balance of cheaper mass recruitment vs strong units, income by controlled buildings.

### Mechanic registry

| Mechanic | Historical evidence | Proposed first build |
|---|---|---|
| Alternating turns | Confirmed | Yes, exact transparent phase |
| Tile-based terrain | Confirmed | Yes, grass/forest/hills/water/roads |
| Range & attack highlights | Confirmed in AE II | Yes, selectable overlays |
| Gold via occupied buildings | Confirmed | Yes, income each turn, reconcile |
| Castles recruit units | Confirmed | Yes, only if occupied/owned |
| Troops class counters | Confirmed | Yes, original-inspired independently balanced types |
| Veterans / level after engagement | Confirmed in review | Initial XP & visual rank |
| Siege, buildings, repairs | Confirmed in review | Engineer/foot-soldier repair and siege in phase 2 |
| Bot coordinates attacks | Confirmed in 2005 review | MVP goal; deterministic AI with tactical objectives |
| Eight-story missions | Confirmed | **Do not copy copyrighted plot/dialogue/maps**; write original scenarios |
| Hot-seat skirmish | Confirmed | Later, after solo-bot is stable |

Original character names, faction artwork, soundtrack and maps remain third-party IP even if mechanics are similar.

## What the GitHub code actually contains

| Repository | Directly inspected | Practical result |
|---|---|---|
| [TAbdiukov/Ancient-Empires-Modern-Web](https://github.com/TAbdiukov/Ancient-Empires-Modern-Web) | `docs/AE2/www/index.html`, `js/app/cpu/cpu.js`, `js/app/map/map.js`, `js/app/main.js` | Runnable *project structure* with separate AI, map, legacy libraries and UI; no live execution performed |
| [ancient-empires/Android-web-backup](https://github.com/ancient-empires/Android-web-backup) | README, LICENSE, repository tree | Preserved AE2 HTML/JS; run via Node + http-server; GPL-3.0 |
| [AncientTree/project_aeii](https://github.com/AncientTree/project_aeii) | README, LICENCE, repository tree | Java/libGDX AE Reloaded desktop/Android/iOS, map editor; GPL-3.0 code |
| [ProjectD8/Ancient-Empires-II-RM](https://github.com/ProjectD8/Ancient-Empires-II-RM) | README, repository tree | J2ME Revolution Mod with skirmish/editor extension; third-party permission not assumed |

### Technical observations from inspected web JS

- `cpu/cpu.js` includes distinct **easy, normal, hard** rates and handles buying and unit turns.
- `map/map.js` distinguishes terrain types, map tile dimensions and map/unit limits.
- `index.html` includes many historic JS/CSS dependencies, including jQuery, Backbone, FastClick, old legacy code.
- It loads `mission-1.js` through `mission-8.js`, consistent with the historical eight-mission structure.
- The web project is **not** a single self-contained HTML. Its README asks users to install Node/http-server, and its client storage has required browser compatibility fixes.

**Version freshness:** checked repository trees and public README on 19 Nov 2026. Repository updated-at is not the same as recent code activity; the original AE Reloaded project had its last recorded push in 2018 (at time of checking).

## Legal and technical decision gate

All three major modern fan projects inspected advertise **GPL-3.0 code**. Copyleft means that incorporating/modifying covered code into a distributed version requires GPL-compatible compliance including source availability. The AE Reloaded README claims free reuse of its assets, but that statement alone **does not verify original publisher sprite/music rights at file level**. Do not import them into an independently distributed project without further due diligence.

**Recommended path for our game:** new clean-room implementation of documented tactical mechanics and new art; use historical implementations only for comparative research. Keep a file-level source register if any third-party code ever becomes a dependency.

**Not yet done:** build/run any third-party version, extract/migrate old saves, empirically compare damage coefficients, review every unit/map file or verify a 100% equivalent reimplementation. These are future work packages, not completed evidence.
