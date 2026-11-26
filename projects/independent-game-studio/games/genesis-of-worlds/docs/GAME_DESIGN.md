# Game design — proposed specification

## 1. Design pillars and player fantasy
Transform a planet visibly, not merely optimize counters. Make the simulation understandable and controllable; permit relaxed long-term play, strategic trade-offs and meaningful recovery from mistakes. Classic TerraGenesis is the reference, not an exact clone. Keep science-inspired assumptions transparent, and distinguish real planetary measurements from fictional technology and gameplay balance.

## 2. Core loop
Select world, scenario, difficulty and faction/culture orientation; inspect terrain and hazards; place a safe starter colony and outposts; generate credits/resources; invest in research and facilities; predict consequences; adjust planetary parameters; unlock self-sustaining settlements and biosphere; stabilize conditions over time; meet victory objectives and continue sandbox development. No forced daily login, monetized timers or premium currencies.

## 3. Planetary model
| System | Proposed mechanics |
| --- | --- |
| Temperature | Heat input, cooling, greenhouse effects, ice melt and freezing, latitude-dependent climate |
| Atmospheric pressure | Gas generation/removal, retention/escape, pressure-dependent habitability and boiling/freezing constraints |
| Oxygen | Track partial pressure and fraction consistently; generation, consumption, biosphere feedback and excessive oxygen hazards |
| Water | Total inventory separated into ice, liquid and vapor; elevation-dependent sea level and flooding; evaporation/condensation |
| Biosphere | Biomass, ecological succession, carrying capacity, algae/plants and later custom organisms; climate/oxygen feedback |
| Population | Colonist arrivals, births/deaths, housing, migration, food, health and jobs; protective habitats on hostile planets |
| Economy | Credits, resources, energy, production, upkeep and trade; budget constraints and alerts |
| Culture | Settlement growth, policy trade-offs, faction goals, independence and milestones |
| Research | Prerequisites, cost, duration, unlocks, efficiency improvements and endgame projects |

Use explicit units (K or °C at UI boundary, Pa/kPa, oxygen partial pressure or fraction, water volume/mass, biomass units); do not confuse water coverage with inventory. Game curves and thresholds are configurable and fictionalized; validate dimensional consistency and bounded integration. Avoid an arithmetic average that hides fatal conditions: separate survival constraints, comfort, ecological stability, population and victory. Temperature and pressure affect liquid water; water/temperature affect biomass; biomass and industry change atmosphere; cities compete for energy/resources. Coupled processes must conserve tracked mass where modeled, otherwise disclose abstractions. Preview effects before action, including dangerous runaway feedback. Protective habitats allow survival before open-air habitability.

## 4. Globe and map
A rotating/zoomable/selectable planet with elevation-derived shoreline, ice caps, biome colors, clouds and atmosphere, sunlight/shadow, city and mining markers, night lights. Use actual planetary data where legal/feasible. Visual progression is continuous: cold barren surface → melting ice/initial seas → plant growth/clouds → habitable world. Water covers actual lowlands before uplands; map height/elevation must match flooding simulation. Offer terrain, water, temperature, habitability and resource overlays plus 2D/low-performance fallback. Do not require four static state images. Desktop mouse and mobile touch navigation; readable controls without obscuring the globe.

## 5. Cities, outposts and production
Found cities and mining outposts at explicit coordinates/elevation; show founding cost, risk, capacity, connectivity and terrain effects. Cities have expandable slots, population, power, housing, food, employment and resource logistics. Mining: locate deposits, extract/upgrade/sell, handle finite reserves if enabled. Facilities have build cost/time, upkeep, level, prerequisites, staffing, power, intended rate and side effects; pause, dismantle and upgrade with clear refunds. Construction queues and batch actions avoid repetitive clicking. Example categories:
- Housing: sealed modules, domes, open-air habitats.
- Industry: mines, refineries, manufacturing and trade.
- Power: solar, batteries, nuclear and grid storage.
- Climate: heaters, coolers, greenhouse-gas generators/removers.
- Atmosphere and oxygen: processors, electrolysis, scrubbers and bioreactors.
- Water: ice processing, aquifers, vapor capture, delivery and removal.
- Biosphere: algae, greenhouses, ecological reserves and forests.
- Science: labs and research centers.
- Space: launch sites, orbital stations and logistics.

Balance resource flows per simulation tick; no negative inventory or unaffordable purchases. Underfunded facilities degrade or stop with visible reasons. Forecast when a target will be reached and what happens after.

## 6. Research, biosphere and society
Technology tree grouped by climate, atmosphere, hydrology, biology, settlements, industry, energy and orbit. Unlock meaningful alternatives rather than linear numerical upgrades. First biosphere mode uses simple biomass; optional deeper mode uses original species traits, environmental tolerances, food webs and extinction/reintroduction. Factions/cultures have transparent strengths and drawbacks; policy changes should be reversible or clearly costly. Independence can be a scenario objective; no mandatory PvP.

## 7. Worlds and scenarios

[World selection and difficulty specification](WORLD_SELECTION_AND_DIFFICULTY.md) supersedes the earlier world list. Eight planned worlds span five inherent difficulty tiers, with independent Relaxed / Normal / Expert modes. Mars is the recommended tutorial, not a mandatory unlock gate. All implemented worlds are freely selectable, with separate offline campaigns. Additional worlds remain planned until individually verified.

## 8. Orbital megaprojects and events
Proposed projects: solar mirror/shade, orbital transport/space elevator where plausible, artificial magnetic shield, orbital agriculture, volatile delivery and large infrastructure. Fictional engineering is explicitly labeled. Events: dust storms, meteor impacts, equipment failure, scientific breakthroughs, shortages, migration and trade opportunities. Events have readable choices, transparent consequences and recovery options; disable severe disasters in relaxed mode. Forecast flooding, extreme temperature, pressure, resource depletion and ecological collapse. Emergency stop and recovery are core controls.

## 9. Automation, pacing and endgame
Pause, ×1, ×5, ×20, ×100 time (values subject to balance). Offline progression opt-in with configurable cap and summary; paused games never silently progress. Automatic facility controllers with target bands, hysteresis, emergency limits, upkeep budget and manual override. Show historical graphs for each parameter, net rates, income/expenses, milestones and projections. Victory requires stable target bands, resilient population/economy and scenario-specific milestones over a defined duration; no single averaged score can conceal lethal values. Continue sandbox after victory, pursue achievements and optimize self-sufficiency. Failure/recovery rules depend on difficulty, with clear warning and restart/export options.

## 10. UX and languages
Dashboard: globe center; status and trend indicators; tabs for planet, settlements, economy, research, biosphere, orbit and culture. Contextual actions, construction queue, event inbox, data overlays and tutorial. Immediate RU/EN/AZ switching with persistent locale; all dynamic messages, errors, tooltips, events, numbers and accessibility text localized. Text scaling, contrast, reduced-motion option, keyboard navigation, responsive touch targets. Save slots, autosave, export/import and offline capability; no mandatory account. All names, UI, art, music and copy must be original or license-cleared.

## 11. Scope control
Mars-only playable vertical slice first; defer playable additional planets, advanced biosphere, orbit and complex culture until core simulation and persistence are demonstrated. Feature list is a proposal, not completed or owner-authorized implementation.
