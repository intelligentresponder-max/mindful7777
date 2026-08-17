# Stripe integration — architecture & status

## What this covers
**Payments**, **Billing** (subscriptions + self-service portal), **Tax**
(automatic EU VAT). Scoped down from the original 5-product list —
**Connect** and **Invoicing** are deliberately not built: no other
coaches/affiliates are being paid out yet, and Checkout Sessions already
produce receipts, so a separate Invoicing flow isn't needed yet. Revisit
both if that changes.

Products live: `membership` (recurring), `support` (one-time), and three
one-time 1:1 hypnosis session tiers — `session_standard` (€77),
`session_vip` (€100), `session_premium` (€150, 90 min). The three session
prices came from a report pasted into chat that the user said originated
from another AI tool/consultant, not written by them directly — flagged and
confirmed with the user before building, since the source wasn't verifiable
and the report contained at least one factual error (`/api/webhooks` vs. the
actual `/api/webhook`). Worth a sanity check against the real Stripe
Dashboard prices before going live.

## Why a separate backend
`intelligentresponder-max.github.io/mindful7777` is static GitHub Pages —
it cannot hold a Stripe **secret** key or receive webhooks. The actual
Stripe calls now live in `stripe-api/`, deployed as its own Vercel project
(same repo, Vercel's "Root Directory" set to `stripe-api/`). GitHub Pages
keeps serving the marketing site unchanged; the frontend just calls out to
the Vercel API for anything that needs the secret key.

```
GitHub Pages (static)  ──fetch──>  stripe-api on Vercel  ──>  Stripe API
mindful7777.de                     api.mindful7777.de (or *.vercel.app)
```

## What changed
- New `stripe-api/` — see `stripe-api/README.md` for full deploy steps
  (Vercel project setup, env vars, webhook registration, DNS).
- New `assets/stripe-checkout.js` — shared `STRIPE_API_BASE` config +
  `startCheckout(product, lang)` helper, loaded by both pages below.
- `pages/membership.html` — the "Jetzt Mitglied werden / Join now" buttons
  now call `stripe-api`'s `create-checkout-session` endpoint instead of the
  static `buy.stripe.com` Payment Link, so Stripe Tax and the Billing Portal
  work.
- `pages/sessions.html` — added three paid-session cards (Standard/VIP/
  Premium) calling the same endpoint. Payment only confirms payment; the
  client still books their slot via the existing Calendly link — no
  automated booking/calendar integration exists yet.

**The `STRIPE_API_BASE` placeholder in `assets/stripe-checkout.js` needs
your real deployed API URL before any of this works.**

## Not yet migrated
`vip-updated.html`'s `stripe-buy-button` ("Freiwillige Unterstützung") still
uses the old embed. The `support` product is already wired up in
`stripe-api` (see its README) — migrating that page means swapping the
`<stripe-buy-button>` element for a button calling
`startCheckout('support', lang)`, same pattern as `pages/membership.html`.

## Deploy checklist
1. Create all five Prices in the Stripe Dashboard: `membership`, `support`,
   `session_standard` (€77), `session_vip` (€100), `session_premium` (€150).
2. Deploy `stripe-api/` to Vercel (`stripe-api/README.md`, step 2).
3. Optional: point `api.mindful7777.de` (or similar) at it via DNS.
4. Register the webhook endpoint in Stripe, copy the signing secret in.
5. Set `STRIPE_API_BASE` in `assets/stripe-checkout.js` to the deployed URL.
6. Test in Stripe **test mode** first — a full purchase of each product, a
   cancel, and a `stripe trigger checkout.session.completed` webhook —
   before flipping to live keys.

## Secrets
Never commit `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` anywhere in this
repo. They live only in the Vercel project's environment variables
(`stripe-api/.env` is git-ignored for local testing only).
