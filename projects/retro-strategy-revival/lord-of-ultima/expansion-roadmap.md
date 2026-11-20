# Future expansion: continents, AI teammates and alliances

**Status:** Owner ideas recorded 20 November 2026 · **BACKLOG / deferred, not implemented**. The locked first acceptance remains **one 10×10 continent, one player vs one bot**, with no multiplayer or real-time server.

## Phased scope, with acceptance gates

| Phase | Experience | Included | Gate before moving on |
|---|---|---|---|
| **P0 — Core campaign** | 1 player vs 1 AI | 1 continent, initial city development, free building and settlement advisers, gold/resources, troops, dungeons, barons, expansion and siege | Full win/loss match; economy/AI/save QA PASS |
| **P1 — Second continent** | Expand and explore | Adjacent second continent, legitimate coastal travel and resource shipping, new settlement opportunities, world-level site ratings | Deterministic transit/stock reconciliation; no trapped troops or duplicate shipments |
| **P2 — Four or more continents (optional)** | Small connected world | Expandable world graph, multi-continent logistics, improved regional map filters; preserve performance with more towns | Perf/time simulation benchmarks across 4 continents and many cities |
| **P3 — Several independent AI factions** | Team skirmish | Example: **human + 2 allied bots vs 3 rival bots**, symmetric starting rules and fair diplomacy; alliances are game-state relations, not shared ownership | AI keeps operating coherently, no accidental friendly fire, victory/reconciliation QA |
| **P4 — Recruit AI allies / clans** | Alliances with diplomacy | Invitation action, bot acceptance or refusal from explainable reputation, interests and safety criteria; independent allied economy and mission behavior | Offers/replies reproducible by seed, alliances persist correctly through save/load |
| **P5 — Alliance orders and strategy coordination** | Direct allied help | High-level objectives: **defend my city**, **send supplies**, **support siege**, **clear nearby dungeons**, **develop your economy**, **hold position** | AI interprets orders within travel/stock/troop rules, reports refusal/blockers, no free units/resources |
| **P6 — Real people, optional later** | Human multiplayer | Networked worlds, authentication, synchronized authoritative simulation and conflict/anti-cheat protection | Separate architecture, threat model, persistence and E2E/scale acceptance |

**This is a sequence of possible increments, not a commitment to build every phase automatically.** Sea features will be introduced only if the current prototype becomes enjoyable and the expansion is approved.

## World advisor: always available, no paywall

The advisor begins in P0 and works at **two layers**:

1. **City layer (21×21):** three suggested placements for each building, adjacency + production forecasts, future-space costs, resource bottlenecks and plans.
2. **Continent layer (10×10):** compare up to three legal founding sites by production potential, terrain/resource mixture, safe expansion potential, distance to current towns, transport accessibility and dungeon proximity. Show plain-language tradeoffs and *why* a location is better for a specific goal.

This is a **non-invasive assistant**. It never moves troops, conquers land, decides diplomacy, founds cities or spends resources without player permission; it must not reveal hidden AI assets. Decisions still matter, and “best” means *best for a declared objective* rather than universal optimal.

## Bots are players, not pets

- Every bot owns cities, treasury, army, inventory and research. It obeys the same world clock and resource constraints as the human.
- Ally bots keep their own identity, economy, initiative and defensive priorities: accepting an invitation does not transfer all cities or permit limitless forced sacrifices.
- Invitation acceptance depends on a transparent, deterministic model: relationship, current threats, alliance relative power and the bot's personality. Allow **reject / negotiate / accept**; otherwise diplomacy offers no meaningful game mechanic.
- Once allied, player can issue **high-level orders**, such as defense, supporting attacks, resource aid and regional priorities. Ally replies **accepted / queued / infeasible / refused** with reasons and realistic execution schedules.
- An allied bot cannot execute a plan for which it has insufficient resources, time, travel access or surviving troops; the same constraints apply to enemy alliances.
- Alliances should be configurable as **human + two AI versus three AI** in a later team-skirmish mode; keep optional human-versus-human support separate and only if later desired.

## Permanent automation and comfort

- **Free from the first turn:** all tooltips, projected outputs, planned-site comparisons, city stats, building recommendation and continent settlement suggestions.
- **Earned through reputation / Command Points:** advanced agents (construction, resource redistribution, automatic dungeon management, defense); permanent unlock, not a timed subscription.
- **No monetization:** no premium resources, no paid speed boosts, no adverts, no forced offline attacks.
- **Mood:** calm and nostalgic medieval strategy with deliberate decisions and readable atmospheric art.

## QA boundaries

- **Save schema:** player owner, faction ID, alliance ID, continent ID and transit orders have stable identifiers so future phases can add opponents/worlds without corrupting a P0 game.
- **No premature implementation:** don't simulate a second continent with a fake button or show “alliances active” before the corresponding engine and QA exist.
- **Balance and fairness:** per-faction resources, build/transport costs and army losses reconcile every tick; no bot receives hidden free resources.
- **Multiplayer:** cannot be faked via client localStorage; moving to P6 needs a proper server-authoritative design.
- **Clarity:** keep roadmap statuses **IDEA → SPECIFIED → IMPLEMENTED → QA PASS → PLAYTESTED**; the current content is IDEA/SPECIFIED, not shipped.

[Original 1v1 MVP](singleplayer-v0.1-spec.md) · [Smart planning and advice](smart-planning-ux.md) · [Research index](README.md)
