/* Rule-of-Three-Generator (JS-Port von rule-of-three/rule_of_three_generator.py).
   Gleiche Sätze wie das Python-Original – per test-parity.js gegen Python geprüft.
   Aufbau: window.RuleOfThree.{SAMPLE, assemble(data), sentences(data), validate(data)} */
(function (root) {
  const s = v => String(v).trim();
  const B = {
    pace_pace_lead: d => `${s(d.pace_1)}, ${s(d.pace_2)}, and ${s(d.lead)}.`,
    vakog_triad: d => `You can ${s(d.visual)}, ${s(d.auditory)}, and ${s(d.kinesthetic)}.`,
    progressive_listing: d => `Isn't it interesting how sometimes you ${s(d.effort)}, other times you ${s(d.waiting)}, and then suddenly ${s(d.automatic)}?`,
    triad_items: d => {
      if (!Array.isArray(d.items) || d.items.length !== 3) throw new Error('Triad chain requires exactly 3 items.');
      return `${s(d.subject)} ${s(d.verb)} ${s(d.items[0])}, ${s(d.items[1])}, and ${s(d.items[2])}.`;
    },
    parts_synthesis: d => `Part of your mind might ${s(d.part_a)}, while another part ${s(d.part_b)}, and both parts are ${s(d.synthesis)}.`
  };
  const KEYS = {
    pace_pace_lead: ['pace_1', 'pace_2', 'lead'],
    vakog_triad: ['visual', 'auditory', 'kinesthetic'],
    progressive_listing: ['effort', 'waiting', 'automatic'],
    triad_items: ['subject', 'verb', 'items'],
    parts_synthesis: ['part_a', 'part_b', 'synthesis']
  };
  const SAMPLE = {
    pace_pace_lead: { pace_1: 'You are sitting here right now', pace_2: 'listening to the sound of my voice', lead: 'you can begin to notice how easily your breathing settles into a natural rhythm' },
    vakog_triad: { visual: 'notice the quiet space behind your eyes', auditory: 'hear the calm cadence of my voice', kinesthetic: 'feel a soothing warmth moving down through your chest and shoulders' },
    progressive_listing: { effort: 'try to relax and it feels like effort', waiting: 'just wait and let time pass', automatic: 'there comes a moment where a deep, quiet calm simply takes over' },
    triad_items: { subject: 'Your brain', verb: 'feels', items: ['refreshed', 'cool', 'completely silent'] },
    parts_synthesis: { part_a: 'stay slightly aware for a moment', part_b: 'already knows it is safe to drop deep into peace', synthesis: 'completely fine and in total harmony' }
  };
  /* Schema-Prüfung (required, Typen, genau 3 items) – gibt Liste von Fehlertexten zurück */
  function validate(data) {
    const err = [];
    if (!data || typeof data !== 'object') return ['Kein JSON-Objekt'];
    for (const k in KEYS) {
      if (!data[k] || typeof data[k] !== 'object') { err.push(`Fehlt: ${k}`); continue; }
      for (const f of KEYS[k]) {
        const v = data[k][f];
        if (f === 'items') { if (!Array.isArray(v) || v.length !== 3 || v.some(x => typeof x !== 'string' || !x.trim())) err.push(`${k}.items: genau 3 ausgefüllte Texte nötig`); }
        else if (typeof v !== 'string' || !v.trim()) err.push(`${k}.${f}: Text fehlt`);
      }
    }
    return err;
  }
  function sentences(data) { return Object.keys(KEYS).map(k => B[k](data[k])); }
  function assemble(data) { return sentences(data).join('\n\n'); }
  const api = { SAMPLE, KEYS, validate, sentences, assemble };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RuleOfThree = api;
})(typeof window !== 'undefined' ? window : this);
