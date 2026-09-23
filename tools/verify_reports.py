from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
text = (root / "data" / "talks.js").read_text(encoding="utf-8")
hrefs = re.findall(r'href: "(\./reports/[^"]+)"', text)
missing = [h for h in hrefs if not (root / h[2:]).exists()]
print("report hrefs", len(hrefs))
print("missing", missing)
reports = list((root / "reports").glob("*.html"))
print("html files", len(reports))
for p in reports:
    t = p.read_text(encoding="utf-8")
    assert 'id="sources"' in t, p
    assert "theme-toggle" in t, p
    assert "../assets/app.js" in t, p
print("structure ok")
