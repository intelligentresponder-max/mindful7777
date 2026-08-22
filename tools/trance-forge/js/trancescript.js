/**
 * TranceScript — Partitur-Sprache für Hypnose-Sessions.
 *
 * Grundgedanke: Stille ist Teil der Komposition, nicht ein Nebenprodukt der
 * Sprachsynthese. Deshalb erzeugt der Compiler Pausen als eigene Segmente und
 * überlässt sie niemals dem TTS-Modell — Modelle kürzen lange Pausen praktisch
 * immer ab, weil sie auf Alltagssprache trainiert sind.
 *
 * Syntax
 *   [4]                    4 s Stille
 *   [4~]                   4 s Stille, auf Atemzyklus gerundet
 *   ~langsam~              Tempo 0.75
 *   ~~sehr langsam~~       Tempo 0.55
 *   *Wort*                 Betonung (als Mikropause realisiert, s. u.)
 *   //Text//               zweite Stimmschicht, läuft unter der Hauptstimme
 *   >> am Zeilenanfang     Zeile startet auf dem Atemraster
 *   @phase:name            Abschnittsmarke
 *   #anchor:name           markiert Ankerpassage
 *   %% Text                Kommentar, wird nicht gesprochen
 */

export const SPEED = { NORMAL: 1.0, SLOW: 0.75, SLOWEST: 0.55 };

export const DEFAULTS = {
  breathCycle: 5.5,     // Sekunden pro Atemzyklus
  charsPerSecond: 13.2, // deutsche Sprechgeschwindigkeit bei Tempo 1.0
  emphasisPause: 0.18,  // Mikropause vor betonten Wörtern
  layerGain: -11,       // dB
  layerDelay: 0.055,    // s
};

const RE = {
  phase: /^@phase:([\w-]+)\s*$/,
  anchor: /#anchor:([\w-]+)/g,
  comment: /^%%/,
};

/* ────────────────────────── Parser ────────────────────────── */

/**
 * Zerlegt eine Zeile in Runs. Kein Regex-Monster, sondern ein linearer Scanner —
 * das bleibt lesbar und erlaubt saubere Fehlermeldungen mit Spaltenangabe.
 */
function scanLine(raw, lineNo) {
  const out = [];
  let i = 0;
  let speed = SPEED.NORMAL;
  let layer = false;
  let buf = '';
  let emphasis = [];
  const errors = [];

  const flush = () => {
    // Ein übrig gebliebenes * ist ein Tippfehler, kein Text. Es wird gemeldet
    // (s. u.) und nicht gesprochen — sonst liest die Stimme "Sternchen" vor.
    const text = buf.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
    if (text) out.push({ kind: 'speech', text, speed, layer, emphasis, line: lineNo });
    buf = '';
    emphasis = [];
  };

  while (i < raw.length) {
    const ch = raw[i];

    // Pause [4] / [4~]
    if (ch === '[') {
      const m = /^\[(\d+(?:\.\d+)?)(~?)\]/.exec(raw.slice(i));
      if (m) {
        flush();
        out.push({
          kind: 'silence',
          seconds: parseFloat(m[1]),
          snapToBreath: m[2] === '~',
          line: lineNo,
        });
        i += m[0].length;
        continue;
      }
      errors.push({ line: lineNo, col: i, msg: 'Ungültige Pause. Erwartet [Zahl] oder [Zahl~].' });
    }

    // Layer //Text//
    if (raw.startsWith('//', i)) {
      flush();
      layer = !layer;
      i += 2;
      continue;
    }

    // Tempoblöcke ~~ vor ~
    if (raw.startsWith('~~', i)) {
      flush();
      speed = speed === SPEED.SLOWEST ? SPEED.NORMAL : SPEED.SLOWEST;
      i += 2;
      continue;
    }
    if (ch === '~') {
      flush();
      speed = speed === SPEED.SLOW ? SPEED.NORMAL : SPEED.SLOW;
      i += 1;
      continue;
    }

    // Betonung *Wort*
    if (ch === '*') {
      const close = raw.indexOf('*', i + 1);
      if (close > i) {
        const word = raw.slice(i + 1, close);
        emphasis.push({ start: buf.length, length: word.length });
        buf += word;
        i = close + 1;
        continue;
      }
      errors.push({ line: lineNo, col: i, msg: 'Betonung nicht geschlossen. Erwartet *Wort*.' });
    }

    buf += ch;
    i++;
  }

  flush();
  if (layer) errors.push({ line: lineNo, col: raw.length, msg: 'Stimmschicht // nicht geschlossen.' });
  if (speed !== SPEED.NORMAL) errors.push({ line: lineNo, col: raw.length, msg: 'Tempoblock ~ nicht geschlossen.' });

  return { runs: out, errors };
}

export function parse(source) {
  const nodes = [];
  const errors = [];
  const lines = source.split('\n');

  lines.forEach((rawLine, idx) => {
    const lineNo = idx + 1;
    let line = rawLine;

    if (RE.comment.test(line.trim())) return;
    if (!line.trim()) return;

    const phase = RE.phase.exec(line.trim());
    if (phase) {
      nodes.push({ kind: 'phase', name: phase[1], line: lineNo });
      return;
    }

    let breathSync = false;
    if (line.trimStart().startsWith('>>')) {
      breathSync = true;
      line = line.trimStart().slice(2);
    }

    const anchors = [];
    line = line.replace(RE.anchor, (_, name) => {
      anchors.push(name);
      return '';
    });
    anchors.forEach((name) => nodes.push({ kind: 'anchor', name, line: lineNo }));

    const { runs, errors: lineErrors } = scanLine(line, lineNo);
    errors.push(...lineErrors);
    if (runs.length && breathSync) runs[0].breathSync = true;
    nodes.push(...runs);
  });

  return { nodes, errors };
}

/* ────────────────────────── Compiler ────────────────────────── */

/**
 * Schätzt die Sprechdauer eines Textes. Nur für die Editor-Vorschau —
 * der finale Mix rechnet mit den echten Bufferlängen (siehe retime()).
 */
export function estimateSpeech(text, speed, opts = DEFAULTS) {
  const cps = opts.charsPerSecond * speed;
  return text.length / cps + 0.25; // 0.25 s Anlauf/Ausklang pro Segment
}

function snapUp(t, cycle) {
  if (!cycle) return t;
  const r = t % cycle;
  return r < 0.02 ? t : t + (cycle - r);
}

/**
 * Baut aus den Knoten eine Timeline mit absoluten Zeitpositionen.
 *
 * @param durations optional: Map segmentId -> echte Dauer in Sekunden.
 *                  Ohne diese Map wird geschätzt (Editor-Vorschau),
 *                  mit ihr exakt gerechnet (Mixdown).
 */
export function compile(parsed, opts = {}, durations = null) {
  const o = { ...DEFAULTS, ...opts };
  const segments = [];
  const phases = [];
  const anchors = [];
  let cursor = 0;
  let seq = 0;

  for (const node of parsed.nodes) {
    if (node.kind === 'phase') {
      phases.push({ name: node.name, at: cursor });
      continue;
    }
    if (node.kind === 'anchor') {
      anchors.push({ name: node.name, at: cursor });
      continue;
    }

    if (node.kind === 'silence') {
      const start = cursor;
      let end = cursor + node.seconds;
      if (node.snapToBreath) end = snapUp(end, o.breathCycle);
      segments.push({
        id: `s${seq++}`,
        kind: 'silence',
        at: start,
        duration: end - start,
        requested: node.seconds,
        line: node.line,
      });
      cursor = end;
      continue;
    }

    // speech
    const id = `t${seq++}`;
    if (node.breathSync) cursor = snapUp(cursor, o.breathCycle);

    const duration = durations?.get(id) ?? estimateSpeech(node.text, node.speed, o);
    const seg = {
      id,
      kind: 'speech',
      track: node.layer ? 'layer' : 'primary',
      text: node.text,
      speed: node.speed,
      emphasis: node.emphasis,
      at: cursor,
      duration,
      line: node.line,
      estimated: !durations,
    };
    segments.push(seg);

    // Die Stimmschicht schiebt den Cursor nicht weiter — sie läuft unter
    // der Hauptstimme, sonst entstünden Löcher in der Hauptspur.
    if (!node.layer) cursor += duration;
  }

  return {
    segments,
    phases,
    anchors,
    total: cursor,
    breathCycle: o.breathCycle,
    charCount: segments.filter((s) => s.kind === 'speech').reduce((n, s) => n + s.text.length, 0),
  };
}

/** Nach dem Rendern erneut compilieren, jetzt mit echten Bufferlängen. */
export function retime(parsed, opts, durations) {
  return compile(parsed, opts, durations);
}

/**
 * Betonung ohne Modellabhängigkeit: eine Mikropause vor dem betonten Wort.
 * Funktioniert bei jedem TTS-Anbieter, weil sie im Text steht statt in einem
 * proprietären Markup — und sie bleibt konsistent, wenn der Anbieter wechselt.
 */
export function applyEmphasis(text, emphasis, opts = DEFAULTS) {
  if (!emphasis?.length) return text;
  let out = '';
  let last = 0;
  for (const e of emphasis) {
    out += text.slice(last, e.start);
    if (!/[,.…—]\s*$/.test(out)) out += '… ';
    out += text.slice(e.start, e.start + e.length);
    last = e.start + e.length;
  }
  return out + text.slice(last);
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
