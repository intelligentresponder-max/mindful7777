# Erstes Testaudio auf dem Samsung

Aufnahme, Editor und Timeline brauchen **keinen API-Schlüssel**. Du kannst
sofort testen — Worker und Stimmklon kommen später.

Was du zum Testen brauchst: HTTPS. Android Chrome gibt das Mikrofon über
`http://192.168.x.x` nicht frei, egal wie oft man auf Erlauben tippt.

---

## Der schnellste Weg: GitHub Pages

Das Repo liefert bereits über Pages aus, also ist HTTPS schon da.

```bash
# Ordner ins Repo legen (Pfad hat Leerzeichen — Anführungszeichen nicht vergessen)
cp -r "Holy New Downloads/trance-forge" /pfad/zu/mindful7777/tools/

cd /pfad/zu/mindful7777
git add tools/trance-forge
git commit -m "TranceForge: Partitur-Pipeline"
git push
```

Nach ein bis zwei Minuten auf dem Handy öffnen:

```
https://<dein-pages-host>/tools/trance-forge/
```

Dann Chrome-Menü → **Zum Startbildschirm hinzufügen**. Läuft danach als eigene
App im Vollbild, ohne Adressleiste — und der Service Worker hält Editor und
Timeline offline verfügbar.

**Falls das Repo privat ist** oder du nicht pushen willst: `cloudflared tunnel
--url http://localhost:8080` gibt dir eine HTTPS-Adresse auf einen lokalen
Server. Funktioniert genauso, ist aber pro Sitzung eine neue URL.

---

## Der erste Take

1. **Aufnahme** öffnen → *Mikrofon aktivieren*. Der Hinweis darunter zeigt, welches
   Format ausgehandelt wurde — auf Android sollte dort `audio/webm;codecs=opus`
   stehen.
2. Großen roten Knopf drücken. Die Ringe sind der Pegel: **drei bis vier von fünf**
   sind richtig. Werden sie rot, übersteuerst du — Abstand vergrößern.
3. Sprich eine kurze Passage im Zieltempo, **mit** den Pausen. Zwei, drei Sätze
   reichen für den ersten Test.
4. Erneut drücken zum Beenden. Der Take erscheint in der Liste.
5. **⤓ antippen** → der Rohtake geht über das Android-Teilen-Menü raus. Damit
   kannst du am großen Rechner mit Kopfhörern gegenhören: Rauschen, Hall,
   Pegel. Das ist die einzige Prüfung, die vor dem Klonen wirklich zählt.

Der Bildschirm bleibt während der Aufnahme an (Wake Lock). Sollte Android das
im Akkusparmodus verweigern, tippt man den Bildschirm zwischendurch einmal an.

---

## Was jetzt schon funktioniert

| | ohne Schlüssel | braucht Worker |
|---|---|---|
| Aufnahme, Pegel, Takes | ✓ | |
| Take exportieren | ✓ | |
| Editor mit Syntax und Timeline | ✓ | |
| Laufzeit, Zeichen, Atemraster | ✓ | |
| Offline nach erstem Laden | ✓ | |
| Transkription + Timing-Ernte | | ✓ |
| Schärfen + Glossar | | ✓ |
| Stimmklon, Render | | ✓ |

---

## Samsung-Eigenheiten

**Samsung Internet statt Chrome.** Funktioniert, aber Chrome ist der besser
getestete Pfad für MediaRecorder. Beim ersten Test Chrome nehmen.

**Bluetooth-Kopfhörer beim Aufnehmen abschalten.** Android schaltet das Mikrofon
sonst auf das Headset-Mikro mit 8 kHz Telefonqualität. Für Referenzmaterial
unbrauchbar.

**Akkusparmodus aus**, solange du aufnimmst.

**Nicht das Handy-Mikro für den Stimmklon nehmen.** Für den ersten Test reicht
es, für das Referenzmaterial nicht — siehe `VOICE_CLONING.md`. Ein einfaches
USB-Mikro am PC ist dafür deutlich besser, und die Aufnahmen lassen sich später
genauso einspielen.

---

## Wenn etwas nicht geht

**„Kein sicherer Kontext"** unter dem Mikrofon-Knopf → du bist auf `http://`.
Siehe oben.

**Mikrofon-Dialog kommt nicht** → Chrome-Einstellungen → Website-Einstellungen →
Mikrofon → die Seite auf *Zulassen* setzen. Android merkt sich eine einmalige
Ablehnung.

**Take ist stumm** → meist hatte eine andere App das Mikrofon noch belegt
(Sprachrekorder, Telefonie, Kamera). App schließen, Seite neu laden.

**Pegel bleibt bei einem Ring** → Sprich lauter oder geh näher ran. Die Filter
sind absichtlich aus, deshalb regelt nichts automatisch nach; das ist gewollt.

---

## Danach

Wenn der erste Take gut klingt, ist der nächste Schritt der Worker — erst dann
lässt sich transkribieren und die Timing-Ernte ausprobieren. Anleitung steht in
`README.md`, Abschnitt *Einrichten*.

Vorher kannst du am PC einmal `node test/timeline.test.mjs` laufen lassen. 26
Prüfungen auf Partitur und Timing, keine Abhängigkeiten, zwei Sekunden.
