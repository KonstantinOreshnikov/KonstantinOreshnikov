# Chess Odyssey B7 — Historical Source Reconciliation & Authority Evidence

**Audit date:** 2026-11-21 (Asia/Baku). **Target:** B7 Release Candidate v0.7.0.  
**Canonical local source:** `data/masters-source-scores.json` (GitHub blob SHA `0a8e7c8fbb801024b70fdafe3db2cbd9d13e271c`, corroborated by `docs/MASTERS_B5_SOURCE_REGISTER.md`).  
**External factual score source:** https://chessgator.com/games (the exact 31 canonical game URLs are in the source register, not invented new URLs).

## Fresh B7 verification

- All **31/31 individual exact historical score pages** were fetched through a live website content extractor using `ttl=0`. The pages were split into each numbered `Annotated score` line; the SAN in each White and Black slot was extracted, ignoring the source site's editorial evaluations and descriptions.
- **1,923/1,923 SAN half-moves** matched the exact per-game sequence stored in the canonical factual JSON. **31/31 White player labels, 31/31 Black player labels, 31/31 year fields, 31/31 recorded results and 31/31 move counts** matched the primary pages as published on audit date. No source metadata/record or SAN repair required on this B7 refresh.
- Source verification result by game: **31 PASS / 0 mismatch**, and independently via pinned chess.js: all 1,923 SAN plies replayed legally from the initial board, as in B5 automated tests. Checkmate is separately derived from actual final board; a reported resignation must not be described as an on-board checkmate.
- This is **a fresh cross-check against the same primary web publisher**, **not** a full second-source historical archive verification. Re-fetching the same publisher does not create an independent corroboration. In particular the B5 findings remain: four fully matched independent ChessDNA transcriptions (Opera, Immortal, Evergreen and Deep Blue 1997), two **partial** prefix matches (Fischer–Byrne 1956 and Kasparov–Topalov 1999) and the other 25 without an independently verified full secondary score.
- Additional B7 attempts to retrieve second-source ChessDNA URLs for Lasker–Bauer 1889, Levitsky–Marshall 1912, Fischer–Spassky 1972 and Botvinnik–Capablanca 1938 returned generic ChessDNA landing/marketing page content **without move transcripts**. Such results count as **NOT VERIFIED**, not as historical failures or independent evidence.
- Historical tournament round/place/date identities and all original RU/EN/AZ pedagogical interpretations require independent authoritative editorial review if seeking scholarly certification. The game only asserts the supported basic facts above; it does not publish third-party commentary or engine evaluations.

## Rights and safety

- Public pages are **not treated as blanket licenses for site text**. Chess Odyssey only reproduces factual move scores/basic game metadata and links the corresponding source. The 116 educational notes across three languages remain independent Chess Odyssey original writing.
- Source freshness is a **dated audit checkpoint**, not a background source watcher or continuously synchronized archive. Any future source edits require a new recorded comparison.
- Correct FIDE references and accessibility standards used for B7 QA: [FIDE Laws of Chess — 2023](https://handbook.fide.com/chapter/E012023), [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

## Remaining factual limitation

The 31/31 primary matches are adequate to establish **reproducible consistency with the registered primary score pages**, but **not** sufficient to certify all historical events with a second independent expert chess archive. Production can be blocked for strict archival independent-verification criteria; do not silently rewrite historical source register or label the missing second-source results as PASS.
