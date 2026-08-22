/**
 * TranceForge Worker.
 *
 * Einziger Zweck: die API-Schlüssel aus dem Browser heraushalten. Ein
 * statisches Repo kann keine Geheimnisse hüten — wer den Client-Code liest,
 * liest auch jeden Schlüssel darin, und verbraucht dann fremdes Kontingent.
 *
 * Der Worker loggt keine Payloads. Weder Aufnahmen noch Skripttexte werden
 * gespeichert; er reicht durch und vergisst.
 *
 * Secrets (wrangler secret put …):
 *   TF_TOKEN         eigenes Zugangstoken für das Betreiber-Gerät
 *   ELEVENLABS_KEY   TTS + STT
 *   ANTHROPIC_KEY    Schliff
 */

const TTS_MODEL = 'eleven_multilingual_v2';
const STT_MODEL = 'scribe_v1';
const LLM_MODEL = 'claude-sonnet-4-6';

// Der Anbieter akzeptiert Tempowerte nur in diesem Fenster. Langsamer wird
// nicht über das Modell erzeugt, sondern über die Pausen — die kontrollieren
// wir ohnehin selbst und exakt.
const SPEED_MIN = 0.7;
const SPEED_MAX = 1.2;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type,x-tf-token',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-expose-headers': 'x-request-id,x-speed-applied',
  'access-control-max-age': '86400',
};

export default {
  async fetch(req, env, ctx) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '');

    if (path === '/api/health') return json(health(env));

    if (!env.TF_TOKEN || req.headers.get('x-tf-token') !== env.TF_TOKEN) {
      return json({ error: 'unauthorized' }, 401);
    }

    const limited = await rateLimit(req, env, ctx);
    if (limited) return limited;

    try {
      switch (path) {
        case '/api/stt':          return await stt(req, env);
        case '/api/refine':       return await refine(req, env);
        case '/api/tts':          return await tts(req, env);
        case '/api/voices':       return await voices(env);
        case '/api/voices/clone': return await clone(req, env);
        default:                  return json({ error: 'not found' }, 404);
      }
    } catch (e) {
      return json({ error: String(e?.message || e).slice(0, 300) }, 502);
    }
  },
};

/* ───────────── Infrastruktur ───────────── */

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });

const health = (env) => ({
  ok: true,
  stt: !!env.ELEVENLABS_KEY,
  tts: !!env.ELEVENLABS_KEY,
  llm: !!env.ANTHROPIC_KEY,
  models: { tts: TTS_MODEL, stt: STT_MODEL, llm: LLM_MODEL },
});

/**
 * Tageslimit. Ein durchgelaufener Render-Bug oder ein geleaktes Token soll
 * nicht das Monatskontingent verbrennen. Ohne KV-Binding wird still übersprungen.
 */
async function rateLimit(req, env, ctx) {
  if (!env.TF_KV) return null;
  const max = +(env.TF_DAILY_LIMIT || 4000);
  const key = `rl:${new Date().toISOString().slice(0, 10)}`;
  const n = +((await env.TF_KV.get(key)) || 0);
  if (n >= max) {
    return json({ error: 'Tageslimit erreicht.', limit: max }, 429);
  }
  ctx.waitUntil(env.TF_KV.put(key, String(n + 1), { expirationTtl: 172800 }));
  return null;
}

const el = (env, path, init = {}) =>
  fetch('https://api.elevenlabs.io' + path, {
    ...init,
    headers: { 'xi-api-key': env.ELEVENLABS_KEY, ...(init.headers || {}) },
  });

/* ───────────── STT ───────────── */

async function stt(req, env) {
  const form = await req.formData();
  const audio = form.get('audio');
  if (!audio) return json({ error: 'kein audio' }, 400);

  const fd = new FormData();
  fd.append('file', audio);
  fd.append('model_id', STT_MODEL);
  fd.append('language_code', form.get('language') || 'de');
  // Wortzeitstempel sind hier nicht optional: ohne sie funktioniert die
  // Timing-Ernte nicht, und die ist der halbe Sinn des Werkzeugs.
  fd.append('timestamps_granularity', 'word');
  fd.append('diarize', 'false');

  const r = await el(env, '/v1/speech-to-text', { method: 'POST', body: fd });
  if (!r.ok) return json({ error: (await r.text()).slice(0, 300) }, r.status);

  const data = await r.json();
  const words = (data.words || [])
    .filter((w) => w.type !== 'spacing')
    .map((w) => ({ word: w.text, start: w.start, end: w.end }));

  return json({ text: data.text, words });
}

/* ───────────── Schliff ───────────── */

async function refine(req, env) {
  const { text, style = 'default', glossary = [] } = await req.json();
  if (!text) return json({ error: 'kein text' }, 400);

  // Das bekannte Glossar geht mit, damit derselbe Fachbegriff über eine
  // Produktreihe hinweg immer gleich aufgelöst wird.
  const known = glossary.length
    ? `<glossar_bekannt>\n${glossary.map((g) => `${g.term} | ${g.plain}`).join('\n')}\n</glossar_bekannt>\n`
    : '';

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `<stil>${style}</stil>\n${known}<diktat>\n${text}\n</diktat>`,
      }],
    }),
  });

  if (!r.ok) return json({ error: (await r.text()).slice(0, 300) }, r.status);
  const data = await r.json();
  const out = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');

  const script = pick(out, 'skript') ?? out.trim();
  const notes = (pick(out, 'hinweise') ?? '')
    .split('\n').map((s) => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
  const terms = (pick(out, 'glossar') ?? '')
    .split('\n')
    .map((l) => l.split('|').map((x) => x.trim()))
    .filter(([t, p]) => t && p)
    .map(([term, plain]) => ({ term, plain }));

  return json({ script, notes, glossary: terms });
}

function pick(text, tag) {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i').exec(text);
  return m ? m[1].trim() : null;
}

/* Wird beim Deploy aus prompts/refine.md eingesetzt (siehe README). */
const SYSTEM_PROMPT = `__REFINE_PROMPT__`;

/* ───────────── TTS ───────────── */

async function tts(req, env) {
  const body = await req.json();
  const { text, voice_id, speed = 1, settings = {}, previous_request_ids, next_text, seed } = body;
  if (!text || !voice_id) return json({ error: 'text und voice_id nötig' }, 400);

  const applied = Math.min(SPEED_MAX, Math.max(SPEED_MIN, speed));

  const r = await el(env, `/v1/text-to-speech/${voice_id}?output_format=mp3_44100_192`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: TTS_MODEL,
      voice_settings: {
        // Hohe Stabilität hält die Sprechhaltung über eine lange Session ruhig;
        // Ausdrucksvarianz ist hier ein Fehler, keine Qualität.
        stability: settings.stability ?? 0.72,
        similarity_boost: settings.similarity_boost ?? 0.85,
        style: settings.style ?? 0.05,
        use_speaker_boost: settings.use_speaker_boost ?? true,
        speed: applied,
      },
      previous_request_ids: previous_request_ids?.length ? previous_request_ids.slice(-3) : undefined,
      next_text,
      seed,
      apply_text_normalization: 'on',
    }),
  });

  if (!r.ok) return json({ error: (await r.text()).slice(0, 300) }, r.status);

  return new Response(r.body, {
    headers: {
      'content-type': 'audio/mpeg',
      // Der Client hängt die nächste Anfrage an diese ID — so bleibt die
      // Prosodie über Segmentgrenzen hinweg gleich.
      'x-request-id': r.headers.get('request-id') || '',
      'x-speed-applied': String(applied),
      ...CORS,
    },
  });
}

/* ───────────── Stimmprofile ───────────── */

async function voices(env) {
  const r = await el(env, '/v1/voices');
  if (!r.ok) return json({ error: (await r.text()).slice(0, 300) }, r.status);
  const data = await r.json();
  return json({
    voices: (data.voices || [])
      .filter((v) => v.category === 'cloned' || v.category === 'professional')
      .map((v) => ({ voice_id: v.voice_id, name: v.name, category: v.category })),
  });
}

async function clone(req, env) {
  const form = await req.formData();
  const challengePhrase = form.get('challenge_phrase');
  const challengeAudio = form.get('challenge_audio');
  const samples = form.getAll('samples');

  // Doppelt geprüft: der Client erzwingt die Bestätigung, der Worker auch.
  // Eine Prüfung, die nur im Browser läuft, ist keine Prüfung.
  if (!challengePhrase || !challengeAudio) {
    return json({ error: 'Bestätigungsaufnahme fehlt. Ohne sie wird kein Profil erzeugt.' }, 400);
  }
  if (!samples.length) return json({ error: 'kein referenzmaterial' }, 400);

  const fd = new FormData();
  fd.append('name', form.get('name') || 'mindful7777');
  fd.append('description', 'Eigene Stimme des Betreibers. Einwilligung per Challenge-Aufnahme belegt.');
  fd.append('labels', JSON.stringify({
    use_case: 'hypnosis',
    consent: 'self-recorded-challenge',
    consent_at: new Date().toISOString(),
  }));
  // Die Bestätigung wandert als erstes Sample mit — sie ist Teil des Belegs.
  fd.append('files', challengeAudio, 'consent.m4a');
  samples.forEach((s, i) => fd.append('files', s, `ref${i}.m4a`));

  const r = await el(env, '/v1/voices/add', { method: 'POST', body: fd });
  if (!r.ok) return json({ error: (await r.text()).slice(0, 300) }, r.status);

  const data = await r.json();
  return json({ voice_id: data.voice_id, name: form.get('name') });
}
