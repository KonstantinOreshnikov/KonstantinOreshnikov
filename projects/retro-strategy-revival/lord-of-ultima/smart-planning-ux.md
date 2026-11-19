# Lord of Ultima-inspired — Smart Planning & Comfort Contract

**Status:** OWNER-DIRECTED DESIGN REQUIREMENT · 19 Nov 2026 · No implementation / UI QA yet  
**Purpose:** preserve the recognizable, strategic city-planning puzzle while removing needless arithmetic, memorization, repetitive clicking and pay-to-win incentives.

## Product experience

The game should feel **calm, atmospheric and self-paced**: a cozy medieval kingdom that players can build, optimize and occasionally defend. The desired first release is **single-player vs one AI** on one small continent, with no real-money shop, ads, paid speed-ups, premium account or timed subscription.

**Not negotiable:** the economic consequence of *where* a town, mine, cottage, mill, farm, warehouse, barracks or city is placed must remain real. An advisor suggests; the player decides. Benefits should be understandable without spreadsheets.

## Always-available advisor (free, from turn 1)

A contextual planning layer is **not** a purchasable helper. Even before earning any automation agent, every player gets:

- Three placements to compare for the selected building: **Max Production**, **Balanced Growth**, **Space / Future Expansion**.
- Live placement overlay (green = possible, amber = low efficiency / conflict with future plan, red = invalid) on the original-inspired **21×21 city grid**.
- Exact projected per-hour output (before → after, and difference), contributing neighboring nodes, resource cost, time, upkeep and remaining free slots.
- Opportunity-cost warning: *“This location currently gives +X iron/hour to a mine; building a cottage here uses that tile.”* This is advisory, not a hard ban.
- Path-to-goal suggestions: *“Want 5,000 iron/hour? Upgrade A, place two mines beside ore B, and add a foundry at C.”* Every proposed operation can be individually edited/declined.
- Per-city dashboards: current output, consumption, storage capacity, net food, troop upkeep, income/outflows, deficit time-to-cap and queued construction.
- Future-use markers (uncommitted reservations) to avoid blocking optimal sites while laying out the next buildings. Reservations cannot yield production or block the AI's legal actions.
- Explainable selection: user can open **Why this tile?**, see assumptions and trade-offs, and compare an alternate option.

**Display priority:** map and buildings remain visually dominant; the advisor is a compact collapsible panel and on-tile overlay, not a wall of labels. Keep treasury/resources and queue visible while working on the city.

## Planning engine contract

For each feasible placement candidate c:
1. Validate the exact terrain/building placement rules and collision constraints.
2. Predict **current tick → after construction** through the same economy engine used by actual gameplay, including adjacency bonuses and production modifiers.
3. Quantify resource gain by good, construction cost, build time, available inventory, army food balance and storage saturation.
4. Compute opportunity cost as the **best achievable future use of the occupied tile within the selected plan horizon**, clearly marking estimates vs exact mechanics.
5. Rank candidates under each selected objective, not by one hidden absolute “best” score; e.g. Max Production vs Balanced vs Space.
6. Validate constraints with a **dry-run**: never mutate game state, spend currency or queue buildings merely by hovering/simulating.
7. Recompute when a neighboring tile/building, terrain bonus, skill level, world state or queue changes.

Use the **same deterministic pure calculation functions** for actual outcomes and previews; never hardcode different UI formulas that drift from actual production.

### Example: explicit optimizer objective (proposal, not original formula)

```text
Score(c, strategy) =
  w1 × annualized_resource_gain(c)
+ w2 × projected_city_growth_capacity(c)
+ w3 × scarce_resource_benefit(c)
- w4 × valuable_tile_opportunity_cost(c)
- w5 × build_resource_cost(c)
- w6 × food_deficit_risk(c)
```

Weights are visible and adjustable by strategy; an “optimal” answer is **conditional on priorities**. Historical adjacency tables require source/version confirmation. Forecasts must label time horizon, exact-vs-approximate inputs and actual vs projected quantities.

## Automation vs advice

| Always free | Earned permanently with reputation/command points | Never permitted |
|---|---|---|
| Placement preview, production forecast, 3 recommended tiles, queue simulation, deficit alerts, resource tables | Builder fills queued upgrades toward user goals; Quartermaster reallocates surplus; Marshal runs safe dungeon raids; Castellan maintains defense | Paywalls, paid rerolls, free resources, silent auto-attack, bypassing troop casualties, accelerated build timers for money |

Players must be able to do any action manually without an agent. Agents save clicks but pay all normal costs, consume time and carry risk. The first automation unlock should be accessible in an early ordinary session, without grinding or premium currency.

## Peaceful single-player rules

- **Pause / 1× / 4× / 10×**, no compulsory multi-hour real-time waits.
- No unattended enemy attack while the local app is closed (no pretend background server).
- AI works by the same resource/movement/building rules as player; difficulty changes behavior, not resource cheating.
- Alerts are informative, not aggressive dark-pattern notifications.
- No daily log-in streak, premium player-vs-player protection, purchases, donations for power, resource bundles, recurring ministers or other monetization gates.
- Optional atmosphere: quiet natural ambient sound and gentle transitions, only original/licensed audio and a mute toggle.

## User journeys and acceptance gates

| ID | User action | Acceptance |
|---|---|---|
| U1 | Select mine; open suggested placements | At least 3 feasible candidates if available, otherwise exact reasons why fewer |
| U2 | Move building ghost over forest/ore | Current → projected output and adjacency explanation match a real committed build |
| U3 | Ask for 5,000 iron/hour | Plan lists ordered steps, cost, duration and resource blockers; no hidden actions |
| U4 | Compare warehouse vs mine on a scarce ore tile | Shows mine opportunity cost and a viable alternative for warehouse |
| U5 | Preview farm placement with large army | Shows net food after upkeep and warns before a deficit |
| U6 | Click “execute selected plan” | Dry-run validation, explicit confirmation and serialized queue; not automatic irreversible build on hover |
| U7 | Cancel/reload/replay | No double charges, ghost buildings, duplicate rewards or negative balances |
| U8 | Advance AI turn | AI subject to same action economy; no hidden resource multipliers |
| U9 | Play with zero agents and no payments | All gameplay routes available; only automation ergonomics differ |
| U10 | Review advisor in RU/EN/AZ and 1366×768 | Readable, no map/label overlaps, persistent resource HUD |

**Evidence required:** source commit/hash, deterministic seed, chosen city layout, expected/actual production ledger, screenshot/video of the three-candidate overlay, 10 negative scenarios, and reconciliation PASS. A design document does not pass these gates.

[Economy](economy-and-agents.md) · [Solo prototype](singleplayer-v0.1-spec.md) · [Visual QA](visual-qa.md)
