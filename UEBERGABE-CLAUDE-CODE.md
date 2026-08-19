# Übergabe an Claude Code — mindful7777

**Stand:** 19.08.2026, Session am Handy (Chat)
**Repo:** `intelligentresponder-max/mindful7777`, Branch `main`
**Live:** https://intelligentresponder-max.github.io/mindful7777/
**Ergänzt** `CLAUDE.md` im Repo (Brand-Regeln und ACCIO-Design-System gelten unverändert).

---

## 1. Ausgangslage der Session

André arbeitete am Handy, konnte Dateien nur über die GitHub-Weboberfläche hochladen,
nicht bearbeiten oder umbenennen. Alle Änderungen wurden deshalb als vollständige
Dateien geliefert und per Upload unter gleichem Namen ersetzt.

---

## 2. Bereits live im Repo

| Datei | Änderung |
|---|---|
| `mindful7777-pdf-maker.html` | **neu** — Single-HTML-Werkzeug: Markdown-Eingabe → druckfertiges PDF über den Browser-Druckdialog |
| `00-blog-index.html` | Block „Extras" ergänzt: Glücksrad-Karte mit Rad-SVG, Gratis-Guide-Karte, auskommentierte PDF-Vorlage; i18n-Keys DE/EN/FR |
| `index.html` | Abschnitt „Alles im Überblick" mit 8 Karten zu allen öffentlichen Seiten; Impressum und Datenschutz im Footer |
| `vip.html` | Stripe-Buy-Button (altes Konto) entfernt, Stripe-Script entfernt, 13 WhatsApp-Links durch Ko-fi ersetzt, Texte angepasst DE/EN, Blog-Link in beiden Footern |

---

## 3. Noch hochzuladen (liegt beim Nutzer als Download)

**Ins Repo-Root:**
`index.html`, `sitemap.xml`, `00-blog-index.html`, `glossar.html`, `tech-glossar.html`,
`gluecksrad.html`, `afterwork.html`, `fernsitzungen.html`, `mindful7_guide.html`,
`mindful7777_lookbook.html`, `mindful7777-pdf-maker.html`, `lead-magnet.html`

**In den Ordner `blog/`:**
`blog-sock-anchor-induktion-de.html`, `blog-sock-anchor-induction-en.html`

**Ebenfalls neu, noch nicht im Repo:**
`pdf-maker-client.html`, `PDF-MAKER.md`

Falls der Upload noch nicht passiert ist: Die Änderungen sind in Abschnitt 4 einzeln
beschrieben und lassen sich am PC genauso gut direkt im Repo nachziehen.

---

## 4. Inhalt dieser Änderungen

**Preis vereinheitlicht** — `index.html` warb mit „VIP-Stack: 25 €/Monat", `vip.html`
verlangt 77,77 €. Beide i18n-Stellen (DE inline, EN im Dictionary `cta.price`) stehen
jetzt auf 77,77 €.

**sitemap.xml neu erzeugt** — vorher 22 URLs, **ohne die Startseite**, ohne
`sock-anchor-protocol.html`, `glossar.html`, `gluecksrad.html`, `lead-magnet.html`.
Jetzt 29 URLs mit hreflang DE/EN/x-default, `lastmod` 2026-08-19 und Prioritäten
(Startseite 1.0, VIP und Protokoll 0.9, Blog-Index 0.8).

**Rechtsfooter ergänzt** — neun öffentliche Seiten hatten keinen Impressumslink
(Impressumspflicht §5 DDG). Eingefügt vor `</body>`: dezenter Footer mit Startseite,
Blog, Impressum, Datenschutz und Haftungshinweis, absolute URLs, `opacity:.6`.
Betroffen: `00-blog-index`, `glossar`, `tech-glossar`, `gluecksrad`, `afterwork`,
`fernsitzungen`, `mindful7_guide`, `mindful7777_lookbook`, `mindful7777-pdf-maker`.

**Tote Links repariert** — `lead-magnet.html` verwies auf ein nicht existierendes
`favicon_spiral.png` (→ `favicon.svg`); die beiden Induktions-Blogartikel verlinkten
sich gegenseitig ohne das Präfix `blog-`.

---

## 5. Die beiden PDF-Werkzeuge

Beide sind eigenständige HTML-Dateien ohne Build und ohne Server. Kein
`localStorage`, keine Datenübertragung — alles bleibt im Browser.

### `mindful7777-pdf-maker.html` (öffentlich)
Markdown-Eingabe links, Live-Vorschau rechts, Ausgabe über `window.print()` mit
`@media print`, das die Bedienoberfläche ausblendet. Deckblatt mit Theta-Ring-SVG und
7777-Signet, optionales Inhaltsverzeichnis aus allen `##`-Kapiteln, A4 und A5.
Syntax: `#` `##` `###` `-` `1.` `>` `**fett**` `---` (Seitenumbruch).
Dokumentiert in `PDF-MAKER.md`.

### `pdf-maker-client.html` (intern, `noindex`)
Erweiterung für Klientendokumente:
- Klientenfelder Name, E-Mail, Datum → Deckblatt „Erstellt für …", Fußzeile, Dateiname
- Bilder per `FileReader` als Data-URL, Platzhalter `[bild1]` bzw. `[bild1: Unterschrift]`,
  optional erstes Bild als Deckblattmotiv
- Versand: (1) Druckdialog, (2) `html2pdf.js` von cdnjs erzeugt einen Blob →
  `navigator.share({files})`, sonst Download-Fallback, (3) `mailto:` mit vorbereitetem
  Anschreiben. Anhängen kann `mailto:` prinzipbedingt nicht — das ist so dokumentiert.

**Bekannte Schwäche:** Weg 2 rendert über html2canvas, die Qualität liegt unter dem
Druckdialog. Ein serverseitiger Weg (Puppeteer, WeasyPrint) wäre die bessere Lösung,
sobald ein Backend existiert.

---

## 6. Offene Punkte

**Dringend, außerhalb des Repos — Gumroad**
- „Das Sock-Anker Protokoll": Text sagt „Nur 1 €", das Preisfeld verlangt mindestens 5 €.
  Entweder Mindestpreis senken oder Text angleichen.
- „Complete Sock Anchor File" (10 €): steht auf *not currently for sale*. `vip.html`
  verlinkt `mindful777.gumroad.com/l/ucaan` als Mitglieder-Download — prüfen, ob das
  dasselbe Produkt ist, sonst läuft der VIP-Bereich ins Leere.

**Zahlungen**
- Neues Stripe-Konto „mindful7777" (`acct_1U5HoDRFsSeIZjZL`) steht im Testmodus.
  Sobald live: Kauf-Button auf `vip.html` einbauen, aktuell nur Ko-fi
  (`ko-fi.com/mindf7777`, Widget-ID `Y0G62040JC`).
- Ko-fi verschickt kein automatisches VIP-Passwort. Die Seite verspricht „Passwort per
  Mail" — das passiert derzeit manuell. Kandidat für eine Automatisierung.

**Aufräumen im Repo**
- Zehn Dateien verweisen noch auf das alte Konto `mindful777.gumroad.com`:
  `fernsitzungen`, `hypnosis-gumroad-page-live`, `ares-transformation(-en)`,
  `funnel/result-*`, `vip/ares-transformation`.
- Doppelte Fassungen: `afterwork.html` / `mindful7777_afterwork.html`,
  `index.html` / `mindful7777_index.html`, `vip.html` / `vip-updated.html`,
  `gluecksrad.html` / `vip/gluecksrad.html` (unterschiedlich groß, Inhalte vergleichen).
- Der Ordner `pages/` nutzt absolute Pfade `/mindful7777/pages/…` auf Dateien, die es
  so nicht gibt — entweder reparieren oder entfernen.
- `intern/login.html` verlinkt auf `/`, das führt bei Pages ins Leere.

**Inhaltlich**
- Ein PDF-Downloadbereich ist in `00-blog-index.html` als Kommentar vorbereitet
  (Ordner `downloads/`), bisher ohne Dateien.
- `robots.txt` und Search Console gegen die neue Sitemap prüfen.

---

## 7. Arbeitsweise mit André

- Coding-Anfänger, arbeitet am Handy per Diktat, am PC per Git Bash unter
  `~/Projects/mindful7777`. Termux-Befehle knapp und Schritt für Schritt.
- Am Handy nur Upload über die GitHub-Weboberfläche, kein Umbenennen — deshalb immer
  vollständige Dateien unter unverändertem Namen liefern, keine Patches.
- Absolute URLs mit `https://intelligentresponder-max.github.io/mindful7777/` sind im
  Repo die Regel, ebenso das i18n-Muster über `data-i18n` mit `?lang=de|en|fr`.
- GitHub Pages cacht: nach dem Upload `?v=2` an die URL hängen.

---

## 8. Erster Schritt am PC

```bash
cd ~/Projects/mindful7777
git pull
grep -rn "25 €" index.html          # muss leer sein
grep -c "<url>" sitemap.xml         # sollte 29 sein
grep -L "impressum" *.html          # Seiten ohne Impressumslink
```
