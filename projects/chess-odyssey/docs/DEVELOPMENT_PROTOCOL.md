# Chess Odyssey — Development Operating Protocol v0.1

## Authority and separation
- This game's owner-approved product concept is archived in docs/ORIGINAL_CONCEPT_2026-11-20.md.
- Build only under projects/chess-odyssey/ and a dedicated game branch. Do not alter other games, main, deployment settings or production sites.
- Prefer real code and evidence to optimistic completion reports. User authorizes iterative development but NOT declaring release on failed checks.

## Skill practices, adapted, not falsely installed
1. **Reuse First:** inspect existing chess libraries and game code first; preserve copyright and licensing; minimize custom rule logic.
2. **Unlazy QA (mandatory):** scope, protected baseline, before/after test, perft, app correctness, browser E2E, responsive UX, translations, source provenance and release gates. Log PASS / FAIL / BLOCKED / NOT TESTED, evidence and exact next step. Never conflate tests written with tests executed.
3. **Humanizer:** new trainer content should explain what and WHY in natural RU/EN/AZ. Avoid automated-sounding verbosity, false tactical certainties, technical jargon without teaching context. Never change chess truth to improve prose.
4. **Translation QA:** all three language variants must preserve move notation, legal moves, chess meaning, threats and exceptions. Independently inspect critical labels and lesson instructions; no machine-translation PASS by assertion.
5. **Browser E2E:** Chromium interactions with board click and selection, actual legal moves, AI response, undo, lessons, localStorage after reload, translation switching and phone viewport. Browser test file existing != executed PASS.
6. **Security/accessibility:** local-only in v0.1; no dynamic innerHTML for user-provided values; support keyboard focus, aria labels, buttons and touch targets. No accounts or analytics without scope decision.
7. **Checkpoint and history:** coherent small commits, CHANGELOG with behavioral delta, QA_LOG with pass/failure evidence, issue for unresolved defect. Never replace failures silently.

## Decision workflow
- **Grill Me** is opt-in only for new product concepts with genuine owner-facing tradeoffs; NOT for executing an approved project.
- These are Chess Odyssey project-scoped practices, not proof of host-level installed upstream skill bundles or paid service access.
- Source of truth: verified executable code/test > this game's current README/QA LOG > historical concept/ideas.

## Hard release gates
Gate A: legal move engine and special rules PASS against known reference positions and perft.
Gate B: every opponent output and coach suggestion legal; target lesson correctness tested.
Gate C: practice / rated isolation enforced before enabling a rating feature.
Gate D: offline distribution, copyright notices, third-party license compliance.
Gate E: real desktop and mobile browser E2E, including save/restore and promotion.
Gate F: independent RU/EN/AZ coverage and semantic parity.
Gate G: functional UX, keyboard focus and accessibility.
Gate H: known high-impact bugs = 0, regression PASS, version artifact and rollback plan.
Gate I: explicit production destination, deployment verification and owner-approved release boundary.

Until all applicable release gates PASS, status stays DEVELOPMENT / BLOCKED FOR v1.0.
