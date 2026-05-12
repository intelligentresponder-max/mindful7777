# 🌿 CLAUDE CODE BRIEFING v3 — ADDENDUM
## mindful7777 — 12 Lektionen aus den BanglaHilfe-Materialien

> **Was ist das hier?** Eine Ergänzung zu **Briefing v2** (`mindful7777_briefing_v2.md`).
> Andocken: Diese Datei beginnt mit **Teil 11** und führt v2 fort.
>
> **Was wurde analysiert?** Acht PDFs aus dem BanglaHilfe-Universum:
> - 2 fertige Agent-Skills (`bangla-hilfe-intelligence`, `bangla-hilfe-content`)
> - KulturBrücke-Agent in 2 Versionen (System Prompt v1 + v2)
> - 2 Wissensbasis-Dateien (Analogien, Redewendungen)
> - Setup-Anleitung KulturBrücke
> - DeutschBD Software-/Content-Setup
>
> **Ergebnis:** 12 Lektionen, die mindful7777 von einem **Skill-Bündel** zu einem
> **funktionierenden Mehr-Agenten-System** machen.

---

# 📑 Inhalt Addendum

| Teil | Thema |
|------|-------|
| 11 | Die 12 Master-Lektionen aus BanglaHilfe |
| 12 | Multi-Agent-Architektur für mindful7777 (statt einer Mega-Datei) |
| 13 | Standardisierte Output-Formate (Banner-Pattern) |
| 14 | Bildgrößen-Pflichtabfrage VOR jedem visuellen Output |
| 15 | 5-teilige Kampagnen-Logik |
| 16 | Schnell-Anfragen mit fixen Schablonen |
| 17 | Software- & Hardware-Setup (Hypno-Variante) |
| 18 | QR-Code-Pflicht auf allen visuellen Assets |
| 19 | Wissensbasis-Pattern (separate Knowledge-Files) |
| 20 | Push-Befehle für v3 (Termux + Git Bash) |

---

# 🎯 TEIL 11 — DIE 12 MASTER-LEKTIONEN

> Jede Lektion in einem Satz, dann die mindful7777-Übersetzung.

## L1 — Multi-Agent statt Mega-Skill
**Gesehen bei:** BanglaHilfe hat **drei spezialisierte Agenten** (Intelligence, Content, KulturBrücke) statt eines Mega-Skills.
**Für uns:** Wir splitten die 8 Skills aus v2 in **4 fokussierte Agenten** mit jeweils eigenem System-Prompt und eigener Wissensbasis. → Teil 12.

## L2 — "NICHT verwenden für" in jeder Skill-Description
**Gesehen bei:** Jede SKILL.md beider Agenten listet **explizit aus**, wofür sie **nicht** zuständig sind ("NICHT verwenden für: Marktrecherche → dafür Intelligence-Agent").
**Für uns:** Jeder mindful7777-Agent bekommt diese Negativ-Abgrenzung. Verhindert "Drift" zwischen den Agenten.

## L3 — Banner-Pattern für Output-Konsistenz
**Gesehen bei:** Alle Outputs nutzen `━━━━━━━━━━━━━━━━━━━━` als Trennstrich-Banner mit Titel + Datum + Thema.
**Für uns:** Jeder Report, jedes Skript, jede Übersetzung beginnt und endet mit dem Banner. → Teil 13.

## L4 — Bildgrößen-Pflichtabfrage VOR jedem Bild
**Gesehen bei:** KulturBrücke v2 fragt **immer zuerst** die Größe ab (Klein/Mittel/Groß/Story), bevor irgendein Bild-Output entsteht.
**Für uns:** Genau dieser Dialog für alle Hypno-Visuals (Audio-Cover, Reels, Story, Lead-Magnet-Header). → Teil 14.

## L5 — 5-teilige Kampagnen-Serie als Standard
**Gesehen bei:** KulturBrücke v2 liefert für Kampagnen automatisch eine 5er-Serie: Hook → Problem → Lösung → Beweis → CTA.
**Für uns:** Jeder Audio-Launch wird zur 5-teiligen Reel-/Story-Serie. → Teil 15.

## L6 — Schnell-Anfragen mit fixen Schablonen
**Gesehen bei:** "Tages-Brief", "Wochen-Report", "Sofort-Check: X", "Wort des Tages", "FAQ-Check: X" — jede mit fixiertem Output-Schema.
**Für uns:** Hypno-Schnell-Anfragen wie "Tages-Brief Hypno-Markt", "Sofort-Check: Suggestion X", "Audio-Idee: Thema". → Teil 16.

## L7 — Brand-Identity hardcoded
**Gesehen bei:** DeutschBD definiert Farben (`#006a4e`, `#FFCC00`), Schriften (Playfair Display, Hind Siliguri), Slogan, Flaggen-Kombo — alles eingefroren.
**Für uns:** v2 hat das Farbschema. Jetzt zusätzlich: Schriften, Standard-Hashtags, Standard-Bildkomposition als feste Größen.

## L8 — QR-Code als Pflicht auf jedem visuellen Asset
**Gesehen bei:** KulturBrücke v2 hat eine eigene QR-Code-Spezifikation, inkl. fertigem API-Link. Jedes Bild bekommt den QR-Code zur Landing-Page.
**Für uns:** mindful7777-QR-Code zur Anmeldeseite (Lead-Magnet) ist auf **allen** Bildern und PDF-Footern Pflicht. → Teil 18.

## L9 — Knowledge-Base separat von SKILL.md
**Gesehen bei:** KulturBrücke-Agent hat zwei externe Markdown-Dateien (`Analogien.md`, `Redewendungen.md`) die als Projekt-Knowledge hochgeladen werden — **nicht** in den System-Prompt eingebettet.
**Für uns:** Glossar, Disclaimer, verbotene Phrasen, Klient-FAQ liegen in `knowledge/` und werden separat geladen. → Teil 19.

## L10 — Software- & Hardware-Setup als eigenes Dokument
**Gesehen bei:** DeutschBD hat ein eigenständiges PDF nur für Software (CapCut, OBS, Canva, Audacity…) und Hardware (Smartphone, Headset, Licht, Hintergrund) — mit Priorität und Upgrade-Pfad.
**Für uns:** Eine `docs/setup_software_hardware.md` mit Hypno-spezifischen Tools (Audacity, Pop-Filter, schalldämpfender Raum…). → Teil 17.

## L11 — Workflow-Visualisierung mit Zeiten und Verantwortlichkeiten
**Gesehen bei:** DeutschBD zeigt den Video-Produktions-Workflow als sechs Schritte mit konkreten Minutenangaben (Skript 30 Min → Review 20 Min → Aufnahme 45 Min → Schnitt 60 Min …).
**Für uns:** Audio-Pipeline mit Zeitschätzungen, damit André weiß, was 1 Audio realistisch kostet (Zeit).

## L12 — "Versprechen / Garantien"-Sektion pro Agent
**Gesehen bei:** Beide Agent-Skills enden mit einem `## ✅ MEINE GARANTIEN`-Block (z.B. "Jeder Report in unter 3 Minuten", "Immer Quellenangaben").
**Für uns:** Jeder Hypno-Agent endet mit seinen 5 Garantien — das ist gleichzeitig Selbstverpflichtung und Qualitäts-Beweis.

---

# 🤖 TEIL 12 — MULTI-AGENT-ARCHITEKTUR

> **Konsequenz aus L1 + L2:** Die 8 Skills aus v2 werden auf **4 Agenten** verteilt.
> Jeder Agent ist ein eigenes Claude.ai-Projekt mit eigenem System-Prompt und eigener Knowledge.

## 12.1 Agent-Übersicht

| # | Agent | Zuständig für | NICHT zuständig für |
|---|-------|---------------|--------------------|
| 1 | **mindful7777-intelligence** | Markt, Konkurrenz, Trends, Outsourcing, Recherche | Skript-Erstellung, Bilder, Klient-Material |
| 2 | **mindful7777-content** | Audio-Skripte, FAQ, Übersetzungen, Lead-Magnet-Texte | Recherche, Bilder, persönliche Klient-Daten |
| 3 | **mindful7777-visual** | Bilder, Canva-Anweisungen, Social Posts, Kampagnen-Serien | Skript-Inhalte, Recherche, Klient-Material |
| 4 | **mindful7777-coaching** | Klient-Onboarding, Session-Vorbereitung, individuelle Suggestionen | Marketing, öffentliche Inhalte, Bilder |

> 💡 **Trennung der Klient-Daten:** Agent 4 wird in einem **eigenen, getrennten** Claude.ai-Projekt geführt mit Zugriff nur durch André. So liegen sensible Coaching-Notizen nie versehentlich beim Marketing-Agenten.

---

## 12.2 Agent 1 — `mindful7777-intelligence`

**Repo-Pfad:** `agents/intelligence/SKILL.md`

```yaml
---
name: mindful7777-intelligence
description: >
  Verwende diesen Skill für ALLE Rechercheaufgaben rund um mindful7777.
  Triggers: Markt-Hypnose Deutschland, Konkurrenzanalyse Hypno-Coaches,
  Keyword-Recherche, Trendbeobachtung Entspannung, Studien zu Hypnose-
  Wirksamkeit, Plattform-Vergleiche (Insight Timer, 7Mind, Calm),
  Social-Media-Zahlen Hypno-Branche, Tages-Brief, Wochen-Report,
  Sofort-Check, Outsourcing-Vorschläge (Sprecher, Editor).

  NICHT verwenden für: Audio-Skript-Erstellung, Disclaimer-Check,
  Bilderzeugung, Klient-Material, persönliches Coaching.
---

# 🔍 mindful7777 — INTELLIGENCE AGENT

## Wer bin ich?
Der Marktforscher und Scout für mindful7777. Ich liefere Fakten, Zahlen,
Quellen, Handlungsempfehlungen — kein Skript, kein Audio, kein Bild.

## Meine 6 Kernaufgaben

### 1. Markt-Monitoring Hypno-Branche DE/AT/CH
- Studien zur Wirksamkeit von Hypnose (Pubmed, DGH, M.E.G.)
- Neue Studien zu Stress, Schlaf, Angst im DACH-Raum
- Veränderungen in Krankenkassen-Erstattung (z.B. bei Hypnotherapie)

### 2. Wettbewerbs-Analyse
- Top-10-Hypno-YouTube-Kanäle DE: Abonnentenwachstum, neue Videos
- Plattformen: 7Mind, Calm, Insight Timer, Balloon — neue Funktionen
- Lokale Hypno-Coaches (Region Frankfurt/Hessen): Preise, Angebote

### 3. Keyword- & SEO-Recherche
- Google Trends: "Hypnose besser schlafen", "Selbsthypnose lernen",
  "geführte Meditation", "Angst Hypnose"
- YouTube-Suchvolumen
- Saisonale Peaks (Januar = Vorsätze, Herbst = Stress, etc.)

### 4. Content-Intelligence
- Welche Fragen werden in Hypno-Foren / Reddit / FB-Gruppen gestellt?
- Aktuelle Themen die viral gehen (Stress-Wellen nach Krisen-News)

### 5. Outsourcing-Scouting
- Audio-Editor Freelancer (Fiverr/Upwork) für Hypno-Audio
- Sprecher-Pool (falls André nicht selbst einspricht)
- Canva-Designer für Reels

### 6. Kooperations-Scouting
- Yoga-Studios, Heilpraktiker, Psychotherapeuten (Empfehler-Netz)
- Podcast-Hosts im Wellness-Bereich
- Mental-Health-Plattformen mit Affiliate-Programmen

## Output-Format
[siehe Teil 13 — Banner-Pattern]

## Schnell-Anfragen
[siehe Teil 16]

## ✅ Meine Garantien
- Jeder Report in unter 3 Minuten
- Immer Quellenangaben
- Immer konkrete Handlungsempfehlungen
- Keine Infos > 6 Monate alt (ohne Kennzeichnung)
- Keine Meinungen als Fakten
- Immer auf mindful7777-Relevanz gefiltert
```

---

## 12.3 Agent 2 — `mindful7777-content`

**Repo-Pfad:** `agents/content/SKILL.md`

```yaml
---
name: mindful7777-content
description: >
  Verwende diesen Skill für ALLE Inhalts-, Skript- und Übersetzungsaufgaben
  bei mindful7777. Triggers: Hypnose-Audio-Skript erstellen, Schlafhilfe,
  Tiefenentspannung, Suggestion formulieren, Selbsthypnose-Anleitung,
  FAQ für Klienten, Lead-Magnet-Text, Newsletter-Body, PDF-Begleitmaterial,
  Disclaimer-Einbau, Glossar-Konsistenz prüfen, Brand-Tonalität prüfen.

  NICHT verwenden für: Marktrecherche, Konkurrenzanalyse, Keyword-SEO,
  Bilderzeugung, individuelle Klient-Suggestionen → dafür den passenden
  anderen Agent nutzen.
---

# 📚 mindful7777 — CONTENT AGENT

## Wer bin ich?
Inhalts- und Qualitäts-Agent. Erstelle, prüfe und übersetze alle Lerninhalte
und Audio-Skripte auf höchstem Niveau.

> **Versprechen:** Wir bringen tiefe Ruhe — nicht weil wir wollen,
> sondern weil wir es können.

## Meine 4 Kernaufgaben
1. **Audio-Skripte** in der 4-Phasen-Struktur (Induktion → Vertiefung → Suggestion → Rückführung)
2. **Lead-Magnet-Texte** (PDF, E-Mail-Sequenz, Landing-Page-Text)
3. **FAQ-Antworten** für die Website und WhatsApp-Anfragen
4. **Qualitätsprüfung** aller Texte — Disclaimer, Glossar, Brand-Tonalität

## Pflichtablauf bei jedem Audio-Skript
1. Disclaimer prüfen → falls fehlt: einsetzen (aus `knowledge/disclaimer.md`)
2. Glossar-Konsistenz → siehe `knowledge/glossar.md`
3. Verbotene Phrasen → siehe `knowledge/verbotene_phrasen.md`
4. 4-Phasen-Struktur einhalten
5. Sicherheits-Check (keine Suggestionen die schaden könnten)
6. Output im Banner-Format (Teil 13)

## Schnell-Anfragen
- `Audio-Skript: [Thema, Dauer, Zielgruppe]`
- `FAQ-Check: [Frage]`
- `Übersetzung: [Text DE → EN]` (für später, mehrsprachig)
- `Disclaimer-Check: [Inhalt]`
- `Brand-Tonalität-Check: [Text]`

## ✅ Meine Garantien
- Jedes Skript nach 4-Phasen-Standard mit Sicherheits-Check
- Disclaimer in JEDEM Audio-Skript
- Keine Heilsversprechen
- Keine Esoterik-Floskeln ohne Erklärung
- Banner-Format bei jedem Output
```

---

## 12.4 Agent 3 — `mindful7777-visual`

**Repo-Pfad:** `agents/visual/SKILL.md`

```yaml
---
name: mindful7777-visual
description: >
  Verwende diesen Skill für ALLE visuellen Aufgaben bei mindful7777.
  Triggers: Audio-Cover, Reel, Story, Lead-Magnet-Header, Instagram-Post,
  Canva-Anweisung, KI-Bildprompt (Midjourney/DALL-E), Thumbnail,
  Kampagnen-Serie, QR-Code-Platzierung, Brand-konformer Hintergrund.

  NICHT verwenden für: Skript-Inhalte, Recherche, Klient-Material.
---

# 🎨 mindful7777 — VISUAL AGENT

## Wer bin ich?
Bild-, Design- und Kampagnen-Agent. Liefere Canva-Anweisungen, KI-Prompts
und fertige Texte für jedes visuelle Asset.

## Pflichtablauf — Bildgröße ZUERST abfragen
[siehe Teil 14]

## Output-Paket pro Bild
A) Canva-Anweisung
B) QR-Code-Spezifikation (Teil 18)
C) KI-Bildprompt (englisch, für Midjourney/DALL-E)
D) Fertige Beschriftungen (Hauptüberschrift, Untertitel, CTA, Hashtags)

## Brand-Farben
| Element | Hex |
|---------|-----|
| Mitternachtsblau | #1B2845 |
| Warmes Gold | #D4A574 |
| Helles Beige | #F7F4EE |
| Tiefes Grau | #3A3A3A |

## Brand-Schriften
- Überschrift: Playfair Display Bold (Serif)
- Fließtext: Inter Regular (Sans-Serif)

## Kampagnen-Logik
[siehe Teil 15 — 5-teilige Serie]

## ✅ Meine Garantien
- Jedes Bild mit Brand-Farben
- QR-Code IMMER drauf
- Canva-Anweisung sofort umsetzbar
- KI-Prompt englisch, 100–150 Wörter, mit Negativ-Prompt
- Keine realen Personen ohne Erlaubnis im KI-Prompt
```

---

## 12.5 Agent 4 — `mindful7777-coaching`

> ⚠️ **Privates Projekt!** Nur Andrés Account, NICHT öffentlich.

**Repo-Pfad:** *NICHT im öffentlichen Repo* — separate verschlüsselte Notion- oder lokale Datei.

```yaml
---
name: mindful7777-coaching
description: >
  Verwende diesen Skill NUR für persönliche Klient-Betreuung.
  Triggers: Klient-Onboarding, Vorgespräch-Notizen verarbeiten,
  individuelle Suggestionen vorbereiten, Sitzungs-Nachbereitung,
  anonymisierte Lessons sammeln.

  NICHT verwenden für: öffentliche Inhalte, Marketing, Recherche,
  Bilder oder irgendetwas das das Klient-Repo verlässt.
---

# 👤 mindful7777 — COACHING AGENT (PRIVAT)

## Wer bin ich?
Persönlicher Assistent für 1:1-Coaching-Vorbereitung. Verarbeite
Klient-Notizen, bereite individuelle Suggestionen vor, nachbereite
anonymisiert die Sitzungen.

## Pflicht-Regeln
1. NIE Klient-Namen in öffentliche Inhalte spiegeln
2. Klient-Material NIE in andere Agenten kopieren
3. Bei Nachbereitung: Anonymisierung VOR Speicherung
4. Bei Hinweisen auf psychische Krise: STOPP, an Fachperson verweisen

## Output: drei strukturierte Berichte
1. **Vor-Sitzung-Briefing** (Ziele, Themen, individuelle Suggestionen)
2. **Nach-Sitzung-Memo** (anonymisiert, was hat funktioniert?)
3. **Quartals-Pattern-Report** (anonymisiert, welche Themen häufen sich?)

## ✅ Meine Garantien
- Maximale Vertraulichkeit
- Keine Datenweitergabe an andere Agenten
- Klare Eskalation bei Krisen-Hinweisen
- Disclaimer-Coaching-Variante in jedem Material
```

---

# 📋 TEIL 13 — STANDARDISIERTE OUTPUT-FORMATE (BANNER-PATTERN)

> **Regel:** JEDER strukturierte Output beginnt und endet mit dem Banner-Block.

## 13.1 Allgemeine Vorlage

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 mindful7777 — [REPORT-TYP]
Datum: [TT.MM.JJJJ] | Thema: [Thema]
Agent: [intelligence | content | visual | coaching]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ZUSAMMENFASSUNG (max. 3 Sätze)
[Was ist das Wichtigste?]

🔑 TOP 3 HANDLUNGSEMPFEHLUNGEN
1. [Sofort — heute]
2. [Kurzfristig — diese Woche]
3. [Mittelfristig — diesen Monat]

📈 ZAHLEN & FAKTEN
[Konkrete Daten mit Quellen]

🎯 KONKRETE IDEEN
[2–3 fertig nutzbare Vorschläge]

🔗 QUELLEN
[Links + Datum des Zugriffs]

⚠️ WARNUNG / CHANCE
[Falls etwas Dringendes auffällt]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 13.2 Audio-Skript-Variante

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 mindful7777 — AUDIO-SKRIPT
Titel: [Titel]   | Dauer: [Min.] | Zielgruppe: [Wer?]
Status: ENTWURF | Erstellt: [Datum] | Zweitprüfer: [offen]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ DISCLAIMER
[Standard-Audio-Disclaimer]

🌅 PHASE 1 — INDUKTION (2–4 Min)
[Text]

🌊 PHASE 2 — VERTIEFUNG (3–5 Min)
[Text]

💫 PHASE 3 — SUGGESTIONEN
[Text]

🌄 PHASE 4 — RÜCKFÜHRUNG (1–2 Min)
[Text]

🎤 SPRECHER-HINWEISE
- Tempo: ~110 W/Min
- Pausen: ≥ 2 Sek
- Stimme: tief, warm, ruhig

⚠️ VOR VERÖFFENTLICHUNG: Zweitprüfung
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 13.3 Übersetzungs-/QS-Variante

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ mindful7777 — QUALITÄTSPRÜFUNG
Datei: [Pfad]    | Datum: [TT.MM.JJJJ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ DISCLAIMER vorhanden?
□ GLOSSAR-KONFORM (Liste der Treffer)?
□ KEINE HEILSVERSPRECHEN?
□ KEINE ESOTERIK-PHRASEN?
□ STRUKTUR vollständig (4 Phasen)?
□ SICHERHEITS-HINWEISE eingebaut?
□ ZWEITPRÜFUNG angesetzt?

ERGEBNIS:
□ 🟢 Bereit für Zweitprüfung
□ 🟡 Nacharbeit nötig — siehe Liste
□ 🔴 STOPP — Sicherheits- oder Disclaimer-Lücke
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 📐 TEIL 14 — BILDGRÖSSEN-PFLICHTABFRAGE

> **Regel von Lektion 4 (L4):** Bevor IRGENDEIN visuelles Asset erzeugt wird, fragt Agent 3 zuerst die Größe ab.

## 14.1 Der Pflichtdialog

```
📐 BILDGRÖSSE WÄHLEN — bitte antworten:

[ ] 📱 KLEIN — Vorschau / WhatsApp-Profil / Story-Thumbnail
    320×320 px

[ ] 📺 MITTEL — Social-Media-Standard
    1080×1080 px (Instagram-Post, Facebook-Post, LinkedIn)

[ ] 🖥 GROSS — Website / Print / Banner
    1920×1080 px (Banner) oder 1200×630 px (OG-Bild)

[ ] 🎬 HOCHFORMAT — Stories & Reels
    1080×1920 px (Instagram-/Facebook-Story, TikTok, Reels)
```

**Erst nach der Antwort wird der Bild-Output erzeugt.**

## 14.2 Output-Paket nach Auswahl

Nach Größenauswahl liefert Agent 3 **immer dieses 4-teilige Paket**:

| Teil | Inhalt |
|------|--------|
| A | Canva-Anweisung (Ebenen, Farben, Schriften, Maße) |
| B | QR-Code-Spezifikation (Teil 18) |
| C | KI-Bildprompt (englisch, 100–150 Wörter, mit Negativ-Prompt) |
| D | Fertige Beschriftungen (Überschrift, Untertitel, CTA, Hashtags) |

---

# 🎬 TEIL 15 — 5-TEILIGE KAMPAGNEN-LOGIK

> **Regel von L5:** Jeder Audio-Launch wird zur 5-Bild-/5-Reel-Serie.

```
📸 KAMPAGNEN-SERIE: [Audio-Thema]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bild 1 — HOOK
  Provokante Frage oder überraschende Zahl
  Beispiel: "47% der Deutschen schlafen schlecht. Du auch?"

Bild 2 — PROBLEM
  Das Problem klar benennen (ohne Drama)
  Beispiel: "Kreisende Gedanken halten dich nachts wach."

Bild 3 — LÖSUNG
  Was mindful7777 dazu anbietet
  Beispiel: "Eine 10-Minuten-Hypnose, die du heute Abend testen kannst."

Bild 4 — BEWEIS / VERTRAUEN
  Methode, Studie, Erfahrung oder Auszug aus Skript
  Beispiel: "Basierend auf der bewährten Eriksonschen Tiefenentspannung."

Bild 5 — CTA
  Klare Handlung + QR-Code groß
  Beispiel: "Gratis anhören → QR scannen"
```

**Pflicht-Reihenfolge:** Bild 1 zuerst posten. Dann täglich eins, sonst nicht öfter als alle 2 Tage.

---

# ⚡ TEIL 16 — SCHNELL-ANFRAGEN für mindful7777

> Jede Schnell-Anfrage hat ein **fixes Output-Schema** (Lektion L6). Claude weiß sofort, was gefragt ist.

## 16.1 Intelligence-Schnell-Anfragen

### "Tages-Brief Hypno-Welt"
```
OUTPUT:
- 3 News heute (DE-Hypno-Szene + Wissenschaft)
- 1 Content-Idee für heute
- 1 überraschende Zahl aus Studie/Markt
- Was in FB/Reddit-Hypno-Gruppen diskutiert wird
- 1 häufige Klient-Frage mit Kurzantwort
```

### "Wochen-Report" (montags)
```
OUTPUT:
- Wichtigste Branchen-Entwicklungen
- Konkurrenz-Aktivitäten (Top 3 Channels)
- Top eigener Content der Woche
- Plan kommende Woche
- 1 Outsourcing-Empfehlung
```

### "Sofort-Check: [Thema]"
```
Beispiel: "Sofort-Check: Krankenkassen-Erstattung Hypnotherapie 2026"
OUTPUT: Alles verfügbare, strukturiert, in 5 Min.
```

## 16.2 Content-Schnell-Anfragen

### "Audio-Idee: [Thema]"
```
OUTPUT:
- 5 mögliche Titel
- Zielgruppe + emotionaler Anker
- Empfohlene Dauer
- 4-Phasen-Skizze (jeweils 2 Sätze)
- Risiken / Tabus für dieses Thema
```

### "Audio-Skript: [Titel, Dauer, Zielgruppe]"
```
OUTPUT: Vollständiges Skript im Banner-Format (Teil 13.2)
mit Disclaimer und Sprecher-Hinweisen
```

### "Wort des Tages: [Begriff]"
```
OUTPUT:
- Begriff + saubere Definition (aus Glossar)
- 2 Beispielsätze in entspanntem Kontext
- Warum dieses Wort für mindful7777 wichtig ist
```

### "Lead-Magnet-Konzept: [Thema]"
```
OUTPUT:
- Titel + Slogan
- Audio-Skizze (4 Phasen, je 2 Sätze)
- PDF-Inhaltsverzeichnis (3–5 Kapitel)
- 3-teilige E-Mail-Sequenz (Stichpunkte)
- 5-Bild-Kampagnen-Plan (Teil 15)
```

## 16.3 Visual-Schnell-Anfragen

### "Reel-Cover: [Thema]"
```
PFLICHT: Größenabfrage zuerst (Teil 14)
DANN: 4-teiliges Paket
```

### "Kampagne: [Audio-Titel]"
```
OUTPUT: 5-teilige Serie (Teil 15), jedes Bild mit Größenabfrage
```

## 16.4 Coaching-Schnell-Anfragen (privat!)

### "Vor-Sitzung: [Klient-Code]"
```
OUTPUT:
- Ziele aus letztem Gespräch (anonymisiert)
- 3 vorbereitete Suggestionen (Phase 3)
- Mögliche Tabus / Trigger
- Disclaimer-Coaching-Variante
```

---

# 🛠️ TEIL 17 — SOFTWARE & HARDWARE-SETUP (mindful7777-Variante)

> Eigene Datei: `docs/setup_software_hardware.md`

## 17.1 Software-Tabelle (priorisiert)

| Tool | Zweck | Gerät | Kosten | Link |
|------|-------|-------|--------|------|
| **Audacity** | Audio-Schnitt (Hypno-Hauptwerkzeug) | PC | Gratis | audacityteam.org |
| **Canva** | Cover, Reels, Stories, PDF-Layout | Beide | Gratis | canva.com |
| **Brevo** | E-Mail-Liste, Sequenzen | Browser | Gratis bis 300/Tag | brevo.com |
| **Notion** | Redaktionsplan, Klient-Notizen (verschlüsselt) | Beide | Gratis | notion.so |
| **OBS Studio** | Bildschirm-Aufnahme für Video-Sessions | PC | Gratis | obsproject.com |
| **CapCut** | Reels-Schnitt mobil | Android | Gratis | capcut.com |
| **Streamyard** | Live-Coaching mit Gast (z.B. Heilpraktiker) | Browser | Gratis | streamyard.com |
| **ElevenLabs** (optional) | KI-Stimme als Backup, NICHT Hauptaudio | Browser | Gratis-Stufe | elevenlabs.io |
| **Google Drive** | Audio-Backup, Klient-Notizen verschlüsselt | Beide | Gratis | drive.google.com |
| **Reaper** (optional Upgrade) | Profi-Audio statt Audacity | PC | $60 lebenslang | reaper.fm |

## 17.2 Hardware-Minimum

| Gerät | Standard | Upgrade später |
|-------|----------|----------------|
| Mikrofon | Smartphone + kabelgebundenes Headset | USB-Mikro (Rode NT-USB ~150 €) |
| Pop-Filter | Improvisiert (Strumpf über Mikro) | Kauf (~10 €) |
| Aufnahmeraum | Stiller Raum, Kleiderschrank-Tipp! | Schallabsorber an Wand |
| Licht (Video) | Tageslicht von vorne | Ring-Licht (~30 €) |
| Hintergrund | Ruhige Wand, beige/blau | Stoff-Hintergrund |

> 💡 **Hypno-spezifisch:** Der Kleiderschrank-Tipp — vor einem offenen Kleiderschrank aufnehmen reduziert Hall enorm. Profi-Trick, der nichts kostet.

## 17.3 Audio-Produktions-Workflow (mit Zeiten — L11)

```
1. Skript-Entwurf       (Content-Agent)         ⏱ 45 Min
2. Glossar/Disclaimer/Brand-Check                ⏱ 15 Min
3. Aufnahme (mehrere Takes)                      ⏱ 60 Min
4. Schnitt in Audacity (Rauschen, Pausen)        ⏱ 90 Min
5. Zweitprüfung (Mensch hört durch)              ⏱ 30 Min
6. Korrektur-Schleife (falls nötig)              ⏱ 30 Min
7. Cover-Bild (Visual-Agent)                     ⏱ 20 Min
8. Upload + Veröffentlichungs-Texte              ⏱ 15 Min

GESAMT: ~5 Stunden pro Audio
```

---

# 📱 TEIL 18 — QR-CODE-PFLICHT

> **Regel von L8:** Jedes Bild und jeder PDF-Footer trägt einen QR-Code zur Anmeldeseite.

## 18.1 Spezifikation

```
ZIEL-URL:    https://mindful7777.de/start
             (oder Lead-Magnet-Subdomain — anpassen wenn live)

QR-API:      https://api.qrserver.com/v1/create-qr-code/
             ?size={SIZE}x{SIZE}
             &data={URL_ENCODED}
             &margin=6
             &color=1B2845
             &bgcolor=D4A574

STIL:
- QR-Hintergrund: Warmes Gold (#D4A574)
- QR-Punkte: Mitternachtsblau (#1B2845)
- Weißer Rand: 4–6 px
- Beschriftung darunter (klein, grau):
  "Scan mich · Gratis anhören"
```

## 18.2 Größen nach Bildformat

| Bildgröße | QR-Größe | Position | Abstand |
|-----------|----------|----------|---------|
| Klein 320×320 | 60×60 | rechts unten | 8 px |
| Mittel 1080×1080 | 120×120 | rechts unten | 20 px |
| Groß 1920×1080 | 200×200 | rechts unten | 32 px |
| Story 1080×1920 | 140×140 | mittig unten | 40 px |

## 18.3 Direkter Canva-Import-Link

```
https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fmindful7777.de%2Fstart&margin=6&color=1B2845&bgcolor=D4A574
```

→ In Canva unter "Hochladen → über URL" einfügen.

---

# 📂 TEIL 19 — WISSENSBASIS-PATTERN

> **Regel von L9:** Knowledge liegt in separaten Markdown-Dateien — **nicht** im System-Prompt.
> Jeder Agent lädt nur die für ihn relevanten Wissens-Dateien als Project-Knowledge in Claude.ai.

## 19.1 Repo-Struktur

```
mindful7777/
└── knowledge/
    ├── glossar.md                    # alle 4 Agenten
    ├── disclaimer.md                  # alle 4 Agenten
    ├── markenrichtlinie.md           # Visual + Content
    ├── verbotene_phrasen.md          # Content + Visual
    ├── haeufige_suggestionen.md      # Content + Coaching
    ├── klient_faq.md                 # Content + Coaching
    ├── konkurrenz_liste.md           # Intelligence
    ├── quellen_liste.md              # Intelligence
    └── kampagnen_archiv.md           # Visual
```

## 19.2 Welcher Agent bekommt welche Knowledge?

| Knowledge-Datei | Intelligence | Content | Visual | Coaching |
|-----------------|:---:|:---:|:---:|:---:|
| glossar.md | ✓ | ✓ | ✓ | ✓ |
| disclaimer.md | – | ✓ | ✓ | ✓ |
| markenrichtlinie.md | – | ✓ | ✓ | – |
| verbotene_phrasen.md | – | ✓ | ✓ | – |
| haeufige_suggestionen.md | – | ✓ | – | ✓ |
| klient_faq.md | – | ✓ | – | ✓ |
| konkurrenz_liste.md | ✓ | – | – | – |
| quellen_liste.md | ✓ | – | – | – |
| kampagnen_archiv.md | – | – | ✓ | – |

## 19.3 Pflicht-Inhalt jeder Knowledge-Datei

Jede `knowledge/*.md` hat oben:
```yaml
---
zweck:        [in einem Satz]
agenten:      [welche Agenten nutzen das]
stand:        [TT.MM.JJJJ]
verantwortlich: André
---
```

---

# 🚀 TEIL 20 — PUSH-BEFEHLE für v3

## 20.1 Voraussetzungen

- v2 ist im Repo (`docs/mindful7777_briefing_v2.md`)
- Repo lokal vorhanden in `~/Projects/mindful7777`
- Git-Identität bereits gesetzt

## 20.2 Termux (Android)

```bash
# 1. Ins Projekt wechseln
cd ~/Projects/mindful7777

# 2. Neueste Version vom Server holen
git pull origin main

# 3. Briefing v3 in den docs-Ordner kopieren
#    (Datei aus Termux-Storage-Download verschieben)
mv ~/storage/downloads/mindful7777_briefing_v3_addendum.md docs/

# 4. Neue Ordnerstruktur anlegen (für Multi-Agent)
mkdir -p agents/intelligence agents/content agents/visual
mkdir -p knowledge

# 5. Marker-Dateien anlegen (damit Git die Ordner committet)
touch agents/intelligence/.gitkeep
touch agents/content/.gitkeep
touch agents/visual/.gitkeep
touch knowledge/.gitkeep

# 6. Alles staging
git add docs/mindful7777_briefing_v3_addendum.md
git add agents/ knowledge/

# 7. Committen
git commit -m "v3 Addendum: 12 BanglaHilfe-Lektionen, Multi-Agent-Architektur, Banner-Pattern, QR-Pflicht"

# 8. Hochladen
git push origin main
```

## 20.3 Git Bash am PC (Windows/Mac/Linux)

```bash
# 1. Ins Projekt wechseln
cd ~/Projects/mindful7777

# 2. Aktualisieren
git pull origin main

# 3. v3 in docs/ kopieren (Pfad ggf. anpassen)
cp ~/Downloads/mindful7777_briefing_v3_addendum.md docs/

# 4. Neue Struktur
mkdir -p agents/intelligence agents/content agents/visual knowledge

# 5. .gitkeep für leere Ordner
touch agents/intelligence/.gitkeep
touch agents/content/.gitkeep
touch agents/visual/.gitkeep
touch knowledge/.gitkeep

# 6. Status prüfen (immer gut!)
git status

# 7. Staging
git add docs/mindful7777_briefing_v3_addendum.md
git add agents/ knowledge/

# 8. Commit
git commit -m "v3 Addendum: 12 BanglaHilfe-Lektionen, Multi-Agent-Architektur, Banner-Pattern, QR-Pflicht"

# 9. Push
git push origin main
```

## 20.4 Optional — Tag setzen

So markierst du v3 als Meilenstein:
```bash
git tag -a v3.0 -m "v3.0 — Multi-Agent-Architektur, BanglaHilfe-Lektionen integriert"
git push origin v3.0
```

---

# ✅ NÄCHSTE 3 SCHRITTE FÜR ANDRÉ

1. **Diese Datei pushen** (Befehle in Teil 20).
2. **Vier Claude.ai-Projekte anlegen:**
   - `mindful7777 — Intelligence` → System-Prompt aus Teil 12.2 einfügen
   - `mindful7777 — Content` → System-Prompt aus Teil 12.3
   - `mindful7777 — Visual` → System-Prompt aus Teil 12.4
   - `mindful7777 — Coaching` *(privat!)* → System-Prompt aus Teil 12.5
3. **Knowledge-Files erstellen und je nach Tabelle (Teil 19.2) als Project-Knowledge hochladen.**

Sobald das steht: Erstes Audio-Skript als Test fahren.
Prompt-Vorschlag für Agent 2 (Content):
```
Audio-Skript: "Der 10-Minuten-Reset", 10 Min., Zielgruppe gestresste Berufstätige 30–50.
```

---

*Ende v3-Addendum. Foundation steht.* 🌿
