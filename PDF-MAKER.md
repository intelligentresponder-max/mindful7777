# PDF-Maker — Anleitung

Werkzeug zum Erstellen druckfertiger PDFs im mindful7777-Stil.
Eine einzige HTML-Datei, keine Installation, läuft auf Handy, Tablet und PC.

**Datei:** `mindful7777-pdf-maker.html`
**Live:** https://intelligentresponder-max.github.io/mindful7777/mindful7777-pdf-maker.html

---

## In drei Schritten zum PDF

1. Link öffnen (oder die Datei lokal im Browser)
2. Titel, Untertitel und Inhalt eintragen — die Vorschau rechts baut sich live mit auf
3. **PDF erstellen** antippen → im Druckdialog **Als PDF speichern**

Auf Android: Der Knopf öffnet den Systemdruck. Oben als Ziel „Als PDF speichern" wählen, dann das Download-Symbol.
Auf dem PC: Chrome-Druckdialog, Ziel „Als PDF speichern".

### Wichtige Druckeinstellungen

| Einstellung | Wert |
|---|---|
| Ziel | Als PDF speichern |
| Ränder | Standard (nicht „Keine") |
| Hintergrundgrafiken | **an** — sonst fehlt das Gold auf dem Deckblatt |
| Kopf-/Fußzeilen des Browsers | aus |

---

## Textformatierung

Der Inhalt wird in vereinfachtem Markdown geschrieben:

| Zeichen | Ergebnis |
|---|---|
| `# Text` | Große Überschrift |
| `## Text` | Kapitel (mit Trennlinie, erscheint im Inhaltsverzeichnis) |
| `### Text` | Zwischentitel |
| `- Text` | Aufzählung |
| `1. Text` | Nummerierte Liste |
| `> Text` | Zitat, kursiv mit goldener Linie |
| `**Text**` | Fett |
| `*Text*` | Kursiv |
| `---` | Seitenumbruch |

Leerzeile trennt Absätze. Alles andere wird als normaler Text gesetzt.

### Beispiel

```
# Einstieg

Setz dich bequem hin.

## Vorbereitung

- Handy stumm schalten
- 20 Minuten ungestörte Zeit

> Vier Sekunden ein, sechs Sekunden aus.

---

## Die Induktion

Zähle von **zehn** rückwärts.
```

---

## Optionen

- **Deckblatt** — Titelseite mit Theta-Ring und 7777-Signet, Untertitel und Markenzeile
- **Inhaltsverzeichnis** — wird automatisch aus allen `##`-Kapiteln gebaut, auf eigener Seite
- **Fußzeile** — Markenname am Ende des Dokuments
- **Format** — A4 für Arbeitsblätter und Protokolle, A5 für E-Books
- **Fußzeile-Feld** — steuert Deckblatt-Markenzeile und Fußzeile gleichzeitig
- Anzeige unten rechts: Wörter und geschätzte Seitenzahl

---

## PDF im Blog veröffentlichen

1. PDF im Tool erstellen und speichern
2. Im Repo `Add file → Upload files`, PDF in den Ordner `downloads/` legen
3. In `00-blog-index.html` den auskommentierten PDF-Block im Bereich „Extras" kopieren, Dateiname und Titel eintragen, Kommentarzeichen entfernen
4. Datei mit gleichem Namen hochladen — GitHub ersetzt die alte Version

---

## Wenn etwas nicht stimmt

**Schrift sieht falsch aus** — die Schriften kommen von Google Fonts, also Internetverbindung nötig. Offline greift die Ersatzschrift, das PDF bleibt trotzdem brauchbar.

**Deckblatt ohne Gold** — Hintergrundgrafiken im Druckdialog aktivieren.

**Seitenumbruch an falscher Stelle** — `---` in einer eigenen Zeile setzen, mit Leerzeilen davor und danach.

**Inhalt weg nach Neuladen** — das Tool speichert nichts. Längere Texte vorher woanders schreiben und hineinkopieren.

**Bilder** — werden aktuell nicht unterstützt. Bei Bedarf erweiterbar.

---

## Technisch

Eine eigenständige HTML-Datei, kein Build, keine Abhängigkeiten außer den Webfonts.
Die PDF-Erzeugung übernimmt die Druckfunktion des Browsers über eine `@media print`-Regel;
der Bedienbereich wird dabei ausgeblendet, gedruckt wird nur das Dokument.

Farben: Gold `#c9a24a`, Theta-Türkis `#5f8f92`, Papier `#fbf9f4`.
Schriften: Cormorant Garamond (Überschriften), Inter (Fließtext).
