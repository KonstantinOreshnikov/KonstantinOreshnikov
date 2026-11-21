# Kingdoms of Ember — v1.1

Independent offline desktop fantasy turn-based tactics inspired by the genre of Ancient Empires II (2005). This is **not** a copy or fork of that game: all runtime code and vector/canvas art are authored independently.

## Run
Download `dist/KingdomsOfEmber_v1.1.html` and open it in a modern desktop browser. No server or external dependencies. Turn-based 16×12 tactical map, combat previews, counterattacks, terrain cover, XP, capture, recruitment, economy, AI, four scenarios and RU/EN/AZ interfaces. Import/export JSON saves; legacy v1 localStorage key preserved.

## Source
- `dist/KingdomsOfEmber_v1.1.html`: autonomous game release candidate.
- `src/game.js`: engine, tactics, AI, saving, drawing.
- `src/game.css`: original visuals.
- `src/index.template.html`: HTML shell.
- `tools/build.py`: deterministic zero-dependency offline bundle builder.
- `docs/QA_REPORT.md`: inspectable result matrix and blockers.
- `docs/CHANGELOG.md`: exact changes relative to v1.
- `docs/DESIGN.md`: game architecture and rights/source register.

The v1.1 QA report refers to a downloadable v1.1 source archive containing tests and screenshots; that archive was not available in the inspected GitHub branch or Library. The original v1.0 archive is preserved in `history/v1.0/`.

## Quality gate
**41/41 automated browser/logic checks PASS**, **0 FAIL**, **12/12 complete AI-vs-AI matches** across four scenarios and three difficulties. Exact SHA-256 of the HTML: `7fb760eafdc23c5ce21eb80fb1fea529822e25bc66b3d6f90fc586aaeb33887e`.

**BLOCKED:** sandbox Chromium prohibited direct `file://` and localhost navigation, so Playwright used `page.set_content` and test-only in-memory storage. Do not treat real offline first-launch/browser-restart persistent-save E2E as verified. The original v1.0 sources ZIP is now available and passed ZIP integrity checking during this migration. That does not retroactively complete v1.1 offline-browser QA.

The v1.1 build originated on `game/kingdoms-of-ember-v1.1-20261120` and is included in this migration branch as a development candidate. It is **not a public tagged release**. [Original v1.0 artifact and source archive](history/v1.0/) are preserved. Read [STATUS.md](STATUS.md) before claiming release readiness.
