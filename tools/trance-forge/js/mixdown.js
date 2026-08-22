/**
 * Mixdown.
 *
 * Der Mix läuft in einem OfflineAudioContext: das Ergebnis ist damit
 * deterministisch und unabhängig davon, wie schnell das Gerät gerade ist.
 * Stille wird nicht gerendert, sondern entsteht dadurch, dass an dieser Stelle
 * schlicht kein Buffer geplant ist — exakt auf die Millisekunde und ohne
 * TTS-Zeichen zu kosten.
 */

const SR = 44100;

export const BED_PRESETS = {
  aus: null,
  amber: { noise: 0.05, drones: [55, 82.5], lp: 320, binaural: null },
  theta: { noise: 0.04, drones: [110, 165], lp: 400, binaural: { carrier: 180, delta: 6 } },
  tief: { noise: 0.07, drones: [41.2, 61.8], lp: 240, binaural: null },
};

const dB = (v) => 10 ** (v / 20);

/* ───────────────────── Dekodieren ───────────────────── */

export async function decodeAll(items, onProgress) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const map = new Map();
  let done = 0;
  for (const { id, buffer } of items) {
    // decodeAudioData verbraucht den ArrayBuffer, deshalb pro Aufruf eine Kopie.
    map.set(id, await ctx.decodeAudioData(buffer.slice(0)));
    onProgress?.(++done / items.length);
  }
  await ctx.close();
  return map;
}

/* ───────────────────── Mix ───────────────────── */

/**
 * @param timeline  aus trancescript.compile(), retimet mit echten Dauern
 * @param buffers   Map segmentId -> AudioBuffer
 * @param opts      { bed, bedGain, layerGain, layerDelay, fadeIn, fadeOut, tailSeconds }
 */
export async function mix(timeline, buffers, opts = {}) {
  const o = {
    bed: 'amber',
    bedGain: -24,
    layerGain: -11,
    layerDelay: 0.055,
    fadeIn: 3,
    fadeOut: 6,
    tailSeconds: 4,
    ...opts,
  };

  const length = Math.ceil((timeline.total + o.tailSeconds) * SR);
  const ctx = new OfflineAudioContext(2, length, SR);

  const master = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 2.5;
  comp.attack.value = 0.02;
  comp.release.value = 0.35;
  comp.connect(master);
  master.connect(ctx.destination);

  const voiceBus = ctx.createGain();
  voiceBus.connect(comp);

  for (const seg of timeline.segments) {
    if (seg.kind !== 'speech') continue;
    const buf = buffers.get(seg.id);
    if (!buf) continue; // fehlgeschlagenes Segment: Lücke statt Abbruch

    const src = ctx.createBufferSource();
    src.buffer = buf;

    if (seg.track === 'layer') {
      // Zweite Stimmschicht: leiser, minimal versetzt, oben beschnitten.
      // Der Text bleibt hörbar, wird aber nicht mehr aktiv mitgelesen.
      const g = ctx.createGain();
      g.gain.value = dB(o.layerGain);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 3000;
      const pan = ctx.createStereoPanner();
      pan.pan.value = -0.35;
      src.connect(lp).connect(g).connect(pan).connect(comp);
      src.start(seg.at + o.layerDelay);
    } else {
      src.connect(voiceBus);
      src.start(seg.at);
    }
  }

  if (o.bed && BED_PRESETS[o.bed]) {
    buildBed(ctx, BED_PRESETS[o.bed], dB(o.bedGain), timeline.total + o.tailSeconds).connect(comp);
  }

  // Fades auf dem Master, damit auch das Bett sauber ein- und ausblendet.
  const end = timeline.total + o.tailSeconds;
  master.gain.setValueAtTime(0, 0);
  master.gain.linearRampToValueAtTime(1, o.fadeIn);
  master.gain.setValueAtTime(1, Math.max(o.fadeIn, end - o.fadeOut));
  master.gain.linearRampToValueAtTime(0, end);

  return ctx.startRendering();
}

function buildBed(ctx, preset, gain, duration) {
  const out = ctx.createGain();
  out.gain.value = gain;

  // Rauschen, tief gefiltert — trägt den Raum, ohne zu zischen.
  if (preset.noise > 0) {
    const noiseBuf = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = noiseBuf.getChannelData(c);
      let last = 0;
      for (let i = 0; i < d.length; i++) {
        // braunes Rauschen: weicher als weißes, weniger ermüdend
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        d[i] = last * 3.5;
      }
    }
    const n = ctx.createBufferSource();
    n.buffer = noiseBuf;
    n.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = preset.lp;
    const ng = ctx.createGain();
    ng.gain.value = preset.noise;
    n.connect(lp).connect(ng).connect(out);
    n.start(0);
    n.stop(duration);
  }

  // Drones: leichte Verstimmung, damit kein steriler Sinus stehen bleibt.
  preset.drones.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07 + i * 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    const g = ctx.createGain();
    g.gain.value = 0.22;
    lfo.connect(lfoGain).connect(osc.frequency);
    osc.connect(g).connect(out);
    osc.start(0); osc.stop(duration);
    lfo.start(0); lfo.stop(duration);
  });

  // Optionale binaurale Differenz. Wirkt als Atmosphäre und Pacing-Hilfe;
  // die Session trägt sich über Sprache und Timing, nicht hierüber.
  if (preset.binaural) {
    const { carrier, delta } = preset.binaural;
    [[carrier, -1], [carrier + delta, 1]].forEach(([f, pan]) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.06;
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      osc.connect(g).connect(p).connect(out);
      osc.start(0); osc.stop(duration);
    });
  }

  return out;
}

/* ───────────────────── Export ───────────────────── */

export function toWav(audioBuffer) {
  const ch = audioBuffer.numberOfChannels;
  const len = audioBuffer.length;
  const data = new ArrayBuffer(44 + len * ch * 2);
  const view = new DataView(data);

  const str = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };

  str(0, 'RIFF');
  view.setUint32(4, 36 + len * ch * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, ch, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * ch * 2, true);
  view.setUint16(32, ch * 2, true);
  view.setUint16(34, 16, true);
  str(36, 'data');
  view.setUint32(40, len * ch * 2, true);

  const chans = [];
  for (let c = 0; c < ch; c++) chans.push(audioBuffer.getChannelData(c));

  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < ch; c++) {
      const s = Math.max(-1, Math.min(1, chans[c][i]));
      view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([data], { type: 'audio/wav' });
}

/** Prüft nach dem Rendern, ob die Pausen wirklich stehen. */
export function verifyTiming(timeline, buffers) {
  const issues = [];
  for (const seg of timeline.segments) {
    if (seg.kind === 'silence' && seg.duration < seg.requested - 0.05) {
      issues.push(`Zeile ${seg.line}: Pause ${seg.requested}s auf ${seg.duration.toFixed(1)}s verkürzt.`);
    }
    if (seg.kind === 'speech' && !buffers.get(seg.id)) {
      issues.push(`Zeile ${seg.line}: Segment nicht gerendert.`);
    }
  }
  return issues;
}
