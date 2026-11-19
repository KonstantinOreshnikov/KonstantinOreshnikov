# Original-visual fidelity plan and acceptance gates

**Do not begin with a generic green dashboard, neon UI, modern card grid or arbitrary procedural islands.** A previous *Caribbean Merchant* map initially failed user visual acceptance; LoU deserves stronger visual evidence before coding.

## Authentic screens to inspect in context

| Reference | What to extract (not copy) |
|---|---|
| [MobyGames — complete original city, 2010](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/browser/677138/) | Wall geometry, 21×21 tile density, original building silhouettes, earthy palette |
| [MobyGames — original region map](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/browser/677121/) | Scale, cities vs terrain differentiation, navigation |
| [MobyGames — Town Hall upgrade](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/browser/677161/) | Build-menu and upgrade hierarchy |
| [MobyGames — original dungeon raid](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/browser/677143/) | Region-level PvE controls |
| [MobyGames — raid outcome report](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/browser/677216/) | Army and loot reporting |
| [GameWatcher LoU screenshots](https://www.gamewatcher.com/games/lord-of-ultima/screens/34728) | City graphics, left control panel, top resources, construction queue |
| [Official Crown of the Gods buildings](https://www.crownofthegods.com/about/buildings/) | Comparative mechanics and renamed building types, not default visual target |

These are references and links, **not a license to republish copyrighted original artwork**.

## First visual prototype: two clickable screens

**City:**
- Focus on almost full-screen grassy/isometric construction zone; building roofs/icons must be distinct without giant typography.
- Town Hall fixed and obvious, stone walls, rivers/trees/rocks according to terrain.
- Left construction panel and persistent compact top economic statistics.
- Click a production building: show name, level, output per hour, maintenance, adjacency bonus and upgrade/cancel.
- Placement mode: candidate tile appears green/red and predicted delta is live; no overlap with natural nodes.
- Camera zoom/pan, readable at 1366×768 and 1920×1080; language can switch RU / EN / AZ.

**Region:**
- Show one geographic area with forest/hill/mountain/plains/shore, a human city, AI city, 3 dungeons and empty founding sites.
- Select a city/dungeon: info and action side panel; visually distinguish raiding vs siege vs city founding.

**Prohibited in visual baseline:** unverified EA original sprites/audio, Crown assets, generated fake “screenshots of the original”, unreadable city markers, color palette chosen without real original screenshots.

## Smart planning UX acceptance

After selecting a building the player must see three genuinely different objective-based recommendations where feasible, not a single magical 'best tile'. The interface must show exact current/projected output, adjacency source, cost, future-space compromise and food-deficit impact. A dry-run hover cannot spend resources. The palette, building scale and density must remain historically recognizable; advisory UI must stay compact and dismissible. See [the owner-directed planner contract](smart-planning-ux.md).

## QA / Unlazy acceptance gates

| Gate | Pass evidence |
|---|---|
| V1 — Original reference | At least 3 labeled real historical screenshots, with screen anatomy and provenance |
| V2 — Visual fidelity | Side-by-side comparative review of **layout/density/hierarchy** (not copied art) and human acceptance |
| V4 — Advisor usability | Ranked tile alternatives, exact preview/actual parity, fit at 1366×768, explainable opportunity cost and no accidental execution |
| V3 — Clickable visual | Screenshot plus interaction recording/click scenario; 21×21 tile selection at standard desktop |
| E1 — Accounting | Wood/stone/iron/food/gold reconcile per event and per city |
| E2 — Adjacency | Highlighted delta equals post-build actual output within rounding rules |
| E3 — Queue | Same order cannot spend resources, complete or award points twice after refresh |
| E4 — Bots | AI and human use same simulation API, costs, starting budget, cap and fog |
| M1 — Combat | Troops are either at home, traveling, fighting or returning; never duplicated |
| M2 — Settlement | Baron expansion and siege transfer atomic; no two cities on one tile |
| P1 — Save/load | Reload/import equivalent to uninterrupted deterministic game (same seed, same tick) |
| P2 — Usability | No hidden treasury/cargo/upkeep, exact blockers and short onboarding |
| F1 — Campaign | At least 10 seeded end-to-end playthrough simulations; zero soft-lock or negative ledger |
| F2 — Scope | No claim of live MMO, running background processes or local Windows launch without evidence |

Record test seed, browser, source SHA, initial state, expected actual effects, screenshot on FAIL and retest result.

## Copyright and branding boundary

Working title and art must be original; **Lord of Ultima** remains a historical reference, not our released game's title. Reusing someone else's game mechanics is categorically different from copying their code, assets, branding, lore or soundtrack. Verify licenses at the exact files before adopting any project as a dependency.

[Spec](singleplayer-v0.1-spec.md) · [Original research](original-vs-successors.md)
