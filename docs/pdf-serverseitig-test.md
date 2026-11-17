# Serverseitige PDF-Erzeugung — Testergebnis (C7)

**Frage:** Erzeugt ein lokales Skript (Puppeteer/Playwright oder WeasyPrint)
aus demselben HTML sauberere PDFs als `html2pdf.js` — gleiche Schriften,
gleiche Seitenumbrüche?

## Testaufbau

Beispieltext: der Standard-Beispielinhalt aus `mindful7777-pdf-maker.html`
(Deckblatt + zwei Kapitel, eine `---`-Seitentrennung). Zwei Wege aus
demselben gerenderten DOM erzeugt, beide über Chromium (Playwright steuert
dieselbe Chromium-Version, die auch in diesem Environment vorinstalliert
ist — funktional identisch zu Puppeteer für diesen Zweck):

1. **Nativer Chromium-Druck** (`page.pdf()`), so wie es der
   Browser-Druckdialog bzw. ein Puppeteer/Playwright-Skript im Hintergrund
   täte — nutzt dieselbe `@media print`-CSS wie der Button "PDF erstellen"
   im Tool.
2. **`html2pdf.js`** (aktuelle Version 0.14.0, weiterhin html2canvas-basiert)
   auf dasselbe `#paper`-Element angewendet — der Weg, den
   `pdf-maker-client.html` für den Teilen-Button (`navigator.share`) nutzt.

## Ergebnis

| | Nativer Druck (Puppeteer-Weg) | html2pdf.js (Canvas-Weg) |
|---|---|---|
| Dateigröße | 77 KB | 349 KB (4,5×) |
| Seiten | 3 (identisch) | 3 (identisch) |
| Eingebettete Bild-Objekte | 0 | 3 (eine JPEG-Rastergrafik pro Seite) |
| Text im PDF | echter Vektortext, 27 eingebettete Schriftobjekte | keine echten Textobjekte — Seite ist ein Bild, Text nicht markier-/durchsuchbar |

Die Seitenumbrüche sind bei beiden Wegen identisch (dieselbe `---`-Trennung
im Markdown, dieselbe Chromium-Rendering-Engine darunter). Der Unterschied
liegt ausschließlich in der Ausgabe: Der native Weg schreibt echte
PDF-Textobjekte mit eingebetteten Schriften — durchsuchbar, markierbar,
in jeder Zoomstufe scharf. `html2pdf.js` fotografiert die Seite
(html2canvas) und klebt das Bild in ein PDF — bei Zoom wird es unscharf,
Text ist nicht kopierbar, und die Datei ist trotz identischem Inhalt
viermal so groß. Das bestätigt die in `UEBERGABECLAUDECODEv2.md` (A3)
vermerkte "bekannte Schwäche" von `pdf-maker-client.html`s Teilen-Weg.

## Einordnung

**Empfehlung:** Falls der Teilen-Weg in `pdf-maker-client.html` wichtig
bleibt, lohnt sich mittelfristig ein kleiner Puppeteer-Endpunkt statt
html2pdf.js — echte Textqualität, kleinere Dateien. Kurzfristig bleibt der
Druckdialog-Weg (bereits vorhanden, bereits gut) die zuverlässigste Option
für alle drei Versandwege.

Testdateien (zum Vergleich, nicht Teil des Repos):
`native-print.pdf` (77 KB) und `html2pdf-canvas.pdf` (349 KB), erzeugt aus
demselben Beispielinhalt.
