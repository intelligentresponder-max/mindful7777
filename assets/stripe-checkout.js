// TODO: set to your deployed stripe-api URL (see stripe-api/README.md),
// e.g. "https://api.mindful7777.de" or the *.vercel.app URL Vercel gives you.
var STRIPE_API_BASE = "https://REPLACE-WITH-YOUR-STRIPE-API-DOMAIN";

async function startCheckout(product, lang) {
  var errorEl = document.getElementById('checkout-error-' + lang + '-' + product)
    || document.getElementById('checkout-error-' + lang);
  if (errorEl) { errorEl.style.display = 'none'; }
  try {
    var res = await fetch(STRIPE_API_BASE + '/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: product, locale: lang })
    });
    var data = await res.json();
    if (!res.ok || !data.url) { throw new Error(data.error || 'Checkout failed'); }
    window.location.href = data.url;
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = (lang === 'de'
        ? 'Checkout gerade nicht verfügbar. Bitte später erneut versuchen.'
        : 'Checkout is not available right now. Please try again shortly.');
      errorEl.style.display = 'block';
    }
    console.error('startCheckout failed', err);
  }
}
