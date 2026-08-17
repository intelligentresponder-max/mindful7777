import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Signatur ungueltig:', err.message);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    console.log('BEZAHLT:', s.customer_details?.email, s.amount_total);
    // hier spaeter: Zugang freischalten / Mail senden
  }

  return Response.json({ received: true });
}
