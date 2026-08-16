# Content-Workflow — laufend neue Inhalte (PDF/Audio, DE/EN)

Wiederholbarer Prozess, um neue Inhalte (v.a. PDFs) auf der Bibliotheks-Seite
zu veröffentlichen, immer zweisprachig DE/EN.

## 1. Inhalt produzieren
- PDF/Audio in DE **und** EN fertigstellen.
- Vor Veröffentlichung gegen `knowledge/verbotene_phrasen.md` prüfen
  (keine Chakren/Energie/Manifestation-Sprache — siehe CLAUDE.md Brand-Regeln).
- Terminologie aus `knowledge/glossar.md` verwenden.

## 2. Dateien ablegen
Namenskonvention, passend zur bestehenden `content/`-Struktur:

```
content/pdf/<slug>-de.pdf
content/pdf/<slug>-en.pdf
content/audio/<slug>-de.mp3   (falls Audio dazugehört)
content/audio/<slug>-en.mp3
```

Bei einem verkäuflichen Bundle: ZIP mit PDF + MP3 + README.txt bauen
(siehe CLAUDE.md → "eBook + Audio Bundle System").

## 3. Karte in pages/library.html eintragen
`pages/library.html` hat zwei Sprachblöcke (`.lang` DE, `.lang` EN), je mit
einer Liste von Karten. Direkt oberhalb des Kommentars

```html
<!-- NEUER INHALT: Card hier oberhalb einfügen (siehe docs/content-workflow.md) -->
```

eine Karte im gleichen Markup-Stil einfügen (Tag-Zeile, Titel, kurzer Text,
CTA-Button) — einmal im DE-Block, einmal im EN-Block (gleiche Reihenfolge).
Verlinke direkt auf die PDF-Datei, den self-hosted eBook-HTML oder den
Gumroad-Produktlink (Username `mindful777`, drei Sevens).

## 4. Verkauf/Vertrieb (optional)
- Kostenlos → direkter Link auf `content/pdf/...` oder eigene HTML-Seite.
- Kostenpflichtig → Gumroad-Produkt unter `mindful777.gumroad.com` anlegen,
  Link in die Karte eintragen (siehe Tabelle "Aktive Produkt-Links" in CLAUDE.md).

## 5. Sichtbarkeit
- Neue Veröffentlichung im Newsletter ankündigen (`pages/newsletter.html`
  ist bereits in der Nav verlinkt und wird auf der Library-Seite beworben).
- Bei größeren Releases: kurzer Hinweis in Discord (FFM-777).

## 6. Git
```bash
git add content/ pages/library.html
git commit -m "content: <slug> hinzugefügt (DE/EN)"
git pull origin main --rebase
git push origin main
```

Damit lässt sich die Bibliothek beliebig oft erweitern, ohne Struktur oder
Design-System neu zu erfinden — jede neue Veröffentlichung ist nur:
Datei ablegen → Karte kopieren → Link eintragen → committen.
