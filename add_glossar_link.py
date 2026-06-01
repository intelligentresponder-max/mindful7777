"""
Adds a glossary backlink to all mindful7777 blog articles.
Inserts before the last <footer> or before closing footer nav links.
Run from: ~/Projects/mindful7777/
"""

import os
import re

ARTICLES = [
    "blog/socken-anker.html",
    "blog/theta-wellen.html",
    "blog/hypnose-sportler.html",
    "blog/stress-reset.html",
    "blog/recovery-training.html",
]

# The block to insert — bilingual, one line each, styled inline
GLOSSAR_BLOCK = """
  <!-- Glossar-Backlink (auto-inserted) -->
  <div style="max-width:680px;margin:0 auto 0;padding:0 1.5rem 2rem;font-family:system-ui,sans-serif;font-size:.85rem;">
    <a href="glossar.html" style="color:#2d7a6e;text-decoration:none;border-bottom:1px solid #e8f4f2;">
      → Alle Fachbegriffe: mindful7777 Glossar
    </a>
    &nbsp;·&nbsp;
    <a href="glossar.html" style="color:#2d7a6e;text-decoration:none;border-bottom:1px solid #e8f4f2;">
      → All terms explained: mindful7777 Glossary
    </a>
  </div>
"""

MARKER = "<!-- Glossar-Backlink (auto-inserted) -->"

def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already added
    if MARKER in content:
        print(f"  SKIP (already present): {path}")
        return

    # Insert before <footer — most reliable anchor
    if "<footer" in content:
        new_content = content.replace("<footer", GLOSSAR_BLOCK + "\n  <footer", 1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  OK: {path}")
    else:
        print(f"  WARN — no <footer> found in: {path}")

print("mindful7777 — Glossar-Backlink einfügen")
print("=" * 45)
for article in ARTICLES:
    if os.path.exists(article):
        process_file(article)
    else:
        print(f"  MISSING: {article}")
print("=" * 45)
print("Fertig. Bitte prüfen und pushen:")
print("  git add blog/")
print('  git commit -m "Blog: Glossar-Backlink in alle Artikel eingefügt"')
print("  git push origin main")
