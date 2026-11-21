"""Build the display-version repair without modifying the preserved v1.2 source."""

from hashlib import sha256
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source = root / "releases/CaribbeanMerchant_v1.2.html"
target = root / "releases/CaribbeanMerchant_v1.2.1_QA.html"
expected = "e70f0c6a91177dd630a81e695adc2475f81e4a23152e7b381e8528a77efd4b1e"
raw = source.read_bytes()
assert sha256(raw).hexdigest() == expected, "Original v1.2 artifact changed"
html = raw.decode("utf-8")
marker = "load();ensureEmpire();bind();bindV1();render();"
assert html.count(marker) == 1
assert "v1.2.1" not in html
html = html.replace("v1.2", "v1.2.1")
repair = """// v1.2.1: restore localized version labels after the older v1.0 renderer runs.
const renderChromeBeforeVersionRepair=renderChrome;
renderChrome=function(){renderChromeBeforeVersionRepair();document.title=T('title');$('#footerLeft').textContent=T('footerLeft');};
"""
html = html.replace(marker, repair + marker)
target.write_text(html, encoding="utf-8")
print(f"Original v1.2 SHA-256: {expected}")
print(f"QA candidate v1.2.1 SHA-256: {sha256(target.read_bytes()).hexdigest()}")
