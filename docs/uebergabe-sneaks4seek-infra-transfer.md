# Übergabe: Infrastruktur von mindful7777 nach Sneaks4seek übertragen

**Stand:** 22.08.2026
**Quelle:** `intelligentresponder-max/mindful7777` (dieses Repo)
**Ziel:** `intelligentresponder-max/Sneaks4seek` — **großes S!** Klein geschrieben führt die
GitHub-Pages-URL auf 404 (steht schon so in Sneaks4seeks eigener
`UEBERGABE_SNEAKERS4SEEK.md`, gilt genauso für den Repo-Namen selbst).
**Gilt zusätzlich:** `CLAUDE.md` (mindful7777-Seite), `UEBERGABE_SNEAKERS4SEEK.md`
(Sneaks4seek-Seite, dort der aktuelle Arbeitsstand des Sneaker-Projekts)

---

## 1. Worum es hier geht — und worum nicht

Sneaks4seek ist ein eigenständiges, inhaltlich komplettes fremdes Projekt: eine
Onboarding-Seite für Sneaker-Verkäufer:innen, eigenes Google-Apps-Script-Backend,
eigenes Design (`theme.css`/`components.css`), eigene laufende Arbeit (siehe deren
`UEBERGABE_SNEAKERS4SEEK.md` — Stand dort: KI-Sneaker-Erkennung mitten im Deployment).

**Diese Übergabe transportiert keine Markeninhalte von mindful7777 dorthin.** Keine
Trance-Texte, keine ACCIO-Design-Tokens, keine Ko-fi-Links, keine Brand-Regeln aus
`CLAUDE.md`. Was übertragen wird, ist ausschließlich **wiederverwendbares
Engineering** — Dinge, die unabhängig davon funktionieren, worum es auf der Seite
inhaltlich geht.

Wenn ein Claude-Agent diese Datei liest, um die Übertragung tatsächlich
durchzuführen: **Schritt 4 unten (Sicherheitsprüfung) ist nicht optional**, auch wenn
hier "nur" ein eigener Skill kopiert wird, kein fremdes Tool wie bei
`deploy-browser-tool`s ursprünglichem Anwendungsfall.

---

## 2. Was übertragen wird

### 2.1 · `deploy-browser-tool`-Skill (der eigentliche Kern dieser Übergabe)

Liegt in diesem Repo unter `.claude/skills/deploy-browser-tool/`. Generalisierter
Ablauf, um ein fertiges Browser-Tool (HTML/CSS/JS-Ordner, kein Build-Schritt) in
`tools/<name>/` eines Repos einzuspielen — Security-Check gegen geleakte Keys,
Testsuite laufen lassen, kopieren, committen, pushen, Live-URL prüfen.

**Warum das für Sneaks4seek sofort nützlich ist:** Das Repo hat bereits einen
`tools/`-Ordner mit `tools/foto-collage.html` — genau die Konvention, auf die dieser
Skill zielt. André bekommt damit für zukünftige kleine Tools (ein Foto-Rechner, ein
Sneaker-Scanner-Prototyp, was auch immer als nächstes als eigenständige Seite dazukommt)
denselben zuverlässigen, non-technical-tauglichen Einspielweg wie bei `trance-forge`
in diesem Repo.

Enthält zusätzlich `assets/recorder.js` (fertiges, abhängigkeitsfreies
Mikrofon-Aufnahme-Modul) und `references/browser-audio-recording.md` — für
Sneaks4seek aktuell nicht offensichtlich gebraucht, aber Teil des Skill-Pakets und
schadet nicht, mitgenommen zu werden. Falls das Sneaker-Projekt nie eine
Audioaufnahme-Funktion bekommt, liegt das einfach ungenutzt da.

### 2.2 · Nur als Referenz, nicht automatisch mitkopieren

Diese zwei Stücke sind zu spezifisch für mindful7777s Setup, um sie blind
rüberzukopieren — aber falls Sneaks4seek sie später mal braucht, ist hier, wo man
nachschaut:

- **GitHub-Actions-Pages-Deploy** (`.github/workflows/deploy.yml` in diesem Repo).
  Sneaks4seek deployt Pages aktuell **nicht** über Actions, sondern über die native
  GitHub-Pages-Einstellung (Settings → Pages → Branch `main`, Root) — steht so in
  Sneaks4seeks eigenem README. Das funktioniert genauso gut für ein Repo ohne
  Build-Schritt. Es gibt keinen Grund, das umzustellen, nur weil mindful7777 es
  anders macht. `deploy-browser-tool` funktioniert mit **beiden** Deploy-Wegen
  identisch — der Skill pusht und prüft danach nur die Erreichbarkeit der URL, ihm
  ist egal, welcher Mechanismus dahinter deployt.
- **Stripe-Backend-Muster** (`stripe-api/` in diesem Repo — Vercel, serverless
  Functions, Payments/Billing/Tax). Sneaks4seek hat ein komplett anderes
  Backend-Bedürfnis (Google Apps Script für Formular + Datei-Uploads, kein
  Zahlungsfluss aktuell). Falls das Sneaker-Projekt irgendwann einen Checkout
  braucht, ist `stripe-api/README.md` in diesem Repo die Vorlage, wie so ein
  separat deploytes Backend neben einer reinen GitHub-Pages-Seite aufgebaut wird —
  aber das ist ein bewusster Zukunfts-Schritt, kein Teil dieser Übertragung.

### 2.3 · Was bewusst draußen bleibt

`CLAUDE.md` (Brand-Regeln, ACCIO-Design-System), `knowledge/` (Verbotsliste,
Markenrichtlinie, Glossar), `assets/style.css` + `assets/lang.js` (mindful7777s
eigenes Design/i18n, Sneaks4seek hat mit `theme.css`/`components.css` sein eigenes),
`tools/trance-forge/` (Hypnose-spezifisches Tool, für ein Sneaker-Onboarding
irrelevant), alle Produktseiten, Ko-fi/Stripe-Preise, VIP-Bereich. Keins davon hat
im Sneaker-Kontext eine Funktion.

---

## 3. Ausgangslage prüfen, bevor irgendwas kopiert wird

```bash
# Sicherstellen, dass es wirklich das richtige Ziel-Repo ist (großes S!)
git -C <sneaks4seek-pfad> remote get-url origin
# sollte .../Sneaks4seek(.git) enthalten, nicht .../sneaks4seek — funktioniert zwar
# per Redirect auch klein, sauberer ist es aber richtig groß, siehe deren eigene
# UEBERGABE_SNEAKERS4SEEK.md ("Learnings aus dieser Session")

# Prüfen, ob dort schon ein eigener .claude/skills/-Ordner existiert (Stand
# 22.08.2026: nein) — falls doch, nicht blind überschreiben, erst ansehen
ls <sneaks4seek-pfad>/.claude/skills/ 2>/dev/null
```

Sneaks4seeks eigene Übergabe warnt ausdrücklich: **"Nie Dateien blind
überschreiben — vor jedem Edit an bestehenden Dateien erst zeigen lassen."** Das gilt
hier genauso, auch wenn nur ein neuer Ordner dazukommt und nichts Bestehendes
angefasst wird.

---

## 4. Sicherheitsprüfung vor dem Kopieren

Auch wenn hier "nur" der eigene Skill wandert: derselbe Grundsatz wie in
`deploy-browser-tool` selbst — nichts, was nach einem Secret aussieht, darf
mitwandern.

```bash
cd .claude/skills/deploy-browser-tool
grep -rniE "elevenlabs|xi-api-key|api\.anthropic|api\.openai|sk-ant-|sk-proj-|sk-live-|sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|AKIA[0-9A-Z]{16}" . \
  && echo "STOPP — siehe Fund oben" || echo "sauber, weiter"
```

(Erwartungsgemäß sauber — der Skill selbst enthält keine Provider-Anbindung, nur
generische Anleitung plus das anbieterfreie `recorder.js`. Trotzdem: prüfen, nicht
annehmen.)

---

## 5. Einspielen

```bash
# Ziel-Repo-Pfad und Quell-Repo-Pfad je nach Umgebung anpassen
mkdir -p "<sneaks4seek-pfad>/.claude/skills"
cp -r ".claude/skills/deploy-browser-tool" "<sneaks4seek-pfad>/.claude/skills/deploy-browser-tool"

cd "<sneaks4seek-pfad>"
git add .claude/skills/deploy-browser-tool
git status --short   # nur .claude/skills/deploy-browser-tool/* darf auftauchen
git commit -m "deploy-browser-tool Skill aus mindful7777 übernommen"
git push
```

Kein `git push --force`. Bricht der Push ab (Zugangsdaten, Rechte, Branch-Konflikt):
das dem Anwender in einem Satz melden, nicht selbst raten oder erzwingen — exakt wie
in `deploy-browser-tool`s eigenen Regeln für Schritt 3.

---

## 6. Nach dem Einspielen prüfen

Der Skill triggert automatisch, sobald in einer Claude-Code-Session **innerhalb von
Sneaks4seek** etwas gesagt wird wie "spiel das Tool ins Repo ein" oder "deploy das
nach GitHub Pages". Kurzer Test: in einer neuen Session im Sneaks4seek-Repo fragen,
ob der Skill `deploy-browser-tool` in der Skill-Liste auftaucht — wenn ja, ist die
Übertragung fertig, ohne dass sonst irgendetwas am Projekt geändert wurde.

Für **jedes** Repo verfügbar statt nur für Sneaks4seek: den Ordner stattdessen nach
`~/.claude/skills/deploy-browser-tool/` kopieren (globaler, nutzerweiter
Skills-Ordner) statt in `<repo>/.claude/skills/`. Dann greift er in jedem Projekt auf
diesem Rechner, nicht nur in Sneaks4seek — praktisch, falls noch weitere Repos neben
mindful7777 und Sneaks4seek dazukommen.

---

## 7. Offene Entscheidungen — nicht selbstständig treffen

Diese drei Punkte sind bewusst nicht Teil der automatischen Übertragung, weil sie
echte Produktentscheidungen für das Sneaker-Projekt sind, keine reinen
Engineering-Fragen:

- **Stripe-Backend-Muster übernehmen?** Nur relevant, falls Sneaks4seek einen
  Zahlungsfluss bekommt. Aktuell nicht der Fall (Google Apps Script reicht für
  Formular + Upload). Vorher mit André klären, nicht vorgreifen.
- **GitHub-Actions-Pages-Deploy übernehmen?** Kein technischer Vorteil gegenüber der
  aktuellen nativen Pages-Einstellung, solange kein Build-Schritt dazukommt. Nur
  sinnvoll, falls Sneaks4seek irgendwann z. B. einen JS-Bundler oder eine
  Testsuite bekommt, die vor jedem Deploy laufen soll.
- **`trance-forge` selbst nach Sneaks4seek bringen?** Nein, außer jemand hat einen
  konkreten Anwendungsfall für Sprachaufnahme im Sneaker-Projekt genannt. Ohne
  konkreten Bedarf bleibt es, wo es ist.
