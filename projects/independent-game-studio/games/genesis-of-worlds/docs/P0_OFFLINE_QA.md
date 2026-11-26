# Mars v0.1 — verified local development package

2026-11-26. Owner scope: P0 personal offline prototype, no hosted release. Exact runtime/build/test source 43a553ccb5da1292952a9cb4f8e3c75ceef0e467. This is a technical candidate, not full gameplay or formal release.

Exact tested source 43a553ccb5da1292952a9cb4f8e3c75ceef0e467: [offline package CI](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048) 2/2 jobs SUCCESS; 12/12 engine, 6/6 terrain synthetic fixtures, 11/11 offline Chromium, 12/12 MOLA Chromium. The two browser suites overlap; do not add their counts as unique scenarios. Actual official MOLA data downloaded, validated and embedded. Both downloaded CI artifact outer SHA-256 and inner ZIP SHA-256 matched; ZIP CRC integrity passed; MOLA HTML, label and embedded grid SHA-256 matched actual provenance. No physical Android, independent human gameplay/linguistic acceptance or performance benchmark claim.

| Artifact | SHA-256 of inner ZIP | CI evidence |
| --- | --- | --- |
| GenesisOfWorlds_v0.1_MOLA.zip (136754 bytes) | `aa75be7bc955761f026db80ca1edfa271276b0de9c29324eb4f5a8ac01bd41bf` | [MOLA candidate](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048/artifacts/15092733115) |
| GenesisOfWorlds_v0.1_Offline.zip | `e95a97d3459e9dda630b30806513bd48210bfbd9aafe2e402f1a0ebec561f32e` | [Procedural candidate](https://github.com/KonstantinOreshnikov/KonstantinOreshnikov/actions/runs/45768735048/artifacts/15092374018) |

CI artifacts expire 2027-02-24; not permanent GitHub Releases. MOLA outer artifact SHA-256 `7b327d1bed9a25deb111c920fdd8aee31b035e1067db235cb216642f187af357`; procedural outer SHA-256 `729a96ab223fcae1f14e1f59b5c955998e7320478e22978f66a0cb7eee9170e1`. MOLA HTML SHA-256 `d6cb4873bd90c878ea4783c37551627d17cacc00d39294e4ab3d52797c660f0e`; procedural HTML SHA-256 `ff7dffe27798a4050efb2ebb8db43a01dee2530a578e6a5d6bcca2c76609fed5`.

## MOLA source and derivative

PDS4 MEG004, source [IMG](https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg004/megt90n000cb.img), [XML](https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg004/megt90n000cb.xml). Source shape 720×1440, range −8068 to 21134 m; derived 180×360, range −7487 to 20475 m, 64800 signed little-endian int16 samples. Latitude-area-weighted 4×4 mean. Raw source SHA-256 `25f16fb7aaf857898dcf98bc4f841341a24f8b9f7e98453ca083bc45d897ca2c`; XML `e3982cb17458a9d59896b0c21e0485322ccc42f8e6089d9d856a62032775b60b`; derived binary `ca5e873a2a283cb717e9433ef3e06b2b4ee211c22eabb522965f5e865ace0e52`. Archive readback rehashed embedded grid, label and HTML and checked range/length. Credit: NASA / MGS MOLA Science Team / PDS Geosciences Node. The source is measured elevation; rendering colors, ice, water and climate are game approximations. 1° downsample is deliberately coarse; graphics and physically grounded water-volume model remain improvements.

## Gates

- Engine + terrain adapter: automated PASS, exact source, Node CI, maker-authored fixtures; not independent review.
- Offline and MOLA Chromium: automated PASS, file launch, real globe, rotation, ticks/rates, save slots, pause/speed, reload, locale switching, 390px layout, JSON export/import (invalid rejected), no HTTP(S) runtime requests, no uncaught errors; MOLA mode also validates active measured grid. Scope exact built HTML.
- Package integrity: PASS for exact downloaded artifacts (outer/inner hashes, CRC, MOLA embedded hashes). Reviewer: maker readback; independent acceptance not verified.
- Physical device, long-session performance/visual fidelity, full human RU/EN/AZ, owner UAT: NOT VERIFIED.
- Formal release/deployment: NOT STARTED, not authorized.

Next cursor: owner local PC trial; verify visuals and performance, then approve next game milestone (economy/cities). No main merge or deployment. P1 other portfolio visuals remain deferred.
