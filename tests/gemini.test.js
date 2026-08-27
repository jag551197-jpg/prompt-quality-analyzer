import test from 'node:test';
import assert from 'node:assert/strict';
import { judgeWithGemini, testGeminiConnection } from '../src/providers/gemini.js';

const validJudge = {
  scores: { instruction_clarity:90, context_sufficiency:80, grounding_constraints:70, uncertainty_handling:75, output_contract:85, tool_guidance:70, conflict_risk:90, context_efficiency:88 },
  hallucination_risk:'low', strengths:['clear'], weaknesses:[], risk_indicators:[], recommendations:['keep it clear'], improved_prompt:'Improved prompt', confidence:0.9
};

test('Gemini invalid key is categorized without leaking provider body', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('secret upstream details', { status:401 });
  try {
    await assert.rejects(
      () => judgeWithGemini({ prompt:'x', context:'', intendedUse:'general', requiresCurrentFacts:false, staticAnalysis:{} }, { apiKey:'bad', model:'test', rubricVersion:'1' }),
      e => e.category === 'authentication_failed' && e.status === 401 && !e.message.includes('secret upstream details')
    );
  } finally { globalThis.fetch = oldFetch; }
});

test('Gemini judge validates structured response and reports duration', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ output_text:JSON.stringify(validJudge) }), { status:200, headers:{'content-type':'application/json'} });
  try {
    const out = await judgeWithGemini({ prompt:'x', context:'', intendedUse:'general', requiresCurrentFacts:false, staticAnalysis:{} }, { apiKey:'ok', model:'test', rubricVersion:'1' });
    assert.equal(out.result.confidence, 0.9);
    assert.equal(out.meta.status, 200);
    assert.ok(out.meta.duration_ms >= 0);
  } finally { globalThis.fetch = oldFetch; }
});

test('connection test reports successful Gemini call', async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ output_text:JSON.stringify(validJudge) }), { status:200 });
  try {
    const out = await testGeminiConnection({ apiKey:'ok', model:'test' });
    assert.equal(out.ok, true);
    assert.equal(out.status, 200);
  } finally { globalThis.fetch = oldFetch; }
});
