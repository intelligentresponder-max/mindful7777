const { stripe } = require('./_lib/stripe');

// Stripe signs the raw request body, so auto body-parsing must stay off.
const config = {
  api: { bodyParser: false },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    res.status(500).json({ error: 'Webhook not configured' });
    return;
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
    return;
  }

  // Handle only what mindful7777 currently needs. Add cases here as new
  // automation (e.g. Discord role grant, welcome email) gets built —
  // see docs/stripe-setup.md for the pattern.
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const product = session.metadata && session.metadata.product;
      console.log('Checkout completed', session.id, product, session.customer_details && session.customer_details.email);
      // NOTE: for session_standard / session_vip / session_premium this only
      // confirms payment — the client still books their slot themselves via
      // the Calendly link on pages/sessions.html. No automatic booking
      // confirmation, calendar hold, or emailed instructions is wired up
      // here; add that here if/when it's needed.
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log('Subscription cancelled', subscription.id);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log('Invoice payment failed', invoice.id, invoice.customer);
      break;
    }
    default:
      break;
  }

  res.status(200).json({ received: true });
}

module.exports = handler;
module.exports.config = config;
