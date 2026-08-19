# Auftrag für Claude Code — mindful7777

Repo: `~/Projects/mindful7777` · Branch `main` · Kontext: `CLAUDE.md` und `UEBERGABE-CLAUDE-CODE.md`
Regeln: Brand-Wortliste aus `CLAUDE.md` einhalten. Absolute URLs mit
`https://intelligentresponder-max.github.io/mindful7777/`. Keine neuen Abhängigkeiten,
keine Build-Tools, kein `localStorage`. Nach jedem Schritt einzeln committen.

---

## Schritt 0 — Stand prüfen

```bash
cd ~/Projects/mindful7777 && git pull
grep -rn "25 €" index.html
grep -c "<url>" sitemap.xml
grep -L "impressum" *.html
```

Erwartet: kein Treffer beim Preis, 29 URLs, und nur interne Werkzeugseiten ohne
Impressumslink. Weicht etwas ab, wurde ein Upload nicht übernommen — dann in
`UEBERGABE-CLAUDE-CODE.md` Abschnitt 4 nachsehen und nachziehen.

---

## Schritt 1 — Altes Gumroad-Konto ersetzen

Zehn Dateien verweisen auf `mindful777.gumroad.com`:
`fernsitzungen.html`, `hypnosis-gumroad-page-live.html`, `ares-transformation.html`,
`ares-transformation-en.html`, `vip/ares-transformation.html`,
`funnel/result-experienced.html`, `funnel/result-open.html`, `funnel/result-seeker.html`,
`funnel/result-skeptic.html`, `funnel/_TEMPLATE_result.html`

Erst auflisten, welches Produkt jeweils verlinkt ist, und mir die Liste zeigen —
**nicht blind ersetzen**. Manche Produkte existieren im neuen Konto nicht.

**Fertig, wenn:** eine Tabelle Datei → Produktlink → Vorschlag vorliegt und die
freigegebenen Ersetzungen umgesetzt sind.

---

## Schritt 2 — Doppelte Dateien auflösen

Vier Paare, jeweils Inhalte vergleichen und entscheiden, welches die aktuelle Fassung ist:

- `afterwork.html` ↔ `mindful7777_afterwork.html`
- `index.html` ↔ `mindful7777_index.html`
- `vip.html` ↔ `vip-updated.html`
- `gluecksrad.html` ↔ `vip/gluecksrad.html`

Die veraltete Fassung nicht löschen, sondern nach `archiv/` verschieben und aus der
`sitemap.xml` nehmen. `vip.html` ist die aktuelle VIP-Seite, dort wurde zuletzt gearbeitet.

**Fertig, wenn:** je Paar eine Datei aktiv ist, der Rest in `archiv/` liegt und keine
Seite mehr auf eine archivierte Datei verlinkt.

---

## Schritt 3 — Ordner `pages/` reparieren oder entfernen

Alle Dateien dort verlinken auf `/mindful7777/pages/about.html`, `…/blog.html`,
`…/contact.html`, `…/discord.html`, `…/library.html`, `…/membership.html`,
`…/newsletter.html`, `…/sessions.html`, `…/wishlist.html` — diese Dateien existieren nicht.
Ebenso zeigt `intern/login.html` auf `/`, was bei GitHub Pages ins Leere läuft.

Prüfen, ob `pages/` noch gebraucht wird. Wenn nein: nach `archiv/`. Wenn ja: die
Navigation auf die real vorhandenen Dateien im Root umbiegen.

**Fertig, wenn:** ein Link-Check über das ganze Repo keine toten internen Links mehr meldet.

---

## Schritt 4 — VIP-Zugang automatisieren

Aktueller Zustand: `vip.html` verspricht „Passwort per Mail", Ko-fi verschickt aber
nichts automatisch — André tippt jede Mail von Hand.

Zwei Wege durchdenken und mir empfehlen, welcher zu einer statischen Pages-Seite passt:
1. Ko-fi-Webhook auf einen kleinen Endpunkt (Cloudflare Worker o. ä.), der die Mail auslöst
2. Umstieg auf Stripe Payment Links mit automatischer Zustellung, sobald das neue Konto
   `acct_1U5HoDRFsSeIZjZL` aus dem Testmodus ist

Das Passwort in `vip.html` liegt im Client-Code — das ist Zugangsschutz light, kein
echter Schutz. Bitte in der Empfehlung mitbewerten.

**Fertig, wenn:** eine kurze Empfehlung mit Aufwand, Kosten und den nötigen Schritten vorliegt.

---

## Schritt 5 — PDF-Erzeugung serverseitig prüfen

`pdf-maker-client.html` teilt PDFs über html2pdf.js im Browser; die Qualität liegt unter
dem Druckdialog. Prüfen, ob ein kleines Skript im Repo (Puppeteer oder WeasyPrint,
lokal am PC ausgeführt) aus demselben HTML sauberere PDFs erzeugt — gleiche Schriften,
gleiche Seitenumbrüche.

**Fertig, wenn:** ein Testlauf mit dem Beispieltext beide Ergebnisse vergleicht.

---

## Reihenfolge und Priorität

1 und 2 zuerst — dort verlieren Besucher gerade Geld und Orientierung.
3 danach, 4 und 5 sind Ausbau.

Nicht Teil dieses Auftrags, macht André selbst in Gumroad: Mindestpreis beim
Sock-Anker-Protokoll und das Produkt „Complete Sock Anchor File" auf Publish stellen.
