# Lord of Ultima-inspired Strategy — Research & Single-player Prototype Design

**Status:** Research and design proposal ONLY · 19 November 2026 · No game implemented / no server or QA yet.

**Project goal (RU):** по памяти восстановить стратегическую глубину Lord of Ultima (2010–2014), прежде всего оригинальный *облик города*, правильную экономику соседства, здания и армии, баронов и подземелья. Начать с **одного континента 10×10, игрока и одного равноправного бота**, исключить донат, обеспечить достижимый бесплатный путь к постоянным управляющим.

The owner described first-hand gameplay memories of continents, building one settlement up from scratch, fielding an army, training barons to establish/conquer towns, dungeons, sea raids and alliances. These recollections align substantially with surviving original LoU references. **The owner later described having tried a paid successor, **probably Crown of the Gods** (a voice transcription said “Chrono Trigger”, which is an unrelated 1995 JRPG). The exact previously played game remains unverified; do not treat this identification as certain. The earlier fan clone that disappointed the owner remains unknown**; do not assume it was Crown of the Gods.

## Read this project in order

1. [Research: Lord of Ultima vs Crown of the Gods](original-vs-successors.md) — source-backed facts, economy, war, differences and caveats.
2. [Single-player vertical slice v0.1: executable specification](singleplayer-v0.1-spec.md) — concrete scope, mechanics, game flow, bot, runtime and MVP limits.
3. [Economy, automation agents and anti-P2W](economy-and-agents.md) — detailed calculation contracts, earned automation, resource invariants.
4. [Visual-reference checklist and QA gates](visual-qa.md) — original screenshots, how to avoid a misleading redesign and acceptance strategy.
5. [Smart planning, advisor and peaceful UX — owner-directed requirements](smart-planning-ux.md) — free placement suggestions, forecasts, opportunity costs, goal planner, anti-P2W and explicit acceptance gates.
6. [Evidence / source register](sources.md) — source URL, authority level and verification gaps.

## Preliminary conclusion

**Feasible:** high for a local browser game covering one continent and 1 AI opponent. A full persistent, shared 24/7 MMO is an independent phase requiring a server-authoritative backend, anti-cheat, authorization and asynchronous command processing. It is not part of this MVP.

**Important distinction:** mechanic research is authorized; implementing the prototype, copying third-party code/graphics, deploying or representing EA's official game is not authorized by this research request.

[Back to both retro-game candidates](../README.md) · [Caribbean Merchant case study](../../caribbean-merchant/README.md)
