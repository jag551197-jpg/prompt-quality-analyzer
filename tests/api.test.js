import test from 'node:test';
import assert from 'node:assert/strict';
import { handleApi } from '../src/server/api-core.js';
test('/api/analyze and /api/health', async () => {
  const ok = await handleApi('POST', '/analyze', JSON.stringify({ prompt: 'Explain the policy below in 3 bullet points.', context: 'Policy text.' }));
  assert.equal(ok.status, 200); assert.ok(Number.isFinite(ok.body.score)); assert.ok(ok.body.security);
  assert.equal((await handleApi('POST', '/analyze', '{}')).status, 400);
  assert.equal((await handleApi('POST', '/analyze', JSON.stringify({ prompt: 'x'.repeat(20001) }))).status, 413);
  assert.equal((await handleApi('GET', '/health')).body.ok, true);
});
