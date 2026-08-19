# VIP-Zugang automatisieren — Empfehlung (C6)

**Problem:** Ko-fi verschickt kein Passwort nach der Zahlung. André tippt
jede Mail von Hand, während `vip.html` "Passwort per Mail" verspricht.
Zusätzlich: Das VIP-Passwort liegt im Client-Code (`sessionStorage`-Guard)
— das ist ein Reibungsverlust für echte Kunden, kein echter Zugangsschutz.
Ein Blick in die Seitenquelle zeigt das Passwort jedem. Automatisierung
löst das Tipp-Problem, nicht den fehlenden Schutz — dazu unten mehr.

## Weg 1 — Ko-fi-Webhook → Cloudflare Worker

Ko-fi kann bei jeder Zahlung ein JSON-Payload an eine selbst gewählte URL
schicken (Ko-fi-Dashboard → Webhooks). Ein kleiner Cloudflare Worker nimmt
das entgegen, prüft das `verification_token` und verschickt die
Zugangsmail automatisch (z. B. über Resend oder MailChannels, beide mit
Worker-freundlicher API).

- **Aufwand:** klein — ein Worker-Skript (~50–80 Zeilen), keine neue
  Infrastruktur außer dem kostenlosen Cloudflare-Account.
- **Kosten:** 0 €. Cloudflare Workers Free Tier (100.000 Requests/Tag)
  reicht bei diesem Volumen bei weitem. Resend Free Tier (3.000 Mails/Monat)
  ebenfalls ausreichend.
- **Schritte:**
  1. Cloudflare-Account + Worker-Projekt anlegen (`wrangler init`).
  2. Ko-fi-Dashboard → Webhooks → URL des Workers eintragen, Verification
     Token kopieren.
  3. Worker: Token prüfen, `type === "Subscription"` und Tier-Namen
     filtern, dann Mail mit VIP-Passwort + Link zu `vip.html` verschicken.
  4. Mit Ko-fis "Send Test Webhook"-Button testen, danach eine echte
     1 €-Testzahlung.
- **Vorteil:** läuft unabhängig vom Stripe-Umbau, ist in ein bis zwei
  Abenden umsetzbar, ändert nichts am bestehenden Ko-fi-Kaufweg.
- **Nachteil:** Ko-fi berechnet keine EU-USt automatisch (der Grund,
  warum das Stripe-Backend in `stripe-api/` überhaupt gebaut wurde, siehe
  `docs/stripe-setup.md`) — dieser Weg löst nur das Passwort-Problem, nicht
  die Steuerfrage.

## Weg 2 — Stripe Payment Links mit automatischer Zustellung

`stripe-api/` ist bereits vorbereitet (`api/webhook.js` empfängt
`checkout.session.completed`), aber noch **nicht deployed** und
`acct_1U5HoDRFsSeIZjZL` steht noch im Testmodus. Die Zustellung selbst
wäre nur ein zusätzlicher Mail-Schritt im bestehenden Webhook-Handler
(~20 Zeilen) — der eigentliche Aufwand liegt im noch offenen
Stripe-Deploy, der ohnehin ansteht (siehe Deploy-Checkliste in
`docs/stripe-setup.md`).

- **Aufwand:** mittel bis groß, aber größtenteils bereits als eigene
  Aufgabe dokumentiert und nicht neu für die Passwort-Automatisierung:
  Vercel-Deployment, Preise im Stripe-Dashboard anlegen, Webhook
  registrieren, Testmodus → Livemodus. Der Mail-Versand selbst ist klein.
- **Kosten:** Vercel Free Tier reicht für dieses Volumen. Stripe-Gebühren
  (EU-Karten ca. 1,5 % + 0,25 €) fallen so oder so an, sobald live
  geschaltet wird. E-Mail-Versand wie bei Weg 1 kostenlos/günstig.
- **Schritte:** Deploy-Checkliste aus `docs/stripe-setup.md` (Schritt 1–6)
  abarbeiten, danach im `checkout.session.completed`-Handler in
  `stripe-api/api/webhook.js` einen Mail-Versand-Aufruf ergänzen, mit
  `stripe trigger checkout.session.completed` testen.
- **Vorteil:** löst gleichzeitig die EU-USt-Pflicht und schaltet Stripes
  Customer Portal frei (Kunden können Abo selbst kündigen/Zahlungsmittel
  ändern, ohne André zu schreiben).
- **Nachteil:** Der Zugangs-Mailversand hängt am größeren, noch
  unfertigen Stripe-Rollout — bis der steht, bleibt Ko-fi der einzige
  funktionierende Kaufweg.

## Empfehlung

**Kurzfristig Weg 1 (Ko-fi-Webhook).** Er ist unabhängig vom
Stripe-Rollout, kostet nichts, und schließt die Lücke, die gerade am
meisten nervt (manuelles Tippen). Weg 2 lohnt sich, sobald der
Stripe-Umbau ohnehin ansteht — dann den Mail-Schritt direkt mit
einbauen, statt ihn separat zu bauen und später zu duplizieren.

**Das Passwort-im-Client-Problem bleibt unabhängig davon bestehen.**
Beide Wege automatisieren nur die Zustellung, nicht die Zugangskontrolle
— das Passwort steht weiterhin lesbar im Quelltext von `vip.html`. Ein
echter Schutz bräuchte eine serverseitige Prüfung (z. B. ein Token pro
Käufer statt eines geteilten Passworts, geprüft über die Vercel-API vor
dem Ausliefern der VIP-Inhalte). Das ist deutlich mehr Aufwand als beide
Automatisierungswege zusammen — aktuell vermutlich kein Prioritätsthema,
da die VIP-Inhalte keine hochsensiblen Daten sind, aber bei wachsender
Mitgliederzahl früher oder später relevant.
