# Lord of Ultima: economy, warfare and comparison with successor games

## Source discipline

- **Historical LoU mechanics:** [Ultima Codex](https://wiki.ultimacodex.com/wiki/Lord_of_Ultima), [Resources](https://wiki.ultimacodex.com/wiki/Resources_(LoU)), [Units](https://wiki.ultimacodex.com/wiki/Units_(LoU)), [Cities](https://lordofultima.fandom.com/wiki/Cities); supported by a [contemporary PC Gamer review, 25 June 2010](https://www.pcgamer.com/lord-of-ultima-review/) and [original UI screenshots at MobyGames](https://www.mobygames.com/game/64169/lord-of-ultima/screenshots/browser/).
- **Crown of the Gods (CotG):** use **its official** [Cities](https://www.crownofthegods.com/about/cities/), [Resources](https://www.crownofthegods.com/about/resources/), [First City Guide](https://www.crownofthegods.com/about/firstcityguide/), [Councillors](https://www.crownofthegods.com/about/councillors/), [Cavern Raiding Guide](https://www.crownofthegods.com/about/cavernraidingguide/), [PvP](https://www.crownofthegods.com/about/pvp/) and [Shrines](https://www.crownofthegods.com/about/shrines/) pages, **not** an imagined copy of LoU.
- **2026 fan revival:** [Lord of Ultima: Revival](https://lordofultima.me/wiki) claims to restore 2014 mechanics and documents a 21×21 city grid, a 6/16 building queue and itemized unit/building data. It is **secondary reconstruction evidence**, not the original EA engine.

## What made Lord of Ultima distinctive

### World and city placement

The original world was made up of island/continental regions. A historic [Continents guide](https://lordofultima.fandom.com/wiki/Continents) describes a 7×7 array of islands/continents and 100×100 local cells per island; this is a period-specific server layout, **not** a requirement for our mini-world.

A city occupied one regional tile but contained a separate **21×21 construction grid**. Town Hall level constrained the number of usable buildings (historical guides describe a level-10 maximum of 100 ordinary buildings). Natural forest, rock, ore and lake nodes seeded inside cities according to surrounding region terrain. Historic [Cities](https://lordofultima.fandom.com/wiki/Cities) gives a **14/14/14 forest/stone/ore + 2 lakes** base and +8/-+4 directional bonuses for neighboring terrain. Treat old tables as historical-version evidence, not automatically universal across updates.

### Five intertwined economies (do not conflate)

| Resource/system | Historical purpose | Core gameplay dependency |
|---|---|---|
| **Wood** | buildings; some soldiers/equipment | Lumber production adjacent to forest, cottages and sawmill |
| **Stone** | construction, walls, specialized research | Quarries adjacent to stone |
| **Iron** | soldiers/weapons, upgrades | Mines adjacent to ore |
| **Food** | army upkeep, expansion | Farm placement; deficit penalizes army |
| **Gold** | recruitment, research, trade and barons | Townhouses/tax income, market and dungeon rewards |
| **Purified resources** | research / title progression | Moonglow Tower, **1,000 ordinary units → 1 purified** resource of its type |

The four original basic resources are *not* a flat trading catalog: the economy is a production/logistics/upkeep system. Gold is a different currency; purified resources are progression inputs. [Codex resources](https://wiki.ultimacodex.com/wiki/Resources_(LoU)).

### Adjacency is the real game design

Building position matters beyond decoration. Historic/fan-reference tables describe each first neighboring forest/ore node boosting a matching extractor by roughly **+50%**, further relevant nodes about **+40% each**; cottages add manpower and increase overall construction speed; the best adjacent processing facility can multiply the resulting production. Farms benefit from neighboring free fertile land/lakes. [2013 player calculations](https://lordofultimastrategies.blogspot.com/2013/07/buildings.html) · [2026 reconstructed reference](https://lordofultima.me/wiki/building-woodcutter).

**Design implication:** auto-suggest placements, but never eliminate spatial adjacency or the choice between a compact efficient economic district and a military city.

### Building, research, barons

- **Town Hall** limits construction, unlocks building tiers and forms the city's center.
- **Cottages** accelerate construction; sawmills/stoneworks/foundries/mills strengthen production.
- **Townhouse** provides gold taxation; market/harbor, warehouse and hideout handle trade/storage.
- **Barracks / Training Ground / Stables / Moonglow Tower / Trinsic Temple / Workshop / Shipyard** unlock troop capacity and unit families.
- Advancement uses research and purified resources; higher titles increase permitted cities.
- **Baron** is a special expansion/conquest unit. Historic guide: level-10 Moonglow Tower and Trinsic Temple, title research and a large resource shipment enabled a new city. Baron could found a new city, reclaim a lawless one or take a besieged castle, **not** simply capture a city by a normal one-click assault. [Historic city guide](https://lordofultima.fandom.com/wiki/Cities).

### Battles, dungeons and fleets

The original distinguishes **Scout, Plunder, Assault, Siege**; building a Castle enables offensive city warfare but makes that city susceptible to conquest. Siege with a Baron progresses the city's claim. Troop classes include infantry, cavalry, magic/blessed, artillery and naval forces; unit choice and defender type affect the outcome. [Units](https://wiki.ultimacodex.com/wiki/Units_(LoU)) · [2013 unit guide](https://lordofultimastrategies.blogspot.com/2013/07/units.html).

The region also contained **Forest, Hill, Mountain and Sea** dungeons and stronger boss monsters. Raids were largely precomputed (not manually controlled tactical boards), took travel time, caused casualties and returned loot constrained by troop carrying capacity. Sea raids/overseas transport use specialized ships; distances and slowest unit speed matter. [2013 dungeon guide](https://lordofultimastrategies.blogspot.com/2013/07/dungeons.html) · [Codex raiding](https://wiki.ultimacodex.com/wiki/Raiding_(Lord_of_Ultima)).

### Alliances and victory

Alliances coordinated protection, territory and palaces dedicated to the eight virtues. Holding the required high-level palaces formed an alliance-based world victory, unlike a simple military knockout. [Ultima Codex](https://wiki.ultimacodex.com/wiki/Lord_of_Ultima) · [Endgame description in revival wiki](https://lordofultima.me/wiki/winning-the-world).

### Original monetization

The original sold Play4Free funds for paid artifacts, accelerators and **four Ministers**: Building, Defense, Trade and War. They automated long build/defense/trade/raid workflows while the player was offline, plus game accelerators. That was a real player convenience/progression asymmetry. [Original resources and ministers](https://wiki.ultimacodex.com/wiki/Resources_(LoU)). The contemporary PC Gamer review emphasizes long waiting times and premium acceleration.

## Crown of the Gods: how close?

| Dimension | Original LoU | Crown of the Gods | Our preferred design |
|---|---|---|---|
| City layout | 21×21, adjacent bonuses | Largely analogous placement-based production; new art/lore | Preserve 21×21 grid and highlight bonuses |
| Economy | 4 resources, gold, food upkeep, refined items | Same resource categories and analogous loops | Same categories, tuned for short sessions |
| Settlement agent | **Baron** | **Senator** | Original independently named **Envoy/Baron-like settler** |
| Military PvE/PvP | dungeons, raid, castles, siege, claim | caverns, councillors, siege/senator claim | 1 AI opponent, 3 land dungeon types, transparent report |
| Palaces/endgame | Alliances + 8 virtues | Alliances + 8 gods/temples, differently named | Mini-campaign ending; no fake live alliances |
| Automation | Paid Ministers | Paid Denari **Councillors**, some free drops/earned Denari; official site calls game anti-P2W | All essential queue conveniences available free; advanced automation through permanent earned progression |
| Art and navigation | EA-era earthy painterly city UI | Different art, names and interface | Original **visual language**, entirely independent assets |
| Operation | Persistent MMO on server | Persistent MMO on server | Local active-session simulation; backend only if later approved |

Sources: [official CotG game](https://www.crownofthegods.com/about/thegame/), [Councillors](https://www.crownofthegods.com/about/councillors/), [Denari](https://www.crownofthegods.com/about/denari/), [PvP](https://www.crownofthegods.com/about/pvp/), [Temples](https://www.crownofthegods.com/about/temples/).

**Interpretation:** CotG is mechanically a recognizable successor, but a different visual experience. The user's disliked fan adaptation may or may not be CotG; we cannot identify it from current information, nor infer which particular screen was disliked.

## Existing source code: due diligence

- **Official complete EA client/server source:** no authoritative public source release verified; **NOT FOUND** is not proof of impossibility.
- [FelixLeChat/LordOfUltima](https://github.com/FelixLeChat/LordOfUltima): C# **WPF desktop** partial recreation, not original EA backend. README confirms missing combat, multiplayer, real-time server and persistent server save. No clear repo license found; author says EA owns arts. **Study concepts only; do not copy unlicensed code or game art.**
- [Crown of the Gods](https://www.crownofthegods.com/) and [LoU Revival](https://lordofultima.me/) are references for mechanics/design, not verified open-source engines.

## Why historical reviews matter

[PC Gamer (2010)](https://www.pcgamer.com/lord-of-ultima-review/) enjoyed strategic city planning but found long real-world timers frustrating. **Keep the placement puzzle; eliminate imposed hours of waiting and recurring premium automation.**

[Back to research index](README.md)
