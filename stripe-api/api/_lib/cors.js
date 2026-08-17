// Restrict cross-origin calls to your own domains. Set ALLOWED_ORIGINS in
// Vercel env vars as a comma-separated list, e.g.:
// https://intelligentresponder-max.github.io,https://mindful7777.de
function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

// Returns true if the request was a handled preflight (caller should return).
function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowed = allowedOrigins();

  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { applyCors, allowedOrigins };
