const { stripe } = require('./_lib/stripe');
const { applyCors } = require('./_lib/cors');

// Server-side allowlist: the client only ever sends a product key, never a
// price or amount, so nobody can tamper with what they pay.
const PRODUCTS = {
  membership: {
    mode: 'subscription',
    priceEnv: 'STRIPE_PRICE_MEMBERSHIP',
  },
  support: {
    mode: 'payment',
    priceEnv: 'STRIPE_PRICE_SUPPORT',
  },
};

module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { product, locale } = req.body || {};
  const config = PRODUCTS[product];

  if (!config) {
    res.status(400).json({ error: `Unknown product "${product}"` });
    return;
  }

  const priceId = process.env[config.priceEnv];
  if (!priceId) {
    res.status(500).json({ error: `${config.priceEnv} is not configured` });
    return;
  }

  const successBase = process.env.SUCCESS_URL_BASE;
  const cancelBase = process.env.CANCEL_URL_BASE;
  if (!successBase || !cancelBase) {
    res.status(500).json({ error: 'SUCCESS_URL_BASE / CANCEL_URL_BASE are not configured' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: config.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successBase}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelBase}?checkout=cancelled`,
      automatic_tax: { enabled: true },
      billing_address_collection: 'auto',
      locale: locale === 'en' ? 'en' : 'de',
      ...(config.mode === 'subscription'
        ? { subscription_data: { metadata: { product } } }
        : { payment_intent_data: { metadata: { product } } }),
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session failed', err);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
};
