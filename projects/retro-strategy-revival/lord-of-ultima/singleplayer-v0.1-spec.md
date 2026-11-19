# Single-player vertical slice: one continent, one opponent

**Proposed name:** a new independent working title, not Lord of Ultima or Crown of the Gods. **Scope:** offline PC browser prototype with 1 human player vs 1 bot. No implementation started.

## Core acceptance goal

Within one test campaign the player can: build an economically optimized city → recruit a small army → clear 2–3 dungeons → earn progression → recruit a Baron-like settler → found or capture a new city → fight an AI city → obtain a visible victory/defeat summary. **No subscription, real money or live-server dependency.**

## Proposed bounded world

- **One continent = 10×10 region tiles (100 total)**, with grass/plains, forest, hill, mountain, roads and unbuildable water/shore edges only as background in v0.1.
- Start: one player city and one bot city in nonadjacent locations; **4 neutral settlement sites** and **3 land dungeon entrances** (forest, hill, mountain). One strategic neutral fortress or shrine for a later objective.
- **Each city**: a separate **21×21 internal build grid**, fixed central Town Hall, natural forest/stone/ore/lake nodes and buildable tiles. Levelled building sprites + hover preview.
- Starting city layout is identical in power for bot and human (optionally terrain variants per seed); seed displayed for reproducibility.
- The bot can construct, gather, recruit, raid, found additional cities and threaten the player; all orders use identical pricing and travel rules. Difficulty options: **Peaceful / Balanced / Aggressive**, changing tactical priorities only.

**Meaning of 10×10:** regional geography, **not** a 10×10 castle interior. Keeping separate region and city grids is mandatory for recognizable LoU mechanics.

## MVP building roster (15 types, first pass)

- Town Hall / Keep
- Woodcutter
- Quarry
- Iron Mine
- Farm
- Cottage
- Sawmill
- Stoneworks
- Foundry
- Mill
- Warehouse
- Townhouse (gold taxes)
- Barracks / Training Ground
- Watchtower / Wall
- Academy / Temple (Baron unlock)

**Later:** specialized mage/cavalry structures, harbor/shipyard, expanded siege defenses, advanced research tower, intercontinental navigation, alliance palaces.

## 5 initial troop families

- Infantry (cheap, fast recruitment, low carrying capacity)
- Archers/defenders (high anti-infantry defense)
- Cavalry/scouts (fast scouting, strong cargo/raiding specialization)
- Siege (slow, structure damage for conquest)
- Settler/Baron (special expansion/claim unit, minimal or no combat strength)

Add magic/blessed units in the second phase, not as mandatory MVP blockers. No sea fleets in the 10×10 version per current scope.

## Distinct orders / non-negotiable behavior

```text
BUILD/UPGRADE -> reserve or charge resources -> construction timer -> completion
RAID          -> dispatch army -> travel -> dungeon combat -> loot -> return
SCOUT         -> dispatch -> travel -> intelligence report -> return
PLUNDER       -> combat -> loot bounded by survivor carry -> return
ASSAULT       -> combat and building damage; does NOT transfer ownership
SIEGE         -> repeated claim progress with settler and surviving escort
FOUND CITY    -> settler travels with settlement bundle -> new owned city
```

Conquest must require a Baron-like unit and an explicit **siege/claim** process rather than letting an army one-shot a city by reducing a health bar. If the source city, target and escort fail eligibility, order is rejected with an exact reason. If the target changes owner en route, deterministic conflict/failure resolution prevents duplicate cities.

## User interface and first 20 minutes

1. Launch, choose a name/language and a seeded compact continent.
2. Region tab: readable map, colored human/bot holdings, terrain, dungeons and unclaimed sites.
3. City tab: zoomable 21×21 grassy pseudo-isometric tile view. Select building; show **valid tiles, predicted hourly income and exact adjacency delta before click**; include free **Max Production / Balanced / Future Space** recommended candidate placements with detailed opportunity-cost warnings (see [Smart Planning](smart-planning-ux.md)).
4. Right/top persistent HUD: wood, stone, iron, food, gold, per-hour rates, army upkeep, capacity and current queue — never lost while scrolling.
5. Build queue: 6 free slots, ETA, cost, cancel and reorder; **basic advisor is free immediately**, first automation helper unlockable early through play; objective-based construction plans show ordered prerequisites and expected resource deficits.
6. Army tab: troop availability, projected combat strength, travel time, raid loot capacity, predicted but clearly **non-certain** outcome.
7. Reports tab: every raid/attack shows starting units, lost units, resources gained, time and bot counteraction.
8. Progress tab: cumulative Renown, spendable Command Points, helper unlocks, wins, achievements, next objective.
9. Save: IndexedDB/localStorage schema versioning and JSON export/import; no external network.

## Simulation and bot

**Engine-first:** TypeScript modules for world, city layout, production, orders, army, combat, research, bot and serialization. GUI layer reads engine state; UI does not directly mutate balances.

One logical game clock with pause/1×/4×/10×. Proposed 1× = 10 real seconds per game hour; deterministic ticks with a fixed simulation seed; no false claim of 24/7 server persistence.

**AI:** evaluate food runway → critical resources/storage → construction needs → safe dungeon raids → available expansion → defenses and opportunistic attacks. Same action API as human; one decision per game hour with constrained planning budget, no god-mode fog-of-war, no cheating resources.

## Example first session

- Hour 0: choose land and place lumber / cottage; see boosted production.
- Hours 2–8: build 2–4 structures, begin first raid.
- Hours 8–18: first dungeon raid returns, hire starter troops, unlock Master Builder.
- Hours 18–48: research basic settlement, train Baron-like unit, establish second town.
- Midgame: bot expands, terrain/dungeon depletion forces different tactical choices.
- Finale: win by taking rival capital **or** by controlling a majority of designated strategic sites (alternative condition to tune). Defeat when no owned city remains, with clear restart/continue options.

Times are illustrative balancing goals, not actual verified implementation.

## Architecture and phase gates

- **Phase A — Visual fidelity:** annotated reference screens, original art language interpreted with new assets; *no simulation code required*, get human visual acceptance first.
- **Phase B — Economic vertical slice:** grid, adjacency, 5 resources, build upgrades, persistence, 1 bot economy.
- **Phase C — Military/expansion:** units, raid reports, siege claim, Baron, 2–5 cities.
- **Phase D — Automation/campaign:** permanent helpers, achievements, balancing and loss/win paths.
- **Later only if asked:** coast, shipyard, sea dungeons, new continents, alliance NPC, authentic networked multiplayer.

A future MMO requires a separate **server-authoritative** design with database, auth, scheduled jobs, order idempotency and adversarial testing; the offline MVP must not be presented as a production MMO.

[Economy and agents](economy-and-agents.md) · [QA](visual-qa.md)
