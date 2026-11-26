# Proposed architecture and acceptance gates

## Architecture
TypeScript + Vite; Three.js/WebGL globe (evaluate lightweight fallback), separate pure deterministic simulation engine, optional Web Worker for heavier simulation, JSON scenario/facility/technology/event catalogs, IndexedDB saves, optional PWA offline cache. No server/account required initially. Neon + authenticated API only as a separately approved later cloud-save feature. GitHub Pages is a possible later deployment target, not an authorized deployment. Prefer simpler implementations when measured requirements permit. No paid APIs.

Modules: domain state, scenario catalog, simulation clock and tick, resource ledger, economy/facility actions, events/seeded RNG, progression and victory, terrain/sea-level mapping, render adapter, UI/i18n, persistence/migrations, tests. Rendering must never mutate authoritative simulation state. Fixed or bounded-step integration and deterministic replay; large time jumps use validated capped batches, not a huge unbounded step. Every action validates funds, prerequisites, capacity and units. Store authoritative rates and balances independently from display formatting. Use consistent snapshot IDs and timestamps. Persist schema version, RNG state, clock, planet state, cities/outposts/facilities, research, events, objectives and settings. Atomic autosave, backup slot, import validation, migrations, and safe handling of corruption/storage limits. Avoid duplicate offline reward on reload; explicit cap and rollback-safe timestamp behavior. Worker messages versioned; same state on resume. Use original assets or verified licensed data only.

## QA plan (all NOT_STARTED)
| Gate | Evidence required |
| --- | --- |
| Simulation unit | Fixed fixtures for rates, coupling, invariants, boundaries, mass/units, negative balances, reproducible seed and deterministic time |
| Economy and gameplay | Real complete loop from colony to stable victory; build/upgrade/pause, queues, research, events and recovery |
| Globe | Real elevation-derived flooding, meaningful visual changes, picking/zoom, fallback, resize and measured performance |
| Persistence | Save/reload/F5, browser close/reopen, offline mode, export/import, corruption and version migration; no duplicate progression |
| Pacing and automation | Pause/speed equivalence where applicable, offline cap, target hysteresis, extreme inputs, forecast and emergency controls |
| Localization | RU/EN/AZ static/dynamic coverage, immediate switch, persistence, numbers/plurals, errors, events, tooltips, aria and mobile layouts |
| Device/browser | Actual Chromium and Android, responsive portrait/landscape, keyboard/touch, reduced motion, text zoom, WebGL failure handling |
| Security/asset review | License/provenance for all files, dependency review, safe import, no credentials/private data |
| Release | Exact pinned source/build, reproducible instructions, versioned package/checksum, regression and owner acceptance; deployment separately authorized |

Use Vitest for deterministic unit tests and Playwright for real browser E2E if chosen. Synthetic tests do not establish physical-device or production acceptance. Keep QA ledger gate identity, evidence, reviewer and scope/dependency fingerprints under studio shared contract; preserve prior PASS evidence and test only delta plus required integration/regression. Independent review before acceptance. No PASS exists for this unimplemented concept.

## Binding delivery decision (2026-11-26)
The earlier optional Neon/API/PWA hosting suggestions are superseded for Genesis of Worlds: local-only ZIP / HTML, no backend, registration, cloud sync or hosted deployment. Portable JSON backup/import supplements browser-local autosave. See [owner decision](LOCAL_ONLY_AND_MOLA.md).
