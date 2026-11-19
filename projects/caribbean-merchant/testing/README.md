# Quality engineering: web testing + game testing

The project has two different forms of testing:

**Hands-on playtesting.** The concept owner played early builds, identified usability/balance problems, rejected failed designs and directed improvements. This is an actual participant feedback loop, not a synthetic persona.

**Automated browser scenarios.** The packaged v1.0 QA report records **26 passing local Chromium/Playwright scenarios**. They checked UI interactions and selected economic invariants with injected localStorage, not a long real-world campaign.

## QA artifacts

- [Evidence and limits](evidence.md) — what was actually checked.
- [Test strategy](test-strategy.md) — web/UX/game/economy risks and gates.
- [Feedback-to-fix matrix](../history/feedback-loop.md) — observations that changed the product.
- [Playable artifact](../play/CaribbeanMerchant_v1.0.html) — verify independently.

## A candid testing boundary

The environment prevented direct `file://` and localhost browser navigation. The recorded browser tests used `page.set_content` to inject the exact HTML and a substitute localStorage implementation. They exercised behavior and rendering, but **cannot establish that double-clicking the game on every Windows browser works**. Browser data persistence across saved file versions still deserves user confirmation.

A green smoke test is not the same as long-run balance, accessibility certification, zero defects or independent security review.

## Related learning repos

[Web Testing with Python](https://github.com/KonstantinOreshnikov/web-testing-python) · [Quality Engineering Lab](https://github.com/KonstantinOreshnikov/web-testing-page-object) · [Automated Test Reporting](https://github.com/KonstantinOreshnikov/automated-test-reporting)

[Project overview](../README.md)
