# 🌿 CLAUDE CODE BRIEFING v2 — Projekt `mindful7777`

> **Für:** Claude Code (Terminal-Assistent)
> **Von:** André
> **Datum:** Mai 2026
> **Status:** Erweiterte Version mit voller Automatisierung
> **Was ist neu in v2:** Skill-basierte Automatisierung, Workflow-Pipelines,
> fertige Vorlagen, Prompts, Termux- + Git-Bash-Befehle

---

## 📑 Inhalt

| Teil | Thema | Status |
|------|-------|--------|
| 1 | Lektionen aus BanglaHilfe (7 Prinzipien) | unverändert |
| 2 | Konzept mindful7777 | leicht erweitert |
| 3 | Technische Einrichtung (Schritt für Schritt) | unverändert |
| 4 | Erste Inhaltsideen | unverändert |
| 5 | Kritische Hinweise für Claude Code | unverändert |
| **6** | **🆕 Skill-basierte Automatisierung** | **NEU** |
| **7** | **🆕 Workflow-Pipelines** | **NEU** |
| **8** | **🆕 Vorlagen & Prompts** | **NEU** |
| **9** | **🆕 Termux-Setup (Handy)** | **NEU** |
| **10** | **🆕 Git-Bash am PC (Copy-Paste)** | **NEU** |

> 💡 Wer es eilig hat, springt zu **Teil 9** (Termux) oder **Teil 10** (Git Bash).

---

# 🎯 DEINE AUFGABE IN EINEM SATZ

Lege auf GitHub das Repo **`mindful7777`** an, richte es nach BanglaHilfe-Qualitätsprinzipien ein **UND** baue von Anfang an ein **Skill-System**, sodass wiederkehrende Aufgaben (Skript-Erstellung, Disclaimer-Check, Glossar-Kontrolle, Qualitäts-Checkliste) reproduzierbar und automatisierbar sind.

---

# 📚 TEIL 1 — LEKTIONEN AUS BANGLAHILFE

Diese 7 Prinzipien sind die Grundlage. **Nicht verhandelbar.**

### Prinzip 1 — Qualität vor Schnelligkeit
Jeder Inhalt durchläuft mindestens **zwei Prüfschritte**: Selbst-Check + Zweitprüfung durch Mensch.

### Prinzip 2 — Konsistenz-Glossar von Anfang an
Fachbegriffe immer identisch. Siehe `docs/glossar.md`.

### Prinzip 3 — Eigenes Land statt gemietetes Land
Niemals nur YouTube/Instagram. Immer eigene E-Mail-Liste + Website.

### Prinzip 4 — Lead-Magnet-Strategie
Jeder Besucher bekommt ein Geschenk gegen E-Mail. Z. B. *"7-Tage-Entspannungs-Audiokurs"*.

### Prinzip 5 — Brand-Disziplin
Gleiche Farben, gleicher Slogan, gleiche Tonlage — überall.

### Prinzip 6 — Workflow vor Veröffentlichung
```
Entwurf → Selbst-Check → 2. Person prüft → Korrektur → Veröffentlichung
```
**Keine Abkürzung. Niemals.**

### Prinzip 7 — Sensiblere Tonalität als bei Sprachkursen
Hypnose ist Vertrauensthema. Klare Disclaimer, keine Heilversprechen, Schutz verletzlicher Menschen.

---

# 🌿 TEIL 2 — KONZEPT mindful7777

**Plattform für Hypnose, Entspannung und persönliche Betreuung im deutschsprachigen Raum.**

**Kernangebote:**
1. **Audio-Sessions** — geführte Hypnose, Meditation, Schlafhilfen
2. **Video-Inhalte** — Atemtechniken, Visualisierungen, Erklärvideos
3. **Persönliche Betreuung** — 1:1-Coaching (Premium)
4. **Lead-Magnet** — kostenloser Einstiegskurs für E-Mail-Sammlung

**Zielgruppe:** Erwachsene 25–55, deutschsprachig, suchen Stressabbau/besseren Schlaf/Angstreduktion, skeptisch gegenüber Esoterik.

### Brand-Identität

| Element | Wert |
|---|---|
| Hauptfarbe | Tiefes Mitternachtsblau `#1B2845` |
| Akzentfarbe | Warmes Gold `#D4A574` |
| Hintergrund | Sehr helles Beige `#F7F4EE` |
| Text | Tiefes Grau `#3A3A3A` |
| Schrift | Sans-Serif (Inter/Arial) + Serifen-Headlines |
| Tonlage | Ruhig, klar, professionell, ohne Esoterik |
| Slogan | *"Tiefe Ruhe. Echte Veränderung."* |

### Was NICHT gemacht wird
❌ Heilsversprechen ❌ "Wundermittel"-Sprache ❌ Esoterik-Floskeln ❌ Behandlung psychischer Erkrankungen ❌ Audios ohne Disclaimer ❌ Kopie anderer Hypnotiseure

---

# 💻 TEIL 3 — TECHNISCHE EINRICHTUNG

> ⚠️ Anweisungen für Claude Code: Alle Befehle als Copy-Paste-Block, jeder Schritt in einfachem Deutsch erklärt.

### Schritt 1 — GitHub-Repo erstellen

Auf [github.com/new](https://github.com/new):

```
Name:           mindful7777
Beschreibung:   Hypnose, Entspannung und persönliche Betreuung —
                Audio, Video und 1:1-Coaching für den deutschsprachigen Raum
Sichtbarkeit:   Private (später bei Bedarf public)
Initialisieren: ✓ README.md, ✓ .gitignore (Node)
```

### Schritt 2 — Lokale Einrichtung

(Siehe **Teil 10** für die fertigen Copy-Paste-Befehle am PC bzw. **Teil 9** für Termux am Handy.)

### Schritt 3 — Ordnerstruktur

```
mindful7777/
├── README.md
├── .gitignore
├── docs/
│   ├── markenrichtlinie.md
│   ├── glossar.md
│   ├── qualitaets_checkliste.md
│   ├── content_workflow.md
│   ├── disclaimer.md
│   └── zielgruppe.md
├── content/
│   ├── audio/
│   ├── video/
│   ├── pdf/
│   └── coaching/
├── skills/                       # 🆕 NEU
│   ├── hypno-script-creator/
│   ├── disclaimer-injector/
│   ├── glossar-konsistenz-pruefer/
│   ├── qualitaets-checkliste-runner/
│   ├── brand-tonalitaet-pruefer/
│   ├── lead-magnet-builder/
│   ├── email-sequence-creator/
│   └── social-post-creator/
├── pipelines/                    # 🆕 NEU
│   ├── audio_production.md
│   ├── lead_magnet.md
│   ├── email_sequence.md
│   ├── social_media.md
│   └── coaching_session.md
├── templates/                    # 🆕 NEU
│   ├── audio_skript.md
│   ├── video_skript.md
│   ├── email_brevo.md
│   ├── social_post.md
│   └── lead_magnet_pdf.md
├── website/
└── outreach/
    ├── email_templates/
    └── social_media/
```

### Schritt 4 — Inhalte der Kerndateien

Die 5 Pflicht-Dateien (`README.md`, `markenrichtlinie.md`, `glossar.md`, `qualitaets_checkliste.md`, `disclaimer.md`) sind im ursprünglichen Briefing v1 enthalten. Übernimm sie **wörtlich**, bevor du mit Teil 6 (Skills) beginnst.

---

# 🎁 TEIL 4 — ERSTE INHALTSIDEEN

1. **Lead-Magnet "Der 10-Minuten-Reset"** — Audio, 10 Min., gegen E-Mail
2. **Video-Serie "Atmen lernen"** — 3-teilig, 5–7 Min., Box/4-7-8/Wechselatmung
3. **Premium "3er-Pack persönliche Betreuung"** — 3 × 60 Min. Coaching, 297–397 €

---

# ⚠️ TEIL 5 — KRITISCHE HINWEISE FÜR CLAUDE CODE

1. Bei Unklarheit **zurückfragen**
2. Fehler **ehrlich kommunizieren**
3. **Jeden Befehl erklären** (André ist Anfänger)
4. **Niemals ohne Disclaimer** bei Hypnose-Inhalten
5. **Zweite Prüfung anmahnen** — keine Veröffentlichung ohne Zweitkontrolle
6. **Brand-Disziplin durchsetzen** — bei Nicht-Glossar-Begriffen höflich korrigieren

---

# 🤖 TEIL 6 — SKILL-BASIERTE AUTOMATISIERUNG

> **Kernidee:** Jede Aufgabe, die du **mehr als zweimal** machst, wird zum Skill.
> Skills folgen dem Anthropic-Skill-Format (YAML-Frontmatter + Markdown).

## 6.1 Was ist ein Skill?

Ein **Skill** ist ein Ordner mit einer `SKILL.md`-Datei. Wenn Claude eine passende Aufgabe sieht, lädt er die Anleitung automatisch und arbeitet sie ab.

**Anatomie:**
```
skill-name/
├── SKILL.md                # YAML-Frontmatter (name, description) + Anleitung
├── references/             # Hintergrund-Docs (bei Bedarf nachgeladen)
└── assets/                 # Vorlagen, Beispiele
```

**Frontmatter-Beispiel:**
```yaml
---
name: hypno-script-creator
description: Erstelle Hypnose-Audio-Skripte für mindful7777 nach der
  4-Phasen-Struktur (Induktion → Vertiefung → Suggestionen → Rückführung).
  Nutze IMMER wenn ein neues Audio-Skript erstellt wird, eine Hypnose-Session
  geplant ist, oder André Begriffe wie "Skript", "Session", "Induktion",
  "Tiefenentspannung", "Schlafhilfe" verwendet.
---
```

> 💡 **"Pushy" Trigger-Beschreibung:** Skills werden oft *zu wenig* getriggert. Schreibe Trigger eher zu generös als zu sparsam.

## 6.2 Die 8 Skills für mindful7777

| # | Skill | Wann triggern? | Output |
|---|-------|----------------|--------|
| 1 | `hypno-script-creator` | Neues Audio-Skript geplant | 4-Phasen-Skript als `.md` |
| 2 | `disclaimer-injector` | Inhalt mit Audio/Video/Coaching | Disclaimer eingebaut |
| 3 | `glossar-konsistenz-pruefer` | Vor jeder Veröffentlichung | Liste der Abweichungen |
| 4 | `qualitaets-checkliste-runner` | Vor jeder Veröffentlichung | Stufen-Bericht 1–5 |
| 5 | `brand-tonalitaet-pruefer` | Vor jeder Veröffentlichung | Esoterik/Heilsversprechen-Flags |
| 6 | `lead-magnet-builder` | Neuer Lead-Magnet | PDF + Audio + 3-teilige Mail-Serie |
| 7 | `email-sequence-creator` | Neue E-Mail-Kampagne | Brevo-fertige Vorlagen |
| 8 | `social-post-creator` | Neuer Social-Media-Post | Posts für IG/YT/TikTok |

---

## 6.3 Skill #1 — `hypno-script-creator`

**Datei:** `skills/hypno-script-creator/SKILL.md`

```yaml
---
name: hypno-script-creator
description: Erstelle Hypnose-Audio-Skripte für mindful7777 nach der
  4-Phasen-Struktur (Induktion → Vertiefung → Suggestionen → Rückführung).
  Nutze IMMER wenn ein Audio-Skript, eine Hypnose-Session, eine
  Schlafhilfe, eine Tiefenentspannung oder Begriffe wie "Induktion",
  "Suggestion", "Selbsthypnose" auftauchen — auch wenn nicht explizit
  "Skript erstellen" gesagt wird.
---

# hypno-script-creator

Erstellt ein vollständiges Hypnose-Audio-Skript in 4 Phasen.

## Pflicht-Struktur

### Phase 1 — Induktion (2–4 Min.)
- Augen schließen, Aufmerksamkeit nach innen
- 3 tiefe Atemzüge mit Zählung
- Körperwahrnehmung von Kopf bis Fuß

### Phase 2 — Vertiefung (3–5 Min.)
- Treppe abwärts / Aufzug / Strand
- Zählung 10 → 0 oder 5 → 0
- Sprachtempo langsamer werdend

### Phase 3 — Suggestionen (variabel)
- Thema-spezifische Suggestionen
- IMMER positiv formuliert (NICHT "kein Stress mehr", SONDERN "tiefe Ruhe")
- 3–7 Kern-Suggestionen, jeweils 2–3× wiederholt

### Phase 4 — Rückführung (1–2 Min.)
- Zurück in den Raum
- Zählung 1 → 5 oder 1 → 10
- Augen öffnen, wach, frisch, klar

## Pflicht-Checks vor Output

1. **Disclaimer** am Anfang vorhanden? (siehe `docs/disclaimer.md`)
2. **Glossar-konform**? (siehe `docs/glossar.md`)
3. **Keine Heilsversprechen**? (siehe `docs/markenrichtlinie.md`)
4. **Sicherheits-Hinweis** "nicht während Autofahren" enthalten?
5. **Klarer Ausstieg** in Phase 4?

## Output-Format

Speichere als `content/audio/[YYYY-MM-DD]_[thema_slug].md` mit:
- YAML-Frontmatter (Titel, Dauer, Zielgruppe, Status)
- Pflicht-Disclaimer
- 4 klar getrennte Phasen mit Zeit-Markern
- Hinweis am Ende: "⚠️ Vor Veröffentlichung: Zweitprüfung nötig"
```

---

## 6.4 Skill #2 — `disclaimer-injector`

```yaml
---
name: disclaimer-injector
description: Prüft jeden Inhalt (Audio, Video, PDF, Coaching-Material)
  auf vorhandenen Standard-Disclaimer und fügt ihn ein, falls er fehlt.
  IMMER nutzen vor Veröffentlichung, beim Skript-Review, oder wenn
  André ein Audio/Video/PDF erstellt. Niemals einen Hypnose-Inhalt
  ohne Disclaimer durchgehen lassen.
---

# disclaimer-injector

## Aufgabe
Sicherstellen, dass JEDER veröffentlichungs-bereite Inhalt den passenden
Disclaimer enthält.

## Quelle
Standard-Texte in `docs/disclaimer.md`.

## Logik

1. Inhalt einlesen
2. Typ erkennen:
   - Audio/Video → "Audio-Disclaimer" einfügen
   - Coaching-Material → "Coaching-Disclaimer" einfügen
   - PDF-Lead-Magnet → BEIDE
3. Position prüfen:
   - Audio-Skript → unmittelbar nach Titel
   - Video → in Beschreibung UND als Einblendung Sek. 0–5
   - PDF → Seite 2 + Footer auf jeder Seite
4. Wenn schon vorhanden: melden "✓ Disclaimer vorhanden"
5. Wenn nicht: einfügen und melden "🛡️ Disclaimer eingefügt an Position X"

## Niemals
- Disclaimer kürzen
- Disclaimer umformulieren ohne Rücksprache
- Disclaimer "vergessen" — bei Zweifel: Skill auslösen
```

---

## 6.5 Skill #3 — `glossar-konsistenz-pruefer`

```yaml
---
name: glossar-konsistenz-pruefer
description: Scannt jeden Text auf Abweichungen vom mindful7777-Glossar
  (docs/glossar.md). IMMER nutzen vor Veröffentlichung, beim Review,
  oder wenn André "prüfen", "checken", "kontrollieren" sagt.
  Ziel: Markenkonsistenz wie bei BanglaHilfe gelernt.
---

# glossar-konsistenz-pruefer

## Regel
Glossar-Begriffe werden IMMER identisch verwendet. Kein "Trance" statt "Hypnose",
kein "Imagination" statt "Visualisierung".

## Logik

1. `docs/glossar.md` einlesen
2. Inhalt einlesen
3. Für jeden Glossar-Begriff:
   - Synonyme suchen, die NICHT erlaubt sind
   - Treffer als Tabelle ausgeben:

| Zeile | Gefunden | Standard-Begriff | Vorschlag |
|-------|----------|------------------|-----------|
| 23 | "Trance" | "Hypnose" | Ersetzen? |
| 45 | "Imagination" | "Visualisierung" | Ersetzen? |

4. Bei 0 Treffern: "✅ Vollständig glossar-konform"
5. Bei Treffern: Vorschläge zur Korrektur, nicht automatisch ändern

## Warum nicht automatisch?
Manche Synonyme sind im Kontext OK (Zitat, Erklärung etc.).
André entscheidet pro Fall.
```

---

## 6.6 Skill #4 — `qualitaets-checkliste-runner`

```yaml
---
name: qualitaets-checkliste-runner
description: Führt die 5-stufige Qualitäts-Checkliste aus
  docs/qualitaets_checkliste.md interaktiv durch. IMMER nutzen
  bevor ein Inhalt als "fertig" markiert wird, vor Veröffentlichung,
  oder wenn André sagt "ist das gut?" / "können wir das raushauen?".
---

# qualitaets-checkliste-runner

## Aufgabe
Geht Stufe 1–5 der Qualitäts-Checkliste durch, fragt André bei jedem Punkt
und gibt am Ende einen Ampel-Bericht aus.

## Ablauf

1. Lese `docs/qualitaets_checkliste.md`
2. Für JEDE Stufe (1–5):
   - Stelle die Checkliste-Fragen
   - Erfasse Antworten (✓ / ✗ / n/a)
3. Ergebnis-Ampel:
   - 🟢 GRÜN: alle Pflicht-Punkte ✓ → "Bereit für Zweitprüfung"
   - 🟡 GELB: kleinere Lücken → "Nacharbeit nötig: [Liste]"
   - 🔴 ROT: Sicherheits- oder Disclaimer-Lücke → "STOPP. Nicht veröffentlichen."

## Output-Datei
Speichere Ergebnis als `content/[typ]/_checks/[datum]_[slug].md`,
damit jede Prüfung nachvollziehbar ist.

## Niemals
- Stufe 3 (Sicherheits-Check) überspringen
- Stufe 4 (Zweite Prüfung) auf "später" verschieben
- 🔴 ROT-Ergebnis als "nicht so wild" abtun
```

---

## 6.7 Skill #5 — `brand-tonalitaet-pruefer`

```yaml
---
name: brand-tonalitaet-pruefer
description: Prüft Texte/Skripte auf verbotene Esoterik-Floskeln,
  Heilsversprechen oder unprofessionelle Sprache.
  IMMER nutzen vor Veröffentlichung.
---

# brand-tonalitaet-pruefer

## Verbotene Wörter / Phrasen (Standard-Liste)

**Heilsversprechen-Trigger:**
- "garantiert", "100%", "Wundermittel", "heilt", "ersetzt Therapie"
- "in X Tagen [Krankheit] weg", "schmerzfrei in einer Sitzung"

**Esoterik-Trigger:**
- "Energie", "Aura", "Chakren öffnen", "Schwingung", "Universum schickt"
- "Manifestieren" (außer mit Erklärung), "höheres Selbst" (ohne Kontext)

**Marketing-Lügen-Trigger:**
- "Geheimnis der Profis", "endlich entlarvt", "Was die Therapeuten verschweigen"

## Logik

1. Inhalt scannen
2. Treffer auflisten mit Kontext:

| Zeile | Phrase | Kategorie | Empfehlung |
|-------|--------|-----------|------------|
| 12 | "garantiert besser schlafen" | Heilsversprechen | Ersetzen durch "kann unterstützen" |
| 34 | "deine Energie heben" | Esoterik | Streichen oder konkret erklären |

3. Wenn Heilsversprechen oder Esoterik → 🔴 STOPP
4. Wenn nur Marketing-Phrase → 🟡 GELB, Vorschlag

## Erweiterbar
André kann jederzeit neue Wörter zur Liste hinzufügen.
Liste in `skills/brand-tonalitaet-pruefer/assets/verbotene_phrasen.md`.
```

---

## 6.8 Skill #6 — `lead-magnet-builder`

```yaml
---
name: lead-magnet-builder
description: Erstellt einen kompletten Lead-Magnet (PDF + Audio-Skript +
  3-teilige E-Mail-Begrüßungs-Serie) für mindful7777. Nutze wenn André
  einen neuen Lead-Magnet plant, einen "Gratis-Kurs" anbietet, oder
  Begriffe wie "Eintrag-Geschenk", "Magnet", "kostenlos im Tausch gegen
  E-Mail" verwendet.
---

# lead-magnet-builder

## Liefer-Pakete

Ein Lead-Magnet bei mindful7777 besteht IMMER aus:

1. **Audio-Skript** (`content/audio/leadmagnet_*.md`)
   → Erzeugt mit `hypno-script-creator`
2. **PDF-Begleiter** (`content/pdf/leadmagnet_*.md`)
   → Struktur: Titel + Disclaimer + Anleitung + Audio-Link + Bonus-Tipp
3. **3-teilige Brevo-Mail-Serie** (`outreach/email_templates/leadmagnet_*/`)
   → Mail 1: sofort, Lieferung + Willkommen
   → Mail 2: Tag 2, Vertrauensaufbau (kleine Geschichte)
   → Mail 3: Tag 5, sanfter CTA zu Premium-Angebot

## Pflicht-Checks
- Lauf durch `disclaimer-injector` (alle 3 Teile)
- Lauf durch `glossar-konsistenz-pruefer`
- Lauf durch `brand-tonalitaet-pruefer`
- Manueller Sicherheits-Check bei Audio

## Ausgabe
Ein einziger Ordner: `content/leadmagnets/[YYYY-MM-DD]_[name]/`
mit allen 5 Dateien (Skript, PDF-Quelle, 3 Mails) + README.md.
```

---

## 6.9 Skill #7 — `email-sequence-creator`

```yaml
---
name: email-sequence-creator
description: Erstellt Brevo-kompatible E-Mail-Sequenzen für mindful7777.
  Nutze bei Newsletter, Welcome-Serie, Launch-Kampagne, Re-Engagement.
---

# email-sequence-creator

## Format pro E-Mail
```
Betreff:        [max. 45 Zeichen, ohne Emojis am Anfang]
Preheader:      [max. 90 Zeichen]
Tag:            [Tag X nach Anmeldung]

[Body Markdown]

CTA:            [genau EINER, klar formuliert]
Unsubscribe:    {{unsubscribe}}
```

## Pflicht-Elemente jeder Mail
- Persönliche Anrede (`{{NAME}}` Brevo-Variable)
- Genau EIN CTA (Premium-Angebot, Audio-Link oder Reply-Frage)
- Plain-Text-Version mitliefern
- Unsubscribe-Link sichtbar

## Sequenz-Typen
| Typ | Anzahl | Rhythmus |
|-----|--------|----------|
| Welcome | 3 | Tag 0, 2, 5 |
| Launch | 5 | Tag -7, -3, -1, 0, +2 |
| Re-Engagement | 2 | Tag 0, 7 |
```

---

## 6.10 Skill #8 — `social-post-creator`

```yaml
---
name: social-post-creator
description: Erstellt mindful7777-konforme Social-Media-Posts
  (Instagram, YouTube-Shorts, TikTok, LinkedIn).
---

# social-post-creator

## Plattform-Varianten

| Plattform | Länge | Bildformat | CTA |
|-----------|-------|------------|-----|
| Instagram-Caption | max. 220 Wörter | 4:5 oder 1:1 | "Link in Bio" |
| IG-Reels | 30–60 Sek. | 9:16 | Sound + Hook |
| YT-Shorts | 15–60 Sek. | 9:16 | "Abonnier für Teil 2" |
| TikTok | 15–90 Sek. | 9:16 | Trend-Sound nutzen |
| LinkedIn | max. 300 Wörter | 4:5 | Frage am Ende |

## Pflicht-Format
1. **Hook** (erste 3 Sek. / erste Zeile)
2. **Wert** (1 konkreter Tipp / 1 Aha-Moment)
3. **CTA** (genau einer)
4. **Hashtag-Set** (max. 8, gemischt: 3 groß + 5 nischig)

## Tabu
- Kein Heilsversprechen
- Kein Esoterik-Slang
- Keine Clickbait-Hooks ("Du wirst nicht glauben…")
```

---

# 🔄 TEIL 7 — WORKFLOW-PIPELINES

> **Pipeline = mehrere Skills hintereinander, automatisch orchestriert.**

## 7.1 Pipeline "Audio-Produktion"

**Datei:** `pipelines/audio_production.md`

```
START
  │
  ├─ 1. hypno-script-creator      → Skript-Entwurf
  ├─ 2. disclaimer-injector       → Disclaimer eingebaut
  ├─ 3. glossar-konsistenz-pruefer → Begriffe okay
  ├─ 4. brand-tonalitaet-pruefer  → keine Esoterik/Heilversprechen
  ├─ 5. qualitaets-checkliste-runner → Stufen 1–3 durchlaufen
  │
  ├─ ⏸ MENSCH: Audio einsprechen
  │
  ├─ 6. qualitaets-checkliste-runner → Stufe 4 (Zweitprüfung)
  ├─ 7. MENSCH: zweite Person hört Audio
  │
  └─ ✅ VERÖFFENTLICHUNG
```

## 7.2 Pipeline "Lead-Magnet-Launch"

```
START
  │
  ├─ 1. lead-magnet-builder       → 5 Dateien erzeugt
  ├─ 2. Audio-Pipeline (7.1)      → Audio fertig
  ├─ 3. PDF-Layout (manuell oder Canva-MCP)
  ├─ 4. email-sequence-creator    → Brevo-Sequenz
  ├─ 5. social-post-creator       → 3 Launch-Posts
  │
  ├─ ⏸ MENSCH: Zweitprüfung aller Teile
  │
  └─ ✅ LAUNCH
```

## 7.3 Pipeline "Wöchentlicher Content-Rhythmus"

```
MONTAG:    social-post-creator → 1 IG-Post
DIENSTAG:  hypno-script-creator → 1 neues Audio
MITTWOCH:  Audio einsprechen + Zweitprüfung
DONNERSTAG: email-sequence-creator → 1 Newsletter
FREITAG:   social-post-creator → 1 Reel (Ausschnitt aus Audio)
SAMSTAG:   Buffer / Coaching-Slots
SONNTAG:   Auswertung + Planung nächste Woche
```

## 7.4 Pipeline "Coaching-Session-Vorbereitung"

```
START (24h vor Termin)
  │
  ├─ 1. Klienten-Notizen lesen (verschlüsselt)
  ├─ 2. Ziele aus Vorgespräch zusammenfassen
  ├─ 3. Individuelle Suggestionen vorbereiten (Phase 3 Skript)
  ├─ 4. disclaimer-injector (Coaching-Variante)
  │
  ├─ ⏸ Sitzung durchführen
  │
  └─ Nachbereitung: anonymisierte Lessons in `content/coaching/lessons.md`
```

---

# 📝 TEIL 8 — VORLAGEN & PROMPTS

## 8.1 Audio-Skript-Vorlage (`templates/audio_skript.md`)

```markdown
---
titel:        [Titel]
dauer:        [10-30 Min.]
zielgruppe:   [z.B. Einschlafhilfe für Vielarbeiter]
status:       entwurf | review | freigegeben
erstellt:     YYYY-MM-DD
zweitpruef:   [Name]
---

# [TITEL DES SKRIPTS]

> 🛡️ DISCLAIMER (siehe docs/disclaimer.md — Audio-Variante)

## Phase 1 — Induktion (2–4 Min.)
[Text]

## Phase 2 — Vertiefung (3–5 Min.)
[Text]

## Phase 3 — Suggestionen
[Text]

## Phase 4 — Rückführung (1–2 Min.)
[Text]

---

## Sprecher-Hinweise
- Tempo: langsam, ~110 Wörter/Min.
- Pausen: nach jedem Satz ≥ 2 Sek.
- Stimme: tief, warm, ruhig

## ⚠️ Vor Veröffentlichung: Zweitprüfung nötig
```

## 8.2 Video-Skript-Vorlage (`templates/video_skript.md`)

```markdown
---
titel:        [Titel]
dauer:        [5-15 Min.]
typ:          erklärvideo | atemtechnik | meditation
status:       entwurf | review | freigegeben
---

# [TITEL]

## Hook (0:00–0:15)
[Was hält den Zuschauer in den ersten 15 Sek.?]

## Inhalt (0:15–[X])
[Hauptteil mit Beispielen]

## CTA (letzte 30 Sek.)
[Was soll der Zuschauer als Nächstes tun?]

## Einblendung Sek. 0–5
🛡️ "Bitte nicht beim Autofahren ansehen"

## ⚠️ Vor Veröffentlichung: Zweitprüfung nötig
```

## 8.3 Brevo-E-Mail-Vorlage (`templates/email_brevo.md`)

```markdown
---
sequenz:      welcome | launch | newsletter | re-engagement
tag:          0
status:       entwurf | freigegeben
---

Betreff:    [max. 45 Zeichen]
Preheader:  [max. 90 Zeichen]

Hallo {{NAME}},

[Body — max. 250 Wörter, ein Gedanke pro Absatz]

[CTA-Satz mit Link]

Ruhige Grüße
André

---
Du erhältst diese Mail, weil du dich bei mindful7777 angemeldet hast.
{{unsubscribe}}
```

## 8.4 Standard-Prompts für Claude Code

**Prompt A — Neues Audio:**
```
"Erstelle ein neues Audio-Skript zum Thema [THEMA], Dauer [X] Minuten,
für [ZIELGRUPPE]. Nutze hypno-script-creator und laufe danach die
Audio-Produktions-Pipeline durch."
```

**Prompt B — Wöchentlicher Newsletter:**
```
"Erstelle die Donnerstags-Newsletter. Thema: [THEMA].
Verwende email-sequence-creator, Typ Newsletter.
Prüfe gegen Glossar und Brand-Tonalität."
```

**Prompt C — Vollständiger Lead-Magnet:**
```
"Bau einen Lead-Magnet zum Thema [THEMA]. Audio + PDF + 3 Mails.
Nutze lead-magnet-builder. Endergebnis: ein Ordner mit allem drin."
```

---

# 📱 TEIL 9 — TERMUX-SETUP (HANDY)

> Termux = Linux-Terminal auf Android. Ideal für unterwegs.

## 9.1 Erstmalige Einrichtung

```bash
# 1. Pakete aktualisieren
pkg update && pkg upgrade -y

# 2. Notwendige Tools installieren
pkg install git gh openssh nano -y

# 3. Speicher-Zugriff erlauben
termux-setup-storage

# 4. Bei GitHub einloggen (Browser-Login)
gh auth login
# → Wähle: GitHub.com → HTTPS → Yes (use git credentials) → Browser
```

## 9.2 Repo klonen + erstmals pushen

```bash
# In den Home-Ordner wechseln
cd ~

# Ordner für Projekte anlegen
mkdir -p Projects && cd Projects

# Repo klonen (passe deinen Benutzernamen an!)
git clone https://github.com/[DEIN_USERNAME]/mindful7777.git

# In den Projekt-Ordner
cd mindful7777

# Git-Identität setzen (nur einmal nötig)
git config user.name "André"
git config user.email "deine-mail@example.com"
```

## 9.3 Diese Briefing-Datei ins Repo bringen

```bash
# Briefing-Datei in den docs-Ordner kopieren
# (Datei z.B. via Termux-Share aus dem Download-Ordner ziehen)
mkdir -p docs
mv ~/storage/downloads/mindful7777_briefing_v2.md docs/

# Hinzufügen + committen + hochladen
git add docs/mindful7777_briefing_v2.md
git commit -m "Briefing v2: Skill-Automatisierung, Pipelines, Vorlagen"
git push origin main
```

## 9.4 Tägliche Termux-Routine

```bash
cd ~/Projects/mindful7777
git pull origin main        # neueste Änderungen holen
# … arbeiten …
git add .
git commit -m "kurze Beschreibung was du gemacht hast"
git push origin main
```

## 9.5 Termux-Tipps

- **Lange Befehle:** Tipp `Strg+R` und such die letzte Eingabe
- **Mehrere Sessions:** Wische von links rein → "New Session"
- **Editor:** `nano dateiname.md` (Speichern: `Strg+O`, Enter, `Strg+X`)
- **Status checken:** `git status` zeigt was sich geändert hat

---

# 💻 TEIL 10 — GIT BASH AM PC (COPY-PASTE)

> Git Bash = Terminal unter Windows mit Linux-Befehlen. Auch auf Mac/Linux direkt im Terminal.

## 10.1 Erstmalige Einrichtung (einmalig)

```bash
# Git-Identität setzen (nur EINMAL pro PC nötig)
git config --global user.name "André"
git config --global user.email "deine-mail@example.com"

# GitHub CLI installieren (Windows: scoop oder winget)
# winget install --id GitHub.cli

# Bei GitHub einloggen
gh auth login
```

## 10.2 Repo klonen (einmalig)

```bash
# In deinen Projekt-Ordner wechseln (passe Pfad an!)
cd ~/Projects
# Falls Ordner noch nicht existiert:
mkdir -p ~/Projects && cd ~/Projects

# Repo klonen
git clone https://github.com/[DEIN_USERNAME]/mindful7777.git

# In den Ordner
cd mindful7777
```

## 10.3 Briefing-Datei ins Repo bringen

```bash
# Datei aus dem Download-Ordner kopieren
# (Windows: /c/Users/[DEIN_USER]/Downloads/)
# (Mac:     ~/Downloads/)
mkdir -p docs
cp ~/Downloads/mindful7777_briefing_v2.md docs/

# Status prüfen
git status

# Hinzufügen
git add docs/mindful7777_briefing_v2.md

# Committen mit aussagekräftiger Nachricht
git commit -m "Briefing v2: Skill-Automatisierung, Pipelines, Vorlagen"

# Hochladen
git push origin main
```

## 10.4 Tägliche Routine

```bash
# IMMER zuerst: neueste Version holen
cd ~/Projects/mindful7777
git pull origin main

# … du arbeitest an Dateien …

# Was hat sich geändert?
git status

# Alles hinzufügen
git add .

# Einzelne Datei hinzufügen (sicherer)
git add content/audio/neue_session.md

# Committen
git commit -m "Neue Audio-Session: 10-Minuten-Reset"

# Hochladen
git push origin main
```

## 10.5 Häufige Befehle — Spickzettel

| Befehl | Was er tut |
|--------|------------|
| `git status` | Was hat sich geändert? |
| `git diff` | Welche Zeilen genau? |
| `git log --oneline` | Letzte Commits anzeigen |
| `git pull` | Neueste Version vom Server |
| `git push` | Eigene Änderungen hochladen |
| `git add .` | Alle Änderungen vormerken |
| `git commit -m "..."` | Änderungen festschreiben |
| `git checkout -- datei` | Änderungen an Datei verwerfen |

## 10.6 Wenn etwas schiefgeht

```bash
# "Was ist passiert?"
git status
git log --oneline -10

# "Ich will meine letzte Änderung zurück"
git checkout -- dateiname.md

# "Ich will meinen letzten Commit ändern (Tippfehler)"
git commit --amend -m "Korrigierte Nachricht"

# "Ich habe Konflikt beim Pull"
# → DON'T PANIC. Datei öffnen, beide Versionen sehen,
#   die gewünschte wählen, dann:
git add datei_mit_konflikt.md
git commit -m "Konflikt gelöst"
git push
```

---

# ✅ FERTIG-SIGNAL FÜR CLAUDE CODE

Wenn die Schritte aus **Teil 3** abgeschlossen sind UND die 8 Skills aus **Teil 6** als `SKILL.md`-Dateien im Repo liegen, melde an André:

> "Das Repository `mindful7777` ist eingerichtet — inklusive 8 Skills, 4 Pipelines und 4 Vorlagen.
> Die Automatisierung ist scharf.
> Was soll als erster Inhalt produziert werden?
> - 🎧 10-Minuten-Reset (Lead-Magnet-Audio)
> - 🎬 Atem-Video-Serie Teil 1
> - 💼 Premium-Coaching-Konzept"

---

# 📋 NACHWORT — WAS NOCH FEHLT

**Lele's Projekt:** Konnte nicht analysiert werden — weder im Projekt-Memory noch in Past Chats hinterlegt. Sobald du die Lektionen einspielst (Datei oder Stichpunkte), erweitere ich Teil 1 entsprechend zu *"7 Prinzipien aus BanglaHilfe + N Lektionen aus Lele"*.

**Skill-Eval-Loop:** Wenn du die Skills produktiv nutzt, sammel 5–10 echte Test-Prompts pro Skill. Mit dem Skill-Creator-Tool können wir dann die Trigger-Beschreibungen optimieren (Anthropic-Standard-Loop).

**MCP-Anbindungen (Phase 2):** Brevo, Canva, Notion und ElevenLabs lassen sich als MCP-Server anbinden — dann steuert Claude die Tools direkt. Lohnt sich, sobald die ersten 5 Inhalte stehen.

---

*Ende des Briefings v2. Viel Erfolg.* 🌿
