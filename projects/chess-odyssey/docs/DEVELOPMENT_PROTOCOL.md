# Chess Odyssey — Development Operating Protocol (rules baseline v0.1)

**Current application state:** B9 / v0.9 Development (2026-11-21). Last packaged playable v0.8.0. See [canonical current project status](CURRENT_STATUS.md); this protocol's *v0.1* number refers to the historical process baseline, not the game's current phase.

## Authority and separation
- The original owner's idea is archived at [ORIGINAL_CONCEPT_2026-11-20.md](ORIGINAL_CONCEPT_2026-11-20.md). It was superseded by the implemented B0–B8 game and owner-approved B9 live-friends-PvP v1.0 scope. Do not reuse its idea-only status as current.
- Work under `projects/chess-odyssey/` via dedicated feature branches and review; explicit owner-approved GitHub source/docs merges #7 and #8 were completed into `main` on 2026-11-21. Do not change other games or deploy production, and do not treat source merge as acceptance of live cloud PvP.
- Prefer real code and evidence to optimistic completion reports. User authorizes iterative development but NOT declaring release on failed checks.

## Skill practices, adapted, not falsely installed
1. **Reuse First:** inspect existing chess libraries and game code first; preserve copyright and licensing; minimize custom rule logic.
2. **Unlazy QA (mandatory):** scope, protected baseline, before/after test, perft, app correctness, browser E2E, responsive UX, translations, source provenance and release gates. Log PASS / FAIL / BLOCKED / NOT TESTED, evidence and exact next step. Never conflate tests written with tests executed.
3. **Humanizer:** new trainer content should explain what and WHY in natural RU/EN/AZ. Avoid automated-sounding verbosity, false tactical certainties, technical jargon without teaching context. Never change chess truth to improve prose.
4. **Translation QA:** all three language variants must preserve move notation, legal moves, chess meaning, threats and exceptions. Independently inspect critical labels and lesson instructions; no machine-translation PASS by assertion.
5. **Browser E2E:** Chromium interactions with board click and selection, actual legal moves, AI response, undo, lessons, localStorage after reload, translation switching and phone viewport. Browser test file existing != executed PASS.
6. **Security/accessibility:** B0/B1 originally local-only. B9 now owner-authorizes staging Neon Better Auth and a small authenticated PvP product; the older no-accounts premise is superseded. No dynamic innerHTML from untrusted values; keyboard focus, aria labels and touch targets. No user-submitted `actorId` / spoofable header in a deployed server; server-side authenticated identity, row ownership, transaction clock and private data isolation must be proven. Local B9 demo is synthetic and must remain loopback-only.
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

Gate J (B9): **Neon authenticated user E2E**: verify real email OTP, JWT/session claims, exact user identity; per-match privacy, transactional chess move/clock/idempotency, authorized progress synchronization, reconnect, two separate real accounts and negative security E2E. A synthetic browser fixture or database schema alone can NEVER satisfy this.
Gate K (B9): safe HTTPS hosting, invite-only/friends access model for 5–10 participants, rollback and secrets isolation. No unrestricted Neon Realtime subscriptions with unknown RLS.
Gate L (B8/B10): owner real PC and phone manual UAT, independent educational RU/EN/AZ editing, B5 historical second-source adjudication or explicitly accepted exclusions.

**Current evidence:** [#403](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/44893035027) local CI all jobs PASS; staging PostgreSQL tables and Neon Better Auth with OTP provisioned; **actual two-user cloud E2E NOT RUN**. Until J, K, L and applicable original gates PASS, status remains **B9/v0.9 DEVELOPMENT — v1.0 BLOCKED**. See [current project status](CURRENT_STATUS.md).
