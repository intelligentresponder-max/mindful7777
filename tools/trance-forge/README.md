# TranceForge

Sprach-zu-Trance-Pipeline für `mindful7777`. Du sprichst die Rohfassung ein —
das Tool erntet dein Timing, schärft den Text, rendert ihn mit deiner geklonten
Stimme und mischt eine fertige Session.

Kein Build-Schritt. Reine ES-Module, läuft direkt auf GitHub Pages neben den
übrigen Seiten des Repos.

---

## Die drei Entscheidungen, auf denen alles steht

**1. Stille wird selbst erzeugt, nie vom Modell erbeten.**
TTS-Modelle sind auf Alltagssprache trainiert und kürzen lange Pausen praktisch
immer ab — genau die Pausen, die in einer Session die Wirkung tragen. Der
Compiler rendert deshalb nur die Sprachblöcke und setzt die Stille im
Web-Audio-Mixdown als echten Nullpuffer ein. Exakt, reproduzierbar, und es
kostet kein einziges TTS-Zeichen.

**2. Dein Timing überlebt die Umwandlung.**
Beim Einsprechen setzt du die Pausen bereits richtig. Ein gewöhnliches
Transkript wirft das weg. `harvest.js` liest die Lücken aus den Wortzeitstempeln
und schreibt sie als `[n]`-Marker zurück in den Text. Nebenbei misst es deine
Sprechrate, damit die Laufzeitschätzung im Editor auf deine Stimme passt statt
auf einen Durchschnitt.

**3. Segmente werden sequenziell gerendert, nicht parallel.**
Der Anbieter kann jede Anfrage auf die vorherige konditionieren
(`previous_request_ids`). Das hält Klangfarbe und Sprechhaltung über
Segmentgrenzen stabil. Bei einer 20-Minuten-Session in 150 Stücken ist das der
Unterschied zwischen einer Session und einer Aneinanderreihung von Clips. Die
Kette braucht das fertige Ergebnis des Vorgängers — Parallelisierung fällt
damit weg, und der Zeitverlust ist den Gewinn wert.

---

## Aufbau

```
trance-forge/
├── index.html            App-Shell, alle Screens
├── css/                  tokens.css (aus theta_state.svg) + app.css
├── js/
│   ├── trancescript.js   Partitur-Sprache: Parser + Compiler   ← Herzstück
│   ├── harvest.js        Timing-Ernte aus den Wortzeitstempeln
│   ├── mixdown.js        Web-Audio-Mix, Ambient-Bett, WAV-Export
│   ├── providers.js      Anbieter-Abstraktion (einziger Ort mit Anbieterwissen)
│   ├── recorder.js       Aufnahme inkl. iOS-Formataushandlung
│   ├── db.js             IndexedDB
│   └── app.js            Screens und Verdrahtung
├── prompts/refine.md     Systemprompt für den Schliff
├── worker/               Cloudflare Worker — Schlüssel-Tresor
└── VOICE_CLONING.md      Was der Klon konkret braucht
```

---

## TranceScript

| Zeichen | Bedeutung |
|---|---|
| `[4]` | 4 s Stille |
| `[4~]` | 4 s Stille, aufgerundet auf den Atemzyklus |
| `~Text~` | Tempo 0,75 |
| `~~Text~~` | Tempo 0,55 |
| `*Wort*` | Betonung |
| `//Wort//` | zweite Stimmschicht unter der Hauptstimme |
| `>>` am Zeilenanfang | Zeile startet auf dem Atemraster |
| `@phase:name` | Abschnittsmarke |
| `#anchor:name` | Ankerpassage |
| `%% Text` | Kommentar, wird nicht gesprochen |

**Atem-Sync.** Ein Raster von 5,5 s (einstellbar) läuft unsichtbar durch die
Timeline. `>>`-Zeilen und `[n~]`-Pausen rasten darauf ein. Die fertige Aufnahme
bekommt dadurch eine gleichmäßige Grundperiodik, auf die sich der Atem des
Hörers einpendeln kann — statt eines Timings, das beim Rendern zufällig
entsteht. Im Editor sind die Rasterlinien in der Timeline-Vorschau sichtbar.

**Betonung ohne Modellabhängigkeit.** `*Wort*` wird als Mikropause davor
realisiert, nicht über proprietäres Markup. Funktioniert bei jedem Anbieter und
bleibt konsistent, wenn der Anbieter wechselt.

**Tempo unter 0,7.** Der Anbieter nimmt keine niedrigeren Werte an. Statt das
Audio nachträglich zu dehnen (was leiert), bekommen `~~`-Blöcke zusätzliche
Binnenpausen. Langsamkeit entsteht in einer Trance ohnehin überwiegend aus den
Abständen.

---

## Einrichten

### 1 — Worker deployen

Ohne den Worker landen die API-Schlüssel im Browser, und wer den Client-Code
liest, verbraucht dein Kontingent.

```bash
cd worker
npm i -g wrangler
node build.mjs                       # setzt prompts/refine.md in den Worker ein
wrangler secret put TF_TOKEN         # frei wählbares Zugangstoken
wrangler secret put ELEVENLABS_KEY
wrangler secret put ANTHROPIC_KEY
wrangler deploy
```

`node build.mjs` muss vor **jedem** Deploy laufen — sonst geht eine Änderung an
`refine.md` nicht mit raus.

Optional gegen durchgelaufene Renders und geleakte Tokens: KV-Namespace anlegen
und in `wrangler.toml` als `TF_KV` binden. Dann greift das Tageslimit.

### 2 — App ausliefern

> Für den **ersten Testlauf auf dem Handy** brauchst du weder Worker noch
> Schlüssel — Aufnahme, Editor und Timeline laufen allein. Kurzanleitung:
> [ERSTER_TEST.md](ERSTER_TEST.md).

Ordner ins Repo legen, GitHub Pages zeigt darauf. Aufrufen unter
`…/tools/trance-forge/`. **HTTPS ist Pflicht** — ohne sie gibt der Browser das
Mikrofon nicht frei.

### 3 — Verbinden

In der App unter *Einstellungen* die Worker-URL und das Token eintragen,
*Testen* drücken. Der Status zeigt, welche der drei Anbieter erreichbar sind.

### 4 — Stimme klonen

Siehe [VOICE_CLONING.md](VOICE_CLONING.md). Kurzfassung: mindestens eine Minute
Referenzmaterial **in der Sprechweise, die später erzeugt werden soll**, plus
der Bestätigungssatz. Ohne Bestätigungsaufnahme wird kein Profil erzeugt —
Client und Worker prüfen beide darauf.

---

## Ablauf

1. **Aufnahme** — Rohfassung im Zieltempo einsprechen. Mehrere Takes möglich.
2. **Ernte** — transkribieren; die Pausen erscheinen als Marker im Text.
   Danach optional *Schärfen*: Diktatspuren raus, behauptende Form rein.
   Der Vorschlag kommt als Diff und wird nie still übernommen.
3. **Editor** — nachschärfen. Werkzeugleiste über der Tastatur, weil auf dem
   Handy niemand Sonderzeichen tippt. Laufzeit, Zeichenzahl und geschätzte
   Kosten laufen im Kopf mit. Einzelne Zeile mit ▶ vorhören, statt jedes Mal
   alles zu rendern.


4. **Render** — Stimme und Bett wählen, rendern. Danach die Prüfliste ansehen:
   dort steht, ob die Pausen exakt gesetzt wurden.
5. **Teilen** — über die Share-Funktion des Systems, sonst als Download.

Rohaufnahmen, Skripte und Renders bleiben im IndexedDB des Geräts. Zum Anbieter
geht nur, was der jeweilige Schritt braucht.

---

## Das Glossar

Fachbegriffe tragen Autorität — gerade bei Sportlern, die die Wörter kennen.
Aber ein Fachbegriff allein verlangt Verstehen, und Verstehen holt aus der
Trance heraus. Deshalb gilt im Schliff der **Doppelschlag**: erst der Begriff,
dann im selben Atemzug die Empfindung.

> „Dein Sympathikus fährt runter. Dein Körper schaltet um."

Der Verstand bekommt sein Futter und darf danach loslassen.

Damit das über eine Produktreihe hinweg trägt, sammelt das Tool jede
Umschreibung:

- Beim Schärfen geht das bekannte Glossar als `<glossar_bekannt>` mit. Für
  bereits erfasste Begriffe muss die vorhandene Umschreibung wortgleich
  übernommen werden.
- Neue Begriffe kommen im `<glossar>`-Block zurück und werden **erst beim
  Übernehmen** gespeichert — ein verworfener Vorschlag darf die Terminologie
  nicht verändern.
- Weicht ein Vorschlag von einer gespeicherten Umschreibung ab, wird das im Diff
  als Warnung angezeigt statt still überschrieben.
- *glossar.md exportieren* schreibt die Liste im Format des
  mindful7777-Wissensordners heraus — direkt ablegbar als
  `knowledge/glossar.md`.

Der Speicher liegt projektübergreifend: ein Begriff, eine Umschreibung, für
alle Sessions.

---

## Das Ambient-Bett

Vollständig generativ über Web Audio, keine Sample-Dateien: braunes Rauschen tief
gefiltert, zwei leicht modulierte Drones in Quinte, optional eine binaurale
Differenz im Theta-Bereich.

**Für Produkttexte:** als *Atmosphäre und Pacing-Hilfe* beschreiben. Die
Studienlage zu binauralen Beats ist gemischt, und die Session trägt sich über
Sprache und Timing. Ein Wirkversprechen, das jemand nachprüfen kann und das
nicht hält, kostet mehr Glaubwürdigkeit als der Effekt einbringt.

---

## Anbieter wechseln

Alles Anbieterwissen steckt in `worker/index.js` und `js/providers.js`. Für einen
Wechsel sind vier Funktionen anzupassen: `stt`, `tts`, `voices`, `clone`. Der
Rest — Partitur, Ernte, Mix, Editor — kennt keinen Anbieternamen.

Zwei Dinge, die ein Ersatzanbieter können muss:

- **Wortzeitstempel beim STT.** Ohne sie funktioniert die Timing-Ernte nicht,
  und die ist der halbe Sinn des Werkzeugs.
- **Konditionierung zwischen Anfragen** (Request-Stitching oder gleichwertig).
  Fehlt sie, driftet die Stimme über eine lange Session.

---

## Bekannte Grenzen

- Ein 20-Minuten-Skript sind grob 15.000 Zeichen. Der Editor zeigt die
  geschätzten Kosten im Kopf an; der Zeichenpreis liegt in
  `localStorage['tf.pricePerChar']`.
- Sequenzielles Rendern dauert. Für eine 20-Minuten-Session ist mit einigen
  Minuten zu rechnen. Das Gerät darf dabei nicht in den Ruhezustand.
- Export als WAV. Eine 20-Minuten-Session sind rund 200 MB. MP3-Encoding ist
  bewusst nicht eingebaut, um die App ohne Build-Schritt zu halten — für den
  Verkauf lohnt ein Encoding-Durchgang im DAW ohnehin.
- Ein fehlgeschlagenes Segment kippt den Render nicht. Es hinterlässt eine
  Lücke, die betroffene Zeile steht in der Ergebnisliste.
