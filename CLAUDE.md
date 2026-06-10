# mindful7777 — Claude Code Kontext v2

## Brand-Regeln (KRITISCH — bei jedem Output prüfen)

### ❌ Niemals verwenden
Chakren, Energie, Heilung, Schwingung, Frequenz, Universum, Manifestation,
Gesetz der Anziehung, Seele, spirituell, göttlich, Licht und Liebe,
"öffne dein Herz", "lass los", "fühle die Energie"

### ✅ Immer verwenden
Vagus-Nerv, Klassische Konditionierung (Pavlov), Brainwave-Transition,
Beta / Theta / Alpha, messbar, reproduzierbar, on demand,
Protokoll, Reset, Anker, Kalibrierung, Stack, HRV

Tagline: WHY NOT? BE THE CHANGE.
Zielgruppe: High-Performer, Biohacker, Selbstoptimierer
Verbotsliste vollständig: knowledge/verbotene_phrasen.md
Markenrichtlinie: knowledge/markenrichtlinie.md

## ACCIO Design-System (v1)

```
Primärfarben:
--bg:          #1B2845  (Mitternachtsblau — Haupthintergrund)
--surface:     #243358  (Oberflächen, Karten)
--gold:        #D4A574  (Akzent, CTAs, Überschriften-Akzent)
--beige:       #F7F4EE  (Fließtext, helle Flächen)
--muted:       rgba(247,244,238,0.55)

Typografie:
--font-serif:  "Playfair Display" (H1/H2 Überschriften)
--font-sans:   "DM Sans" (Body, Buttons, Labels)
--font-mono:   "DM Mono" (Code, Skript-Blöcke)

Sonderregeln:
- Gold-Spirale Watermark: 38% Opacity, fixed bottom-right
- VIP-Dokumente: "VERTRAULICH" Wasserzeichen diagonal, 20% Grau
- Alle öffentlichen Assets: QR-Code zu mindful7777.de/start
- Bild-Rahmen: 1px solid #D4A574 ODER auf Beige-Hintergrund
```

Globales CSS: assets/style.css
Sprach-Switcher: assets/lang.js (DE/EN auf allen Seiten)

## Plattformen & Payment-Links

| Plattform | URL | Zweck |
|-----------|-----|-------|
| GitHub Pages | intelligentresponder-max.github.io/mindful7777 | Hosting |
| Gumroad | mindful777.gumroad.com (Username: mindful777 — 3 Sevens!) | Digitale Produkte |
| Ko-fi | ko-fi.com/mindf7777 | VIP Membership €25/Mo |
| Throne | throne.com/mindful7777 | Wishlist / Support |
| Stripe | Links direkt — je nach Produkt | Direktzahlung |
| Discord | FFM-777 Server | Community |

### Aktive Produkt-Links
- Lead Magnet (gratis): mindful777.gumroad.com/l/ucaan
- Sock-Anchor Bundle (€9): mindful777.gumroad.com/l/csaf777
- VIP Membership (€25/Mo): ko-fi.com/mindf7777
- eBook HTML: /sock-anchor-ebook.html (self-hosted)

### Plattform-Regeln
- Gumroad Username ist mindful777 (3 Sevens) — NICHT mindful7777
- Ko-fi für Membership/Recurring — Stripe für Einmalzahlungen
- Throne für Wishlist-Items und Community-Support
- Alle Download-Produkte: ZIP mit PDF + MP3 + README.txt

## Technisches Setup

### Geräte & Pfade
- Git Bash (Windows): ~/Projects/mindful7777/
  → Username hat Leerzeichen: "/c/Users/Holy New/..."
- Termux (Android): ~/mindful7777/ | Downloads: ~/storage/shared/Download/

### Git Standard-Workflow
```bash
git add .
git commit -m "typ: beschreibung"
git pull origin main --rebase
git push origin main
```
Remote-ahead Fix: git pull origin main --rebase && git push origin main

### Tools
```bash
pip install reportlab pillow matplotlib numpy --break-system-packages
pkg install ffmpeg nodejs
npm install -g @anthropic-ai/claude-code
```

## Vollständige Repo-Struktur

```
mindful7777/
├── CLAUDE.md                        ← dieser Kontext
├── index.html                       ← Haupt-Landing Page
├── sock-anchor-protocol.html        ← Teaser + Blur-Gate
├── sock-anchor-ebook.html           ← Interaktives eBook
├── hypnosis-gumroad-page-live.html  ← Gumroad Landing
├── upsell.html / lead-magnet.html / teaser-sock-anker.html
│
├── .github/workflows/               ← GitHub Actions (CNAME deploy)
│
├── agents/                          ← 4-Agenten-System
│   ├── coaching/                    ← Agent 04 (Cryptomator)
│   ├── content/                     ← Agent 02
│   ├── intelligence/                ← Agent 01
│   └── visual/                      ← Agent 03
│
├── assets/
│   ├── audio/                       ← MP3-Sessions
│   │   ├── sock-anchor-de.mp3       ← [TODO: produzieren]
│   │   └── sock-anchor-en.mp3       ← [TODO: produzieren]
│   ├── images/
│   ├── lang.js                      ← DE/EN Switcher
│   └── style.css                    ← Globales CSS
│
├── blog/                            ← 7 Blog-Artikel
├── content/audio/ coaching/ pdf/ video/
│
├── docs/
│   ├── mindful7777_briefing_v2.md
│   ├── mindful7777_publisher_handbuch.docx
│   └── setup_software_hardware.md
│
├── funnel/                          ← Quiz → Result-Seiten → VIP
│   ├── quiz.html
│   ├── result-skeptic/seeker/open/experienced.html
│   ├── private.html / private-vip.html
│   └── onboarding.html / apply.html
│
├── intern/                          ← Dashboard (auth.js geschützt)
│   ├── login.html / dashboard.html / auth.js
│   └── audio_0-3 / doc_0-3 / links_0-2 / notizen.html
│
├── knowledge/                       ← Brand-Wissensbasis
│   ├── verbotene_phrasen.md         ← IMMER prüfen vor Output
│   ├── markenrichtlinie.md
│   ├── glossar.md / discord-onboarding-ffm777.md
│   └── haeufige_suggestionen.md / klient_faq.md
│
├── outreach/email_templates/ social_media/
│
├── pages/                           ← Statische Seiten
│   └── about / blog / contact / discord / glossar / membership / newsletter / sessions
│
├── sessions/leo7.html               ← PRIVAT — niemals öffentlich
│
└── vip/                             ← VIP-Bereich
    ├── ares-transformation.html / -en.html
    └── [7777-1 bis 7777-7 — schrittweise aufbauen]
```

## eBook + Audio Bundle System

### Datei-Struktur Bundle
```
sock-anchor-bundle/
├── sock-anchor-ebook.pdf            ← reportlab aus ebook HTML
├── induktions-skript-de.pdf         ← Skript-only PDF
├── induktions-skript-en.pdf
├── sock-anchor-session-de.mp3       ← Theta Binaural + Voice DE
├── sock-anchor-session-en.mp3       ← Theta Binaural + Voice EN
└── README.txt                       ← mindful7777 WHY NOT? BE THE CHANGE.
```

### Audio-Produktion (Termux)
```bash
# Theta Base (10 Min)
ffmpeg -f lavfi -i "sine=frequency=200:duration=600" \
       -f lavfi -i "sine=frequency=206:duration=600" \
       -filter_complex "[0:a][1:a]amerge=inputs=2,pan=stereo|c0<c0|c1<c1" \
       -b:a 192k assets/audio/theta_base.mp3

# Voice + Binaural mischen
ffmpeg -i voice_raw.mp3 -i theta_base.mp3 \
       -filter_complex "[0:a]volume=1.0[v];[1:a]volume=0.3[b];[v][b]amix=inputs=2" \
       -af loudnorm -b:a 128k assets/audio/sock-anchor-de.mp3
```

## VIP-Passwort-System

sessionStorage client-side Guard auf allen vip/-Seiten:
```javascript
if (!sessionStorage.getItem('vip-access')) {
  window.location.href = '/mindful7777/vip/';
}
```

## Wichtige Einzeldateien

- knowledge/verbotene_phrasen.md → VOR jedem Content-Output lesen
- assets/style.css → VOR Stil-Änderungen lesen
- assets/lang.js → in alle neuen Seiten einbinden
- sessions/leo7.html → PRIVAT, niemals verlinken
- intern/auth.js → Login-Logik, nicht ändern ohne Test
