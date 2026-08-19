# Stripe integration — architecture & status

## What this covers
**Payments**, **Billing** (subscriptions + self-service portal), **Tax**
(automatic EU VAT). Scoped down from the original 5-product list —
**Connect** and **Invoicing** are deliberately not built: no other
coaches/affiliates are being paid out yet, and Checkout Sessions already
produce receipts, so a separate Invoicing flow isn't needed yet. Revisit
both if that changes.

Products in scope: `membership` (recurring, currently 77,77 €/month) and
`support` (one-time, Stripe-native alternative to the Ko-fi "pay what you
can" link). The three one-time 1:1 hypnosis session tiers this doc used to
describe (`session_standard`/`session_vip`/`session_premium`, €77/€100/€150)
have been **dropped** — that offer's page (`pages/sessions.html`, with its
Calendly booking link) is archived and the offer is retired. Those three
prices had come from a report pasted into chat that the user said originated
from another AI tool/consultant, not written by them directly, and were
never independently confirmed against the live Stripe Dashboard — reviving
that product line later means re-confirming pricing and booking flow first,
not just re-adding the old numbers.

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
- `stripe-api/` — see `stripe-api/README.md` for full deploy steps (Vercel
  project setup, env vars, webhook registration, DNS).
- `assets/stripe-checkout.js` — shared `STRIPE_API_BASE` config +
  `startCheckout(product, lang)` helper.
- `pages/membership.html` and `pages/sessions.html` were the original
  frontend targets — **both are now archived** (repo cleanup moved them to
  `archiv/`, unrelated to this Stripe work, see `UEBERGABE-CLAUDE-CHAT-2.md`
  §4). `pages/membership.html`'s "Jetzt Mitglied werden" buttons already
  called `startCheckout('membership', lang)` correctly — that's the working
  reference pattern to port over. `pages/sessions.html`'s three paid-session
  cards are **not** being revived, see above.
- **`vip.html` is the current VIP page and still only has Ko-fi** — the
  Stripe backend has not been deployed yet, so no button has been added
  there. Adding one before deployment would just show every visitor a
  "Checkout gerade nicht verfügbar" error.

**The `STRIPE_API_BASE` placeholder in `assets/stripe-checkout.js` needs
your real deployed API URL before any of this can go live.**

## Not yet migrated
`vip-updated.html`'s `stripe-buy-button` ("Freiwillige Unterstützung") is
also archived now. The `support` product is already wired up in
`stripe-api` (see its README) — migrating means adding a button to
`vip.html` calling `startCheckout('support', lang)`, same pattern as
`membership`.

## Deploy checklist
1. Create the two Prices in the Stripe Dashboard: `membership` (77,77 €/mo),
   `support`.
2. Deploy `stripe-api/` to Vercel (`stripe-api/README.md`, step 2).
3. Optional: point `api.mindful7777.de` (or similar) at it via DNS.
4. Register the webhook endpoint in Stripe, copy the signing secret in.
5. Set `STRIPE_API_BASE` in `assets/stripe-checkout.js` to the deployed URL.
6. Add `<script src="assets/stripe-checkout.js"></script>` to `vip.html`
   and a button calling `startCheckout('membership', document.documentElement.lang)`
   next to the existing Ko-fi CTA — don't replace it until tested.
7. Test in Stripe **test mode** first — a full purchase, a cancel, and a
   `stripe trigger checkout.session.completed` webhook — before flipping to
   live keys.

## Secrets
Never commit `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` anywhere in this
repo. They live only in the Vercel project's environment variables
(`stripe-api/.env` is git-ignored for local testing only).
