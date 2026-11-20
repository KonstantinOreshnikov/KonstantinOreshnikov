# Quality engineering: web testing + game testing

The project has two different forms of testing:

**Hands-on playtesting.** The concept owner played early builds, identified usability/balance problems, rejected failed designs and directed improvements. This is an actual participant feedback loop, not a synthetic persona.

**Automated browser scenarios.** The packaged v1.0 QA report records **26 passing local Chromium/Playwright scenarios**. They checked UI interactions and selected economic invariants with injected localStorage, not a long real-world campaign.

## v1.1 recorded synthetic regression evidence

The [v1.1 QA report](v1.1-contracts-autosale.md) records:
- **19 PASS** synthetic-DOM gameplay assertions, including stale-offer rotation, delivery and career credit.
- **14 PASS** synthetic runtime assertions using the owner's prior day-1238 JSON save, without resetting existing progress.
- **5 PASS** synthetic UI event checks for global auto-sale and contract completion.

These are **recorded checks in the source branch**, not an independent Playwright rerun after the portfolio merge. The v1.1 changes to title/footer are display-only; the embedded JavaScript is text-identical to modular `game.js` after integration. Native Windows/Android file-open and cross-device persistence E2E remain **NOT TESTED**.

## QA artifacts

- [Evidence and limits](evidence.md) — what was actually checked.
- [Test strategy](test-strategy.md) — web/UX/game/economy risks and gates.
- [Feedback-to-fix matrix](../history/feedback-loop.md) — observations that changed the product.
- [Latest playable artifact v1.1](../play/CaribbeanMerchant_v1.1.html) — verify independently.
- [Previous playable artifact v1.0](../play/CaribbeanMerchant_v1.0.html) — preserved baseline.

## A candid testing boundary

The environment prevented direct `file://` and localhost browser navigation. The recorded browser tests used `page.set_content` to inject the exact HTML and a substitute localStorage implementation. They exercised behavior and rendering, but **cannot establish that double-clicking the game on every Windows browser works**. Browser data persistence across saved file versions still deserves user confirmation.

A green smoke test is not the same as long-run balance, accessibility certification, zero defects or independent security review.

## Related learning repos

[Web Testing with Python](https://github.com/KonstantinOreshnikov/web-testing-python) · [Quality Engineering Lab](https://github.com/KonstantinOreshnikov/web-testing-page-object) · [Automated Test Reporting](https://github.com/KonstantinOreshnikov/automated-test-reporting)

[Project overview](../README.md)
