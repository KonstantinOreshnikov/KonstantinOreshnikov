# Chess Odyssey — B5 Historical Game Source & Provenance Register

**Prepared:** 2026-11-21. **Authority:** `data/masters-source-scores.json` (GitHub blob SHA `0a8e7c8fbb801024b70fdafe3db2cbd9d13e271c` when sourced) and verified historical SAN in `masters-library.js`. The B5 corpus is a **curated learning selection** rather than an exhaustive, licensed copy of the world's chess archives.

## Origin and reuse rules

- Primary factual score records: https://chessgator.com/games/ — each game has its **exact source URL** below, fetched and parsed on 2026-11-21. Historical moves, basic event/player/year/outcome metadata are factual records; **no source-site commentary, engine evaluation labels, screenshots or proprietary graphical assets are copied**.
- Independent external corroboration: https://chessdna.app/games/index.html; complete matching transcribed scores for Opera, Immortal, Evergreen and Deep Blue 1997, and partial prefix agreement for Fischer Byrne 1956 (53 plies) and Kasparov Topalov 1999 (66 plies). This is **NOT full cross-source verification for all 31**.
- Supplementary reference/discovery paths: https://www.pgnmentor.com/files.html and https://www.chess.com/article/view/the-best-chess-games-of-all-time; Lichess public game dataset https://database.lichess.org/ was reviewed as a potential licensed training data alternative, but is **not falsely treated as the source for these historical PGNs**. No bulk unlicensed database is rehosted.
- Every factual move is **replayed move-by-move through the pinned chess.js**. Final checkmate is calculated from actual position; recorded 1-0 or 0-1 may represent resignation and must not be relabeled as checkmate.
- Original new Chess Odyssey educational commentary lives in `masters-notes-a.js`, `masters-notes-b.js`, `masters-notes-c.js`, with RU/EN/AZ title, introductory teaching, and 116 move-specific notes. The original site commentary is **not** reproduced.
- Provenance policy: game IDs, year and exact source URLs are checked. Event metadata can differ historically between databases; **independent archival adjudication of every player/date/event is NOT COMPLETE**. Note uncertainty rather than filling gaps with speculation.
- Current package reproduces only factual SAN scores and original learning text; no third-party game-site code, images, analysis prose, or media. If rights/accuracy disputes are found, quarantine the affected score pending review rather than falsely certify it.

## Historical game register (31 games; 1923 recorded half-moves)

| # | Canonical ID | Players | Year | Recorded result | Half-moves | Score record | Cross-check status |
| ---: | --- | --- | ---: | :---: | ---: | --- | --- |
| 01 | `opera-game` | Paul Morphy — Duke of Brunswick & Count Isouard | 1858 | 1-0 | 33 | [Primary](https://chessgator.com/games/opera-game) | Secondary check |
| 02 | `immortal-game` | Adolf Anderssen — Lionel Kieseritzky | 1851 | 1-0 | 45 | [Primary](https://chessgator.com/games/immortal-game) | Secondary check |
| 03 | `evergreen-game` | Adolf Anderssen — Jean Dufresne | 1852 | 1-0 | 47 | [Primary](https://chessgator.com/games/evergreen-game) | Secondary check |
| 04 | `game-of-the-century` | Donald Byrne — Bobby Fischer | 1956 | 0-1 | 82 | [Primary](https://chessgator.com/games/game-of-the-century) | Secondary check |
| 05 | `kasparov-topalov-1999` | Garry Kasparov — Veselin Topalov | 1999 | 1-0 | 87 | [Primary](https://chessgator.com/games/kasparov-topalov-1999) | Secondary check |
| 06 | `deep-blue-kasparov-1997` | Deep Blue — Garry Kasparov | 1997 | 1-0 | 37 | [Primary](https://chessgator.com/games/deep-blue-kasparov-1997) | Secondary check |
| 07 | `karpov-kasparov-1985` | Anatoly Karpov — Garry Kasparov | 1985 | 0-1 | 80 | [Primary](https://chessgator.com/games/karpov-kasparov-1985) | Primary + legal replay |
| 08 | `lasker-bauer-1889` | Emanuel Lasker — Johann Bauer | 1889 | 1-0 | 65 | [Primary](https://chessgator.com/games/lasker-bauer-1889) | Primary + legal replay |
| 09 | `levitsky-marshall-1912` | Stepan Levitsky — Frank Marshall | 1912 | 0-1 | 46 | [Primary](https://chessgator.com/games/levitsky-marshall-1912) | Primary + legal replay |
| 10 | `fischer-spassky-1972` | Bobby Fischer — Boris Spassky | 1972 | 1-0 | 81 | [Primary](https://chessgator.com/games/fischer-spassky-1972) | Primary + legal replay |
| 11 | `botvinnik-capablanca-1938` | Mikhail Botvinnik — José Raúl Capablanca | 1938 | 1-0 | 81 | [Primary](https://chessgator.com/games/botvinnik-capablanca-1938) | Primary + legal replay |
| 12 | `steinitz-von-bardeleben-1895` | Wilhelm Steinitz — Curt von Bardeleben | 1895 | 1-0 | 49 | [Primary](https://chessgator.com/games/steinitz-von-bardeleben-1895) | Primary + legal replay |
| 13 | `rotlewi-rubinstein-1907` | Georg Rotlewi — Akiba Rubinstein | 1907 | 0-1 | 50 | [Primary](https://chessgator.com/games/rotlewi-rubinstein-1907) | Primary + legal replay |
| 14 | `reti-bogoljubov-1924` | Richard Réti — Efim Bogoljubov | 1924 | 1-0 | 49 | [Primary](https://chessgator.com/games/reti-bogoljubov-1924) | Primary + legal replay |
| 15 | `samisch-nimzowitsch-1923` | Friedrich Sämisch — Aron Nimzowitsch | 1923 | 0-1 | 50 | [Primary](https://chessgator.com/games/samisch-nimzowitsch-1923) | Primary + legal replay |
| 16 | `torre-lasker-1925` | Carlos Torre — Emanuel Lasker | 1925 | 1-0 | 85 | [Primary](https://chessgator.com/games/torre-lasker-1925) | Primary + legal replay |
| 17 | `short-timman-1991` | Nigel Short — Jan Timman | 1991 | 1-0 | 67 | [Primary](https://chessgator.com/games/short-timman-1991) | Primary + legal replay |
| 18 | `tal-hecht-1962` | Mikhail Tal — Hans-Joachim Hecht | 1962 | 1-0 | 97 | [Primary](https://chessgator.com/games/tal-hecht-1962) | Primary + legal replay |
| 19 | `paulsen-morphy-1857` | Louis Paulsen — Paul Morphy | 1857 | 0-1 | 56 | [Primary](https://chessgator.com/games/paulsen-morphy-1857) | Primary + legal replay |
| 20 | `capablanca-marshall-1918` | José Raúl Capablanca — Frank Marshall | 1918 | 1-0 | 71 | [Primary](https://chessgator.com/games/capablanca-marshall-1918) | Primary + legal replay |
| 21 | `alekhine-feldt-1916` | Alexander Alekhine — M. Feldt | 1916 | 1-0 | 35 | [Primary](https://chessgator.com/games/alekhine-feldt-1916) | Primary + legal replay |
| 22 | `edward-lasker-thomas-1912` | Edward Lasker — George Thomas | 1912 | 1-0 | 35 | [Primary](https://chessgator.com/games/edward-lasker-thomas-1912) | Primary + legal replay |
| 23 | `spassky-bronstein-1960` | Boris Spassky — David Bronstein | 1960 | 1-0 | 45 | [Primary](https://chessgator.com/games/spassky-bronstein-1960) | Primary + legal replay |
| 24 | `zukertort-blackburne-1883` | Johannes Zukertort — Joseph Blackburne | 1883 | 1-0 | 65 | [Primary](https://chessgator.com/games/zukertort-blackburne-1883) | Primary + legal replay |
| 25 | `byrne-fischer-1963` | Robert Byrne — Bobby Fischer | 1963 | 0-1 | 42 | [Primary](https://chessgator.com/games/byrne-fischer-1963) | Primary + legal replay |
| 26 | `mcdonnell-labourdonnais-1834` | Alexander McDonnell — Louis-Charles de la Bourdonnais | 1834 | 0-1 | 74 | [Primary](https://chessgator.com/games/mcdonnell-labourdonnais-1834) | Primary + legal replay |
| 27 | `kasparov-karpov-1986` | Garry Kasparov — Anatoly Karpov | 1986 | 1-0 | 81 | [Primary](https://chessgator.com/games/kasparov-karpov-1986) | Primary + legal replay |
| 28 | `carlsen-anand-2013` | Magnus Carlsen — Viswanathan Anand | 2013 | 1-0 | 115 | [Primary](https://chessgator.com/games/carlsen-anand-2013) | Primary + legal replay |
| 29 | `nezhmetdinov-chernikov-1962` | Rashid Nezhmetdinov — Oleg Chernikov | 1962 | 1-0 | 65 | [Primary](https://chessgator.com/games/nezhmetdinov-chernikov-1962) | Primary + legal replay |
| 30 | `kasparov-anand-1995` | Garry Kasparov — Viswanathan Anand | 1995 | 1-0 | 75 | [Primary](https://chessgator.com/games/kasparov-anand-1995) | Primary + legal replay |
| 31 | `morphy-anderssen-1858` | Paul Morphy — Adolf Anderssen | 1858 | 1-0 | 33 | [Primary](https://chessgator.com/games/morphy-anderssen-1858) | Primary + legal replay |

### Independent second-source checks (not blanket certification)

- `opera-game`: Exact complete score matched against https://chessdna.app/games/opera-game.html.
- `immortal-game`: Exact complete score matched against https://chessdna.app/games/immortal-game.html.
- `evergreen-game`: Exact complete score matched against https://chessdna.app/games/evergreen-game.html.
- `deep-blue-kasparov-1997`: Exact complete score matched against https://chessdna.app/games/deep-blue-kasparov-1997.html.
- `game-of-the-century`: First 53 plies match independent https://chessdna.app/games/game-of-the-century.html; full independent parity NOT VERIFIED.
- `kasparov-topalov-1999`: First 66 plies match independent https://chessdna.app/games/kasparov-topalov-1999.html; full independent parity NOT VERIFIED.

### QA conflict and historical corrections

The original import transiently attached 1986/2013 data to IDs for Byrne–Fischer **1963** and McDonnell–La Bourdonnais **1834**. Both were detected through year/suffix consistency, replaced from the correct exact source pages and fully replayed; corrective GitHub commit `d95d0c863fd89970aec0ec160cbb225426e91248`. The invalid mapping is historical error evidence, **not** a current game.

Modern editorial publication/refresh dates are **not** the historic match dates. Some historical end scores stop on resignation rather than checkmate; `masters-core.js` independently checks final board status. Years, source URLs and the exact 31 score lists are the facts accepted for B5 development preview, subject to B7 editorial review for production.

## B5 acceptance and release boundary

All **31 game scores**, **1,923 SAN plies**, **116 annotation anchors** and **3 languages** must pass unit QA; browser must navigate actual FEN at every move, show the right explanation and legal-answer options, persist bookmarks, export correct PGN, and protect separate practice/Academy. Documentation-only assertions are not a QA PASS.

**B5 scope:** working historical game replay and learning modes. **Not** a deep Stockfish move-accuracy certification, verified historical annotations in every existing web archive, comprehensive official FIDE master history, nor human editorial RU/EN/AZ language certification. B6 and B7 remain blockers to v1.0 release.
