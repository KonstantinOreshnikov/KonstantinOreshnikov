# Changelog

## v1.1 — 20 November 2026
- Fixed retaliation when defending unit had already moved/acted; improved exact prediction from remaining HP.
- Fixed ally-induced choke-point soft-lock: cross friendly tiles, never end on occupied tile.
- Improved goal-oriented AI movement, target choice, terrain-aware combat and class-aware recruitment, with symmetric costs and rules for both sides.
- Made turn-start income and building capture/recruitment idempotent; prevented free commander hiring.
- Hardened v1 JSON save validation (duplicates, IDs, money, coordinates); old key/schema unchanged.
- Added toggled enemy threat-zone overlay and RU/EN/AZ labels.
- Improved experience overflow and building defense/repair display.
- 41 automated checks PASS; 12 fully resolved AI-vs-AI matches (4 scenarios × 3 difficulties).
- No copyright-uncleared code, assets, maps or audio imported.

## v1.0 — 19 November 2026
Previously created single-HTML game. Original verified v1.0 HTML retained in downloadable source archive for regression. Earlier claims of 23/23 PASS were treated as historical, not sufficient for the v1.1 QA.
