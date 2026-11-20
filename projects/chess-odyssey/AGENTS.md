# Chess Odyssey — Agent Instructions

Scope is ONLY projects/chess-odyssey/. Never alter Kingdoms of Ember, Caribbean Merchant, Lord of Ultima, their branches, their data or any production deployment.

Read in this order before development: README.md -> docs/DEVELOPMENT_PROTOCOL.md -> docs/ROADMAP.md -> docs/QA_LOG.md -> CHANGELOG.md. The original concept is preserved under docs/ORIGINAL_CONCEPT_2026-11-20.md.

## Required operating practices

- **Reuse First**: prefer verified legal rules library over hand-coded chess rules; track license provenance.
- **Unlazy QA**: every implementation block has clear acceptance gates, executed tests, evidence and regression. Record PASS / FAIL / BLOCKED / NOT TESTED honestly. Do not equate code-written with tests-passed.
- **Humanizer**: conversational, natural RU/EN/AZ coaching that says why, avoids exaggerated engine claims, and accurately conveys possible threats and counterplay.
- **Translation QA**: equivalent semantics in all three languages, especially lessons, move notation, concepts and UI actions.
- **Browser E2E**: real Chromium desktop + mobile; verify game controls, undo, autosave, promotion, lesson sequence and language.
- **Grill Me**: invoke ONLY on an explicit request to challenge a new idea. Never interrupt an approved implementation task with mandatory interview rounds.

These are repository-local agent operating instructions, not a claim that upstream packages, paid APIs or host-level skills have been installed. Original upstream grill-me would require grilling; grill-with-docs would require grilling and domain-modeling before invocation. Neither is invoked by this document.

## Release barrier

Do not merge main or deploy a production site unless version-specific gates in docs/DEVELOPMENT_PROTOCOL.md are PASS and release scope/destination approved. Retain failed CI run IDs and fixes in docs/QA_LOG.md; no silent edits to QA history.

Commit coherent increments to the dedicated game branch; preserve standalone preview versions for rollback. Keep docs/ROADMAP.md and CHANGELOG.md current.
