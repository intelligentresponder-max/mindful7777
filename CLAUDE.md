# mindful7777 — Claude Code Kontext

## Brand-Regeln (KRITISCH — immer einhalten)

Niemals diese Phrasen verwenden:
- Chakren, Energie, Heilung, Schwingung, Frequenz
- Universum, Manifestation, Gesetz der Anziehung
- Seele, spirituell, göttlich, Licht und Liebe
- "öffne dein Herz", "lass los", "fühle die Energie"

Immer dieses Framing verwenden:
- Vagus-Nerv, Klassische Konditionierung (Pavlov), Brainwave-Transition
- Beta / Theta / Alpha (Hirnwellen)
- Messbar, reproduzierbar, on demand
- Protokoll, Reset, Anker, Kalibrierung

Tagline: WHY NOT? BE THE CHANGE.
Zielgruppe: High-Performer, Biohacker, Selbstoptimierer

## Design-System

```
--bg-primary:        #000000  (schwarz)
--text-primary:      #ffffff  (weiß)
--accent-gold:       #d4af37  (gold)
--accent-purple:     #9b59b6  (lila)
--watermark-opacity: 0.38
```

Gold-Spirale Watermark auf jeder Seite (favicon_spiral.png, 38% Opacity, fixed bottom-right).
Ares-Variante: #030303 bg, #ff4d00 orange, #7ee8fa ice-blue, Bebas Neue + Space Mono.

## Technisches Setup

### Geräte & Pfade
- Termux (Android): Repo unter `~/mindful7777/`, Downloads: `~/storage/shared/Download/`
- Git Bash (Windows): Repo unter `~/Projects/mindful7777/` — Achtung: Windows-Username enthält Leerzeichen (`"Holy New"`)

### Häufigster Git-Fehler
```bash
# Remote-ahead rejection → immer so lösen:
git pull origin main --rebase && git push origin main
```

### Tools
- PDF: `reportlab` (Python) → `pip install reportlab --break-system-packages`
- Audio: `ffmpeg` → `pkg install ffmpeg` (Termux)
- Animation: `matplotlib`, `numpy` → `pip install matplotlib numpy --break-system-packages`
- Bilder: `pillow` → `pip install pillow --break-system-packages`

## Repo-Struktur

```
mindful7777/
├── CLAUDE.md              ← dieser Kontext (nicht deployen!)
├── index.html             ← Landing Page
├── vip/
│   ├── index.html         ← Passwort-Gate (sessionStorage)
│   ├── 7777-1.html        ← VIP Sektion 1 (Sock-Anchor Full)
│   ├── 7777-2.html        ← VIP Sektion 2 (Focus-Stack) [TODO]
│   └── ...                ← bis 7777-7
├── assets/
│   ├── favicon.svg
│   ├── favicon_spiral.png
│   └── audio/             ← MP3-Sessions
├── output/                ← generierte PDFs (gitignore!)
└── scripts/               ← Python/Bash Produktions-Skripte
```

## VIP-Passwort-System (client-side)

```javascript
// Passwort-Check auf /vip/index.html
function checkPassword() {
  const input = document.getElementById('pw-input').value;
  if (input === PASSWORD) {
    sessionStorage.setItem('vip-access', 'true');
    window.location.href = '/mindful7777/vip/7777-1.html';
  }
}
// Guard auf jeder VIP-Seite:
if (!sessionStorage.getItem('vip-access')) {
  window.location.href = '/mindful7777/vip/';
}
```

## Produkt-Links

- GitHub Pages: `https://intelligentresponder-max.github.io/mindful7777`
- Ko-fi VIP (€25/Mo): `https://ko-fi.com/mindf7777`
- Gumroad Lead Magnet: `https://mindful7777.gumroad.com/l/ucaan`
  ⚠️ Gumroad-Username = `mindful777` (nur 3 Sevens, nicht 4!)
- Discord FFM-777: Community Server

## Commit-Konventionen

```
feat:    Neue Funktion/Seite
fix:     Bugfix
style:   CSS/Design-Änderung
content: Neuer Text/Skript
audio:   Audio-Datei hinzugefügt
pdf:     PDF hinzugefügt
```

## .gitignore (wichtige Einträge)

```
output/          # generierte PDFs nicht ins Repo
*.pyc
__pycache__/
node_modules/
.DS_Store
```
