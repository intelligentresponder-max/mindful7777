/**
 * Invarianten der Partitur. Keine Abhängigkeiten, kein Browser:
 *   node test/timeline.test.mjs
 *
 * Diese Tests sind der Grund, warum man dem Timing trauen kann. Wer an
 * trancescript.js oder harvest.js etwas ändert, lässt sie danach laufen.
 */

import { parse, compile, retime, applyEmphasis } from '../js/trancescript.js';
import { harvest, breakSentences } from '../js/harvest.js';

let pass = 0, fail = 0;

function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`  ok    ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`); }
}
function group(name) { console.log(`\n${name}`); }

const CYCLE = 5.5;
const SCRIPT = `@phase:vertiefung
%% Kommentar, wird nicht gesprochen
>> Deine Schultern sind bereits *schwerer* als vorher. [3~]
~~Zehn.~~ Dein Kiefer löst sich. [3]
//tiefer//
~~Neun.~~ Die Schultern rutschen nach unten. [4~]
#anchor:daumen Leg deinen Daumen an den Mittelfinger. [2]`;

/* ───────── Parser ───────── */
group('Parser');
{
  const p = parse(SCRIPT);
  const speech = p.nodes.filter((n) => n.kind === 'speech');
  check('Kommentar wird nicht gesprochen', !speech.some((s) => s.text.includes('Kommentar')));
  check('Phase erkannt', p.nodes.some((n) => n.kind === 'phase' && n.name === 'vertiefung'));
  check('Anker erkannt', p.nodes.some((n) => n.kind === 'anchor' && n.name === 'daumen'));
  check('Stimmschicht markiert', speech.some((s) => s.layer && s.text === 'tiefer'));
  check('Tempo 0.55 gesetzt', speech.some((s) => s.speed === 0.55));
  check('Atem-Trigger auf erster Zeile', speech[0].breathSync === true);
  check('keine Syntaxfehler', p.errors.length === 0, JSON.stringify(p.errors));

  const bad = parse('Kaputt mit *offener Betonung');
  check('offene Betonung wird gemeldet', bad.errors.length === 1);
  check('Sternchen landet nicht im Text', !bad.nodes[0].text.includes('*'));
}

/* ───────── Betonung ───────── */
group('Betonung');
{
  const p = parse('Deine Schultern sind bereits *schwerer* als vorher.');
  const n = p.nodes[0];
  const word = n.text.substr(n.emphasis[0].start, n.emphasis[0].length);
  check('Offset trifft das Wort', word === 'schwerer', word);
  check('Mikropause davor', applyEmphasis(n.text, n.emphasis).includes('… schwerer'));
  const m = parse('Du bist *ruhig* und *schwer* jetzt.');
  check('mehrere Betonungen', (applyEmphasis(m.nodes[0].text, m.nodes[0].emphasis).match(/…/g) || []).length === 2);
}

/* ───────── Timeline ───────── */
group('Timeline');
{
  const p = parse(SCRIPT);
  const est = compile(p, { breathCycle: CYCLE });

  // echte TTS-Dauern sind typisch länger als die Schätzung
  const durations = new Map();
  est.segments.filter((s) => s.kind === 'speech').forEach((s) => durations.set(s.id, s.duration * 1.15));
  const tl = retime(p, { breathCycle: CYCLE }, durations);

  const silences = tl.segments.filter((s) => s.kind === 'silence');
  check('keine Pause wird gekürzt', silences.every((s) => s.duration >= s.requested - 1e-9));

  const snapped = silences.filter((s) => s.duration > s.requested + 1e-9);
  check('Atem-Snaps liegen auf dem Raster',
    snapped.every((s) => {
      const r = (s.at + s.duration) % CYCLE;
      return r < 1e-6 || Math.abs(r - CYCLE) < 1e-6;
    }), snapped.map((s) => (s.at + s.duration).toFixed(3)).join(', '));
  check('mindestens ein Snap ist aktiv', snapped.length >= 2);

  const main = tl.segments
    .filter((s) => s.track === 'primary' || s.kind === 'silence')
    .sort((a, b) => a.at - b.at);
  let overlap = null;
  for (let i = 1; i < main.length; i++) {
    if (main[i].at < main[i - 1].at + main[i - 1].duration - 1e-6) overlap = `${main[i - 1].id}/${main[i].id}`;
  }
  check('Hauptspur überlappt sich nicht', !overlap, overlap);

  const layer = tl.segments.find((s) => s.track === 'layer');
  const under = tl.segments.find((s) => s.track === 'primary' && Math.abs(s.at - layer.at) < 0.01);
  check('Stimmschicht schiebt den Cursor nicht', !!under);

  check('Gesamtlänge wächst mit echten Dauern', tl.total > est.total);
  check('Zeichenzahl zählt nur Sprache', tl.charCount > 0 && tl.charCount < SCRIPT.length);
}

/* ───────── Timing-Ernte ───────── */
group('Timing-Ernte');
{
  const words = [
    { word: 'Setz', start: 0.0, end: 0.30 },
    { word: 'dich', start: 0.32, end: 0.55 },
    { word: 'hin.', start: 0.57, end: 0.95 },
    { word: 'Das', start: 3.10, end: 3.35 },
    { word: 'ist', start: 3.37, end: 3.55 },
    { word: 'alles.', start: 3.57, end: 4.10 },
    { word: 'Jetzt.', start: 9.60, end: 10.10 },
  ];
  const h = harvest(words, { breathHint: CYCLE });

  check('erste Pause als [2] übernommen', h.text.includes('[2]'), h.text);
  check('lange Pause bekommt Snap-Marker', /\[5\.5~\]/.test(h.text), h.text);
  check('Kurzpause bekommt keinen Snap', !/\[2~\]/.test(h.text));
  check('Pausen gezählt', h.stats.pauseCount === 2);
  check('Sprechrate plausibel', h.stats.charsPerSecond > 5 && h.stats.charsPerSecond < 30, String(h.stats.charsPerSecond));
  check('Satzumbrüche erhalten die Marker', breakSentences(h.text).includes('[2]'));

  // Rundlauf: geerntete Marker müssen wieder parsebar sein
  const back = parse(breakSentences(h.text));
  check('Ernte ist wieder parsebar', back.errors.length === 0, JSON.stringify(back.errors));
}

console.log(`\n${fail === 0 ? '✓' : '✗'} ${pass} bestanden, ${fail} fehlgeschlagen\n`);
process.exit(fail ? 1 : 0);
