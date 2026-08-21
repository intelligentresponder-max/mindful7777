# Übergabe an Claude Code — mindful7777

**Stand:** 21.08.2026, Session im Browser (Claude Code on the web)
**Ersetzt:** die vorherige Fassung dieser Datei (19.08., Handy-Chat-Session — alle
dort offenen Punkte sind unten unter Punkt 2 als erledigt markiert) und
`HANDOVER.md` (21.08., lag nur als Chat-Anhang vor, nie im Repo — ebenfalls erledigt).
**Repo:** `intelligentresponder-max/mindful7777`, aktuell auf `main`
**Live:** https://intelligentresponder-max.github.io/mindful7777/
**Gilt zusätzlich:** `CLAUDE.md` (Brand-Regeln, ACCIO-Design-System, Repo-Struktur)

---

## 1. Ausgangslage der Session

Arbeit lief auf dem Branch `claude/new-session-1wjmcn` (direkter Repo-Zugriff, kein
Copy-Paste-Umweg). Alle Änderungen wurden dort committed und anschließend nach `main`
gemergt und gepusht — **main ist aktuell, GitHub Pages hat den Stand bereits gebaut.**
Vor Arbeitsbeginn am PC einmal `git pull`, dann ist alles unten Beschriebene lokal da.

---

## 2. Was in dieser Session erledigt wurde

### 2.1 · Preis- und Autonomie-Korrekturen
- `upsell.html`: Preis auf 77,77 €/Monat vereinheitlicht (war 25 €), Streichpreis
  „Normalerweise 47 €/Monat" entfernt (den Preis gab es nie — UWG-Risiko), künstliche
  Verknappungs-Banner („Nur hier", „Einmaliges Angebot") entfernt.
- `afterwork.html`: derselbe stray 25-€-Preis gefunden und auf 77,77 € korrigiert.
- `vip.html`: `obj.card3.a` (DE+EN) umformuliert — statt „hast du 21 Tage verloren —
  aber es wird funktionieren" jetzt eine Messgröße statt eines Erfolgsversprechens.
- `glossar.html`: „Abfolge von Anweisungen" → „Abfolge von Schritten" (Autonomie-Regel).
- Testimonial „Maximilian R." in `upsell.html` mit André geklärt: **echt, freigegeben,
  unverändert gelassen.**

### 2.2 · Gumroad-Altlasten (B2 aus früherer Übergabe)
Bereits vollständig migriert — keine Kunden-Links mehr auf `mindful777.gumroad.com`.
Einzige verbleibenden Treffer: `intern/links_0.html` und `intern/links_2.html`
(Andrés eigenes Verkäufer-Dashboard, laut `CLAUDE.md` bewusst so). Kein Handlungsbedarf.

### 2.3 · Doppelte Dateien (B3)
3 von 4 gemeldeten Paaren existieren nicht mehr (bereits bereinigt).
`gluecksrad.html` vs. `vip/gluecksrad.html` sind **keine** Duplikate, sondern zwei
bewusst getrennte Seiten (öffentliches Gratis-Rad vs. VIP-exklusives Rad) — beide bleiben.

### 2.4 · Struktur (B4)
`pages/`-Verweise bereits weg (Ordner ist in `archiv/pages/` verschoben),
`intern/login.html`/`auth.js` bereits korrekt. Ein repoweiter Link-Check lief sauber
durch (einzige Auffälligkeit ist ein False Positive in `funnel/quiz.html`,
`'result-'+type+'.html'` ist ein JS-Template-String, kein kaputter Link).

### 2.5 · VIP-Artikel `vip/gehorsam-verkauft-nicht.html`
Datei fehlte komplett im Repo (lag nur als nie hochgeladener Chat-Download vor). Auf
Andrés Wunsch aus der Kurzzusammenfassung neu verfasst: These „obedience is pleasure"
im Test, zwei Lager, Drei-Punkte-Test, zwei echte Formulierungspaare aus dem
Textabgleich dieser Session, Sonderfall Hypnose-Skripte. `noindex`, nicht in der
Sitemap, dezent im VIP-Mitgliederbereich verlinkt (DE+EN, `internal.link` in `vip.html`).

### 2.6 · Empfehlung VIP-Zugang-Automatisierung
**Nur eine Empfehlung, noch nicht gebaut** — Details in
`docs/vip-zugang-automatisierung.md`. Kurzfassung: Ko-fi-Webhook → Cloudflare Worker
zuerst (kostenlos, unabhängig vom Stripe-Rollout), Stripe-Weg erst wenn der ohnehin
geplante Stripe-Umbau (siehe Punkt 3) angegangen wird. Das Passwort-im-Client-Problem
bleibt in beiden Fällen bestehen (siehe Punkt 3).

### 2.7 · Test: serverseitige PDF-Erzeugung
Nur ein Test, nichts gebaut — Ergebnis in `docs/pdf-serverseitig-test.md`. Nativer
Chromium-Druck (Puppeteer/Playwright-Äquivalent) erzeugt 77 KB mit echtem,
durchsuchbarem Vektortext; `html2pdf.js` (der Weg, den `pdf-maker-client.html`s
Teilen-Button nutzen würde) erzeugt 349 KB reine Rasterbilder ohne markierbaren Text.
Bestätigt die seit Längerem bekannte Schwäche. Falls der Teilen-Weg wichtig wird: ein
kleiner Puppeteer-Endpunkt (z. B. neben `stripe-api/` auf Vercel) wäre der nächste
Schritt — noch nicht umgesetzt.

### 2.8 · Datenschutz-Ergänzung
Neuer Abschnitt 9 „Onboarding-Fragebogen (E-Mail-Versand)" in `datenschutz.html`
(Zweck, Empfänger, Rechtsgrundlage inkl. Art. 9 DSGVO für die Gesundheitsangaben aus
Fragebogen-Schritt 7, Widerruf). Folgeabschnitte entsprechend umnummeriert (9→12).

### 2.9 · Zwei neue Seiten aus `HANDOVER.md` eingebunden
- `verkaufsgespraech-als-copy.html` — Blogbeitrag „Ein Verkaufsgespräch, das
  stillsteht", DE/EN, Quellen-Einordnung Galal/Dilts/allgemeine Literatur.
- `onboarding-fragebogen.html` — zehnstufiger Trance-Profil-Fragebogen, DE/EN,
  `mailto:`-Versand an `intelligent.responder@gmail.com`.
- Beide lagen nur als Chat-Download vor. Beim Einbinden **Basis-URL korrigiert**: die
  Dateien zeigten auf `mindful7777.github.io` (nie live), jetzt auf das tatsächlich
  laufende `intelligentresponder-max.github.io/mindful7777/`. `onboarding-fragebogen.html`
  hatte zusätzlich noch gar kein `canonical`-Tag — ergänzt.
- Auf der Startseite verlinkt: zwei neue Karten im „Alles im Überblick"-Raster
  (`hub.11`/`hub.12`), gleiche `.hub-card`-Klasse wie die anderen zehn.

### 2.10 · Neuer Blogbeitrag
`blog/09-trance-profil-onboarding.html` — „Zehn Fragen, vier Minuten: dein
Trance-Profil", im Stil der Beiträge 01–08 (gleiches CSS, Glossar-Sektion,
i18n-Dictionary DE/EN, FR bewusst ausgelassen — keine Vorlage dafür vorhanden, wie
schon bei den beiden Seiten aus 2.9). Verlinkt an drei Stellen: Extras-Karte in
`00-blog-index.html` (DE/EN/FR, da dieser Index durchgehend dreisprachig ist), 13.
Hub-Karte auf der Startseite, neuer Sitemap-Eintrag.

### 2.11 · sitemap.xml
Von 35 auf **38 URLs** gewachsen (die drei neuen Seiten aus 2.9/2.10), durchgehend im
bestehenden `?lang=`-Alternate-Muster.

---

## 3. Was wirklich noch offen ist

**`knowledge/markenrichtlinie.md` und `knowledge/verbotene_phrasen.md` sind leer
(0 Zeilen).** `CLAUDE.md` verlangt, diese Dateien vor jedem Content-Output zu prüfen —
das geht aktuell ins Leere. Frühere Übergaben sagten, der Inhalt läge bei André als
Download („war leer, jetzt vollständig") — im Repo ist davon nichts angekommen. Vor der
nächsten größeren Text-Session lohnt sich ein Blick, ob diese beiden Dateien
tatsächlich befüllt werden sollen.

**Stripe-Backend nicht deployed.** `assets/stripe-checkout.js` hat weiterhin nur den
Platzhalter `STRIPE_API_BASE = "https://REPLACE-WITH-YOUR-STRIPE-API-DOMAIN"`,
`vip.html` bindet das Script noch nicht ein. Vollständige Deploy-Checkliste in
`docs/stripe-setup.md` — unverändert offen, in dieser Session nicht angefasst.

**VIP-Zugang-Automatisierung nicht gebaut** (nur Empfehlung, siehe 2.6).

**Serverseitiger PDF-Endpunkt nicht gebaut** (nur Test, siehe 2.7).

**Gumroad, außerhalb des Repos (macht André selbst, letzter bekannter Stand
unverändert):**
- „Das Sock-Anker Protokoll": Text sagt „Nur 1 €", Preisfeld verlangt mindestens 5 €.
- „Complete Sock Anchor File" (10 €): stand auf *not currently for sale* — prüfen, ob
  das noch aktuell ist, `vip.html` verlinkt dieses Produkt für Mitglieder.

---

## 4. Arbeitsweise mit André

- Coding-Anfänger. Arbeitet am Handy per Diktat, am PC mit Git Bash unter
  `~/Projects/mindful7777` (Windows: `C:\Users\Holy New\Projects\mindful7777`).
  Befehle knapp und Schritt für Schritt.
- Am Handy nur Upload über die GitHub-Weboberfläche, kein Umbenennen, kein Editieren —
  deshalb dort immer vollständige Dateien unter unverändertem Namen liefern.
- i18n-Muster: `data-i18n`-Attribute mit `?lang=de|en|fr` (fr nur auf älteren Seiten,
  neuere Einzelseiten sind bewusst DE/EN). DE steht inline im HTML, EN/FR in
  Dictionaries — **beide Stellen ändern**, sonst driften die Sprachen.
- Absolute URLs mit `https://intelligentresponder-max.github.io/mindful7777/` sind die
  Regel — **nicht** `mindful7777.github.io` (das war ein wiederkehrender Fehler in
  extern vorbereiteten Dateien, siehe 2.9).
- GitHub Pages cacht: nach dem Deploy `?v=2` an die URL hängen, falls es veraltet wirkt.

---

## 5. Erster Schritt am PC

```bash
cd ~/Projects/mindful7777
git pull
grep -c "<loc>" sitemap.xml               # sollte 38 sein
grep -rn "25 €\|47 €" --include="*.html" . | grep -v archiv   # sollte leer sein
wc -l knowledge/markenrichtlinie.md knowledge/verbotene_phrasen.md   # noch 0 0 — s. Punkt 3
ls vip/gehorsam-verkauft-nicht.html verkaufsgespraech-als-copy.html onboarding-fragebogen.html blog/09-trance-profil-onboarding.html
```
