# Ancient Empires II-inspired — Browser v0.1 Vertical Slice

**Status:** PROPOSAL, NOT IMPLEMENTED · working title TBD, avoid original trademark in published game name.

## Winning the first 20 minutes

Within a local browser session the player should see a clean top-down tactical map; move an infantry unit, understand why forest modifies combat, select valid attacks, capture an income building, recruit more units, fight a bot, get a detailed combat report and win/lose through an explicit condition.

## MVP board

- **16×12 tiles** illustrative map size (not claimed original); 2 human-held / 2 bot-held formations and 3–5 capturable structures.
- Tiles: grass, forest, hills, water, roads, bridges, castles and townhouses.
- 6 independently balanced starter unit types: **Swordsman, Archer, Rider, Spearman, Mage, Catapult**. Upgrade variations and exotic units are later.
- Each unit has move allowance, terrain movement cost, attack range, attack type, counters, HP, XP and “acted” flag.
- One unit per tile, distinct visible reachability overlay and red enemy attack overlay; path highlight and clear blocker messages.
- Player moves and attacks; ends the turn; bot runs its own moves with the same costs and limitations.
- Captured townhouses/castles generate turn income; eligible castles recruit units if affordable and tile unoccupied. Economy ledger must match balances before/after the turn.
- Combat shows **estimated damage range, chance to defeat, retaliation possibility, terrain defense bonus and projected survivor HP**. Estimates must derive from the same battle engine as actual resolution.
- XP/veterancy: unit receives visible XP and rank per verified gameplay events; avoid unbounded level boost or XP exploit.
- Tactical bot: capture income, protect own holdings, seek advantageous matchups and coordinate attacks; no resource bonuses or privileged fog.
- Original 3–5 tutorial / tactical mini-scenarios, plus one skirmish battle against AI; do not republish original game's eight maps or narrative.
- Pause/restart, autosave and JSON export/import; instant RU/EN/AZ. Offline and PC-first.
- No paid shop, login, intrusive popups or coercive daily progression.

## Interface — convenience without removing decisions

| Context | Feedback/action |
|---|---|
| Select unit | Legal movement and attack squares, combat role and stats |
| Hover enemy | Estimated damage, counterattack and death risk |
| Hover tile | Terrain defense/movement consequences, best target recommendation |
| Select castle | Affordable recruit options and upkeep/income changes |
| End turn | Summary: gold earned/spent, buildings captured, casualties, new threats |
| Potential mistake | Warn if unit ends in an exposed tile; allow cancel **before** committing |
| Mission progress | Visible objective, current state and end condition |
| AI turn | Brief explainable action log and visible/skip animation |
| History | Save replay state/log with seed so bugs can be reproduced |

### Recommended first build order

1. **Design reference** from original screenshots (terrain palette, readable sprite sizes, selection states) and copyright-clean art direction.
2. **Pure rules engine**: grid, pathfinding, terrain-cost reachability, attack resolution, capture, recruitment, turn income.
3. **Clickable UI**: main battlefield, side panel, top gold/turn/objective bar, clear selections.
4. **Bot**: rule-based 2–3-turn horizon, focuses on economy and tactical damage; deterministic seed to reproduce.
5. **Playability QA** and balancing across multiple seeds; only then expand units/maps/campaign.

## Scope exclusions for v0.1

No multiplayer server, remote accounts, original copyrighted graphics/music, giant 100-map campaign, deep alliances, live economy, mobile app packaging or paid boosts.

## Primary acceptance gates

1. Every reachable tile honors terrain cost and unit move limits.
2. Every attack preview exactly matches deterministic battle semantics/bounds.
3. Gold and ownership reconcile after a move, capture, recruit and end-turn sequence.
4. Bot uses the same actions and costs as the player.
5. No repeated XP/credits or unit duplication after reload/import/replay.
6. Player can lose and win a complete local skirmish without page refresh.
7. RU, EN, AZ use readable labels without tile overlays covering sprites.
8. Local Windows browser opening of downloaded artifact smoke-tested **before release claim**.

[Original source audit](mechanics-and-code-audit.md) · [QA plan](test-plan.md)
