# Fehlerprotokoll — mindful7777

Regel: Jeder einmal gemachte Fehler wird hier mit Ursache, Fix und Gegenmaßnahme festgehalten.
Bei jeder Methode werden Alternativen auf Nutzen / Sicherheit / neue Wege geprüft.

## 2026-11-17 — Sprachzwillinge (DE/EN) mit SEO

| # | Fehler | Ursache | Fix | Gegenmaßnahme |
|---|--------|---------|-----|---------------|
| 1 | Toter DE/EN-Umschalter auf 14 Seiten | `lang.js`/Inline-`setLang` sucht `.lang`-Blöcke bzw. `data-de`-Attribute, die nicht existieren | Echte Zwillingsseiten (`-en` / `-de`) mit Link-Umschalter | Vor neuem Umschalter prüfen, ob die Zielinhalte existieren (Browser-Klick-Test) |
| 2 | Übersetzungs-Skript zweimal auf bereits umgeschriebene Quelle angewandt, Tabellenzellen um 1 verschoben (`theta-wellen-de`, `stress-reset-de`) | Einheiten-Index basiert auf DOM-Struktur; Buttons (2 Einheiten) wurden zu Links (1 Einheit) | `git checkout` der Quelle, Neu-Lauf | Quelle immer aus Git/Backup lesen, nie aus bereits verändertem Output; Vorher/Nachher-Textvergleich (`same.py`) |
| 3 | Umschalter lag auf Blogseiten unter der fixen Navigation (nicht klickbar) | `div.lang-toggle` stand nach `<nav position:fixed>` | In `.nav-links` verschoben | Klick-Test mit Playwright statt nur Markup-Prüfung |
| 4 | Gemischte Textknoten (Text neben SVG/Icon) wurden nicht übersetzt | Extraktion erfasste nur reine Inline-Blöcke | Manuell nachgezogen, Vergleich Original/Zwilling | Nach jeder Übersetzung Textknoten-Diff gegen Original |
| 5 | Mobile-Überlauf (Tabellen, Phase-Marker, Navigation) | Längere Texte in DE/EN | Scroll-Container, kürzere Labels, kleinere Nav | Overflow-Test bei 390 px für alle neuen Seiten |
| 6 | Verbotenes Wort „Frequenz" in Übersetzung („Herzfrequenz") | Wörtliche Übersetzung | → „Puls" | Markenwort-Grep über alle neuen Dateien |
| 7 | Redaktionsreste sichtbar („SEO: …", „/disclaimer", „https:///disclaimer", „Sofortiger Download" trotz E-Mail-Zustellung) | Altlasten in den Quellseiten | In DE-Originalen bereinigt | Sichtbaren Text vor Release auf Interna und Widersprüche prüfen |

## Alternativen geprüft

- **Umschalter entfernen**: sicher und schnell, aber verschenkt EN-Reichweite → verworfen (Entscheidung André: übersetzen).
- **Client-seitiger Sprachwechsel (JS)**: Suchmaschinen indexieren nur eine Sprache pro URL → schlechter für SEO → verworfen.
- **`?lang=`-Parameter in hreflang**: gleicher Inhalt unter mehreren URLs, kein echtes Signal → ersetzt durch eigene URLs.
- **Maschinelle Übersetzung per API**: Daten verlassen das Repo, keine Markenkontrolle → nicht genutzt.

## Offen

- Rechtstexte (Impressum/Datenschutz EN) sind Serviceübersetzungen, nicht juristisch geprüft; deutsche Fassung verbindlich.
- Datenschutz nennt `intelligent.responder@gmail.com`, Kontakt sonst `mindful7777@gmail.com` — vereinheitlichen.
- `blog/blog-sock-anchor-induktion-de.html` enthält Wörter der Verbotsliste (Zeile ~230).
- Testimonial „Michael R." auf `sporthypnose(-en).html` — Echtheit/Einwilligung prüfen.
- Startseite, VIP u. a. nutzen weiter `?lang=`-hreflang (eine URL, JS-Wechsel) — mittelfristig auf echte URLs umstellen.

## 2026-11-17 (Nachtrag) — Aufräumen

| # | Fehler | Ursache | Fix | Gegenmaßnahme |
|---|--------|---------|-----|---------------|
| 8 | Erfundene Testimonials (Sporthypnose „Michael R.", Upsell „Maximilian R.") | Platzhalter-Texte wurden als echte Stimmen veröffentlicht | Durch neutrale Einordnung ersetzt | Nur echte, freigegebene Rückmeldungen mit Einwilligung veröffentlichen |
| 9 | `?lang=`-hreflang auf 21 Seiten + Sitemap | Eine URL, Inhalt per JS umgeschaltet: Suchmaschinen sehen keine zweite Sprache | Entfernt; echte Sprachzwillinge nur für Seiten mit eigener URL | Hreflang nur zwischen echten URLs |
| 10 | Human-Design-Inhalte (Marken-Widerspruch), Stripe-Backend ohne Nutzung | Altlasten | Entfernt (Seite, Gästebereich-Karten, Guide-Kapitel 6, `stripe-api/`, Doku) | Verbotsliste vor jedem Release gegen das ganze Repo prüfen |
| 11 | Stripe-Reste in Archiv-HTML, Übergabe-Dokus, Push-Skripten (inkl. Live-Link `buy.stripe.com`) | Beim ersten Aufräumen nur `stripe-api/` entfernt, Rest nicht per grep geprüft | Alles entfernt; nur dieser Eintrag erwähnt Stripe noch | Nach Entfernen eines Dienstes immer `grep -rIil <name>` über das ganze Repo |
| 12 | Sporthypnose: Prozentbalken, „87 %" / „3×" und „Erfahrungsbasierte Werte aus Nutzerberichten" | Zahlen ohne Quelle, Berichte existierten nicht | Stat-Leiste durch belegbare Fakten ersetzt (90 Sek., HRV), Balken als „Illustratives Beispiel" gekennzeichnet | Jede Zahl braucht Quelle oder Kennzeichnung als Beispiel |
| 13 | `mindful7_guide*.html`: feste 794-px-Seiten, fremdes Design, Wortwahl außerhalb der Marke („spirit", „gentle"), nur 4 von 7 Säulen | PDF-Layout als Webseite veröffentlicht | Ersetzt durch `stack-guide.html` / `-en.html` (7 Protokolle, ACCIO-Design, responsiv, Hreflang); alte URLs leiten per Meta-Refresh weiter | Webseiten responsiv bauen, Marken-Vokabular vor Veröffentlichung prüfen |

Offen: Sicherheitsabwägung für den Zahlweg steht aus (Stripe wurde bewusst entfernt, siehe docs/vip-zugang-automatisierung.md).
