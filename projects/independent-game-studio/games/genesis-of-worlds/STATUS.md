# Genesis of Worlds — current status

2026-11-26. DEVELOPMENT / OFFLINE TECHNICAL PROTOTYPE. Owner approved local-only ZIP game and remaining P0. No merge or deployment authorization. Branch game/genesis-of-worlds-v0.1-20261126; previous source 0b7fa669abb2ca99b4fd808e4913d5e7704953d9.

Historical tested source 0b7fa669abb2ca99b4fd808e4913d5e7704953d9: [CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45766650902) 12/12 Node + 9/9 Chromium PASS; [screenshots](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45766650902/artifacts/15092197150). Physical Android and independent UAT remain open. New delta (portable JSON saves, MOLA adapter/package) requires its own tests.

- Added portable export/import with validated JSON and no arbitrary filesystem writes. Local storage remains browser/path-specific.
- MOLA ingestion adapter and reproducible packaging script added; baseline procedural package and measured-data package jobs independent. Actual PDS data acquisition, label validation, package hashes and delta CI pending; do not claim measured terrain until CI evidence.
- [Local-only decision and terrain source](docs/LOCAL_ONLY_AND_MOLA.md). No runtime server/DB/auth/cloud. No public hosted release.
- Next cursor: inspect new CI jobs, fix specific failed validation or browser check (max two attempts per unchanged blocker); obtain artifact provenance and archive checksum; independent user acceptance remains open.
- P1 visual portfolio work deferred. Other game records unchanged.
