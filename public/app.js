// PQA Community Edition 2.0 — browser app. The analysis runs locally (engine.js); nothing is sent to a server.
import { analyzePrompt, ENGINE_VERSION } from './engine.js';
import { scanText } from './guard.js';

const UI = {
  pt: { Language: 'Idioma', 'Check your prompt': 'Verifique seu prompt', intro: 'Uma checklist gratuita e de código aberto de boas práticas de confiabilidade de prompts. Tudo roda no seu navegador; nada é enviado.', Prompt: 'Prompt', 'Material (optional)': 'Material (opcional)', 'Check prompt': 'Verificar prompt', Score: 'Pontuação', Quality: 'Qualidade', Risk: 'Risco', Checklist: 'Checklist', 'Security scan': 'Verificação de segurança', 'Improved prompt': 'Prompt melhorado', Copy: 'Copiar', Copied: 'Copiado', method: 'Como a pontuação funciona: cada verificação aplicável vale o mesmo; a pontuação é a parcela das verificações aplicáveis que passam.', footer: 'A PQA Community Edition é de código aberto (MIT).', pass: 'OK', fail: 'Corrigir', not_applicable: 'N/A', good: 'Boa', fair: 'Regular', needs_work: 'Precisa melhorar', low: 'Baixo', medium: 'Médio', high: 'Alto', clear: 'Nada encontrado' },
  fr: { Language: 'Langue', 'Check your prompt': 'Vérifiez votre prompt', intro: 'Une checklist gratuite et open source des bonnes pratiques de fiabilité des prompts. Tout s\'exécute dans votre navigateur ; rien n\'est envoyé.', Prompt: 'Prompt', 'Material (optional)': 'Contenu (facultatif)', 'Check prompt': 'Vérifier le prompt', Score: 'Score', Quality: 'Qualité', Risk: 'Risque', Checklist: 'Checklist', 'Security scan': 'Analyse de sécurité', 'Improved prompt': 'Prompt amélioré', Copy: 'Copier', Copied: 'Copié', method: 'Fonctionnement du score : chaque vérification applicable compte autant ; le score est la part des vérifications applicables réussies.', footer: 'PQA Community Edition est open source (MIT).', pass: 'OK', fail: 'À corriger', not_applicable: 'N/A', good: 'Bonne', fair: 'Moyenne', needs_work: 'À améliorer', low: 'Faible', medium: 'Moyen', high: 'Élevé', clear: 'Rien détecté' },
  en: { intro: 'A free, open-source checklist of common prompt-reliability practices. Everything runs in your browser; nothing is sent anywhere.', method: 'How the score works: each applicable check counts equally; the score is the share of applicable checks that pass.', footer: 'PQA Community Edition is open source (MIT).', pass: 'OK', fail: 'Fix', not_applicable: 'N/A', good: 'Good', fair: 'Fair', needs_work: 'Needs work', low: 'Low', medium: 'Medium', high: 'High', clear: 'Nothing found', Copied: 'Copied' },
};
const GUARD = {
  pt: { prompt_injection_override: 'Sobreposição de instruções / injeção de prompt', prompt_injection_role: 'Manipulação de papel ou política', secret_exfiltration: 'Pedido de exfiltração de segredos ou do prompt de sistema', tool_abuse: 'Possível instrução destrutiva ou abuso de ferramentas', encoded_payload: 'Conteúdo codificado ou ofuscado extenso', credential_material: 'Possível credencial ou chave privada', active_script: 'Conteúdo de script ativo' },
  fr: { prompt_injection_override: 'Contournement des instructions / injection de prompt', prompt_injection_role: 'Manipulation de rôle ou de règles', secret_exfiltration: 'Demande d\'exfiltration de secrets ou du prompt système', tool_abuse: 'Instruction potentiellement destructrice ou abus d\'outils', encoded_payload: 'Contenu encodé ou obfusqué volumineux', credential_material: 'Possible identifiant ou clé privée', active_script: 'Contenu de script actif' },
};
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let lang = (() => { try { return localStorage.getItem('pqa-community-lang') || (navigator.language || 'en').slice(0, 2); } catch { return 'en'; } })();
if (!['en', 'pt', 'fr'].includes(lang)) lang = 'en';
const t = k => UI[lang]?.[k] ?? UI.en[k] ?? k;

function applyLang(){
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  $('lang').value = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  if (!$('result').classList.contains('hidden')) run();
}
function run(){
  const r = analyzePrompt({ prompt: $('prompt').value, context: $('context').value, language: lang });
  $('score').textContent = `${r.score}/100`; $('quality').textContent = t(r.quality); $('risk').textContent = t(r.risk);
  $('checks').innerHTML = r.checks.map(c => `<li class="${c.status}"><b>${esc(t(c.status))}</b> ${esc(c.label)}${c.advice ? `<small>${esc(c.advice)}</small>` : ''}</li>`).join('');
  const g = scanText(`${$('prompt').value}\n${$('context').value}`);
  $('guard').innerHTML = g.findings.length ? g.findings.map(f => `<li class="fail"><b>${esc(t(f.severity))}</b> ${esc(GUARD[lang]?.[f.id] || f.label)}</li>`).join('') : `<li class="pass"><b>${esc(t('pass'))}</b> ${esc(t('clear'))}</li>`;
  $('improved').value = r.improved_prompt;
  $('result').classList.remove('hidden');
}
$('version').textContent = ENGINE_VERSION;
$('lang').addEventListener('change', e => { lang = e.target.value; try { localStorage.setItem('pqa-community-lang', lang); } catch {} applyLang(); });
$('analyze').addEventListener('click', run);
$('copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('improved').value); $('copy').textContent = t('Copied'); setTimeout(() => { $('copy').textContent = t('Copy'); }, 1500); } catch {} });
applyLang();
