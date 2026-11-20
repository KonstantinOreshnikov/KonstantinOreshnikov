# Historical v1.0 evidence register

**Release under test:** Caribbean Merchant v1.0, prepared 19 Nov 2026.  
**Original local artifact:** `CaribbeanMerchant_v1.0.html`.  
**QA report bundled with the project snapshot:** local `QA_REPORT.md`.

## Supported result

**26 / 26 local automated browser scenarios PASS** in Chromium via Python Playwright. Areas named in that original report: initial render; 3 languages; existing v0.6 save migration; 10-factory purchase; warehouse increments; sales reserve and minimum price; quantity-aware market pricing; contract acceptance and failure cases; destination claim; buildings; rivals; pirate hideouts; navigation and narrow viewport.

**Do not extrapolate**: no exhaustive campaign test, actual Windows local-file opening, security audit, native Android APK or multi-thousand-day production stress test was completed.

## Human testing

The owner played two to three early sessions and reported firsthand UI and gameplay friction. Later requirements were driven by those observations and recollection of original features. This is **valuable player feedback**, but not a controlled study with a participant sample.

## Test implementation note

Due to tool browser navigation restrictions, tests used `page.set_content` with the exact standalone HTML and a localStorage stub. The report did not claim standard HTTP deployment or production backend uptime.

## Latest version evidence

For v1.1, see the separate [contracts and global auto-sale regression report](v1.1-contracts-autosale.md). That report includes synthetic-DOM testing with a previous user save. It does not prove a native Windows/Android or cross-device browser E2E run.

[QA approach](README.md) · [Test cases](test-strategy.md) · [History](../history/README.md)
