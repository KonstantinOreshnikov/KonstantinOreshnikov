# Genesis of Worlds — current status

2026-11-26. DEVELOPMENT / VERIFIED OFFLINE TECHNICAL CANDIDATE. Owner approved local-only ZIP and integration of these primary development materials into main on 2026-11-26. No formal game release or hosted deployment authorized.

Exact tested source 43a553ccb5da1292952a9cb4f8e3c75ceef0e467: [offline package CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048) 2/2 jobs SUCCESS; 12/12 engine, 6/6 terrain synthetic fixtures, 11/11 offline Chromium, 12/12 MOLA Chromium. The two browser suites overlap; do not add their counts as unique scenarios. Actual official MOLA data downloaded, validated and embedded. Both downloaded CI artifact outer SHA-256 and inner ZIP SHA-256 matched; ZIP CRC integrity passed; MOLA HTML, label and embedded grid SHA-256 matched actual provenance. No physical Android, independent human gameplay/linguistic acceptance or performance benchmark claim.

- [MOLA ZIP candidate](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048/artifacts/15092733115) · [procedural fallback](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048/artifacts/15092374018) · [QA and provenance](docs/P0_OFFLINE_QA.md). Temporary CI archives expire 2027-02-24; permanent game release: none.
- Source/terrain/model and browser storage are local; JSON export/import provides portable backup; no servers, accounts or network required at runtime.
- Initial three README illustrations remain clearly labeled procedural concept illustrations, not current MOLA screenshots. Real browser screenshots are in CI artifacts.
- Next cursor: owner local PC trial; assess visual polish and performance, then owner-approved next milestone. P1 studio visuals deferred. Other games unchanged.

Checkpoint GOW-MARS-20261126: automated P0 technical gates PASS for exact candidate; independent human/device/UAT and release gates NOT VERIFIED/NOT STARTED. Do not repeat unchanged PASS or claim a full game.

## Next milestone design addition (2026-11-26)
Owner requested multi-world selection and different difficulty levels. [World selection and difficulty](docs/WORLD_SELECTION_AND_DIFFICULTY.md) records eight planned worlds, five tiers, three independent modes, local campaign saves and data-driven engine contracts. No runtime changes or new QA verdicts; v0.1 remains Mars-only. World/mode foundation targeted for v0.2; playable expansions after core loop. Other projects unchanged.

## Flagship scenario decision (2026-11-26)
Owner selected **Earth: Save Civilization** as the signature feature, prominently presented in README and future main menu. [Scenario specification](docs/EARTH_SAVE_CIVILIZATION.md). Design only; Mars v0.1 runtime and QA evidence unchanged.

## Integration and next milestone (2026-11-26)
Owner approved merging PR #33 as development baseline, not a release. Earth remains Coming Soon; owner requested the exact flagship reference image from chat, but the source asset and reuse rights are not verified, so embedding is pending. [Next development package](docs/V0_2_EXECUTION_PLAN.md). Historical QA evidence remains unchanged; no new runtime code in this documentation delta.

## Active v0.2 work (2026-11-26)
Owner authorized next implementation milestone. Branch game/genesis-of-worlds-v0.2-20261126; v0.1 main baseline 8995932049d24ef4d4cbe54ed88f4d3dc420f860; model commit e28a02c3ff2e107179c52676c84708ba066bb5a2; original tested source retained. New campaign/menu, three economic modes, separate local slots, v1 migration, city economy, construction, upkeep, trade and environmental facilities implemented in separate v0.2 files. Seven future worlds are Coming Soon. Initial 20 maker engine checks passed in JS isolate; Node and measured MOLA package steps succeeded in [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45772973094); Chromium pending. No release, merge or deployment authorization for v0.2. Earth hero exact original image still pending rights/source. Next cursor: inspect dedicated v0.2 CI; fix targeted failures; package readback and independent owner acceptance.

Checkpoint GOW-V02-20261126: exact runtime 3c65092f4d9fe29505b4e01696de91d6d0db8802; PR #34; 20/20 initial maker assertions plus Node suite step success, 3 mode × 42-year maker stress paths valid. Package build step success; Chromium test/CI artifact digest pending. P1/P2 integration acceptance open; next cursor job 139749762200. No actual physical PC owner UAT or independent checker PASS.

## v0.2 automated QA result — 2026-11-26 (supersedes pending checkpoint)
20/20 campaign/economy assertions + 1 compound trade/recruitment check PASS; 13/13 real Chromium checks PASS; measured MOLA package and exact archive integrity PASS. Independent human/device/owner acceptance and long-term balance remain open.
- Exact source 3c65092f4d9fe29505b4e01696de91d6d0db8802; [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45772973094); [artifact](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45772973094/artifacts/15094537949), expires 2027-02-24. Inner ZIP 143109 bytes, SHA-256 `fa202a459b0f0aaa300b0ef5455b413d1434c51039efc16fd3f203566fa7c2d1`; outer artifact SHA-256 `372f43c10939e4b2d8d594ed3a0a4e815d5f5a82eac22d63dfbde05be2b7ca05`; embedded HTML and MOLA grid hashes matched, both ZIP CRC checks clean.
- Next: owner local PC playtest and independent review; targeted UI/economy feedback, then v0.3 research/biome/events. Full victory/failure, new world gameplay and long-term balance are not yet implemented/verified. No main merge, hosted deployment or formal release authorization for v0.2. [QA details](docs/V0_2_QA.md).

## Active v0.3 development (2026-11-26)
Owner authorized next work; stacked branch game/genesis-of-worlds-v0.3-20261126 from verified v0.2 evidence 0e561e076706ae49b8a26489bc81554f0eeae7d9. 22/22 maker model assertions, UI syntax compiled. New research, ecological stages, events, achievements and victory/recovery. Node/Chromium/package QA pending. Prior versions untouched. Next: exact new CI and full fresh campaign balance check. No merge or release approval.

### v0.3 checkpoint
Exact runtime 17128ebbe6eb91cd674bd630965490470a9c977e; stacked [PR #35](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/pull/35), [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45774541198), job 139754910897. Node assertions and MOLA package step succeeded; Chromium pending. Three fresh campaign paths reach victory in 156/168/179 years (Beginner/Normal/Expert), reproducible maker JS tests in [evidence](docs/V0_3_FRESH_VICTORY.md). Independent human/device and alternative-path balance not verified. v0.2 artifact remains latest verified package until v0.3 browser/archive gate. Next inspect original exact CI; no merge.

## v0.3 automated QA result — 2026-11-26 (supersedes pending checkpoint)
22/22 Node assertions; 10/10 Chromium E2E; 3/3 fresh maker model victory paths (156/168/179 years); measured MOLA ZIP and embedded hashes verified. Independent human/device/UAT, alternative-path balance and long-session performance remain open.
- Exact source 17128ebbe6eb91cd674bd630965490470a9c977e; [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45774541198); [artifact](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45774541198/artifacts/15094714534), expires 2027-02-24. Inner ZIP 148903 bytes, SHA-256 `ae056743025f22427e46730e343c5ea4f953de9c7ef32af430d922fffae88b08`; outer artifact SHA-256 `63cd9a311abe914993cba73e5ad1b9d9447ecf1d247f1ee30af908ed923238c1`; HTML and measured grid hashes independently recomputed from downloaded bytes by maker, both ZIP CRC checks clean.
- Next development milestone v0.4: orbital infrastructure, forecasts, target automation, regional resilience systems. Owner UAT and independent checker remain open, not blockers to separately authorized development. Mars only playable. Draft stacked PR #35 on #34; no main merge, hosted deployment or release. [QA details](docs/V0_3_QA.md).

## v0.4 development
Owner authorized v0.4; stacked on v0.3. 22/22 maker checks; dedicated Node/Chromium/MOLA package gates pending. Orbital infrastructure, automation, forecasts/history, flood risk/adaptation, policy. No merge/release. Next exact CI and artifact verification.
