# Hypnose-Display (Transformator T-01)

Zwei-Fenster-Tool für Sitzungen: `steuerung.html` (Steuerpult, Operator) steuert `index.html` (Display, zweiter Monitor) per BroadcastChannel. Beide Seiten im **selben Browser** öffnen. Läuft ohne Build.

Aufruf (nach Deploy): `…/mindful7777/tools/hypnose-display/steuerung.html` → „Display öffnen".

## Profil / Ablauf
`profil-goodboys.js` (window.FLOW) – Fragen-Ablauf DE/EN. Neue Profile = neue Datei + `<script src>` in beiden Seiten.

## Änderungen gegenüber dem Original (Übergabe-Version)
Original-Prüfsummen: `ORIGINAL-CHECKSUMS.sha256` (index.html, steuerung.html, profil-goodboys.js stimmten beim Upload; `cues.js` fehlte).
1. `index.html`: noindex, Pflicht-Hinweis (18+, Einverständnis, nicht Fahren, Epilepsie/Lichtempfindlichkeit, Telefonseelsorge) vor dem Start – Disclaimer-Regel aus `knowledge/disclaimer.md`; `prefers-reduced-motion` schaltet Spirale/Halo/Blitze ab.
2. `steuerung.html`: noindex, Kurzhinweis.
3. `cues.js`: neu gefüllt (Original lag nicht bei): 7 Bilder, 4 Video-Schleifen, 4 Audio-Schleifen, 15 Texte in 3 Gruppen (Ankommen, Vertiefen, Ausleiten). Alles unter `media/`, selbst erzeugt mit `make_media.py` (`python3 make_media.py [img|video|audio]`), keine Fremdquellen. Original-`cues.js` bei Bedarf einfach darüberlegen.
4. `steuerung.html`: neu gestaltet (HUD-Optik, Bild-Vorschauen, Anzeige „Läuft gerade“, aktive Knöpfe markiert, oben fest: Schwarz und Alles stoppen, Esc = Alles stoppen). Lautstärke startet bei 60 % und wird beim Verbinden gesetzt.
5. `index.html`: Klienten-Ansicht ohne Rahmen (automatisch im Vollbild, Taste K schaltet um), Video-Schleife, Text und Ablauf überlagern sich nicht mehr, Antwort-Knöpfe nicht mehr gequetscht.
6. Unverändert: Google-Fonts-Link (wie `assets/style.css` im Repo). Offen: lokal einbetten (DSGVO – Besucher-IP an Google), siehe Fehlerprotokoll.

## Fehlerprotokoll
- Upload ohne `cues.js` → `verify.sh` meldete FAILED. Lehre: `sh verify.sh` vor jeder Übergabe.
- Profil-Satz „Mit leerem Kopf bist du am besten" widerspricht `knowledge/discord-onboarding-ffm777.md` (kein Umgehen des kritischen Verstands). Nur mit Einverständnis und eigenem Hinweis nutzen; Text im Profil bei Bedarf entschärfen.

## Skripte, Generator, Texteingabe (17.11.2026)
- **Skripte** (`scripts/*.md`, Quelle: deine zwei TranceScripts, unverändert): Steuerpult → „Skript · Schritt für Schritt“. Parser liest Phasen, Tempo, Anker, Echo-Zeilen und Pausenmarken `[n~]`; Zeilen erscheinen als Schritte, `Weiter ▶`/`◀` oder Pfeiltasten blenden sie ein. Neues Skript: `.md` in `scripts/` legen, `python3 make_scripts.py` ausführen (erzeugt `scripts.js`).
- **Rule-of-Three-Generator** (`rule-of-three.js`, Original + Schema unter `rule-of-three/`): fünf Dreier-Muster als Formular, „Zusammensetzen“ lädt die 5 Sätze als Skript. JSON nach `rule_of_three_schema.json` lässt sich einfügen und kopieren; unvollständige Eingaben werden mit Hinweis abgelehnt. `node test-parity.js` beweist, dass JS und Python exakt dieselben Sätze liefern.
- **Texteingabe**: mehrzeiliges Feld („Einblenden“ zeigt Zeilenumbrüche), „Zeilen als Skript laden“ macht jede Zeile zu einem Schritt, „Anzeigedauer“ (automatisch, 5/8/12 s, bleibt stehen) gilt für alle Texte. Lange Sätze werden automatisch kleiner gesetzt.

## Sicherheit der erzeugten Medien
- Videos: nur weiche Sinus-Verläufe, kein Blitzen, langsamste Änderung unter 1 Hz. Trotzdem Hinweis bei Epilepsie/Lichtempfindlichkeit beachten.
- Audio: Spitzenpegel ca. −10 dBFS. „Kopfhörer“-Dateien (Theta 6 Hz, Alpha 10 Hz) sind binaural und wirken nur über Kopfhörer. Loops sind periodisch erzeugt; je nach Browser kann der Neustart minimal knacken.
- Text-Cues bewusst ohne Befehls-/Gehorsams-Formulierungen (Markenregel: kritischen Verstand nicht umgehen). Eigene Texte jederzeit in `cues.js` ergänzen.

## Test (17.11.2026, Chrome headless, beide Fenster)
Verbindung, Bild, Video (läuft, Schleife), Audio (läuft, Schleife, Lautstärke 0,6), Text mit Namen, Ablauf, Klienten-Ansicht, „Alles stoppen“ (alles aus, Anzeige zurückgesetzt), Steuerpult bei 390 px ohne Querscrollen: alles ohne Konsolenfehler. Nicht getestet: echte Kopfhörer-Wirkung, Safari/iPhone, Google Fonts (im Test blockiert, Ersatzschrift).

## Fehlerprotokoll (Ergänzung)
- Skript-Auswahl sprengte die Breite bei 390 px (lange Titel in `select`) → `min-width:0; max-width:100%`. Lehre: Mobilbreite nach jedem neuen Formularelement prüfen.
- Generator ließ ein leeres Feld durch (`refreshed, cool, and .`), weil das Original-Schema nur „String“ verlangt → Formular prüft „ausgefüllt“ zusätzlich; Python-Original bleibt unverändert.
- Test-Fehlgriff: Textfeld im geschlossenen `<details>` ist nicht bedienbar → Test öffnet es zuerst.
- `__pycache__/*.pyc` landete im Commit (Test importierte das Python-Original) → entfernt, `.gitignore` ergänzt. Lehre: vor jedem Commit `git status` auf Fremddateien lesen; Tests mit `python3 -I -B` starten.
- `curl -I` über den Proxy zeigte „200 Connection Established“ (Proxy-Zeile, nicht die Seite) → Status mit `-w '%{http_code}'` prüfen.
- Text-Einblendung und Ablauf-Frage lagen übereinander → `body:has(#flow.on) #txt` setzt den Text nach unten. Lehre: Overlays immer gemeinsam im Browser testen, nicht einzeln.
- Spiral-Bild: Arme endeten mitten im Bild → Arme laufen jetzt aus dem Bild. Lehre: Screenshot prüfen, nicht nur Code.
- Ganzseiten-Screenshot zeigte weißen Hintergrund (nur `body` hatte `fixed`-Verlauf) → `html{background}` gesetzt.

## Version 3 (17.11.2026): Loop-Knacken, Sprache, Upload, Oberfläche
- **Audio-Loop ohne Knacken:** Ursache war das MP3-Encoder-Padding plus Phasensprung am Dateiende bei `<audio loop>`. Jetzt Web-Audio-Loop-Puffer: 30-s-Fenster ab Sekunde 2 (Dateien 40 s lang, periodisches Material), Anfang 1 s linear überblendet. Messung im Browser: Sprung an der Naht ≤ typischer Sample-Schritt (z. B. 0,0065 vs. 0,0066). Ein-/Ausblendung 1,5 s / 0,8 s. Fallback auf `<audio>`, falls Decodieren scheitert.
- **Sprache im Ablauf (Profil Good Boys):** Ursache: Knöpfe ohne aktiven Zustand, `lang`/`mode` wurden nur beim Klick gesendet (ein später geöffnetes/neu geladenes Display verlor sie), Operator-Text immer zweisprachig. Jetzt: aktiver Zustand, Speicherung (`hd-flang`), Neusenden bei `hello`, Operator zeigt die gewählte Sprache.
- **Sprachumschalter DE/EN oben** (`hd-ui`, Nachricht `uilang`): Steuerpult, Cue-Beschriftungen, Textbausteine und Startseite des Displays.
- **Upload** (.txt, .md, .json; Drag & Drop; max. 500 KB, max. 500 Schritte): bleibt im Browser (localStorage), entfernbar. Text nur per `textContent` (XSS-Test bestanden).
- **Oberfläche:** Tabs (Sitzung & Medien, Text & Skript, Generator, Ablauf), „Läuft gerade“, Schwarz und Stopp immer sichtbar.
- **Fehler, gefunden beim Test:** Display warf nach dem Start einen JS-Fehler bei `uilang` (Start-Overlay war schon entfernt) → Nullprüfung in `applyUi`.
- **Alternativen geprüft:** Loop per Crossfade zweier `<audio>`-Elemente (ungenau im Timing, verworfen); Upload per Server (nicht möglich auf GitHub Pages, Datenschutz); Browser-Speicher statt Server ist sicherer.

## Bild-/GIF-Upload (17.11.2026)
- Tab „Sitzung & Medien“ → „Eigene Bilder / GIFs“: PNG, JPG, WebP, GIF per Klick oder Drag & Drop, max. 8 MB. Speicherung in IndexedDB (nur dieser Browser, nichts online). Anzeige im Display per Datenadresse, GIFs laufen animiert. SVG bewusst ausgeschlossen (könnte Skripte enthalten). Test: Upload, Anzeige im Display, Persistenz nach Reload, Ablehnung falscher Typen, Löschen.
- Hinweis: Rechte am hochgeladenen Bild liegen beim Nutzer; Bilder im Browser des Geräts, nicht im Repo (kein Eintrag in data/bilder.json nötig, da nichts veröffentlicht wird).

## Skripte hinzufügen, bearbeiten, Sprache (17.11.2026)
- Tab „Text & Skript“ → „Text hinzufügen“: Text einfügen (Copy & Paste) oder Datei/Drag & Drop. Titel, Sprache (automatisch DE/EN), Aufteilung (Zeilen/Sätze/automatisch), optionale Übersetzung (eine Zeile je Schritt).
- **A · Session-Text:** Fragmente oder ganzes Skript wird unverändert eingeblendet. **B · Worte des Gegenübers:** wird als Zitat („…“ bzw. “…”) eingeblendet. Jedes Skript trägt eine Sprache ([DE]/[EN]); mit „Anzeige“ (Original/DE/EN) wird die hinterlegte Übersetzung eingeblendet.
- **Bearbeiten:** alle Skripte (auch die zwei mitgelieferten) und alle Textbausteine (DE/EN getrennt) sind editierbar; Änderungen am Original in localStorage (`hd-edits`, `hd-cues`), „Original wiederherstellen“ möglich.
- **Sichern:** „Alle sichern (JSON)“ exportiert Uploads, Änderungen und Textbausteine; JSON-Datei wieder hochladen = Import auf anderem Gerät.
- Grenze: keine automatische Übersetzung (kein Schlüssel/Server auf GitHub Pages, Datenschutz); Übersetzung wird eingefügt oder selbst geschrieben.
- Test: Einfügen mit Sätze-Aufteilung, Übersetzungs-Umschaltung, Zitat in B, Bearbeiten und Zurücksetzen des Originals, Textbausteine, Export, Persistenz nach Reload, 390 px ohne Überlauf.

## Skripte 03–05: Socken-Anker (17.11.2026)
- Aus der Vorlage „Socken-Anker · 3 Theta-Wave-Induktionen“ übernommen: nur die gesprochenen Passagen (Street, After Training, After Shower), gekürzt, Pausen als [3~]/[6~], Phasen und Anker markiert. Jeder Schritt hat die englische Fassung (`<<`-Zeile im .md), umschaltbar über „Anzeige“.
- Bewusst nicht übernommen: die Sprecher-Hinweise und „Warum das funktioniert“-Texte (nicht zum Einblenden), drei eingestreute englische Fremdzeilen („inner coach“, „universe is smiling“, „Everything is fine…“; das Universum-Wort steht auf der Verbotsliste), Absatz „Einsatz-Empfehlung“.
- Textliche Anpassungen: „Cortisol sinkt“ und „Das ist Physiologie“ → vorsichtigere Formulierungen (Vagus-Nerv, „messbar Richtung Ruhe“); Edison-Aussage mit „soll“ abgeschwächt; Markenwörter geprüft (CLAUDE.md-Liste, 0 Treffer). `knowledge/verbotene_phrasen.md` fehlt in diesem Checkout (in CLAUDE.md erwähnt) – Prüfung daher gegen die Liste in CLAUDE.md.
- Neu im Parser: `<<`-Zeile = Übersetzung des vorherigen Schritts; Sprache der mitgelieferten Skripte wird erkannt statt fest „EN“.
