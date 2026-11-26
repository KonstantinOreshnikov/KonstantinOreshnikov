# Fresh Mars campaign reachability — v0.3

Exact runtime 17128ebbe6eb91cd674bd630965490470a9c977e. Maker JS isolate executed deterministic public game actions from new campaigns; no final-state injection. Reproduction: node tests/fresh-victory-v0.3.test.cjs. The saved script was executed in JS isolate, not yet as Node CI. Each tick validates state. Policy builds mine and lab, researches energy and climate branches, adds reactor and terraforming facilities, sells ore for financing, responds to events by declining, controls facilities to target bands, then stops nonessential facilities to stabilize the budget. It uses no new external services. Results are proof of one viable path per mode, not independent playtest, UI E2E or comprehensive balance.

| Mode | Victory year | Actions | Credits | Population |
| --- | ---: | ---: | ---: | ---: |
| beginner | 156 | 92 | 2816 | 100 |
| normal | 168 | 129 | 2172 | 100 |
| expert | 179 | 186 | 2102 | 100 |

All eight gates were true at victory in every mode. Exact underlying results in [JSON](V0_3_FRESH_VICTORY_RESULTS.json). Future work: independent human/device acceptance, difficulty balance and alternative routes, graph/UI quality, long session. No release or main merge.
