#!/usr/bin/env python3
"""Build the autonomous offline HTML from separately stored original sources."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'src/index.template.html').read_text(encoding='utf8')
css=(ROOT/'src/game.css').read_text(encoding='utf8')
js=(ROOT/'src/game.js').read_text(encoding='utf8')
assert html.count('<!-- EMBER_CSS -->')==1 and html.count('<!-- EMBER_JS -->')==1
built=html.replace('<!-- EMBER_CSS -->',css).replace('<!-- EMBER_JS -->',js)
target=ROOT/'dist/KingdomsOfEmber_v1.1.html'
target.parent.mkdir(exist_ok=True,parents=True)
target.write_text(built,encoding='utf8')
print(f"Built {target} ({target.stat().st_size} bytes)")
