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
| `POST /api/create-checkout-session` | Body: `{ "product": "membership" \| "support", "locale": "de" \| "en" }`. Returns `{ url }` — redirect the browser there. |
| `POST /api/create-portal-session` | Body: `{ "session_id": "<checkout session id from the success redirect>" }`. Returns `{ url }` for Stripe's Customer Portal (cancel/update payment method). |
| `POST /api/webhook` | Stripe webhook receiver. Configure this URL in the Stripe Dashboard. |

## First-time setup

1. **Create the two Prices in Stripe** (Dashboard → Product catalog):
   - `membership` — recurring, €25/month (or your amount) — this replaces the
     existing `buy.stripe.com/...` Payment Link on `pages/membership.html`.
   - `support` — one-time, "pay what you can" or fixed amount — this replaces
     the `stripe-buy-button` on `vip-updated.html`.
   Copy each **Price ID** (`price_...`, not the Payment Link/Buy Button ID).

2. **Deploy this folder as its own Vercel project**, with this subdirectory
   (`stripe-api/`) set as the project's Root Directory:
   ```bash
   cd stripe-api
   npx vercel link      # creates/links a Vercel project
   npx vercel env add STRIPE_SECRET_KEY
   npx vercel env add STRIPE_WEBHOOK_SECRET
   npx vercel env add STRIPE_PRICE_MEMBERSHIP
   npx vercel env add STRIPE_PRICE_SUPPORT
   npx vercel env add SUCCESS_URL_BASE
   npx vercel env add CANCEL_URL_BASE
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

`pages/membership.html` calls `create-checkout-session` — see the `<script>`
block near the bottom of that file. Point `STRIPE_API_BASE` at your deployed
API domain. Copy the same pattern onto other pages using the old
`stripe-buy-button` / Payment Link embeds (e.g. `vip-updated.html`) when
you're ready to migrate them.

## Why Checkout Sessions instead of Payment Links / Buy Buttons

The existing embeds work, but a server-created Checkout Session is what
unlocks `automatic_tax: { enabled: true }` (Stripe Tax — required for EU VAT
on digital products, which Payment Links don't calculate dynamically per
customer) and Billing's Customer Portal (self-service subscription
management).
