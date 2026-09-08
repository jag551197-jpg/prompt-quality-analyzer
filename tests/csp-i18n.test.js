import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync('public/index.html','utf8'),app=fs.readFileSync('public/app.js','utf8'),css=fs.readFileSync('public/styles.css','utf8'),toml=fs.readFileSync('netlify.toml','utf8');
test('CSP remains strict',()=>{assert.match(toml,/script-src 'self'/);assert.match(toml,/style-src 'self'/);assert.doesNotMatch(toml,/unsafe-inline/)});
test('no inline script/style/event handlers',()=>{assert.doesNotMatch(html,/<script(?![^>]*src=)[^>]*>/i);assert.doesNotMatch(html,/style\s*=/i);assert.doesNotMatch(html,/\son\w+\s*=/i);assert.doesNotMatch(app,/\.style\s*\./)});
test('language control and locale payload are wired',()=>{assert.match(html,/id="languageSwitcher"/);assert.match(app,/installLanguageUI\(\)/);assert.match(app,/ui_language:getLanguage\(\)/);assert.match(app,/response_language_instruction:languageInstruction\(\)/)});
test('all three locales and flags exist',()=>{const i=fs.readFileSync('public/i18n.js','utf8');for(const x of ['🇺🇸','🇧🇷','🇫🇷','en-US','pt-BR','fr-FR'])assert.ok(i.includes(x))});
