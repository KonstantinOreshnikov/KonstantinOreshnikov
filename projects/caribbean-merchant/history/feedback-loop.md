# Player feedback → product decisions

Selected observations from hands-on testing, paraphrased rather than presented as exact quotes.

| Observation / user story | Change | Build |
|---|---|---|
| “The map is ugly and the city labels overlap.” | Replaced the simplistic SVG relief with geographical bathymetry and position-managed port labels; inspected rendered screenshots. | v0.4 |
| “I scroll to trade, and money / cargo capacity disappear.” | Sticky HUD keeps treasury, hold usage and remaining capacity visible. | v0.5 |
| “How much of this good can I actually afford and carry?” | Market rows distinguish city stock, personal stock, onboard stock and affordable quantity. | v0.5–v1.0 |
| “Buying a mission isn't enough; I keep arriving without its goods.” | Atomic contract acceptance loads onboard stock first, then owned warehouse, then purchases missing goods; all-or-nothing failure. | v1.0 |
| “I own factories everywhere. I can't manually collect everything.” | Automated production sale, retained stock and minimum price, subject to market conditions. | v1.0 |
| “150 units per warehouse is too little.” | Expand individual product warehouses in steps up to 300 for a total 10,000 credits each. | v1.0 |
| “I want to sail and fight, not manage a convoy.” | Explicitly retain one player ship, trade in old ship and simulate rivals in background. | Throughout / v1.0 |
| “Where's the reason to progress?” | Career ladder, achievement system, city projects and victory paths. | v0.6–v1.0 |
| “Was that actually in the original?” | Research process distinguishes confirmed PC mechanics from mobile-review evidence and invented convenience changes. | v1.0 research |

## Working method

**Observe → prioritize → implement → check → retest.** Some changes required more than one attempt: the first map redesign visibly failed despite having new styling. The user rejected it, prompting a physical-map rebuild and more rigorous screenshot review.

The human player is not represented as a paid QA organization. Local automated scripts provide **bounded evidence**, not claims of exhaustive validation.

[Milestones](milestones.md) · [QA](../testing/README.md)
