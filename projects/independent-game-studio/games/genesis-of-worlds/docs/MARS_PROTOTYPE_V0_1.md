# Mars technical prototype v0.1 — research and decision record

2026-11-26. Scope approved by owner: first Mars visual/simulation prototype and three README visuals. No production release.

## Evidence
- [NASA Mars Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html?level=1): approximate average temperature 214 K (−59 °C); mean-radius pressure 6.36 mbar = 0.636 kPa. The oxygen initial partial pressure is an illustrative trace value, not separately calibrated. Water and biomass indices are game abstractions, not measured global inventory.
- [USGS MGS MOLA DEM 463 m](https://astrogeology.usgs.gov/search/map/mars_mgs_mola_dem_463m) and [Mars data inventory](https://fdp.astrogeology.usgs.gov/fdp/mars/): candidate measured elevation for next terrain stage. [Global shaded relief](https://astrogeology.usgs.gov/search/map/mars_mgs_mola_global_shaded_relief_463m) has public-domain provenance. Do not infer DEM values from rendered colors. Record dataset version, credit, projection, NoData, units, source/derived SHA-256 and license before ingestion. Large original TIFF is not imported. Proposed downsample 1024×512 or 2048×1024 with area-aware sampling and documented error; validate seam, poles, range, elevation datum, water mask and mobile performance.
- [Three.js MIT license](https://threejs.org/license/) and [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer): WebGL2 capability required for current renderer. Compare native projection vs Three.js in later spike. [TerraGenesis community basics](https://terragenesis.fandom.com/wiki/Basic_Tips) describe temperature/pressure/water/oxygen/biomass sequencing; community reference, not original formulas. Earlier candidate repositories remain research leads, no external code imported.

## Implementation decision
Use zero-dependency standalone HTML + JavaScript for the first offline visual spike, rather than immediately add TypeScript/Vite/Three.js. The software sphere projects visible points onto a procedural terrain, with deterministic lighting, water mask, ice, vegetation and clouds. All three illustrations use the same pixel model. This is a genuine projected sphere but not a measured terrain mesh or photorealistic map. TypeScript/WebGL remains an option after measuring performance and MOLA requirements. No network requests or account required.

## Model
Fixed one-year fictional tick. Temperature °C, total pressure kPa, oxygen partial pressure kPa (bounded by total), water and biomass normalized 0–100. Five adjustable signed facility-rate proxies; greenhouse warming, atmospheric loss, evaporation and climate-dependent liquid-water proxy, biological growth/decay and oxygen feedback. Diagnostic suitability is a product of bounded climate, pressure, oxygen and liquid-water factors (not scientific habitability or victory). Water coverage is visual approximation using a procedural elevation threshold, not a physical volume-to-sea-level calculation. Presets are illustrative scenarios, not inferred simulation history; a user can advance deterministic ticks at 1/5/20 per second or pause/manual step. Storage saves validated schema and controls; reload paused; no offline accrual. Language selector EN/RU/AZ; editorial acceptance not performed.

## Maker QA
- 1. initial state valid: PASS in JS isolate
- 2. all presets valid: PASS in JS isolate
- 3. step is deterministic: PASS in JS isolate
- 4. step does not mutate input: PASS in JS isolate
- 5. cold Mars has no liquid coverage proxy: PASS in JS isolate
- 6. habitable preset supports biomass: PASS in JS isolate
- 7. oxygen never exceeds total pressure: PASS in JS isolate
- 8. bounded extreme positive controls: PASS in JS isolate
- 9. bounded extreme negative controls: PASS in JS isolate
- 10. invalid save rejected: PASS in JS isolate
- 11. render colors finite and in range: PASS in JS isolate
- 12. year cap: PASS in JS isolate

Node reproduction: `node tests/engine.test.cjs` from project folder. This test has been authored, not executed in a Node runtime during this work package. Browser QA pending: local file launch, actual render, rotation/pointer/keyboard, rate controls, pause/speed, preset confirmation, save/reopen, language switching and responsive layouts. Independent review and device tests remain NOT VERIFIED. No claim of release readiness. Scope: engine only, reviewer maker, no independent sign-off.

## Next
1. Run exact-source Node and real Chromium E2E; capture versioned browser screenshots and metrics.
2. Ingest validated MOLA derivative with provenance; compare visual/performance and true elevation-derived shoreline.
3. Calibrate coupled rates, extend tests, evaluate WebGL2/Three.js and add fallback as needed. Only then advance milestone acceptance.

## Exact-source correction and recheck
Initial assembly omitted the clamp binding; corrected before browser verification. Re-evaluated the actual serialized engine: 12/12 checks PASS and inline script syntax compiled in JS isolate. Manual save and autosave now use separate storage keys. Added isolated PR browser test workflow; results remain pending until actually returned. No independent PASS.

## Baseline verification and offline-only delta
Historical tested source 0b7fa669abb2ca99b4fd808e4913d5e7704953d9: [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45766650902) 12/12 Node + 9/9 Chromium PASS; [screenshots](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45766650902/artifacts/15092197150). Physical Android and independent UAT remain open. New delta (portable JSON saves, MOLA adapter/package) requires its own tests.
See [local-only decision and MOLA build](LOCAL_ONLY_AND_MOLA.md).
