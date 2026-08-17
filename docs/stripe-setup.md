# Stripe integration — architecture & status

## What this covers
**Payments**, **Billing** (subscriptions + self-service portal), **Tax**
(automatic EU VAT). Scoped down from the original 5-product list —
**Connect** and **Invoicing** are deliberately not built: no other
coaches/affiliates are being paid out yet, and Checkout Sessions already
produce receipts, so a separate Invoicing flow isn't needed yet. Revisit
both if that changes.

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
- `pages/membership.html` — the "Jetzt Mitglied werden / Join now" buttons
  now call `stripe-api`'s `create-checkout-session` endpoint instead of the
  static `buy.stripe.com` Payment Link, so Stripe Tax and the Billing Portal
  work. **The `STRIPE_API_BASE` placeholder in that file's `<script>` block
  needs your real deployed API URL before this works.**

## Not yet migrated
`vip-updated.html`'s `stripe-buy-button` ("Freiwillige Unterstützung") still
uses the old embed. The `support` product is already wired up in
`stripe-api` (see its README) — migrating that page means swapping the
`<stripe-buy-button>` element for a button calling
`startCheckout('support', lang)`, same pattern as `pages/membership.html`.

## Deploy checklist
1. Create the `membership` and `support` Prices in the Stripe Dashboard.
2. Deploy `stripe-api/` to Vercel (`stripe-api/README.md`, step 2).
3. Optional: point `api.mindful7777.de` (or similar) at it via DNS.
4. Register the webhook endpoint in Stripe, copy the signing secret in.
5. Set `STRIPE_API_BASE` in `pages/membership.html` to the deployed URL.
6. Test in Stripe **test mode** first — a full purchase, a cancel, and a
   `stripe trigger checkout.session.completed` webhook — before flipping to
   live keys.

## Secrets
Never commit `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` anywhere in this
repo. They live only in the Vercel project's environment variables
(`stripe-api/.env` is git-ignored for local testing only).
