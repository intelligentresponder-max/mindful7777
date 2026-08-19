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

The 1:1-session tiers (`session_standard`/`session_vip`/`session_premium`,
Calendly-based) that used to live here have been dropped — that offer is
retired, its page (`pages/sessions.html`) is archived. Only VIP membership
automation is in scope for now.

## First-time setup

1. **Create two Prices in Stripe** (Dashboard → Product catalog):
   - `membership` — recurring, **77,77 €/month** — this is the current
     `vip.html` price (was €25/month when this backend was first drafted;
     `pages/membership.html` it originally targeted has since been archived,
     see "Frontend wiring" below).
   - `support` — one-time, "pay what you can" or fixed amount — `vip.html`
     currently handles this via a Ko-fi link instead; wire this product in
     only if/when you want a Stripe-native alternative to that.
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

`pages/membership.html`, `pages/sessions.html`, and `vip-updated.html` — the
pages this backend originally targeted — have since been archived (see
`UEBERGABE-CLAUDE-CHAT-2.md` §4). **`vip.html` is the current VIP page and is
not yet wired up.** To connect it:

1. Add `<script src="assets/stripe-checkout.js"></script>` to `vip.html`.
2. Set `STRIPE_API_BASE` in `assets/stripe-checkout.js` to your deployed API
   URL (see step 2/3 above — there is no deployment yet, so this is still a
   placeholder).
3. Add a button calling `startCheckout('membership', lang)` on `vip.html`.
   Ko-fi remains the only working payment path there today — add the Stripe
   button alongside it, don't replace it, until this backend is deployed and
   tested end-to-end.

`checkout.session.completed` webhook events for `membership` only confirm
and log the subscription (see `api/webhook.js`) — no automatic VIP-password
delivery is wired up yet. Build that out (e.g. an email step in the webhook
handler) if/when you want signup to be fully hands-off.

## Why Checkout Sessions instead of Payment Links / Buy Buttons

The existing embeds work, but a server-created Checkout Session is what
unlocks `automatic_tax: { enabled: true }` (Stripe Tax — required for EU VAT
on digital products, which Payment Links don't calculate dynamically per
customer) and Billing's Customer Portal (self-service subscription
management).
