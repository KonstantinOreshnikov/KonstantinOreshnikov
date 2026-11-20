# Economy contracts, intelligent helpers and no paid advantage

**Design proposal, not a claim about exact historical values.** All numbers below are tunable MVP assumptions.

## Data entities and grain

| Entity | Grain | Critical invariant |
|---|---|---|
| World cell | continent × (x,y) | One terrain and at most one settlement/dungeon |
| City | unique city ID | Owner ID; stable location; 21×21 internal layout |
| Build slot | city × (x,y) | One building or fixed natural resource node, never both |
| Production ledger | city × resource × simulation tick | Output less consumption/transfers equals stock movement |
| Building level | city × building ID | Between permitted levels; upgrade cost charged once |
| Treasury | owner (or specified gold pool) | No negative gold |
| Unit stack | city × unit type × owner | No negative units, recruitment costs and upkeep reconciled |
| Order | unique order ID | Scheduled, executing, complete/cancelled; no double processing |
| Dungeon | region tile × seed | Consistent defender count, reward budget and respawn |
| Baron / settlement | player × order | Expansion prerequisites, travel and ownership transfers atomic |
| Reputation/agents | owner × achievement/agent ID | One-time earned rewards and unlocks |

## Four basic resources + gold

Wood, stone, iron, food are stored **per city**, with explicit caps; gold is tracked per player or city consistently (choose and document one: **MVP uses player-wide gold**). Food is consumed by trained troops; use the ledger to explain any deficit.

Each **game hour** update:

```text
gross_output = floor(base_output[building_type][level]
                   × (1 + sum_of_relevant_adjacent_node_bonus
                        + sum_of_adjacent_cottage_bonus)
                   × (1 + strongest_adjacent_processing_bonus))

available = min(storage_cap, previous_stock + gross_output
                + arrived_shipments + returned_raid_loot
                - build_spend - recruit_spend - outgoing_shipments)

net_food = farm_output - sum(troop_count × upkeep_per_hour)
```

For flavor, the underlying original used a **+50% first relevant node / +40% additional nodes** pattern for major gatherers in documented versions; our first vertical slice may use that structure after gameplay calibration. Processing effect uses only the strongest adjacent applicable mill, not stacking arbitrarily. For farms, fertile free squares are relevant. These are **historically inspired design contracts**, not measured calibrated production.

**Safety:** if food is deficient, do not make troops silently vanish; show an explicit warning and apply a documented morale/attrition rule only after a visible grace period. Units out on raids must not simultaneously defend home.

## Sample MVP economy (illustrative—not implemented)

- Initial city: Town Hall level 1, small stock of 4 resources, no troops; gold 500.
- Level-1 resource building: **100 units/game hour** unboosted (illustrative), plus displayed adjacency modifiers.
- Level-1 warehouse: stores 1,000 of each resource; upgrades raise it at explicit prices.
- Hour duration in real play: **10 seconds at 1×** (24 game hours = 4 real minutes). Pause/1×/4×/10× speed controls; all mechanics use the same logical clock, bot included.
- Starter builds complete during the first few game hours; avoid real-world multi-hour enforced waits.
- Debug time advance is visible only in QA mode and is not a standard paid player privilege.

These numbers are for *first-play tuning*, not the historical tables and not accepted final balance.

## Always-free adviser vs permanently earned automation

**Owner requirement (19 Nov 2026):** production forecast, ranked placement suggestions, tile opportunity cost, city statistics, feasible building-plan simulation, and resource/food deficit alerts are **free from turn 1**, not sold as agents or earned upgrades. Read the canonical [Smart Planning & Comfort Contract](smart-planning-ux.md). Only automation of repeated actions is a permanent earned reward.

## Agent model: unlocks, never subscriptions

**Original:** paid Building/Defense/Trade/War Ministers. **Our model:** no paid currency, no microtransactions, no real-time expiry. A player can manually perform every action even before unlocking an agent.

Two separate concepts:

- **Cumulative Renown:** never spent, used for ranks/achievements and to prevent titles moving backwards.
- **Command Points:** earned in gameplay, spent once on *permanent automation licenses*. Balance cannot go negative; awards cannot be claimed twice.

| Agent | Proposed unlock price (Command Points) | Behavior |
|---|---:|---|
| **Master Builder** | 8 | Expand queue from 6 to 16, enqueue target-level building upgrades, stop on insufficient materials; does not create free materials |
| **Quartermaster** | 12 | Send surplus wood/stone/iron/food between owned cities, retain reserves, never exceed carriage/travel constraints |
| **Raid Marshal** | 16 | Repeat safe dungeon raids with specified army size and minimum survivors; stop when losses or loot economics cross threshold |
| **Castellan** | 12 | Replenish designated defenders with available resources, maintain food buffer, warn before attack; cannot auto-win fights |

**Suggested point sources:** first completed tutorial objectives, defeating dungeon bosses, founding cities, winning defensive battles and achievement milestones. Goal: unlock first helper during the initial session; all four should remain attainable without grinding a single repetitive action.

Fairness principle: a helper may remove manual clicks and optimize already-authorized queues; **it must never bypass building costs, growth caps, travel, time, troop loss, risk or upkeep.** Equal budgets and combat rules for human and bot.

## Automated queue semantics

1. User selects building target (e.g. Woodcutter 1 → 5) or preset.
2. Queue records explicit orders with prerequisites, resource price and time.
3. On tick, state engine processes each order **once**; resources charged at a documented stage (recommended: when job starts), reserved stock handled explicitly.
4. If inputs are lacking, queue is **paused with a visible blocker**, not silently completed.
5. Completed level is idempotent; after refresh/JSON import the same order cannot execute twice.
6. Bot uses the **same queue and costs** as player; difficulty changes priorities, not hidden income multipliers.

## Anti-exploit controls

- A shipment cannot be simultaneously in warehouse, caravan and destination.
- Troops sent away are unavailable to garrison until return.
- Gold/resources/CP cannot drop below zero.
- A claim cannot own a settled tile twice; Baron returns or fails atomically if target occupied.
- A dungeon raid cannot exceed carried loot or repeatedly pay out without regeneration.
- Each completed event has a stable ID to avoid double credit on reload.
- Auto-raid never burns the whole army without explicit thresholds.
- No idle-time bot attack while a local single-player save is closed in MVP. Resuming a session is deterministic.

[Single-player scope](singleplayer-v0.1-spec.md) · [Source research](original-vs-successors.md)
