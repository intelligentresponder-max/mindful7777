# Hypnose-Display (Transformator T-01)

Zwei-Fenster-Tool für Sitzungen: `steuerung.html` (Steuerpult, Operator) steuert `index.html` (Display, zweiter Monitor) per BroadcastChannel. Beide Seiten im **selben Browser** öffnen. Läuft ohne Build.

Aufruf (nach Deploy): `…/mindful7777/tools/hypnose-display/steuerung.html` → „Display öffnen".

## Profil / Ablauf
`profil-goodboys.js` (window.FLOW) – Fragen-Ablauf DE/EN. Neue Profile = neue Datei + `<script src>` in beiden Seiten.

## Änderungen gegenüber dem Original (Übergabe-Version)
Original-Prüfsummen: `ORIGINAL-CHECKSUMS.sha256` (index.html, steuerung.html, profil-goodboys.js stimmten beim Upload; `cues.js` fehlte).
1. `index.html`: noindex, Pflicht-Hinweis (18+, Einverständnis, nicht Fahren, Epilepsie/Lichtempfindlichkeit, Telefonseelsorge) vor dem Start – Disclaimer-Regel aus `knowledge/disclaimer.md`; `prefers-reduced-motion` schaltet Spirale/Halo/Blitze ab.
2. `steuerung.html`: noindex, Kurzhinweis.
3. `cues.js`: **Platzhalter** (leere Listen), Original bitte nachliefern.
4. Unverändert: Google-Fonts-Link (wie `assets/style.css` im Repo). Offen: lokal einbetten (DSGVO – Besucher-IP an Google), siehe Fehlerprotokoll.

## Fehlerprotokoll
- Upload ohne `cues.js` → `verify.sh` meldete FAILED. Lehre: `sh verify.sh` vor jeder Übergabe.
- Profil-Satz „Mit leerem Kopf bist du am besten" widerspricht `knowledge/discord-onboarding-ffm777.md` (kein Umgehen des kritischen Verstands). Nur mit Einverständnis und eigenem Hinweis nutzen; Text im Profil bei Bedarf entschärfen.
