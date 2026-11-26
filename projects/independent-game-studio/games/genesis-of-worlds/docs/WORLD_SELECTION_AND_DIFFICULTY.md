# World selection and difficulty — design specification

Date: 2026-11-26. Owner requested multiple worlds with distinctly different difficulty levels and freedom to choose. This is an approved product direction and proposed balancing design, not a claim that worlds are implemented. Preserve verified Mars v0.1 source 43a553ccb5da1292952a9cb4f8e3c75ceef0e467 and its QA evidence.

## Reference research

The classic game's community documentation distinguishes inherent world difficulty (Easy / Medium / Hard) from player-selected Beginner / Normal / Expert modes. Its terrestrial catalog rates Mars and Mercury Easy, Luna and Venus Medium, Earth Hard. Mars, Mercury and Luna start unlocked, Venus follows Mars victory, Earth follows Venus victory. Other packs include moons, dwarf planets, fictional planets, exoplanets and historical Earths. Examples: Europa Hard, Ganymede and Callisto Easy, Io Medium, Titan Easy, Pluto Easy. The later community wiki is not proof of every rule in the owner's exact 2018 edition. Beginner simplifies maintenance, construction and ecosystem management; Normal enables fuller systems; Expert reduces resources and adds major threats. No monetization, premium currency or paid unlocking is carried into our design.

Sources: [Terrestrial worlds](https://terragenesis.fandom.com/wiki/Terrestrial_Planets), [difficulty modes](https://terragenesis.fandom.com/wiki/Difficulty), [Jovian moons](https://terragenesis.fandom.com/wiki/Moons_of_Jupiter), [Saturn moons](https://terragenesis.fandom.com/wiki/Moons_of_Saturn), [dwarf planets](https://terragenesis.fandom.com/wiki/Dwarf_Planets), [fictional worlds](https://terragenesis.fandom.com/wiki/Fictional_Planets). Physical reference: [NASA solar system](https://science.nasa.gov/solar-system/planets/), [temperatures](https://science.nasa.gov/solar-system/temperatures-across-our-solar-system/), [Venus](https://science.nasa.gov/venus/venus-facts/), [Mercury](https://science.nasa.gov/mercury/facts/), [Titan](https://science.nasa.gov/saturn/moons/titan/facts/), [USGS planetary catalog](https://astrogeology.usgs.gov/search). Scientific feasibility is not implied.

## Genesis of Worlds: inherent world difficulty

Five proposed tiers: 1 Easy, 2 Moderate, 3 Medium, 4 Hard, 5 Extreme. These are original game-design ratings, not scientific rankings or copied reference ratings; calibrate after actual playtests.

| World ID | World | Tier | Distinct scenario |
| --- | --- | ---: | --- |
| mars | Mars | 1 | Recommended tutorial. Warm cold terrain, increase atmosphere, manage water, create biomass. Preserve MOLA baseline. |
| mercury | Mercury | 2 | Cool hot regions; cope with day/night swings and solar exposure; build atmosphere and import water. |
| luna | Moon | 3 | Near-vacuum, atmospheric escape, low gravity, resource constraints; sheltered settlements first. |
| venus | Venus | 4 | Extreme heat and CO2 pressure; cooling, atmospheric removal, water introduction, pressure-rated habitats. |
| europa | Europa | 4 | Radiation shielding, ice reservoir, controlled melting and flooding hazards. |
| titan | Titan | 4 | Deep cold, nitrogen-rich atmosphere, hydrocarbon chemistry; distinguish methane from water. |
| pluto | Pluto | 5 | Weak solar energy, low gravity, extreme cold and volatile retention; advanced energy and shielding. |
| earth | [Earth: Save Civilization](EARTH_SAVE_CIVILIZATION.md) | 5 | Flagship scenario: restore an already populated world under fictional ecological crisis; prevent collapse, preserve people and stabilize climate. |

All completed worlds available for free from New Game. Optional campaign/tutorial ordering provides guidance only; no paywalls or forced completion before playing another world. Expansion candidates: Ceres, Io, Ganymede, Callisto, Triton, original fictional ocean/volcanic/frozen worlds, seed-generated exoplanets. Each must have a separate scenario and acceptance gate. Gas giants are not surface-terraformed; future orbital scenarios only if explicitly designed.

## Independent player-selected mode

| Mode | Proposed effect |
| --- | --- |
| Relaxed / Beginner | Generous starting budget, reduced or zero maintenance, faster research/construction, forgiving recovery, optional tutorial, simplified biomass; destructive disasters off by default. |
| Normal | Balanced costs, full economy, technologies, maintenance, world-specific hazards and optional biosphere. |
| Expert | Tighter budget, stronger hazards and upkeep, more demanding stable targets and recovery planning; optional major events. No artificial real-time waiting or monetization. |

Exact multipliers are balancing parameters to be tested, not locked values. Difficulty must alter gameplay, not just a badge. Simulation speed and pause remain independent of difficulty; no forced offline progression. Optional custom sandbox settings can disable disasters or adjust pace without altering default scenario evidence. Difficulty and ecosystem mode stored with each campaign.

## New Game and saved campaigns

Main menu → New Game → select world (visual card, type, five-level rating, atmosphere/temperature, key risks, terrain provenance, recommended approach) → choose mode → choose biomass/biosphere where implemented → confirm → start. Continue opens latest campaign. Saved Worlds lists independent local campaigns and permits switching, naming and export/import without overwriting another world; pause inactive worlds by default. Delete or overwrite requires confirmation. RU/EN/AZ full static/dynamic labels and accessibility. Unimplemented worlds may be shown as Coming Soon only; never silently start Mars behind a Venus card.

## Engine and data contract

Data-driven WorldDefinition keyed by stable worldId: scenarioVersion, type, name keys, difficulty tier, radius/gravity/solar descriptors with sources, initialState, scenario-specific units/ranges, atmosphere composition/escape, heat model, water/ice reservoirs, non-water volatiles where needed, biomass, resource rules, hazards, target bands, victory/failure predicates, terrain asset identifier and provenance. Separate ModeDefinition keyed by modeId for resource, cost, upkeep, build/research, hazard and recovery settings. Shared deterministic tick and renderer; do not fork per-planet engines. Current Mars limits (temperature -100..70 C; pressure 0.01..180 kPa) cannot represent Venus, Pluto, Titan or true vacuum: extend validation by scenario and retain prior save support. Do not clamp real start values into Mars bounds. Use absolute units consistently and explicit fictional proxies. Render distinct world terrain, colors, water/ice, atmosphere and lighting. MOLA is Mars-only. NASA/USGS candidate DEM/imagery for each body require license, source/version, units, orientation, coverage, checksums; clearly identify procedural terrain or partial coverage when measured data is unavailable. All approved data embedded/packaged locally, no runtime network.

Save schema v2 design: worldId, modeId, scenarioVersion, campaignId, schemaVersion, state, time, seed/RNG, facilities and optional ecosystem data. Migrate existing v1 Mars saves to Mars with explicit compatible legacy settings; no state loss, duplicate progression, silent reset or cross-world import. Separate manual/autosave per campaign; portable JSON and safe validation. No server, database or registration.

## Implementation order and gates

P0 v0.1 verified Mars candidate is unchanged. At v0.2 introduce world/mode contracts and local campaign selection/storage foundation alongside cities/economy; playable Mars first. v0.3–v0.4 mature scenarios, hazards, research and automation; v0.5 deliver the multi-world catalog incrementally: Mercury/Luna, then Venus/Europa/Titan, finally Pluto/Earth. Do not label any world playable until its start state, controls, victory/failure and saves work. This ordering avoids duplicating an immature engine; explicit owner direction may change it.

Acceptance per world: distinct data/terrain and starting values; no clipping or impossible targets; meaningful strategy and hazards, complete deterministic playable path; correct mode differences; safe saves, switching/reload/import/export and v1 migration; Russian/English/Azerbaijani coverage; zero runtime network; regression against exact approved Mars baseline and new affected gates. Balance must be independently reviewed; no new QA PASS claimed by this document.
