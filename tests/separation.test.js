// The Community Edition must stay generic: no weight tables, dimension names or profile scoring from any other engine.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const files = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['node_modules', '.git'].includes(e.name) ? [] : files(path.join(d, e.name))) : [path.join(d, e.name)]);
test('no weight profiles, scoring dimensions or calibration in the Community source', () => {
  const banned = /WEIGHT_PROFILES|weightedScore|weightsFor|instruction_clarity|context_sufficiency|grounding_constraints|uncertainty_handling|output_contract|conflict_risk|context_efficiency|hallucination_pressure|calibratedOverall|risk_index/;
  for (const f of files('.').filter(f => /\.(js|mjs|json|md|html)$/.test(f) && !f.includes('tests/separation.test.js'))) assert.ok(!banned.test(fs.readFileSync(path.join(root, f), 'utf8')), f);
});
