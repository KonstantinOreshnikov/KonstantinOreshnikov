# Proposed development roadmap

No dates or implementation commitment. Every milestone requires explicit applicable owner authorization, verified evidence and scope control.

| Milestone | Scope | Exit criteria |
| --- | --- | --- |
| Research/spec | Source and license validation, Mars baseline, globe spike design, balance model, UI concept | Owner approves scope and technical decisions; open risks identified |
| v0.1 | Mars, continuous globe, deterministic simulation, time controls | Visible terrain/water/ice/biomass response; reproducible simulation; basic save/reload |
| v0.2 | Cities, mines, resources, economy, construction; world/mode schema and local campaign selection foundation | Complete playable loop with colony expansion and bounded resource ledger; usable mobile controls |
| v0.3 | Research, biomass/biosphere, events, victory and recovery | Research unlocks, ecological feedback, full scenario victory and sandbox continuation |
| v0.4 | Orbit, culture/factions, forecasting and automatic target controllers | Automation stabilizes within bands, alerts are actionable, megaprojects meaningful |
| v0.5 | Eight-world rollout: Mercury/Luna, Venus/Europa/Titan, Pluto and flagship [Earth: Save Civilization](EARTH_SAVE_CIVILIZATION.md); achievements and optional deeper biosphere | Distinct verified starts, gameplay, difficulty modes, local campaign saves and no Mars regressions |
| v0.6 implemented slice | Interface and visual polish, more detailed planet data, difficulty calibration, accessibility and scenario depth | Owner-authorized scope and tested changes; no new release claim |
| v0.7 proposed | Deeper regional crises, higher-resolution assets, difficulty calibration and alternative strategies | Owner-authorized delta, independent gameplay and performance evidence |
| v1.0 candidate | Full core scope, RU/EN/AZ, offline saves/import/export, documentation, QA | Required independent gameplay/browser/device/localization/security/regression gates evidenced; owner approval before release |

MVP preference: Mars only, minimal colony economy, 5 core environmental parameters, meaningful planetary visual changes, research subset, stable target victory, pause/speed, reliable local saves. Add other content only after vertical slice demonstrates value. Multi-world local campaign management is required; procedural worlds remain optional. Cloud saves are excluded by the local-only decision.

Current baseline: verified v0.4 offline candidate; verified v0.6 Living Worlds development candidate. See [status](../STATUS.md). Next after v0.5 verification: visual polish, balancing, richer regional scenarios and independent acceptance. See [world selection and difficulty](WORLD_SELECTION_AND_DIFFICULTY.md).

## Next implementation package
See [v0.2 execution plan](V0_2_EXECUTION_PLAN.md). Preserve the Mars v0.1 baseline and validate only new scope plus affected integrations. Earth is the signature campaign; plan its shared systems early, without claiming it is implemented or delaying core playable Mars work.

## Owner priority override — v0.7
Visual quality of all eight worlds and README gallery first; deeper gameplay, disasters and difficulty calibration deferred. Automated v0.7 visual QA passed; independent visual/performance acceptance remains open. Owner approved project page publication to main.
