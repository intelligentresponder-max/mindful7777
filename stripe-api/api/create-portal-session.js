const { stripe } = require('./_lib/stripe');
const { applyCors } = require('./_lib/cors');

// No login system on the static site, so we identify the customer from the
// Checkout Session ID Stripe just redirected them back with (unguessable,
// known only to the person who completed checkout). This only works right
// after checkout — a returning member wanting to manage an old subscription
// needs a different flow (e.g. a portal link emailed via webhook). Not built
// yet; see docs/stripe-setup.md.
module.exports = async (req, res) => {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { session_id } = req.body || {};
  if (!session_id) {
    res.status(400).json({ error: 'session_id is required' });
    return;
  }

  const returnUrl = process.env.SUCCESS_URL_BASE;
  if (!returnUrl) {
    res.status(500).json({ error: 'SUCCESS_URL_BASE is not configured' });
    return;
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    if (!checkoutSession.customer) {
      res.status(400).json({ error: 'This checkout session has no associated customer' });
      return;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl,
    });

    res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error('create-portal-session failed', err);
    res.status(500).json({ error: 'Could not create portal session' });
  }
};
