/**
 * Provider-Schicht.
 *
 * Kein Anbietername außerhalb dieser Datei. Der Markt bewegt sich schnell und
 * ein Wechsel darf kein Rewrite werden — alles andere spricht nur gegen dieses
 * Interface.
 *
 * Alle Aufrufe gehen über den eigenen Worker. API-Keys erreichen den Browser
 * nie; wer den Client-Code liest, findet keinen Schlüssel.
 */

import { applyEmphasis } from './trancescript.js';

const cfg = {
  base: localStorage.getItem('tf.workerBase') || '',
  token: localStorage.getItem('tf.token') || '',
};

export function configure({ base, token }) {
  if (base !== undefined) { cfg.base = base.replace(/\/$/, ''); localStorage.setItem('tf.workerBase', cfg.base); }
  if (token !== undefined) { cfg.token = token; localStorage.setItem('tf.token', token); }
}
export function getConfig() { return { ...cfg }; }

class ApiError extends Error {
  constructor(msg, { status, hint } = {}) { super(msg); this.status = status; this.hint = hint; }
}

async function call(path, { method = 'POST', body, raw = false, signal } = {}) {
  if (!cfg.base) throw new ApiError('Kein Worker konfiguriert.', { hint: 'Einstellungen → Worker-URL eintragen.' });

  let res;
  try {
    res = await fetch(cfg.base + path, {
      method,
      headers: {
        'x-tf-token': cfg.token,
        ...(body instanceof FormData ? {} : { 'content-type': 'application/json' }),
      },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ApiError('Keine Verbindung zum Worker.', { hint: 'Netz prüfen. Skript ist lokal gespeichert.' });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(errorMessage(res.status, text), { status: res.status, hint: errorHint(res.status) });
  }
  return raw
    ? { buffer: await res.arrayBuffer(), requestId: res.headers.get('x-request-id') }
    : res.json();
}

function errorMessage(status, text) {
  if (status === 401) return 'Worker weist den Zugriff ab.';
  if (status === 402 || status === 429) return 'Kontingent beim Anbieter aufgebraucht.';
  if (status === 413) return 'Aufnahme zu groß für einen Durchgang.';
  if (status >= 500) return 'Anbieter antwortet nicht.';
  return text.slice(0, 200) || `Fehler ${status}.`;
}
function errorHint(status) {
  if (status === 401) return 'Token in den Einstellungen prüfen.';
  if (status === 402 || status === 429) return 'Skript ist gespeichert. Nach dem Reset erneut rendern.';
  if (status === 413) return 'Aufnahme in kürzere Takes teilen.';
  if (status >= 500) return 'In ein paar Minuten erneut versuchen.';
  return null;
}

/* ───────────────────── STT ───────────────────── */

export async function transcribe(blob, { language = 'de' } = {}) {
  const fd = new FormData();
  fd.append('audio', blob, 'take' + extFor(blob.type));
  fd.append('language', language);
  const r = await call('/api/stt', { body: fd });
  return { text: r.text, words: r.words ?? [] };
}

function extFor(mime = '') {
  if (mime.includes('mp4')) return '.m4a';
  if (mime.includes('webm')) return '.webm';
  if (mime.includes('ogg')) return '.ogg';
  if (mime.includes('wav')) return '.wav';
  return '.audio';
}

/* ───────────────────── Refine ───────────────────── */

export async function refine(rawText, { style = 'default', glossary = [], signal } = {}) {
  const r = await call('/api/refine', { body: { text: rawText, style, glossary }, signal });
  return { script: r.script, notes: r.notes ?? [], glossary: r.glossary ?? [] };
}

/* ───────────────────── Stimmprofile ───────────────────── */

export async function listVoices() {
  return (await call('/api/voices', { method: 'GET' })).voices ?? [];
}

/**
 * Stimmklon. Nur die eigene Stimme — der Challenge-Satz wird mitgesendet und
 * mitgespeichert, damit die Einwilligung belegbar bleibt. Der Anbieter verlangt
 * diese Bestätigung ohnehin vertraglich; hier ist sie technisch erzwungen.
 */
export async function cloneVoice({ name, samples, challengeAudio, challengePhrase }) {
  if (!challengeAudio || !challengePhrase) {
    throw new ApiError('Ohne Challenge-Aufnahme kein Stimmprofil.', {
      hint: 'Bestätigungssatz aufnehmen und erneut versuchen.',
    });
  }
  const fd = new FormData();
  fd.append('name', name);
  fd.append('challenge_phrase', challengePhrase);
  fd.append('challenge_audio', challengeAudio, 'challenge' + extFor(challengeAudio.type));
  samples.forEach((s, i) => fd.append('samples', s, `sample${i}${extFor(s.type)}`));
  return call('/api/voices/clone', { body: fd });
}

/* ───────────────────── TTS ───────────────────── */

/**
 * Segmente werden bewusst SEQUENZIELL gerendert, nicht parallel.
 *
 * Der Anbieter kann eine Anfrage auf die vorherige konditionieren
 * (previous_request_ids). Das hält Klangfarbe und Sprechhaltung über
 * Segmentgrenzen stabil — bei einer 20-Minuten-Session in 150 Stücken ist das
 * der Unterschied zwischen einer Session und einer Aneinanderreihung von Clips.
 * Die Kette braucht das abgeschlossene Ergebnis des Vorgängers, also fällt
 * Parallelisierung weg. Der Zeitverlust ist den Gewinn wert.
 */
export async function renderSegments(timeline, voiceId, opts = {}) {
  const { onProgress, signal, settings = {} } = opts;
  const speech = timeline.segments.filter((s) => s.kind === 'speech');
  const results = [];
  const failed = [];
  const chain = [];

  for (let i = 0; i < speech.length; i++) {
    const seg = speech[i];
    if (signal?.aborted) throw new DOMException('abgebrochen', 'AbortError');

    const prepared = stretch(applyEmphasis(seg.text, seg.emphasis), seg.speed);
    const next = speech[i + 1];

    try {
      const { buffer, requestId } = await call('/api/tts', {
        raw: true,
        signal,
        body: {
          text: prepared,
          voice_id: voiceId,
          speed: seg.speed,
          settings,
          previous_request_ids: chain.slice(-3),
          next_text: next ? next.text.slice(0, 200) : undefined,
          seed: opts.seed,
        },
      });
      results.push({ id: seg.id, buffer });
      if (requestId) chain.push(requestId);
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      // Ein defektes Segment kippt nicht den ganzen Render.
      failed.push({ id: seg.id, line: seg.line, text: seg.text, error: e.message });
      chain.length = 0; // Kette nach einem Loch neu beginnen
    }

    onProgress?.({ done: i + 1, total: speech.length, failed: failed.length });
  }

  return { results, failed };
}

/**
 * Der Anbieter nimmt Tempowerte nur bis 0.7 an. ~~sehr langsam~~ liegt
 * darunter — statt das Audio nachträglich zu dehnen (was hörbar leiert),
 * bekommt der Satz zusätzliche Binnenpausen. Langsamkeit entsteht in einer
 * Trance ohnehin überwiegend aus den Abständen, nicht aus gedehnten Silben.
 */
function stretch(text, speed) {
  if (speed >= 0.7) return text;
  return text
    .replace(/([,;:])\s+/g, '$1… ')
    .replace(/([.!?])\s+/g, '$1…… ');
}

/** Einzelne Zeile für die Vorschau im Editor. Cache über Text-Hash. */
const previewCache = new Map();

export async function previewLine(text, speed, voiceId, settings = {}) {
  const key = `${voiceId}|${speed}|${text}`;
  if (previewCache.has(key)) return previewCache.get(key).slice(0);
  const { buffer } = await call('/api/tts', {
    raw: true,
    body: { text, voice_id: voiceId, speed, settings },
  });
  if (previewCache.size > 40) previewCache.delete(previewCache.keys().next().value);
  previewCache.set(key, buffer);
  return buffer.slice(0);
}

export async function health() {
  return call('/api/health', { method: 'GET' });
}

export { ApiError };
