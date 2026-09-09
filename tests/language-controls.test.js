import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');const i18n=fs.readFileSync(new URL('../public/i18n.js',import.meta.url),'utf8');const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');
test('three language controls are physically present in shipped HTML',()=>{for(const [id,code,flag] of [['langEn','en','🇺🇸'],['langPt','pt','🇧🇷'],['langFr','fr','🇫🇷']]){assert.match(html,new RegExp(`id="${id}"`));assert.match(html,new RegExp(`data-pqa-lang="${code}"`));assert.ok(html.includes(flag));}});
test('language controls use CSP-safe event listeners',()=>{assert.match(i18n,/addEventListener\("click"/);assert.doesNotMatch(html,/\sonclick\s*=/i);});
test('language controls are explicitly clickable',()=>{assert.match(css,/pointer-events:auto!important/);assert.match(css,/cursor:pointer!important/);});
