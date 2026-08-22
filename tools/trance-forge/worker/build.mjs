/**
 * Setzt prompts/refine.md in den Worker ein, damit der Prompt eine normale,
 * versionierte Datei bleibt statt eines String-Blocks im Code.
 *   node build.mjs && wrangler deploy
 */
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('./index.js', import.meta.url), 'utf8');
const prompt = readFileSync(new URL('../prompts/refine.md', import.meta.url), 'utf8');

if (!src.includes('__REFINE_PROMPT__')) {
  console.error('Platzhalter __REFINE_PROMPT__ fehlt in index.js.');
  process.exit(1);
}

const out = src.replace('`__REFINE_PROMPT__`', JSON.stringify(prompt));
writeFileSync(new URL('./index.build.js', import.meta.url), out);
console.log(`index.build.js geschrieben — Prompt: ${prompt.length} Zeichen.`);
