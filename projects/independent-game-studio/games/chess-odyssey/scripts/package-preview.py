"""Build an inspectable, playable Stockfish B3 preview ZIP.
Only project-local files; includes GPL license and exact upstream hashes.
This is a development artifact, not a production release.
"""
from pathlib import Path
import zipfile
import hashlib

ROOT = Path(__file__).resolve().parent.parent
VERSION = "0.9.0"
NAME = f"ChessOdyssey_v{VERSION}_Stockfish_Preview.zip"
OUTPUT = ROOT / "dist" / NAME
FILES = [
    "START_WINDOWS.cmd",
    "index.html", "styles.css", "pieces/piece-sets.css", "pieces/SOURCE_REGISTER.md", "pieces/LICENSE-MIT.txt", "pieces/LICENSE-APACHE-2.0.txt", "app.js", "clock-core.js", "chess-appearance.js", "game-review-core.js", "coach-engine.js", "engine-bridge.js", "academy.js", "progress-core.js", "progress-ui.js",
    "masters-library.js", "masters-notes-a.js", "masters-notes-b.js", "masters-notes-c.js",
    "masters-core.js", "masters-ui.js",
    "vendor/chess.js",
    "data/masters-source-scores.json",
    "engine/stockfish-19-lite-single.js",
    "engine/stockfish-19-lite-single.wasm",
    "engine/Copying.txt", "engine/MANIFEST.md",
    "scripts/serve-local.cjs",
    "README.md", "THIRD_PARTY_NOTICES.md",
    "docs/ENGINE_B3_DESIGN.md",
    "docs/ACADEMY_B4_DESIGN.md",
    "docs/MASTERS_B5_DESIGN.md", "docs/MASTERS_B5_SOURCE_REGISTER.md", "docs/PROGRESS_B6_DESIGN.md",
    "docs/RELEASE_B7_QA.md", "docs/SOURCE_B7_REFRESH.md",
    "docs/COACH_B2_DESIGN.md",
    "docs/DEVELOPMENT_PROTOCOL.md",
    "docs/QA_LOG.md", "docs/ROADMAP.md",
    "tests/clock-core.cjs", "tests/p0p2-ui-core.cjs", "tests/p0p2-browser.cjs", "tests/release-rules.cjs", "tests/release-browser.cjs", "tests/release-live-match-browser.cjs", "tests/release-accessibility.cjs",
    "dist/ChessOdyssey_v0.9.0_PREVIEW.html",
]
FILES += [f"pieces/{style}/{side}{piece}.svg" for style in ("fantasy","spatial","celtic","chessnut","rhosgfx","kiwen-suwi","totoy","papercut") for side in "bw" for piece in "KQRBNP"]
for rel in FILES:
    target = ROOT / rel
    if not target.is_file() or target.stat().st_size == 0:
        raise RuntimeError(f"Missing or empty packaged file: {rel}")
license_data = (ROOT / "engine/Copying.txt").read_text(encoding="utf-8")
if "GNU GENERAL PUBLIC LICENSE" not in license_data:
    raise RuntimeError("GPL license absent")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
prefix = f"ChessOdyssey_v{VERSION}/"
with zipfile.ZipFile(OUTPUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for rel in FILES:
        archive.write(ROOT / rel, prefix + rel)
with zipfile.ZipFile(OUTPUT) as archive:
    bad = archive.testzip()
    if bad:
        raise RuntimeError(f"Corrupt package: {bad}")
    actual = {name.removeprefix(prefix) for name in archive.namelist()}
    if actual != set(FILES):
        raise RuntimeError(f"Package content mismatch: {set(FILES) ^ actual}")
digest = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
print(f"PASS Chess Odyssey package: {OUTPUT.name}, {len(FILES)} files, {OUTPUT.stat().st_size} bytes, SHA256 {digest}")
