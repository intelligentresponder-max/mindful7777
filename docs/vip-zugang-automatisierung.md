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

## Empfehlung

**Das Passwort-im-Client-Problem bleibt unabhängig davon bestehen.**
Beide Wege automatisieren nur die Zustellung, nicht die Zugangskontrolle
— das Passwort steht weiterhin lesbar im Quelltext von `vip.html`. Ein
echter Schutz bräuchte eine serverseitige Prüfung (z. B. ein Token pro
Käufer statt eines geteilten Passworts, geprüft über die Vercel-API vor
dem Ausliefern der VIP-Inhalte). Das ist deutlich mehr Aufwand als beide
Automatisierungswege zusammen — aktuell vermutlich kein Prioritätsthema,
da die VIP-Inhalte keine hochsensiblen Daten sind, aber bei wachsender
Mitgliederzahl früher oder später relevant.
