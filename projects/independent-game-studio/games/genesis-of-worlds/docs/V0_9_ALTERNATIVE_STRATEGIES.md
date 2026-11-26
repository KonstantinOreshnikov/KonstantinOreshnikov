# v0.9 alternative strategy maker evidence

Runtime 85b5e9b91a20e6ccdac18f4bc324438621416005. Same procedural model and fresh campaign harness as tests/fresh-victory-v0.9.test.cjs. Run each route from a fresh campaign. The base 24 paths use existing facilities; the optional projects below were tested separately. These are deterministic maker tests, not a complete balance or independent acceptance verdict.

| World / mode | Project | Initial route | Adjusted route | Victory year |
|---|---|---|---|---:|
| Mars Normal | Fusion grid | 200-credit reserve, reactor off: no victory by 731 | 1200-credit reserve, upgrade habitat/farm/ice, turn reactor off while grid active; restore reactor and disable grid once physical goals satisfied | 196 |
| Europa Normal | Logistics hub | 200-credit reserve, mine off: no victory by 747 | 1200-credit reserve, mine off while hub active; restore mine and disable hub once physical goals satisfied | 188 |
| Earth Normal | Research array | 200-credit reserve, turn lab off after array completed | Unchanged | 143 |

## Reproduce
Starting from function play(id,mode) in the fresh-victory test, replace `tech("resilience");set("lab",false);` with the sequence below: research the required tech (fusion/logistics/orbitalScience), quote project, afford project credits plus reserve and ore, order project, advance while remaining > 0. For fusion, turn off reactor and upgrade habitat/farm/ice. For logistics, turn off mine. For science, no extra construction. Turn off lab in all cases. For Mars/Europa, before the existing goal-completion branch, if all physical, people, tech, hazard and regional goals pass, and project is on, toggle it off and restore reactor/mine respectively. Then continue the base harness. All adjusted routes won with all goal flags true. Credit reserves at victory: Mars 3141, Europa 3137, Earth 2718. Failed initial routes preserved above. No game balance constants changed to force PASS.

Next v0.9.5: assess sustained operation versus temporary use, project cost/benefit, reserve sensitivity and difficulty; test representative additional seeds and real browser/device play. No claim of universal balance.
