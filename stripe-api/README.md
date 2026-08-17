# mindful7777 Stripe backend

Serverless functions covering **Payments**, **Billing** (subscriptions +
customer portal), and **Tax** (automatic VAT via Stripe Tax on Checkout).
Deployed on Vercel, called from the static site on GitHub Pages — GitHub
Pages can't hold a secret key or receive webhooks, so this lives in its own
deployment.

Connect and Invoicing are intentionally not built — not needed yet for a
solo-creator storefront. Add them here later if that changes.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/create-checkout-session` | Body: `{ "product": "membership" \| "support" \| "session_standard" \| "session_vip" \| "session_premium", "locale": "de" \| "en" }`. Returns `{ url }` — redirect the browser there. |
| `POST /api/create-portal-session` | Body: `{ "session_id": "<checkout session id from the success redirect>" }`. Returns `{ url }` for Stripe's Customer Portal (cancel/update payment method). |
| `POST /api/webhook` | Stripe webhook receiver. Configure this URL in the Stripe Dashboard. |

## First-time setup

1. **Create five Prices in Stripe** (Dashboard → Product catalog):
   - `membership` — recurring, €25/month (or your amount) — this replaces the
     existing `buy.stripe.com/...` Payment Link on `pages/membership.html`.
   - `support` — one-time, "pay what you can" or fixed amount — this replaces
     the `stripe-buy-button` on `vip-updated.html`.
   - `session_standard` — one-time, €77 — "Standard Session".
   - `session_vip` — one-time, €100 — "VIP Session".
   - `session_premium` — one-time, €150 — "Premium Session" (90 min).
   Copy each **Price ID** (`price_...`, not the Payment Link/Buy Button ID).

   Optional product metadata for the three session Prices, if you want it
   for your own filtering/reporting in the Dashboard (nothing in this
   codebase reads it — Checkout doesn't need it to work):
   ```
   product_category = service_consultation
   duration_minutes = 90        # session_premium only
   priority          = high | vip_access   # session_premium / session_vip
   rate_type         = special_offer       # session_standard
   ```

2. **Deploy this folder as its own Vercel project**, with this subdirectory
   (`stripe-api/`) set as the project's Root Directory:
   ```bash
   cd stripe-api
   npx vercel link      # creates/links a Vercel project
   npx vercel env add STRIPE_SECRET_KEY
   npx vercel env add STRIPE_WEBHOOK_SECRET
   npx vercel env add STRIPE_PRICE_MEMBERSHIP
   npx vercel env add STRIPE_PRICE_SUPPORT
   npx vercel env add STRIPE_PRICE_SESSION_STANDARD
   npx vercel env add STRIPE_PRICE_SESSION_VIP
   npx vercel env add STRIPE_PRICE_SESSION_PREMIUM
   npx vercel env add SUCCESS_URL_BASE
   npx vercel env add CANCEL_URL_BASE
   npx vercel env add SESSIONS_URL_BASE_SUCCESS
   npx vercel env add SESSIONS_URL_BASE_CANCEL
   npx vercel env add ALLOWED_ORIGINS
   npx vercel deploy --prod
   ```
   (`STRIPE_WEBHOOK_SECRET` you'll fill in during step 4, once the endpoint
   exists — set a placeholder now, update it after.)

3. **Point a subdomain at it** (optional but recommended, e.g.
   `api.mindful7777.de`): in Vercel → Project → Domains, add the subdomain,
   then add the CNAME record it gives you at your DNS provider. Until you do
   this, use the `*.vercel.app` URL Vercel gives you.

4. **Register the webhook** in the Stripe Dashboard → Developers → Webhooks
   → Add endpoint → `https://<your-api-domain>/api/webhook`, events:
   `checkout.session.completed`, `customer.subscription.deleted`,
   `invoice.payment_failed`. Copy the signing secret it shows you into
   `STRIPE_WEBHOOK_SECRET` (`npx vercel env add STRIPE_WEBHOOK_SECRET`,
   overwriting the placeholder), then redeploy.

5. **Local testing** (optional): `cp .env.example .env`, fill it in, then
   `npx vercel dev`. Use the [Stripe CLI](https://stripe.com/docs/stripe-cli)
   `stripe listen --forward-to localhost:3000/api/webhook` to test webhooks
   locally — it prints a `whsec_...` for your local `.env`.

## Frontend wiring

`pages/membership.html` and `pages/sessions.html` both load
`assets/stripe-checkout.js`, which holds `STRIPE_API_BASE` and the shared
`startCheckout(product, lang)` helper — set `STRIPE_API_BASE` there once and
both pages pick it up. Copy the same pattern onto other pages using the old
`stripe-buy-button` / Payment Link embeds (e.g. `vip-updated.html`) when
you're ready to migrate them.

Paying for a session only confirms payment — the customer still books their
slot themselves via the existing Calendly link on `pages/sessions.html`.
There's no automatic calendar hold, tier-specific booking link, or emailed
confirmation; `api/webhook.js` just logs the purchase. Build that out if you
want the paid tier to actually gate which Calendly event type someone can
book.

## Why Checkout Sessions instead of Payment Links / Buy Buttons

The existing embeds work, but a server-created Checkout Session is what
unlocks `automatic_tax: { enabled: true }` (Stripe Tax — required for EU VAT
on digital products, which Payment Links don't calculate dynamically per
customer) and Billing's Customer Portal (self-service subscription
management).
