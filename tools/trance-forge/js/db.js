/**
 * Lokaler Speicher. Skripte, Rohaufnahmen und Renders bleiben auf dem Gerät.
 * Zum Anbieter geht nur, was für den jeweiligen Schritt gebraucht wird.
 */

const DB = 'trance-forge';
const VERSION = 3;

let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const req = indexedDB.open(DB, VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains('projects')) {
        const s = db.createObjectStore('projects', { keyPath: 'id' });
        s.createIndex('updated', 'updated');
      }
      if (!db.objectStoreNames.contains('takes')) {
        const s = db.createObjectStore('takes', { keyPath: 'id' });
        s.createIndex('projectId', 'projectId');
      }
      if (!db.objectStoreNames.contains('voices')) {
        db.createObjectStore('voices', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('glossary')) {
        // Ein Begriff, eine Umschreibung — projektübergreifend, damit dieselbe
        // Erklärung über die ganze Produktreihe gilt.
        const s = db.createObjectStore('glossary', { keyPath: 'term' });
        s.createIndex('updated', 'updated');
      }
      if (!db.objectStoreNames.contains('renders')) {
        const s = db.createObjectStore('renders', { keyPath: 'id' });
        s.createIndex('projectId', 'projectId');
      }
      void e;
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  return dbp;
}

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((res, rej) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let result;
    try { result = fn(s); } catch (e) { rej(e); return; }
    t.oncomplete = () => res(result?.result ?? result);
    t.onerror = () => rej(t.error);
  });
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ───────────── Projekte ───────────── */

export async function saveProject(p) {
  const rec = { ...p, updated: Date.now() };
  await tx('projects', 'readwrite', (s) => s.put(rec));
  return rec;
}

export async function getProject(id) {
  return tx('projects', 'readonly', (s) => s.get(id));
}

export async function listProjects() {
  const all = await tx('projects', 'readonly', (s) => s.getAll());
  return (all || []).sort((a, b) => b.updated - a.updated);
}

export async function deleteProject(id) {
  await tx('projects', 'readwrite', (s) => s.delete(id));
  for (const store of ['takes', 'renders']) {
    const items = await tx(store, 'readonly', (s) => s.index('projectId').getAll(id));
    await tx(store, 'readwrite', (s) => { (items || []).forEach((i) => s.delete(i.id)); });
  }
}

/* ───────────── Takes ───────────── */

export async function saveTake(t) {
  const rec = { id: uid(), created: Date.now(), ...t };
  await tx('takes', 'readwrite', (s) => s.put(rec));
  return rec;
}
export async function listTakes(projectId) {
  const all = await tx('takes', 'readonly', (s) => s.index('projectId').getAll(projectId));
  return (all || []).sort((a, b) => a.created - b.created);
}
export async function deleteTake(id) {
  return tx('takes', 'readwrite', (s) => s.delete(id));
}

/* ───────────── Stimmprofile ───────────── */

export async function saveVoice(v) {
  await tx('voices', 'readwrite', (s) => s.put(v));
  return v;
}
export async function listVoiceProfiles() {
  return (await tx('voices', 'readonly', (s) => s.getAll())) || [];
}
export async function deleteVoice(id) {
  return tx('voices', 'readwrite', (s) => s.delete(id));
}

/* ───────────── Renders ───────────── */

export async function saveRender(r) {
  const rec = { id: uid(), created: Date.now(), ...r };
  await tx('renders', 'readwrite', (s) => s.put(rec));
  return rec;
}
export async function listRenders(projectId) {
  const all = await tx('renders', 'readonly', (s) => s.index('projectId').getAll(projectId));
  return (all || []).sort((a, b) => b.created - a.created);
}

/* ───────────── Glossar ───────────── */

export async function listGlossary() {
  const all = await tx('glossary', 'readonly', (s) => s.getAll());
  return (all || []).sort((a, b) => a.term.localeCompare(b.term, 'de'));
}

/**
 * Neue Begriffe werden ergänzt, vorhandene NICHT überschrieben. Sobald eine
 * Umschreibung einmal freigegeben ist, gilt sie — sonst driftet die
 * Terminologie über die Produktreihe auseinander.
 */
export async function mergeGlossary(entries, { overwrite = false } = {}) {
  const existing = new Map((await listGlossary()).map((e) => [e.term, e]));
  const added = [];
  await tx('glossary', 'readwrite', (s) => {
    for (const { term, plain } of entries) {
      if (!term || !plain) continue;
      const prev = existing.get(term);
      if (prev && !overwrite) continue;
      s.put({ term, plain, updated: Date.now(), uses: (prev?.uses || 0) + 1 });
      if (!prev) added.push(term);
    }
  });
  return added;
}

export async function setGlossaryEntry(term, plain) {
  return tx('glossary', 'readwrite', (s) => s.put({ term, plain, updated: Date.now() }));
}

export async function deleteGlossaryEntry(term) {
  return tx('glossary', 'readwrite', (s) => s.delete(term));
}

export async function usage() {
  if (!navigator.storage?.estimate) return null;
  const e = await navigator.storage.estimate();
  return { used: e.usage, quota: e.quota };
}
