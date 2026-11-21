# Post-v1.1 roadmap and current limits

v1.1 is the current documented playable standalone with historical synthetic QA; a newer v1.2 HTML artifact exists with independent gameplay QA pending. The previous contract-offer expiry blocker and factory-wide auto-sale request are addressed, as documented in [v1.1 synthetic QA](../testing/v1.1-contracts-autosale.md).

## Next acceptance gates

1. Run owner's Windows downloaded-file smoke test of **v1.1**, including correct version title and an actual contract completion.
2. Complete an extended campaign and record economic health, rank progression and dead ends.
3. Validate real-browser save export/import and local persistence on the user's existing save; synthetic-DOM original-save QA already PASS but native E2E NOT TESTED.
4. Test large quantities: 15 cities × 10 factories over many in-game days.
5. Improve naval battles (course, wind, range, enemy strategy) **without requiring fleet management**.
6. Test map labels and accessibility across large/small screens and all three languages.
7. Evaluate legal attribution/asset licensing before choosing an explicit source-code license or promotion.

## Deferred ideas (not shipped)

Native APK, multiplayer, deep colonial war AI, controllable convoys and a fully animated tactical sea board.

## Risk register

- Game balance and passive-income exploits under long-term simulation — open.
- Real Windows file launch and browser storage portability — open.
- Original mobile-vs-PC rules evidence — incomplete; authoritative mobile manual unavailable.
- Older historical journal records not retranslated on language change — known limitation.
- No repository CI on early development milestones — historical limitation.

[v1.1 QA](../testing/v1.1-contracts-autosale.md) · [QA](../testing/README.md) · [Overview](../README.md)
