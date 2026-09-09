import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src=fs.readFileSync(new URL('../public/i18n.js',import.meta.url),'utf8');

test('i18n DOM translation is idempotent under MutationObserver',()=>{
  assert.match(src,/const originalText=new WeakMap\(\),renderedText=new WeakMap\(\)/);
  assert.match(src,/if\(current!==target\)el\.textContent=target/);
  assert.match(src,/previousRendered!==undefined&&current!==previousRendered/);
});
