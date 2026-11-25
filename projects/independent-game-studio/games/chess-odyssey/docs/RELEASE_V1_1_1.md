# Chess Odyssey v1.1.1 — hotfix release candidate

Date: 2026-11-25. **Automated QA PASS; owner authorization and production acceptance pending.**
Current public version remains v1.1 / official archive v1.1.0 until deployment.

## Changes
- PvP: single-flight 1.2s polling, keep selected square on unchanged state, account-scoped active-room restore, epoch and stale-version guards, bounded 10s requests and same-request-ID replay, reconnect and server-clock display.
- RU/EN/AZ: local and online presets, player color/promotion, status/error captions, 43 static accessibility attributes, version labels and historical board accessibility.
- No changes to server function, database data/schema, authorization policy or saved player progress.

## Exact verified artifact
- Source commit: `c42e1c16b379405c1029b9088c4648176f13f11f` (PR #27); full QA [3/3 PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653763), focused [PASS](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790).
- [CI candidate ZIP](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790/artifacts/14997604931): `ChessOdyssey_v1.1.1_Stockfish_Preview.zip`, 152 files, 2,047,853 bytes; SHA-256 `96a6035446ccd3053cf3a954120a43d3c1a9bd96188db81d030873c843662cac`.
- GitHub Actions outer artifact SHA-256 `56b7d8fcecfa64b7787b5b8d1da84bb7cde6fefef559f392cc3276d0727182fa`; artifact #14997604931. This is a temporary CI artifact, not a permanent release. The archive was built before the documentation reconciliation; use this release note as the authoritative accompanying note.
- Full regression includes genuine Stockfish, browser and Windows launcher; Windows launcher job used the compatibility v1.0.0 archive built from the same candidate source. Exact v1.1.1 ZIP was integrity-checked by the focused job.

## Gates
| Gate | Verdict | Evidence |
| --- | --- | --- |
| Full regression | PASS | [3/3](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653763) |
| Two simulated authenticated browser contexts | PASS | [19/19](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790): invite, 40 alternating half-moves, lost HTTP response without duplicate write, both F5, temporary read failure, clocks, outsider denial |
| Account UI | PASS | [9/9](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790); simulated identities, progress isolation and language headings |
| Cloud API | PASS | [26/26](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790); signed JWT and mock transport, not production |
| RU/EN/AZ targeted controls and regression | PASS for tested paths only | [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45561653790); online/local presets, promotion, accessibility, account labels |
| Complete human multilingual review, unknown dialog | NOT VERIFIED | live review remains |
| Actual production two-account match | NOT VERIFIED for v1.1.1 | v1.1 reported FAIL; no synthetic substitution |
| Measured production latency, physical/cross-device checks | NOT VERIFIED | final UAT |
| Owner merge / deploy / permanent publication | BLOCKED until explicit approval | [PR #27](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/27) |

## Release procedure
After explicit authorization: merge only if runtime files still match the tested revision, allow the existing Pages pipeline to deploy, promote the exact verified ZIP from the focused CI artifact to a permanent GitHub prerelease with this note, verify published tag and asset digest, then run two real authenticated players (40 half-moves, reload both sides, reconnect, clocks, latency, access and language checks). Keep v1.1.0 as the prior official release; no full acceptance or stable release claim until owner-approved UAT. The candidate marker is intentional for the production acceptance stage. If real UAT fails, preserve evidence and reopen the affected gate only.
