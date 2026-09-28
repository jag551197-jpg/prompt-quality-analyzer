import fs from 'node:fs';
const html=fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const mod=fs.readFileSync(new URL('../public/i18n.js',import.meta.url),'utf8');
function catalog(lang){
  const initial=mod.match(/const CATALOG=\{pt:(\{[\s\S]*?\}),fr:(\{[\s\S]*?\})\};Object\.assign/);
  if(!initial)throw new Error('initial catalogs missing');
  const base=lang==='pt'?initial[1]:initial[2];
  const out=JSON.parse(base);
  const re=new RegExp(`Object\\.assign\\(CATALOG\\.${lang},\\s*(\\{[\\s\\S]*?\\})\\);`,'g');
  for(const m of mod.matchAll(re))Object.assign(out,JSON.parse(m[1]));
  return out;
}
const pt=catalog('pt'),fr=catalog('fr');
const clean=html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
const texts=[...clean.matchAll(/>([^<>]+)</g)].map(x=>x[1].replace(/\s+/g,' ').trim()).filter(Boolean);
const attrs=[...clean.matchAll(/\s(?:placeholder|title|aria-label)="([^"]+)"/g)].map(x=>x[1].trim()).filter(Boolean);
const visible=[...texts,...attrs];
const dynamic=/^\d+( analyses| improvements generated| improved instructions| files| chars| sources)$/;
const technical=/^(PQA|PQA Guard Community|Prompt|ORIGINAL|P|GitHub|Benchmark|Benchmark v[\d.]+|v[\d.]+|v[\d.]+ · \d+ cases|\/100|\d+|—|\$\d|0%|0\.0s|0\.00h|0\/3|Evidence-tiered v3|evidence-tiered-v3|PQA Savings Model v1\.0|Community Online|EN|PT|FR|English|Português \(Brasil\)|Français|\.txt \.md \.json \.csv \.yaml \.js \.ts \.py \.html \.xml \.log)$/i;
for(const [lang,cat] of [['PT-BR',pt],['FR',fr]]){
 const missing=[...new Set(visible.filter(x=>/[A-Za-zÀ-ÿ]/.test(x)&&!technical.test(x)&&!dynamic.test(x)&&!cat[x]&&!/^PQA v/.test(x)))];
 if(missing.length){console.error(`Untranslated ${lang} user-facing strings:\n`+missing.map(x=>' - '+x).join('\n'));process.exit(1)}
}

for(const [lang,cat] of [['PT-BR',pt],['FR',fr]]){
  const untranslatedValues=[...new Set(visible.filter(x=>/[A-Za-zÀ-ÿ]/.test(x)&&!technical.test(x)&&!dynamic.test(x)&&cat[x]===x))];
  if(untranslatedValues.length){console.error(`Identity/fallback ${lang} strings:\n`+untranslatedValues.map(x=>' - '+x).join('\n'));process.exit(1)}
}
console.log(`Community i18n coverage PASS (${visible.length} text/attribute strings checked; PT=${Object.keys(pt).length}; FR=${Object.keys(fr).length}; identity fallbacks=0)`);
