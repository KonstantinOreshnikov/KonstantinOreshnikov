# UI/UX: iteration under real feedback

## Map redesign: the clearest lesson

The first versions used hand-drawn SVG land shapes and a dark palette. Extra gradients and piracy circles produced a screenshot where labels overlapped and large areas looked flat and muddy.

**The player explicitly rejected that map.** We did not paper over the complaint with another color tweak; the next build introduced geographical relief and bathymetry, port coordinates derived from geography and readable marker labels.

## Commerce workflow

- Treasury and cargo space in a persistent HUD, including long scroll sessions.
- A compact market highlighting profitable shipments and active-contract goods.
- Market distinction between **city stock**, **player warehouse** and **onboard cargo**.
- One-click **buy max**, **pick up own goods**, and mission load/claim actions.
- Prominent, precise blockers when a contract cannot be funded or carried.

## Localization

Instant **RU / EN / AZ** selection, not a second downloadable build. User interfaces, goods and geographic names follow the selected language. Historical free-text journal entries can remain in their original language; this is documented as a limitation rather than hidden.

## Screen sizes

A PC-first wide layout is primary; narrow viewport checks were performed in local Chromium. A responsive browser view is **not** the same as a packaged Android application.

[Map provenance](../research/attribution.md) · [Testing](../testing/README.md) · [History](../history/milestones.md)
