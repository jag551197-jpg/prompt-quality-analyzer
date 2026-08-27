import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePrompt } from '../src/core/analyze.js';

test('analysis emits progress and deterministic fallback without key', async () => {
  const events=[];
  const result=await analyzePrompt({prompt:'Tell me the latest tax rules. Always give a definitive answer.',context:'',intendedUse:'Research',requiresCurrentFacts:true},{geminiApiKey:''},{onEvent:e=>events.push(e)});
  assert.equal(result.mode,'deterministic-only');
  assert.equal(events[0].stage,'received');
  assert.equal(events.at(-1).stage,'complete');
  assert.equal(events.at(-1).progress,100);
  assert.ok(events.every(e=>typeof e.elapsed_ms==='number'));
});
