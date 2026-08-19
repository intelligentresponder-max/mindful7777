# Link-Liste & Blog-Publishing — mindful7777

**Stand:** 19.08.2026
**Repo:** `intelligentresponder-max/mindful7777`, Branch `main`
**Live:** https://intelligentresponder-max.github.io/mindful7777/

Zwei Themen in einer Datei, wie angefragt: (1) vollständige Link-Liste mit Erreichbarkeit ab der Startseite, (2) Anleitung PDF-Maker → Blog-Veröffentlichung, auch am Handy.

---

## Teil 1 — Vollständige Link-Liste

82 HTML-Seiten live im Repo (ohne `archiv/`, dort liegen 16 weitere, bewusst offline genommene Seiten — siehe `UEBERGABE-CLAUDE-CHAT.md` Abschnitt 2.2).

„Erreichbar ab Startseite" heißt: von `index.html` aus **klickbar erreichbar**, über beliebig viele Zwischenschritte — nicht nur direkt verlinkt. Ermittelt per Link-Graph-Analyse (jeder `<a href>` auf jeder Seite verfolgt, plus der eine bekannte JavaScript-Link in `funnel/quiz.html`).

### 1.1 Erreichbar ab Startseite (28 von 82 Seiten)

**Ebene 1 — direkt von index.html verlinkt (via „Alles im Überblick"):**
- `sock-anchor-protocol.html`, `00-blog-index.html`, `glossar.html`, `gluecksrad.html`, `sporthypnose.html`, `fernsitzungen.html`, `afterwork.html`, `vip.html`
- außerdem im Footer: `impressum.html`, `datenschutz.html`

**Ebene 2:**
- die 7 Blog-Cluster-Artikel `blog/01-*` bis `blog/07-*` (über `00-blog-index.html`)
- `blog/index.html` (über den „Blog"-Link in `fernsitzungen.html` — **siehe Befund 1.3**)
- `lead-magnet.html` (über „Erst gratis testen →" in `sporthypnose.html`)

**Ebene 3 — über `blog/index.html` (Ares-Transformation-Blog):**
- `ares-transformation.html`, `ares-transformation-en.html`
- `blog/theta-wellen.html`, `blog/stress-reset.html`, `blog/socken-anker.html`, `blog/recovery-training.html`, `blog/hypnose-sportler.html`, `blog/fernsitzungen.html`

### 1.2 NICHT erreichbar ab Startseite (54 von 82 Seiten)

**Öffentliche Marketing-/Content-Seiten ohne Klickpfad** — für diese lohnt sich ein Direktlink (QR/bit.ly) am meisten, weil Besucher sie sonst gar nicht finden:
- `mindful7777-pdf-maker.html`, `mindful7777_lookbook.html`
- `mindful7_guide.html`, `mindful7_guide_komplett.html`
- `tech-glossar.html`
- `sock-anchor-ebook.html`, `teaser-sock-anker.html`
- `vip/gluecksrad.html`
- `blog/blog-sock-anchor-induktion-de.html`, `blog/blog-sock-anchor-induction-en.html` — **auffällig:** vollwertige, SEO-fertige Blog-Artikel (in der Sitemap!), aber von keiner einzigen Seite aus anklickbar
- `blog/blog-remote-sessions-en.html`
- `upsell.html`

**Eigenständiges Funnel-System** (`funnel/`) — kompletter Quiz-Trichter mit eigenen Landingpages, aber komplett getrennt vom Rest der Seite, nirgends von `index.html` aus verlinkt. Wirkt wie eine eigene Kampagne für externen Traffic (Ads, E-Mail):
`funnel/quiz.html`, `funnel/result-experienced/-open/-seeker/-skeptic.html`, `funnel/apply.html`, `funnel/onboarding.html`, `funnel/private.html`, `funnel/private-identity.html`, `funnel/private-sleep.html`, `funnel/private-vip.html`, `funnel/blog.html`, `funnel/blog-besser-schlafen.html`, `funnel/blog-erfolg-hypnose.html`, `funnel/blog-selbsthypnose-lernen.html`, `funnel/blog-was-ist-hypnose.html`, `funnel/copybank-landingpage.html`, `funnel/_TEMPLATE_result.html`

**`onboarding/index.html`** — ebenfalls isoliert, keine Verlinkung von außen.

**Interne Tools (keine Marketingseiten, nicht anfassen):**
`favicon-generator.html`, `ck_de_page.html`, `ck_de_embed.html`, `ck_en_page.html`, `ck_en_embed.html`, `model-form.html`, `model-form-en.html`, `googlef2f76078c663f0b2.html` (Google-Search-Console-Verifizierung)

**Privat/passwortgeschützt (laut `CLAUDE.md` bewusst nicht öffentlich):**
alles unter `intern/` (Dashboard, Audios, Docs, Notizen, Login), `sessions/leo7.html` (explizit „PRIVAT — niemals öffentlich")

### 1.3 Zwei Befunde beim Erstellen dieser Liste

1. **`fernsitzungen.html` hat zwei widersprüchliche „Blog"-Links.** Die Haupt-Navigation (oben und im Footer, 3× im Text) verlinkt „Blog" auf `blog/index.html` — das ist die alte Ares-Transformation-Blog-Seite mit 6 älteren Artikeln. Der neue Rechtsfooter (aus dieser Session) verlinkt „Blog" korrekt auf `00-blog-index.html` — den aktuellen 7-Artikel-Cluster. Besucher, die über die Hauptnavigation gehen, landen also im alten statt im aktuellen Blog. Nicht selbst korrigiert, weil unklar ist, ob `blog/index.html` bewusst als eigener Kanal gedacht ist — sag Bescheid, falls das vereinheitlicht werden soll.
2. **Zwei fertige Blog-Artikel ohne jeden Klickpfad:** `blog/blog-sock-anchor-induktion-de.html` und `-en.html` sind in der Sitemap, SEO-technisch vollständig, aber weder in `00-blog-index.html` noch in `blog/index.html` verlinkt.

### 1.4 Mindestens 3 Top-Beiträge (meine Auswahl, mit Begründung)

Ausgewählt aus den 7 Blog-Cluster-Artikeln — die einzigen mit vollständigem SEO-Paket von Anfang an (Canonical, hreflang DE/EN/FR, Open Graph, JSON-LD) und direkt an den Markenkern angelehnt:

1. **`blog/07-sock-anchor-protokoll.html`** — der Flaggschiff-Artikel: einziger mit `HowTo`-Schema (Google kann ihn als Schritt-für-Schritt-Anleitung mit Rich-Snippet ausspielen), direkte Brücke zum Gratis-Protokoll und zum VIP-Stack.
2. **`blog/01-theta-zustand.html`** — Einstiegsartikel, „Start hier"-Card in `00-blog-index.html`, baut die wissenschaftliche Erzählung auf, die alle anderen Artikel voraussetzen.
3. **`blog/03-vagusnerv-atmung.html`** — „Vagus-Nerv" ist laut `CLAUDE.md` einer der zentralen Pflichtbegriffe der Marke; dieser Artikel erklärt genau das Konzept, auf dem das ganze Sock-Anchor-Protokoll beruht.

Für Direktlinks (QR/Social) sind das die drei mit dem besten Aufwand-Nutzen-Verhältnis, weil sie technisch schon fertig sind und inhaltlich am tiefsten zum Produkt führen.

---

## Teil 2 — Blog-Inhalte per PDF-Maker veröffentlichen (auch am Handy)

Das Tool `mindful7777-pdf-maker.html` erstellt PDFs, aber lädt sie **nicht selbst hoch** — das Hochladen und Verlinken macht ihr selbst über die GitHub-Weboberfläche. Vier Schritte, alle auch am Handy machbar (Safari/Chrome reicht, keine App nötig).

### Schritt 1 — PDF erstellen
1. Öffne https://intelligentresponder-max.github.io/mindful7777/mindful7777-pdf-maker.html im Handy-Browser
2. Titel, Untertitel und Inhalt eintragen (einfaches Markdown: `#`, `##`, `-`, `**fett**` — volle Syntax in `PDF-MAKER.md` im Repo)
3. Unten rechts prüfen: Deckblatt an, ggf. Inhaltsverzeichnis an, Format A4 oder A5
4. **„PDF erstellen"** antippen → der Systemdruckdialog öffnet sich
5. Als Ziel **„Als PDF speichern"** wählen (nicht drucken!), Hintergrundgrafiken **an** lassen (sonst fehlt das Gold auf dem Deckblatt) → speichern. Landet in den normalen Downloads deines Handys.

### Schritt 2 — PDF ins Repo hochladen
1. Im Handy-Browser zu `github.com/intelligentresponder-max/mindful7777` gehen (eingeloggt)
2. **Add file → Upload files**
3. Datei aus den Downloads auswählen — falls der Ordner `downloads/` im Repo noch nicht existiert: einfach `downloads/` vor den Dateinamen tippen (z. B. `downloads/sock-anchor-de.pdf`), GitHub legt den Ordner beim Speichern automatisch an
4. Unten **„Commit changes"** → direkt auf `main` committen

### Schritt 3 — PDF im Blog verlinken
1. Im Repo zu `00-blog-index.html` navigieren, oben rechts auf das **Stift-Symbol** (Bearbeiten) tippen
2. Ganz unten im Abschnitt „Extras" nach diesem auskommentierten Block suchen (Strg+F / Handy-Suche nach `PDF hinzufuegen`):
   ```html
   <!-- PDF hinzufuegen: PDF ins Repo laden (z. B. downloads/name.pdf) und diesen Block in <div class="cards"> kopieren:
   <a class="card2" href="https://intelligentresponder-max.github.io/mindful7777/downloads/DATEINAME.pdf" download>
     <span class="num">PDF</span>
     <h4>Titel des PDFs</h4>
     <p>Ein Satz, worum es geht.</p>
   </a>
   -->
   ```
3. Direkt **über** diesem Kommentarblock liegt eine `</div>`, die den vorherigen „Extras"-Kartenblock schließt (Glücksrad, Gratis-Guide). Den `<a class="card2">...</a>`-Block **vor diese `</div>`** einfügen (nicht in den Kommentar reinschreiben) — dabei:
   - `DATEINAME.pdf` durch den echten Dateinamen aus Schritt 2 ersetzen
   - `Titel des PDFs` und den Satz im `<p>` durch echten Titel/Beschreibung ersetzen
4. Unten **„Commit changes"** → direkt auf `main`

### Schritt 4 — Kontrollieren
Live-Seite mit `?v=2` an die URL hängen (GitHub Pages cacht sonst): `https://intelligentresponder-max.github.io/mindful7777/00-blog-index.html?v=2` — die neue Karte sollte unter „Extras" erscheinen, Klick lädt das PDF.

### Für ganze Blog-Artikel (nicht nur PDF-Downloads)
Der PDF-Maker erstellt reine PDFs, keine HTML-Blogseiten. Für einen neuen Artikel wie `blog/08-irgendwas.html` braucht es eine neue HTML-Datei nach dem Muster der bestehenden `blog/01-*` bis `blog/07-*` (Kopie einer bestehenden als Vorlage, Titel/Text/Meta-Tags anpassen) plus einen neuen Eintrag in `00-blog-index.html` und `sitemap.xml`. Das ist am Handy über die reine GitHub-Weboberfläche mühsam (HTML von Hand bearbeiten) — dafür eignet sich eher eine Session hier im Chat: Text schicken, ich baue die Seite fertig und committe direkt.
