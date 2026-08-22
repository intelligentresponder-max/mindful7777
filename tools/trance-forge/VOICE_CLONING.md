# Der Stimmklon: was er wirklich braucht

Stand August 2026. Anbieterangaben ändern sich — vor dem Aufnahmetag kurz gegenprüfen.

---

## Zwei Wege, und du brauchst beide

| | Instant (IVC) | Professional (PVC) |
|---|---|---|
| Material | 1–2 Minuten, nicht über 3 | mindestens 30 Min., ideal 2–3 Stunden |
| Verfügbar ab | Starter-Tarif | Creator-Tarif |
| Bereit in | unter einer Minute | Fine-Tuning dauert Wochen |
| Prüfung | Einwilligung bestätigen | Voice-Captcha im Interface |
| Qualität | gut, hörbar synthetisch bei langen Texten | trägt eine 20-Minuten-Session |

**Praktischer Plan:** Heute IVC anlegen und damit arbeiten. Parallel das
PVC-Material aufnehmen und einreichen. Bei ElevenLabs lag die Fine-Tuning-Dauer
für PVC Anfang 2026 im Bereich mehrerer Wochen — wer erst kurz vor dem
Produktstart einreicht, wartet.

---

## Aufnahmebedingungen

**Format.** MP3 ab 192 kbps genügt. WAV bringt kaum etwas — die Aufnahmequalität
entscheidet, nicht der Container. Wer im Browser aufnimmt: TranceForge handelt
das Format selbst aus (auf dem iPhone `audio/mp4`, sonst Opus) und schaltet
Echo-Unterdrückung, Rauschfilter und Auto-Gain ab. Diese Filter sind auf
Telefonie optimiert und zerstören genau das, was hier gebraucht wird.

**Raum.** Kein Hall. Ein Raum mit Teppich, Vorhängen und einem Bett ist besser
als jedes Büro. Notfalls im Kleiderschrank.

**Mikrofon.** Ein einfaches USB-Kondensatormikrofon schlägt jedes Handy-Mikro
deutlich. 20 cm Abstand, leicht seitlich, mit Poppschutz.

**Ein Sprecher, gleichbleibender Pegel.** Keine zweite Stimme im Hintergrund,
keine Lautstärkesprünge zwischen Takes.

---

## Der Punkt, an dem die meisten scheitern

**Nimm die Referenz in der Sprechweise auf, die später erzeugt werden soll.**

Ein Klon lernt nicht nur die Klangfarbe, sondern die Sprechhaltung: Tempo,
Tonhöhenverlauf, Satzmelodie, wie weit du am Satzende abfällst. Wer die
Referenz in normalem Alltagstempo einspricht und danach eine ruhige, tiefe
Trance-Session erzeugen will, bekommt eine Stimme, die klingt wie er — aber
falsch spricht. Das fällt sofort auf und lässt sich später nicht korrigieren.

Also: ruhig, tief, langsam, fallende Satzmelodie. Genau wie in der Session.
TranceForge gibt dafür zehn Passagen aus echtem Sessionmaterial vor.

**Zweiter Fallstrick, der aus derselben Sache folgt:** Der Anbieter empfiehlt
für Referenzmaterial ausdrücklich *keine* extrem langen Stillen. Eine
Trance-Session lebt aber von Fünf-Sekunden-Pausen. Beides zusammen heißt: In den
Referenzaufnahmen sprichst du langsam **durch**, ohne die langen Pausen. Die
Pausen macht später der Compiler — exakt und ohne ein einziges TTS-Zeichen zu
kosten. Deshalb enthalten die Referenzpassagen im Tool keine Pausenmarker.

---

## Die Bestätigung

Beide Wege verlangen, dass du die Rechte an der Stimme bestätigst; PVC zusätzlich
über eine Aufnahme direkt im Interface des Anbieters.

Für die Aufnahme gilt: **gleiches Mikrofon, gleicher Raum, gleiche
Sprechweise** wie beim Referenzmaterial. Schlägt die Prüfung fehl, ist der
nächste Versuch erst nach 24 Stunden möglich — es lohnt also, das nicht
nebenbei zu machen.

TranceForge nimmt zusätzlich einen eigenen Challenge-Satz mit auf und legt ihn
samt Zeitstempel im Profil ab (`consent_recorded_at`, `challenge_phrase`,
`challenge_audio`). Client und Worker prüfen beide darauf; eine Prüfung, die nur
im Browser läuft, ist keine Prüfung. Damit ist im Zweifel belegbar, dass das
Profil aus deiner eigenen Stimme entstanden ist.

Das ist kein Formalismus: Fremde Stimmen ohne dokumentierte Erlaubnis zu klonen
verstößt gegen die Nutzungsbedingungen jedes seriösen Anbieters und kann
rechtliche Folgen haben.

---

## Materialplan für 3 Stunden

Drei Stunden am Stück sind unrealistisch und klingen am Ende auch nicht mehr
gleich. Besser über mehrere Tage, immer zur selben Tageszeit und mit
identischem Aufbau:

| Block | Inhalt | Dauer |
|---|---|---|
| 1 | Die zehn Referenzpassagen im Tool, zweimal durch | ~12 Min. |
| 2 | Ein vollständiges Sessionskript vorlesen, ohne die langen Pausen | ~15 Min. |
| 3 | Zählsequenzen 10→1 in mehreren Varianten | ~8 Min. |
| 4 | Freies Sprechen über ein ruhiges Thema, gleiche Sprechweise | ~20 Min. |
| 5 | Fachbegriffe einzeln und im Satz: Sympathikus, Proteinsynthese, Glykogen, Vasodilatation, Regeneration | ~5 Min. |

Block 5 lohnt sich besonders: Fremdwörter und Anglizismen sind die Stellen, an
denen deutsche TTS-Stimmen typischerweise stolpern.

Sechs bis acht solcher Durchgänge ergeben rund drei Stunden.

---

## Prüfen, bevor du einreichst

TranceForge misst jeden Take automatisch (`recorder.js → inspect`) und warnt bei:

- **Übersteuerung** — Spitzenpegel über 0,99. Nicht reparierbar, neu aufnehmen.
- **Zu leise** — RMS unter etwa −38 dB. Der Anbieter hebt an und hebt das
  Grundrauschen mit.
- **Zu viel Stille** — über 45 % des Takes. Siehe oben: durchsprechen.

---

## Wenn der Klon fertig ist

Vor dem ersten Verkaufsprodukt einmal gegenhören: dieselbe Passage aus dem
Referenzmaterial synthetisieren und mit dem Original vergleichen. Achte weniger
auf die Klangfarbe — die stimmt meist sofort — als auf **Satzmelodie am
Satzende** und auf **Fremdwörter**. Beides sind die Stellen, an denen ein Klon
verrät, dass er einer ist.

Für die Session-Einstellungen: hohe Stabilität (etwa 0,72), hohe Ähnlichkeit
(0,85), Ausdrucksstil nahe null. Ausdrucksvarianz ist bei einer Trance ein
Fehler, keine Qualität — die Stimme soll über zwanzig Minuten gleich bleiben.
