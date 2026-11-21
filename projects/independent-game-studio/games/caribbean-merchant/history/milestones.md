# Milestone timeline

> These dates/versions describe archived downloadable builds and recorded decisions, **not original GitHub commit dates**.

| Build | What it changed | Key learning |
|---|---|---|
| **v0.1** | Playable market, 15 schematic ports, ship upgrades, contracts, single ship, random pirate combat. | Confirm the remembered core loop is fun before adding complexity. |
| **v0.2** | Instant RU/EN/AZ localization, preview of sea danger, win/escape estimates, auto-battle, more colorful SVG map. | Players need *decision-support information* before sailing. |
| **v0.3** | Four piracy areas, several enemy classes, loot forecasts, compass, a first attempt at terrain styling. | More decoration is not automatically better UX. |
| **v0.4** | Replaced unreadable schematic geography with a true relief/bathymetry map; moved port markers to geographical coordinates; label collision checks. | A user rejected the earlier “muddy” map; visual clarity became a hard acceptance criterion. |
| **v0.5** | Sticky cash/hold indicators; market opportunities, one-click quantity, cargo availability, contract shopping assistance and denser UI. | A game must stay usable after scrolling. |
| **v0.6** | Career progression with 16 ranks, 60 achievements, multiple endings and reward checks. | Economic growth needs motivating milestones. |
| **v1.0** | 10 productions/city, auto-sale manager, reserve/price floor, 150→300 storage, atomic contracts, city buildings, three simplified competitors, pirate hideouts, 82 achievements. | Automate repetitive work so the player can enjoy the sea adventure. |
| **v1.1** | Rotating expired contracts, priority offers, one-click fulfillment, global factory auto-sale controls and clear capital/palace unlock. | Prevent career-contract stalls and remove manual factory configuration. |
| **v1.2 (artifact; QA pending)** | Recurring pirate/faction outposts, raids, city threats and repeated encounters identified in the preserved standalone HTML. | Answer the request for more repeatable adventures; real gameplay acceptance has not been independently established. |

The labels v0.1–v0.6, v1.0 and v1.1 were used during active iteration; v1.2 is a later chat-supplied artifact preserved byte-for-byte. v1.2 is **not** promoted to a QA-backed release. No fabricated v0.7–v0.9 releases are presented as shipped.

## Critical design pivot

Early goal: “recreate Port Royale as remembered.”  
Validated player goal: **one ship to roam and fight; the economic empire should manage itself**.

This explains why the final design intentionally diverges from original PC fleet micromanagement.

[Actual preserved HTML snapshots](releases/README.md) · [v1.2 artifact and QA status](../STATUS.md) · [Specific feedback trace](feedback-loop.md)
