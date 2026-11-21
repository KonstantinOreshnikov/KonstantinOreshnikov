# Chess Odyssey — Agent Instructions

Application/runtime scope is ONLY `projects/chess-odyssey/`. Documentation-only synchronization of the top-level public portfolio README, `projects/README.md` and `projects/game-studio/README.md` is allowed on the chess development branch to correct project navigation/status. Never alter Kingdoms of Ember, Caribbean Merchant, Lord of Ultima runtime, their branches, their data or any production deployment.

**Current phase:** B9 / v0.9 DEVELOPMENT, not an idea; last packaged playable preview remains v0.8.0; no v0.9 release, no online PvP production. **Read first:** docs/CURRENT_STATUS.md -> docs/B9_NEON_STAGING_CHECKPOINT_2026-11-21.md -> docs/B9_NEON_INTEGRATION.md -> docs/QA_LOG.md -> docs/ROADMAP.md -> README.md -> docs/DEVELOPMENT_PROTOCOL.md -> CHANGELOG.md. Archived original idea: docs/ORIGINAL_CONCEPT_2026-11-20.md (**historical**, not current). Always verify actual CI and live Neon state before changing status.

## Required operating practices

- **Reuse First**: prefer verified legal rules library over hand-coded chess rules; track license provenance.
- **Unlazy QA**: every implementation block has clear acceptance gates, executed tests, evidence and regression. Record PASS / FAIL / BLOCKED / NOT TESTED honestly. Do not equate code-written with tests-passed.
- **Humanizer**: conversational, natural RU/EN/AZ coaching that says why, avoids exaggerated engine claims, and accurately conveys possible threats and counterplay.
- **Translation QA**: equivalent semantics in all three languages, especially lessons, move notation, concepts and UI actions.
- **Browser E2E**: real Chromium desktop + mobile; verify game controls, undo, autosave, promotion, lesson sequence and language.
- **Grill Me**: invoke ONLY on an explicit request to challenge a new idea. Never interrupt an approved implementation task with mandatory interview rounds.

These are repository-local agent operating instructions, not a claim that upstream packages, paid APIs or host-level skills have been installed. Original upstream grill-me would require grilling; grill-with-docs would require grilling and domain-modeling before invocation. Neither is invoked by this document.

## Current B9 security and acceptance boundaries
- Historical verified automated QA: GitHub Actions [#403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027) (3/3 jobs PASS), B8 clock 32/32, B8 browser 12/12, B9 synthetic domain 27/27, HTTP 15/15, two-browser 11/11. Synthetic success is NOT live Neon E2E.
- Neon Staging `wild-hall-05832800`, PostgreSQL 17 Frankfurt, Better Auth email+OTP configured with owner authorization. Four application tables have RLS+FORCE RLS and **zero** allow policies. Zero genuine users/games verified. Live authenticated PvP, issuer/signature checks, transactional durable adapter, real OTP and negative security QA are NOT TESTED.
- `pvp/dev-server.cjs` uses spoofable `X-Demo-User`, limited to loopback. This fixture MUST NEVER be publicly served or re-used as production authentication; do not claim live PvP based on it.
- In production protect data and credentials, perform authenticated two-real-user tests, preserve opt-in migration and distinct AI Ladder Index/PvP scores. Keep B8 independent RU/EN/AZ manual review and B5 second-archive checks OPEN.
- Owner-approved staging Auth changes are not permission for production, main merges or public deployment.

## Release barrier

Do not merge main or deploy a production site unless version-specific gates in docs/DEVELOPMENT_PROTOCOL.md are PASS and release scope/destination approved. Retain failed CI run IDs and fixes in docs/QA_LOG.md; no silent edits to QA history.

Commit coherent increments to the dedicated game branch; preserve standalone preview versions for rollback. Keep docs/ROADMAP.md and CHANGELOG.md current.
