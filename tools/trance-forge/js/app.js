import { parse, compile, retime, DEFAULTS, formatTime, estimateSpeech } from './trancescript.js';
import { harvest, breakSentences } from './harvest.js';
import { decodeAll, mix, toWav, verifyTiming } from './mixdown.js';
import * as api from './providers.js';
import * as db from './db.js';
import { Recorder, inspect, pickMimeType } from './recorder.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ═══════════ Zustand ═══════════ */

const state = {
  project: null,
  opts: {
    breathCycle: +(localStorage.getItem('tf.breath') || DEFAULTS.breathCycle),
    charsPerSecond: +(localStorage.getItem('tf.cps') || DEFAULTS.charsPerSecond),
  },
  parsed: { nodes: [], errors: [] },
  timeline: null,
  refineDraft: null,
  refineGlossary: [],
  harvestStats: null,
  voices: [],
  refSamples: [],
  challenge: null,
  rendering: null,
  lastRender: null,
};

/* ═══════════ Hilfen ═══════════ */

let toastTimer;
function toast(msg, isError = false) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.toggle('err', isError);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), isError ? 5200 : 2800);
}

function fail(e) {
  const msg = e?.hint ? `${e.message} ${e.hint}` : (e?.message || 'Unbekannter Fehler.');
  toast(msg, true);
  console.error(e);
}

function status(text) { $('#statusStrip').textContent = text || ''; }

function go(screen) {
  $$('.screen').forEach((s) => s.classList.toggle('hidden', s.dataset.screen !== screen));
  $$('#tabs button').forEach((b) => b.setAttribute('aria-current', String(b.dataset.go === screen)));
  window.scrollTo(0, 0);
  if (screen === 'edit') refreshEditor();
  if (screen === 'render') refreshVoiceSelect();
  if (screen === 'projects') refreshProjects();
  if (screen === 'settings') refreshStorage();
}

/* ═══════════ Projekte ═══════════ */

async function newProject(name) {
  const p = await db.saveProject({
    id: db.uid(),
    name: name || `Session ${new Date().toLocaleDateString('de-DE')}`,
    script: '',
    voiceId: null,
    bed: 'amber',
    bedGain: -24,
  });
  await loadProject(p.id);
  return p;
}

async function loadProject(id) {
  const p = await db.getProject(id);
  if (!p) return;
  state.project = p;
  $('#projectName').textContent = p.name;
  $('#edText').value = p.script || '';
  $('#selBed').value = p.bed || 'amber';
  $('#rngBed').value = p.bedGain ?? -24;
  $('#bedGainVal').textContent = `−${Math.abs(p.bedGain ?? -24)} dB`;
  localStorage.setItem('tf.lastProject', id);
  await refreshTakes();
  refreshEditor();
}

const saveScript = debounce(async () => {
  if (!state.project) return;
  state.project.script = $('#edText').value;
  await db.saveProject(state.project);
}, 700);

async function refreshProjects() {
  const list = $('#projectList');
  const items = await db.listProjects();
  list.innerHTML = '';
  for (const p of items) {
    const el = row(
      p.name,
      `${new Date(p.updated).toLocaleString('de-DE')} · ${(p.script || '').length} Zeichen`,
      [
        ['Öffnen', async () => { await loadProject(p.id); go('edit'); }],
        ['Löschen', async () => {
          if (!confirm(`„${p.name}" mit allen Takes und Renders löschen?`)) return;
          await db.deleteProject(p.id);
          if (state.project?.id === p.id) state.project = null;
          refreshProjects();
        }, 'danger'],
      ]
    );
    list.append(el);
  }
}

function row(title, sub, actions = []) {
  const el = document.createElement('div');
  el.className = 'item';
  const meta = document.createElement('div');
  meta.className = 'meta';
  const b = document.createElement('b'); b.textContent = title;
  const s = document.createElement('small'); s.textContent = sub;
  meta.append(b, s);
  el.append(meta);
  for (const [label, fn, cls] of actions) {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (cls) btn.className = cls;
    btn.onclick = fn;
    el.append(btn);
  }
  return el;
}

/* ═══════════ Aufnahme ═══════════ */

const rec = new Recorder();
let armed = false;
let recTarget = 'take'; // 'take' | 'reference' | 'challenge'

rec.addEventListener('level', (e) => {
  const { peak, clipped, elapsed } = e.detail;
  const lit = Math.min(5, Math.floor(peak * 6.2));
  $$('#levelRings .lr').forEach((r, i) => {
    r.classList.toggle('lit', i < lit && !clipped);
    r.classList.toggle('hot', clipped && i < lit);
  });
  if (elapsed) $('#recTime').textContent = formatTime(elapsed);
});

$('#btnArm').onclick = async () => {
  try {
    const mime = await rec.arm();
    armed = true;
    $('#btnArm').textContent = 'Mikrofon aktiv';
    $('#btnArm').disabled = true;
    $('#recHint').textContent = `Bereit · ${mime || 'Standardformat'} · Filter aus`;
  } catch (e) { fail(e); }
};

$('#btnRec').onclick = async () => {
  if (!armed) { toast('Erst das Mikrofon aktivieren.'); return; }
  const btn = $('#btnRec');
  if (btn.classList.contains('recording')) {
    const out = await rec.stop();
    btn.classList.remove('recording');
    $('#btnPause').disabled = true;
    if (out) await handleRecording(out);
  } else {
    rec.start();
    btn.classList.add('recording');
    $('#btnPause').disabled = false;
    $('#recHint').textContent = 'Läuft — sprich im Zieltempo.';
  }
};

$('#btnPause').onclick = () => {
  if (rec.rec?.state === 'recording') { rec.pause(); $('#btnPause').textContent = 'Weiter'; }
  else { rec.resume(); $('#btnPause').textContent = 'Pause'; }
};

async function handleRecording({ blob, duration, clipped, mimeType }) {
  const info = await inspect(blob).catch(() => null);
  if (clipped || info?.warnings.length) {
    toast(info?.warnings[0] || 'Aufnahme übersteuert.', true);
  }
  if (recTarget === 'take') {
    if (!state.project) await newProject();
    await db.saveTake({ projectId: state.project.id, blob, duration, mimeType, info });
    await refreshTakes();
    $('#recHint').textContent = `Take gespeichert · ${formatTime(duration)}`;
  } else if (recTarget === 'reference') {
    state.refSamples.push({ blob, duration, info });
    refreshReference();
  } else if (recTarget === 'challenge') {
    state.challenge.audio = blob;
    refreshChallenge();
  }
  recTarget = 'take';
}

async function refreshTakes() {
  if (!state.project) return;
  const takes = await db.listTakes(state.project.id);
  $('#takeCount').textContent = takes.length;
  const list = $('#takeList');
  list.innerHTML = '';
  takes.forEach((t, i) => {
    list.append(row(
      `Take ${i + 1}`,
      `${formatTime(t.duration)} · ${(t.blob.size / 1024 / 1024).toFixed(1)} MB${t.info?.warnings.length ? ' · ' + t.info.warnings.length + ' Hinweis' : ''}`,
      [
        ['▶', () => playBlob(t.blob)],
        ['⤓', () => exportTake(t, i + 1)],
        ['✕', async () => { await db.deleteTake(t.id); refreshTakes(); }, 'ghost'],
      ]
    ));
  });
}

/**
 * Rohtake herausgeben. Braucht keinen Anbieter und keinen Schlüssel — damit
 * lässt sich schon vor dem ersten API-Aufruf am großen Rechner prüfen, ob
 * Mikrofon, Raum und Pegel taugen.
 */
async function exportTake(t, nr) {
  const ext = t.mimeType?.includes('mp4') ? 'm4a' : t.mimeType?.includes('ogg') ? 'ogg' : 'webm';
  const name = `${(state.project?.name || 'take').replace(/[^\w-]+/g, '_')}_take${nr}.${ext}`;
  const file = new File([t.blob], name, { type: t.blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(t.blob);
  a.download = name;
  a.click();
}

let previewAudio;
function playBlob(blob) {
  previewAudio?.pause();
  previewAudio = new Audio(URL.createObjectURL(blob));
  previewAudio.play();
}

/* ═══════════ Ernte & Schärfen ═══════════ */

$('#btnTranscribe').onclick = async () => {
  if (!state.project) return toast('Kein Projekt geladen.');
  const takes = await db.listTakes(state.project.id);
  if (!takes.length) return toast('Erst einen Take aufnehmen.');

  const btn = $('#btnTranscribe');
  btn.disabled = true;
  try {
    let allWords = [];
    let offset = 0;
    for (let i = 0; i < takes.length; i++) {
      status(`Transkribiere Take ${i + 1} von ${takes.length}…`);
      const r = await api.transcribe(takes[i].blob);
      allWords.push(...r.words.map((w) => ({ ...w, start: w.start + offset, end: w.end + offset })));
      offset += takes[i].duration;
    }
    if (!allWords.length) throw new Error('Keine Wortzeitstempel erhalten — ohne sie geht die Timing-Ernte nicht.');

    const h = harvest(allWords, { breathHint: state.opts.breathCycle });
    state.harvestStats = h.stats;
    $('#edText').value = breakSentences(h.text);
    saveScript();
    showStats(h.stats);
    $('#btnRefine').disabled = false;
    status('');
    toast(`${h.stats.pauseCount} Pausen übernommen.`);
    go('edit');
  } catch (e) { fail(e); status(''); }
  finally { btn.disabled = false; }
};

function showStats(s) {
  $('#harvestStats').hidden = false;
  $('#statGrid').innerHTML = '';
  const rows = [
    ['Gesprochen', formatTime(s.spokenDuration)],
    ['Pausen erkannt', s.pauseCount],
    ['Pausenzeit gesamt', `${s.pauseTotal} s`],
    ['Längste Pause', `${s.longestPause} s`],
    ['Sprechrate', s.charsPerSecond ? `${s.charsPerSecond} Z/s` : '–'],
  ];
  for (const [k, v] of rows) {
    const a = document.createElement('span'); a.textContent = k;
    const b = document.createElement('span'); b.textContent = v;
    $('#statGrid').append(a, b);
  }
}

$('#btnAdoptCps').onclick = () => {
  const cps = state.harvestStats?.charsPerSecond;
  if (!cps) return;
  state.opts.charsPerSecond = cps;
  localStorage.setItem('tf.cps', cps);
  $('#rngCps').value = Math.round(cps * 10);
  $('#cpsVal').textContent = String(cps).replace('.', ',');
  refreshEditor();
  toast('Laufzeitschätzung nutzt jetzt deine Sprechrate.');
};

$('#btnRefine').onclick = async () => {
  const src = $('#edText').value.trim();
  if (!src) return toast('Kein Text zum Schärfen.');
  const btn = $('#btnRefine');
  btn.disabled = true;
  status('Schärfe…');
  try {
    const known = await db.listGlossary();
    const r = await api.refine(src, { glossary: known.map(({ term, plain }) => ({ term, plain })) });
    state.refineDraft = r.script;
    state.refineGlossary = r.glossary || [];
    renderDiff(src, r.script, r.notes);
    showNewTerms(state.refineGlossary, known);
    $('#diffWrap').classList.remove('hidden');
    go('refine');
  } catch (e) { fail(e); }
  finally { btn.disabled = false; status(''); }
};

$('#btnAcceptRefine').onclick = async () => {
  $('#edText').value = state.refineDraft;
  saveScript();
  // Erst mit dem Übernehmen wandern die Begriffe ins Glossar. Ein verworfener
  // Vorschlag darf die Terminologie nicht verändern.
  const added = await db.mergeGlossary(state.refineGlossary || []);
  await refreshGlossary();
  $('#diffWrap').classList.add('hidden');
  refreshEditor();
  go('edit');
  toast(added.length ? `Übernommen · ${added.length} neue Begriffe im Glossar.` : 'Übernommen.');
};
$('#btnRejectRefine').onclick = () => {
  state.refineDraft = null;
  state.refineGlossary = [];
  $('#newTerms').innerHTML = '';
  $('#diffWrap').classList.add('hidden');
};

function showNewTerms(terms, known) {
  const map = new Map(known.map((k) => [k.term, k.plain]));
  const el = $('#newTerms');
  el.innerHTML = '';
  for (const t of terms) {
    const d = document.createElement('div');
    if (!map.has(t.term)) d.textContent = `Neu im Glossar: ${t.term} — ${t.plain}`;
    else if (map.get(t.term) !== t.plain) { d.className = 'warn'; d.textContent = `Abweichung bei „${t.term}": Glossar sagt „${map.get(t.term)}", Vorschlag sagt „${t.plain}".`; }
    else continue;
    el.append(d);
  }
}

/* ═══════════ Glossar ═══════════ */

async function refreshGlossary() {
  const entries = await db.listGlossary();
  $('#glossCount').textContent = entries.length;
  const list = $('#glossList');
  list.innerHTML = '';
  for (const e of entries) {
    list.append(row(e.term, e.plain, [
      ['✎', async () => {
        const v = prompt(`Umschreibung für „${e.term}"`, e.plain);
        if (v === null || !v.trim()) return;
        await db.setGlossaryEntry(e.term, v.trim());
        refreshGlossary();
      }],
      ['✕', async () => { await db.deleteGlossaryEntry(e.term); refreshGlossary(); }, 'ghost'],
    ]));
  }
}

$('#btnAddTerm').onclick = async () => {
  const term = prompt('Fachbegriff?');
  if (!term?.trim()) return;
  const plain = prompt(`Umschreibung für „${term.trim()}" — ein Halbsatz, keine Definition.`);
  if (!plain?.trim()) return;
  await db.mergeGlossary([{ term: term.trim(), plain: plain.trim() }], { overwrite: true });
  refreshGlossary();
  toast('Ergänzt.');
};

/* Export im Format des mindful7777-Wissensordners. */
$('#btnExportGloss').onclick = async () => {
  const entries = await db.listGlossary();
  if (!entries.length) return toast('Glossar ist leer.');
  const today = new Date().toISOString().slice(0, 10);
  const md = [
    '# KNOWLEDGE: glossar.md',
    `Zuletzt aktualisiert: ${today}`,
    'Quelle: TranceForge — automatisch beim Schärfen ergänzt.',
    '',
    'Jeder Fachbegriff wird im Skript im selben Atemzug aufgelöst:',
    'erst der Begriff, dann die Empfindung. Die Umschreibung hier ist',
    'verbindlich — derselbe Begriff wird nicht zweimal anders erklärt.',
    '',
    '| Begriff | Umschreibung |',
    '|---|---|',
    ...entries.map((e) => `| ${e.term} | ${e.plain.replace(/\|/g, '\\|')} |`),
    '',
  ].join('\n');
  const blob = new Blob([md], { type: 'text/markdown' });
  const file = new File([blob], 'glossar.md', { type: 'text/markdown' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'glossar.md' }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'glossar.md';
  a.click();
};

/* Wort-Diff über LCS. Der Vorschlag wird nie still übernommen —
   sichtbare Änderungen sind der einzige Weg, dem Schliff zu trauen. */
function renderDiff(a, b, notes = []) {
  const A = a.split(/(\s+)/);
  const B = b.split(/(\s+)/);
  const m = A.length, n = B.length;
  const L = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);

  const out = [];
  let i = 0, j = 0, changes = 0;
  while (i < m && j < n) {
    if (A[i] === B[j]) { out.push(esc(A[i])); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { out.push(`<del>${esc(A[i])}</del>`); i++; changes++; }
    else { out.push(`<ins>${esc(B[j])}</ins>`); j++; changes++; }
  }
  while (i < m) { out.push(`<del>${esc(A[i++])}</del>`); changes++; }
  while (j < n) { out.push(`<ins>${esc(B[j++])}</ins>`); changes++; }

  $('#diffView').innerHTML = out.join('');
  $('#diffCount').textContent = `${changes} Änderungen`;
  $('#refineNotes').innerHTML = '';
  notes.forEach((n) => {
    const d = document.createElement('div');
    d.textContent = n;
    $('#refineNotes').append(d);
  });
}

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/* ═══════════ Editor ═══════════ */

const ed = $('#edText');
const hl = $('#edHighlight');

ed.addEventListener('input', () => { refreshEditor(); saveScript(); });
ed.addEventListener('scroll', () => { hl.scrollTop = ed.scrollTop; });

function highlight(src) {
  return esc(src)
    .replace(/^%%.*$/gm, (m) => `<span class="tok-comment">${m}</span>`)
    .replace(/^@phase:[\w-]+/gm, (m) => `<span class="tok-phase">${m}</span>`)
    .replace(/#anchor:[\w-]+/g, (m) => `<span class="tok-anchor">${m}</span>`)
    .replace(/^(\s*)&gt;&gt;/gm, (_, w) => `${w}<span class="tok-breath">&gt;&gt;</span>`)
    .replace(/\[\d+(?:\.\d+)?~\]/g, (m) => `<span class="tok-snap">${m}</span>`)
    .replace(/\[\d+(?:\.\d+)?\]/g, (m) => `<span class="tok-pause">${m}</span>`)
    .replace(/\/\/[^/\n]*\/\//g, (m) => `<span class="tok-layer">${m}</span>`)
    .replace(/~~[^~\n]*~~/g, (m) => `<span class="tok-speed">${m}</span>`)
    .replace(/~[^~\n]*~/g, (m) => `<span class="tok-speed">${m}</span>`)
    .replace(/\*[^*\n]+\*/g, (m) => `<span class="tok-emph">${m}</span>`);
}

function refreshEditor() {
  const src = ed.value;
  hl.innerHTML = highlight(src) + '\n';

  state.parsed = parse(src);
  state.timeline = compile(state.parsed, state.opts);

  $('#edRuntime').textContent = formatTime(state.timeline.total);
  $('#edChars').textContent = `${state.timeline.charCount} Zeichen`;
  $('#edCost').textContent = costLabel(state.timeline.charCount);

  const errs = $('#edErrors');
  errs.innerHTML = '';
  state.parsed.errors.slice(0, 4).forEach((e) => {
    const d = document.createElement('div');
    d.textContent = `Zeile ${e.line}: ${e.msg}`;
    errs.append(d);
  });

  drawTimeline();
}

/* Zeichen kosten Geld. Ohne Anzeige merkt man das erst auf der Rechnung. */
function costLabel(chars) {
  const perChar = +(localStorage.getItem('tf.pricePerChar') || 0.00018);
  if (!perChar) return `${chars} Z`;
  return `≈ ${(chars * perChar).toFixed(2)} €`;
}

function drawTimeline() {
  const c = $('#tlCanvas');
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = 56;
  c.width = w * dpr; c.height = h * dpr;
  const g = c.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);

  const tl = state.timeline;
  if (!tl || tl.total <= 0) return;
  const px = w / tl.total;

  // Atemraster
  g.strokeStyle = 'rgba(136,80,5,.45)';
  g.lineWidth = 1;
  for (let t = 0; t < tl.total; t += tl.breathCycle) {
    g.beginPath(); g.moveTo(t * px, 0); g.lineTo(t * px, h); g.stroke();
  }

  for (const s of tl.segments) {
    if (s.kind === 'silence') continue;
    const x = s.at * px, bw = Math.max(1.5, s.duration * px);
    if (s.track === 'layer') {
      g.fillStyle = 'rgba(111,168,160,.55)';
      g.fillRect(x, 40, bw, 8);
    } else {
      const alpha = s.speed < 0.7 ? 0.95 : s.speed < 0.9 ? 0.72 : 0.5;
      g.fillStyle = `rgba(232,160,32,${alpha})`;
      g.fillRect(x, 12, bw, 24);
    }
  }

  g.fillStyle = 'rgba(212,168,71,.85)';
  g.font = '9px ui-monospace, monospace';
  tl.phases.forEach((p) => {
    g.fillRect(p.at * px, 0, 1, 10);
    g.fillText(p.name.slice(0, 12), p.at * px + 3, 8);
  });
  tl.anchors.forEach((a) => {
    g.fillStyle = 'rgba(111,168,106,.9)';
    g.fillRect(a.at * px - 1, 36, 2, 12);
  });
}

window.addEventListener('resize', debounce(drawTimeline, 150));

/* Werkzeugleiste — auf dem Handy tippt niemand Sonderzeichen. */
$$('#edToolbar button[data-ins], #edToolbar button[data-wrap]').forEach((b) => {
  b.onmousedown = (e) => e.preventDefault();
  b.onclick = () => {
    const { selectionStart: s, selectionEnd: e, value: v } = ed;
    if (b.dataset.wrap) {
      const t = b.dataset.wrap;
      ed.value = v.slice(0, s) + t + v.slice(s, e) + t + v.slice(e);
      ed.setSelectionRange(s + t.length, e + t.length);
    } else {
      const t = b.dataset.ins;
      ed.value = v.slice(0, s) + t + v.slice(e);
      ed.setSelectionRange(s + t.length, s + t.length);
    }
    ed.focus();
    refreshEditor(); saveScript();
  };
});

/* Zeile vorhören: rendert nur diese eine Zeile. Beim Iterieren spart das
   gegenüber vollen Durchläufen sowohl Wartezeit als auch Kontingent. */
$('#btnPreviewLine').onclick = async () => {
  const voiceId = state.project?.voiceId || $('#selVoice').value;
  if (!voiceId) return toast('Erst ein Stimmprofil wählen.');
  const before = ed.value.slice(0, ed.selectionStart);
  const lineNo = before.split('\n').length;
  const p = parse(ed.value.split('\n')[lineNo - 1] || '');
  const seg = p.nodes.find((n) => n.kind === 'speech');
  if (!seg) return toast('Auf dieser Zeile steht kein Text.');
  try {
    status('Zeile wird vorbereitet…');
    const buf = await api.previewLine(seg.text, seg.speed, voiceId);
    const ctx = new AudioContext();
    const src = ctx.createBufferSource();
    src.buffer = await ctx.decodeAudioData(buf);
    src.connect(ctx.destination);
    src.start();
    status('');
  } catch (e) { fail(e); status(''); }
};

/* ═══════════ Render ═══════════ */

function refreshVoiceSelect() {
  const sel = $('#selVoice');
  sel.innerHTML = '';
  if (!state.voices.length) {
    sel.innerHTML = '<option value="">Kein Profil — erst Stimme klonen</option>';
    return;
  }
  state.voices.forEach((v) => {
    const o = document.createElement('option');
    o.value = v.voice_id || v.id;
    o.textContent = v.name;
    sel.append(o);
  });
  if (state.project?.voiceId) sel.value = state.project.voiceId;
}

$('#selVoice').onchange = async () => {
  if (!state.project) return;
  state.project.voiceId = $('#selVoice').value;
  await db.saveProject(state.project);
};
$('#selBed').onchange = async () => {
  if (!state.project) return;
  state.project.bed = $('#selBed').value;
  await db.saveProject(state.project);
};
$('#rngBed').oninput = (e) => {
  $('#bedGainVal').textContent = `−${Math.abs(e.target.value)} dB`;
  if (state.project) { state.project.bedGain = +e.target.value; saveProjectDebounced(); }
};
$('#rngBreath').oninput = (e) => {
  const v = e.target.value / 10;
  state.opts.breathCycle = v;
  localStorage.setItem('tf.breath', v);
  $('#breathVal').textContent = `${String(v).replace('.', ',')} s`;
  refreshEditor();
};
const saveProjectDebounced = debounce(() => db.saveProject(state.project), 500);

function ringProgress(pct) {
  $('#renderPct').textContent = `${Math.round(pct * 100)}%`;
  const rings = $$('#renderRings .rr');
  const lit = pct * rings.length;
  rings.forEach((r, i) => {
    r.classList.toggle('done', i < Math.floor(lit));
    r.classList.toggle('active', i === Math.floor(lit) && pct < 1);
  });
}

$('#btnRender').onclick = async () => {
  const voiceId = $('#selVoice').value;
  if (!voiceId) return toast('Kein Stimmprofil gewählt.');
  if (!state.timeline?.segments.length) return toast('Kein Skript im Editor.');
  if (state.parsed.errors.length && !confirm(`${state.parsed.errors.length} Syntaxfehler im Skript. Trotzdem rendern?`)) return;

  const ctrl = new AbortController();
  state.rendering = ctrl;
  $('#btnRender').disabled = true;
  $('#btnCancelRender').classList.remove('hidden');
  $('#renderResult').classList.add('hidden');

  try {
    // 1 — Segmente sequenziell synthetisieren (Prosodie-Kette)
    $('#renderStatus').textContent = 'Stimme wird erzeugt…';
    const { results, failed } = await api.renderSegments(state.timeline, voiceId, {
      signal: ctrl.signal,
      onProgress: ({ done, total, failed: f }) => {
        ringProgress((done / total) * 0.7);
        $('#renderStatus').textContent = `Segment ${done} von ${total}${f ? ` · ${f} fehlgeschlagen` : ''}`;
      },
    });
    if (!results.length) throw new Error('Kein einziges Segment gerendert.');

    // 2 — dekodieren
    $('#renderStatus').textContent = 'Dekodiere…';
    const buffers = await decodeAll(results, (p) => ringProgress(0.7 + p * 0.12));

    // 3 — Timeline mit den ECHTEN Dauern neu rechnen. Erst dadurch stimmen
    //     die Positionen; die Schätzung war nur für die Editor-Vorschau.
    const durations = new Map([...buffers].map(([id, b]) => [id, b.duration]));
    const exact = retime(state.parsed, state.opts, durations);

    // 4 — mischen
    $('#renderStatus').textContent = 'Mische…';
    ringProgress(0.88);
    const rendered = await mix(exact, buffers, {
      bed: $('#selBed').value,
      bedGain: +$('#rngBed').value,
    });

    ringProgress(1);
    const blob = toWav(rendered);
    state.lastRender = { blob, exact };

    const issues = verifyTiming(exact, buffers);
    showRenderResult(blob, exact, issues, failed);
    $('#renderStatus').textContent = `Fertig · ${formatTime(rendered.duration)}`;

    if (state.project) {
      await db.saveRender({ projectId: state.project.id, blob, duration: rendered.duration });
    }
  } catch (e) {
    if (e.name === 'AbortError') { $('#renderStatus').textContent = 'Abgebrochen.'; ringProgress(0); }
    else { fail(e); $('#renderStatus').textContent = e.hint || ''; }
  } finally {
    state.rendering = null;
    $('#btnRender').disabled = false;
    $('#btnCancelRender').classList.add('hidden');
  }
};

$('#btnCancelRender').onclick = () => state.rendering?.abort();

function showRenderResult(blob, exact, issues, failed) {
  $('#renderResult').classList.remove('hidden');
  $('#player').src = URL.createObjectURL(blob);

  const v = $('#verifyList');
  v.innerHTML = '';
  const add = (text, cls) => {
    const d = document.createElement('div');
    d.textContent = text; if (cls) d.className = cls;
    v.append(d);
  };
  const silences = exact.segments.filter((s) => s.kind === 'silence');
  const total = silences.reduce((a, s) => a + s.duration, 0);
  add(`${silences.length} Pausen, ${total.toFixed(1)} s Stille — exakt gesetzt.`, 'ok');
  add(`Atemzyklus ${String(exact.breathCycle).replace('.', ',')} s`, 'ok');
  issues.forEach((i) => add(i, 'warn'));

  const f = $('#failedList');
  f.innerHTML = '';
  failed.forEach((x) => {
    const d = document.createElement('div');
    d.className = 'warn';
    d.textContent = `Zeile ${x.line} fehlgeschlagen: „${x.text.slice(0, 40)}…"`;
    f.append(d);
  });
}

$('#btnDownload').onclick = () => {
  if (!state.lastRender) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(state.lastRender.blob);
  a.download = `${(state.project?.name || 'session').replace(/[^\w-]+/g, '_')}.wav`;
  a.click();
};

$('#btnShare').onclick = async () => {
  if (!state.lastRender) return;
  const file = new File([state.lastRender.blob], `${(state.project?.name || 'session')}.wav`, { type: 'audio/wav' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: state.project?.name }); }
    catch (e) { if (e.name !== 'AbortError') $('#btnDownload').click(); }
  } else {
    $('#btnDownload').click();
  }
};

/* ═══════════ Stimmprofil ═══════════ */

const REF_PASSAGES = [
  'Setz dich hin. Oder leg dich hin. Das ist die letzte Entscheidung, die du in den nächsten zwanzig Minuten triffst.',
  'Such dir einen Punkt. Irgendeinen Punkt vor dir, leicht über Augenhöhe. Und dort bleibst du jetzt.',
  'Deine Augen werden gleich anfangen zu brennen, und sie werden schwer, und du hältst sie trotzdem offen.',
  'Zehn. Dein Kiefer löst sich. Neun. Die Schultern rutschen nach unten, weg von den Ohren. Acht. Deine Arme werden schwer.',
  'Deine Schultern sind bereits schwerer als vor dreißig Sekunden. Das ist keine Behauptung, das ist Physiologie.',
  'Während du hier liegst, arbeitet dein Körper. Er arbeitet härter als im Training. Reparatur passiert nicht unter Last.',
  'Spür die Wärme in deinen Beinen. Sie ist da, weil deine Gefäße sich geweitet haben.',
  'Diese Schwere ist kein Zufall. Diese Schwere ist Regeneration, die du fühlen kannst.',
  'Ich zähle jetzt hoch. Bei fünf bist du wach, klar und ausgeruht. Eins. Der Kreislauf kommt zurück.',
  'Bleib noch eine Minute sitzen, bevor du aufstehst. Trink etwas. Wir sind fertig.',
];
const REF_TARGET = 180; // Sekunden — Untergrenze für ein tragfähiges Profil
let refIndex = 0;

function refreshReference() {
  $('#refPassage').textContent = REF_PASSAGES[refIndex % REF_PASSAGES.length];
  const total = state.refSamples.reduce((a, s) => a + s.duration, 0);
  $('#refProgress').firstElementChild.style.width = `${Math.min(100, (total / REF_TARGET) * 100)}%`;
  $('#refTarget').textContent = `${formatTime(total)} von ${formatTime(REF_TARGET)} · Ziel für ein tragfähiges Profil`;

  const list = $('#refList');
  list.innerHTML = '';
  state.refSamples.forEach((s, i) => {
    list.append(row(
      `Passage ${i + 1}`,
      `${formatTime(s.duration)}${s.info?.warnings.length ? ' · ' + s.info.warnings[0] : ''}`,
      [
        ['▶', () => playBlob(s.blob)],
        ['✕', () => { state.refSamples.splice(i, 1); refreshReference(); }, 'ghost'],
      ]
    ));
  });
  updateCloneButton();
}

$('#btnRefNext').onclick = () => { refIndex++; refreshReference(); };

$('#btnRefRec').onclick = async () => {
  if (!armed) { try { await rec.arm(); armed = true; } catch (e) { return fail(e); } }
  recTarget = 'reference';
  if (rec.rec?.state === 'recording') {
    const out = await rec.stop();
    $('#btnRefRec').textContent = 'Passage aufnehmen';
    if (out) await handleRecording(out);
  } else {
    rec.start();
    $('#btnRefRec').textContent = 'Aufnahme beenden';
  }
};

function newChallenge() {
  const words = ['anker', 'theta', 'kadenz', 'resonanz', 'zyklus', 'schwelle'];
  const w = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  state.challenge = {
    phrase: `mindful sieben-sieben-sieben. Referenzaufnahme ${w} ${n}. Dies ist meine eigene Stimme, und ich stimme dem Klonen zu. Aufgenommen am ${new Date().toLocaleDateString('de-DE')}.`,
    audio: null,
    createdAt: Date.now(),
  };
  refreshChallenge();
}

function refreshChallenge() {
  $('#challengePhrase').textContent = state.challenge?.phrase || '';
  $('#challengeState').textContent = state.challenge?.audio ? 'Bestätigung aufgenommen.' : 'Noch nicht aufgenommen.';
  updateCloneButton();
}

$('#btnChallengeNew').onclick = newChallenge;

$('#btnChallengeRec').onclick = async () => {
  if (!armed) { try { await rec.arm(); armed = true; } catch (e) { return fail(e); } }
  recTarget = 'challenge';
  if (rec.rec?.state === 'recording') {
    const out = await rec.stop();
    $('#btnChallengeRec').textContent = 'Bestätigungssatz aufnehmen';
    if (out) await handleRecording(out);
  } else {
    rec.start();
    $('#btnChallengeRec').textContent = 'Aufnahme beenden';
  }
};

function updateCloneButton() {
  const total = state.refSamples.reduce((a, s) => a + s.duration, 0);
  const ok = total >= 60 && !!state.challenge?.audio;
  $('#btnClone').disabled = !ok;
  $('#cloneState').textContent = !state.challenge?.audio
    ? 'Ohne Bestätigungsaufnahme wird kein Profil erzeugt.'
    : total < 60 ? `Noch ${formatTime(60 - total)} Referenzmaterial nötig.`
    : total < REF_TARGET ? `${formatTime(total)} — nutzbar, ab ${formatTime(REF_TARGET)} deutlich besser.`
    : 'Bereit.';
}

$('#btnClone').onclick = async () => {
  $('#btnClone').disabled = true;
  status('Stimmprofil wird erzeugt…');
  try {
    const r = await api.cloneVoice({
      name: `mindful7777 · ${new Date().toLocaleDateString('de-DE')}`,
      samples: state.refSamples.map((s) => s.blob),
      challengeAudio: state.challenge.audio,
      challengePhrase: state.challenge.phrase,
    });
    await db.saveVoice({
      id: r.voice_id,
      name: r.name,
      consent_recorded_at: new Date(state.challenge.createdAt).toISOString(),
      challenge_phrase: state.challenge.phrase,
      challenge_audio: state.challenge.audio,
      sampleSeconds: Math.round(state.refSamples.reduce((a, s) => a + s.duration, 0)),
    });
    await loadVoices();
    toast('Stimmprofil erzeugt.');
    newChallenge();
    state.refSamples = [];
    refreshReference();
  } catch (e) { fail(e); }
  finally { $('#btnClone').disabled = false; status(''); }
};

async function loadVoices() {
  try { state.voices = await api.listVoices(); }
  catch { state.voices = []; }
  const local = await db.listVoiceProfiles();
  const list = $('#voiceList');
  list.innerHTML = '';
  for (const v of local) {
    list.append(row(
      v.name,
      `${v.sampleSeconds}s Referenz · Einwilligung ${new Date(v.consent_recorded_at).toLocaleDateString('de-DE')}`,
      [['✕', async () => { await db.deleteVoice(v.id); loadVoices(); }, 'ghost']]
    ));
  }
  refreshVoiceSelect();
}

/* ═══════════ Einstellungen ═══════════ */

$('#btnSaveConn').onclick = () => {
  api.configure({ base: $('#inpBase').value.trim(), token: $('#inpToken').value.trim() });
  toast('Gespeichert.');
  checkHealth();
};

$('#btnTestConn').onclick = async () => {
  $('#connState').textContent = 'Prüfe…';
  try {
    const h = await api.health();
    $('#connState').textContent = `Erreichbar · STT ${h.stt ? 'ja' : 'nein'} · TTS ${h.tts ? 'ja' : 'nein'} · LLM ${h.llm ? 'ja' : 'nein'}`;
  } catch (e) { $('#connState').textContent = `${e.message} ${e.hint || ''}`; }
};

$('#rngCps').oninput = (e) => {
  const v = e.target.value / 10;
  state.opts.charsPerSecond = v;
  localStorage.setItem('tf.cps', v);
  $('#cpsVal').textContent = String(v).replace('.', ',');
  refreshEditor();
};

async function refreshStorage() {
  const u = await db.usage();
  $('#storageInfo').textContent = u
    ? `${(u.used / 1048576).toFixed(1)} MB von ${(u.quota / 1048576).toFixed(0)} MB belegt`
    : 'Belegung nicht abfragbar.';
}

$('#btnWipe').onclick = async () => {
  if (!confirm('Alle Projekte, Takes, Renders und Stimmprofile auf diesem Gerät löschen?')) return;
  for (const p of await db.listProjects()) await db.deleteProject(p.id);
  for (const v of await db.listVoiceProfiles()) await db.deleteVoice(v.id);
  state.project = null;
  toast('Gelöscht.');
  refreshStorage(); refreshProjects();
};

/* ═══════════ Start ═══════════ */

$$('#tabs button').forEach((b) => { b.onclick = () => go(b.dataset.go); });
$('#btnProjects').onclick = () => go('projects');
$('#btnNewProject').onclick = async () => {
  const name = prompt('Name der Session?');
  if (name === null) return;
  await newProject(name.trim());
  go('edit');
};

async function checkHealth() {
  const badge = $('#netBadge');
  if (!navigator.onLine) { badge.className = 'badge off'; badge.textContent = 'offline'; return; }
  try { await api.health(); badge.className = 'badge on'; badge.textContent = 'bereit'; }
  catch { badge.className = 'badge off'; badge.textContent = 'kein worker'; }
}
window.addEventListener('online', checkHealth);
window.addEventListener('offline', checkHealth);

function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

(async function init() {
  const c = api.getConfig();
  $('#inpBase').value = c.base;
  $('#inpToken').value = c.token;
  $('#rngCps').value = Math.round(state.opts.charsPerSecond * 10);
  $('#cpsVal').textContent = String(state.opts.charsPerSecond).replace('.', ',');
  $('#rngBreath').value = Math.round(state.opts.breathCycle * 10);
  $('#breathVal').textContent = `${String(state.opts.breathCycle).replace('.', ',')} s`;

  if (!window.isSecureContext) {
    $('#recHint').textContent = 'Kein sicherer Kontext — der Browser gibt das Mikrofon nur über HTTPS oder localhost frei.';
    $('#btnArm').disabled = true;
  } else if (!pickMimeType()) {
    $('#recHint').textContent = 'Dieser Browser unterstützt keine Aufnahme.';
  }

  const last = localStorage.getItem('tf.lastProject');
  if (last) await loadProject(last).catch(() => {});
  if (!state.project) await newProject();

  newChallenge();
  refreshReference();
  await refreshGlossary();
  await loadVoices();
  go('record');
  checkHealth();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
