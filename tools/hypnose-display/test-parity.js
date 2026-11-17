// Prüft, dass rule-of-three.js exakt dieselben Sätze erzeugt wie das Python-Original.
// Aufruf im Ordner tools/hypnose-display:  node test-parity.js   (braucht python3)
const { execFileSync } = require('child_process');
const path = require('path');
const R = require('./rule-of-three.js');

const py = payload => execFileSync('python3', ['-I', '-c',
  'import json,sys;sys.path.insert(0,sys.argv[1]);from rule_of_three_generator import RuleOfThreeGenerator as G;print(G.assemble(json.loads(sys.argv[2])),end="")',
  path.join(__dirname, 'rule-of-three'), JSON.stringify(payload)], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

const custom = JSON.parse(JSON.stringify(R.SAMPLE));
custom.pace_pace_lead.pace_1 = '  Du sitzt hier  ';
custom.triad_items = { subject: 'Dein Atem', verb: 'wird', items: ['ruhig', 'tief', 'gleichmäßig'] };
custom.parts_synthesis.synthesis = 'völlig in Ordnung';

let bad = 0;
for (const [name, p] of [['SAMPLE', R.SAMPLE], ['custom (Leerzeichen, Umlaute)', custom]]) {
  const a = R.assemble(p), b = py(p);
  console.log((a === b ? 'OK   ' : 'FEHLER'), name, `${a.length} Zeichen`);
  if (a !== b) { bad++; console.log('JS:\n' + a + '\nPY:\n' + b); }
}
// Fehlerfall: nicht genau 3 Items muss in beiden Fassungen fehlschlagen
const broken = JSON.parse(JSON.stringify(R.SAMPLE)); broken.triad_items.items = ['a', 'b'];
let jsFail = false, pyFail = false;
try { R.assemble(broken); } catch (e) { jsFail = true; }
try { py(broken); } catch (e) { pyFail = true; }
console.log((jsFail && pyFail ? 'OK   ' : 'FEHLER'), 'zwei statt drei Items wird abgelehnt (JS und Python)');
if (!(jsFail && pyFail)) bad++;
console.log('validate(SAMPLE) =', R.validate(R.SAMPLE).length === 0 ? 'OK' : 'FEHLER', '| validate(broken) =', R.validate(broken));
process.exit(bad ? 1 : 0);
