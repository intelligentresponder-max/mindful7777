/**
 * Timing-Ernte.
 *
 * Wer ein Skript einspricht, timet die Pausen bereits richtig — das Gefühl fürs
 * Tempo steckt in der Aufnahme. Ein gewöhnliches Transkript wirft das weg.
 * Dieses Modul liest die Wortzeitstempel aus dem STT-Ergebnis und schreibt die
 * tatsächlichen Sprechpausen als [n]-Marker zurück in den Text.
 *
 * Zusätzlich wird die individuelle Sprechgeschwindigkeit gemessen und als
 * charsPerSecond zurückgegeben. Damit stimmt die Laufzeitschätzung im Editor
 * auf die eigene Stimme statt auf einen Durchschnittswert.
 */

const DEFAULTS = {
  minPause: 0.7,      // ab hier gilt eine Lücke als gesetzte Pause
  quantize: 0.5,      // Marker auf halbe Sekunden runden
  maxPause: 12,       // längere Lücken sind Denkpausen, nicht Komposition
  breathHint: 5.5,
};

/**
 * @param words [{ word, start, end }]  Zeitstempel in Sekunden
 * @returns { text, stats }
 */
export function harvest(words, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  if (!words?.length) return { text: '', stats: null };

  let text = '';
  let speakTime = 0;
  let speakChars = 0;
  const pauses = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const token = (w.word ?? w.text ?? '').trim();
    if (!token) continue;

    if (i > 0) {
      const gap = w.start - words[i - 1].end;
      if (gap >= o.minPause) {
        const rounded = Math.min(
          o.maxPause,
          Math.max(o.quantize, Math.round(gap / o.quantize) * o.quantize)
        );
        pauses.push(rounded);
        // Snap-Marker nur bei tragenden Pausen. Eine Halbsekundenlücke liegt
        // rechnerisch ebenfalls nahe an einem Vielfachen des Zyklus, ist aber
        // Sprechrhythmus und keine Komposition — die darf nicht gedehnt werden.
        const rest = rounded % o.breathHint;
        const nearCycle = rounded >= 2.5
          && (rest < 0.75 || rest > o.breathHint - 0.75);
        text += ` [${trimNum(rounded)}${nearCycle ? '~' : ''}]`;
        if (gap > 2.5) text += '\n';
      }
    }

    text += (text.endsWith('\n') || text === '' ? '' : ' ') + token;
    speakChars += token.length + 1;
  }

  // Sprechrate über die Netto-Sprechzeit: Gesamtspanne minus der geernteten
  // Pausen. Nur die Wortdauern zu summieren würde die Rate überschätzen, weil
  // die kurzen Lücken zwischen den Wörtern beim Sprechen mitlaufen — und genau
  // die stecken später auch in jedem TTS-Segment.
  const span = words[words.length - 1].end - words[0].start;
  const harvested = pauses.reduce((a, b) => a + b, 0);
  speakTime = Math.max(0.5, span - harvested);
  const cps = speakChars / speakTime;

  return {
    text: text.trim(),
    stats: {
      charsPerSecond: cps ? round(cps, 2) : null,
      pauseCount: pauses.length,
      pauseTotal: round(pauses.reduce((a, b) => a + b, 0), 1),
      longestPause: pauses.length ? Math.max(...pauses) : 0,
      spokenDuration: round(words[words.length - 1].end - words[0].start, 1),
    },
  };
}

/**
 * Zeilenumbrüche an Satzgrenzen — macht den Editor auf dem Handy lesbar.
 * Läuft nach harvest(), damit die Pausenmarker erhalten bleiben.
 */
export function breakSentences(text) {
  return text
    .replace(/([.!?])\s+(?=[A-ZÄÖÜ])/g, '$1\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function trimNum(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
function round(n, d) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
