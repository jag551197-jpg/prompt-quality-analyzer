import {getLanguage,getLocale,languageInstruction,installLanguageUI,t as tr} from './i18n.js';
import { estimateSavings, recordSavings, walletSummary, resetWallet, loadPricing, MODEL_VERSION } from './savings.js';
import { clearTransactions, getTransaction, listTransactions } from './idb.js';
import { cancelTransaction, createAnalysisTransaction, executeTransaction, getEstimatedProgress, resumePendingTransactions, subscribeTransactionUpdates, TERMINAL_STATES } from './job-manager.js';
import {scanText,inspectFile,mergeScan} from './guard.js';

function getCommunityClientId(){let id=localStorage.getItem('pqa_community_client_id');if(!id){id=(crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`);localStorage.setItem('pqa_community_client_id',id);}return id;}
const trf=(key,vars={})=>Object.entries(vars).reduce((out,[k,v])=>out.replaceAll(`{${k}}`,String(v??'')),tr(key));
const $ = id => document.getElementById(id);
let communityFileScan=null;
function renderGuard(promptText=''){const promptScan=scanText(promptText||$('prompt')?.value||''),combined=mergeScan(promptScan,communityFileScan);const sev=$('guardSeverity'),host=$('guardFindings');if(sev){sev.textContent=combined.severity==='clear'?tr('CLEAR'):tr(combined.severity.toUpperCase());sev.className=`severity ${combined.severity==='clear'?'low':combined.severity}`;}if(host)host.innerHTML=combined.findings.length?combined.findings.map(f=>`<div class="guard-finding"><b>${f.severity.toUpperCase()}</b><span>${tr(f.label)}</span></div>`).join(''):`<span class="guard-clear">${tr('No community scanner indicators detected.')}</span>`;return combined;}
async function handleCommunityFile(file){const status=$('communityFileStatus');if(!file)return;status.textContent=tr('Scanning file…');try{const result=await inspectFile(file);communityFileScan=result;if(!result.allowed){try{await fetch('/api/security-file-scan',{method:'POST',headers:{'content-type':'application/json','x-pqa-client-id':getCommunityClientId()},body:JSON.stringify({prompt:$('prompt')?.value||'',ui_language:getLanguage(),file:{name:result.name||file.name,size:result.size||file.size,type:file.type||'application/octet-stream',text:result.text||''}})});}catch{}status.textContent=`${tr('Blocked')}: ${tr(result.findings?.[0]?.label||'file not allowed')}`;renderGuard();return;}const rr=await fetch('/api/security-file-scan',{method:'POST',headers:{'content-type':'application/json','x-pqa-client-id':getCommunityClientId()},body:JSON.stringify({prompt:$('prompt')?.value||'',ui_language:document.documentElement.lang||'en',file:{name:result.name,size:result.size,type:file.type||'text/plain',text:result.text}})});let sec={};try{sec=await rr.json()}catch{}if(!rr.ok||sec.safe!==true){communityFileScan={...result,allowed:false,findings:sec?.security?.findings||result.findings||[]};status.textContent=`${tr('Blocked')}: ${tr(sec.detail||sec.error||'suspicious content detected')}`;renderGuard();return;}const prior=$('context').value.trim();$('context').value=[prior,`--- Community file: ${result.name} ---`,result.text].filter(Boolean).join('\n\n').slice(0,60000);status.textContent=`${result.name} · ${(result.size/1024).toFixed(1)} KB · ${tr('scanned')} · ${tr('clear')}`;renderGuard();}catch(e){communityFileScan=null;status.textContent=`${tr('File scan failed')}: ${tr('The file was not processed because the security scan could not be completed.')}`;renderGuard();}}

installLanguageUI();
const btn = $('analyze');
let activeId = null;
let pollTimer = null;
let elapsedTimer = null;
let lastRenderedUpdate = 0;


function money(v){return `$${Number(v||0).toFixed(2)}`}
function renderWallet(){
 const w=walletSummary($('walletPeriod')?.value||'all');
 $('walletTokens').textContent=Number(w.token_savings||0).toLocaleString();
 $('walletCost').textContent=money(w.ai_cost_saved_usd);
 $('walletRetries').textContent=Number(w.retry_savings||0).toFixed(2);
 $('walletPrompts').textContent=`${w.count} improvement${w.count===1?'':'s'} generated`;
}
function maybeRecordSavings(tx){
 const r=tx?.final_result; if(!r?.improved_prompt||!tx?.payload?.prompt)return;
 const est=estimateSavings({prompt:tx.payload.prompt,improvedPrompt:r.improved_prompt,score:r.overall_score,risk:r.hallucination_risk,intendedUse:tx.payload.intendedUse,reasonCodes:r.reason_codes||[],pricing:loadPricing()});
 if(recordSavings(tx.id,{use_case:tx.payload.intendedUse||'General',risk:r.hallucination_risk,score:r.overall_score},est))renderWallet();
}

function list(el, items, empty) {
  el.innerHTML='';
  (items?.length ? items : [empty]).forEach(x => { const li=document.createElement('li'); li.textContent=x; el.appendChild(li); });
}
function fmtMs(ms) { if (ms == null || !Number.isFinite(Number(ms))) return '—'; const n=Number(ms); return n<1000?`${Math.round(n)}ms`:`${(n/1000).toFixed(1)}s`; }
function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function stateLabel(s='') { return s.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()); }

function pct(v) { const n=Number(v); return Number.isFinite(n) ? `${Math.round(n*100)}%` : '—'; }
function riskClass(r='') { const x=String(r).toLowerCase(); return ['low','medium','high'].includes(x) ? x : 'unknown'; }
function severityLabel(r='') { const x=String(r).toLowerCase(); return x==='high'?'CRITICAL REVIEW':x==='medium'?'REVIEW ADVISED':x==='low'?'LOW RISK':'NOT EVALUATED'; }
function chips(el, items=[]) { el.innerHTML = items.length ? items.map(x=>`<span class="chip">${esc(x)}</span>`).join('') : '<span class="chip muted-chip">No reason codes</span>'; }
function hallLabel(v=''){return tr(String(v).replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()));}
function hallBandClass(v=''){const x=String(v).toLowerCase();return ['low','moderate','high','very_high'].includes(x)?`hall-${x.replace('_','-')}`:'hall-unknown';}
function renderHallucinationAnalysis(r){
  const h=r?.hallucination_analysis;if(!h||!$('hallucinationExplainer'))return;
  const idx=Number(h.risk_index);
  $('hallRiskIndex').textContent=Number.isFinite(idx)?`${Math.round(idx)}/100`:'—/100';
  $('hallRiskIndex').className=`hall-risk-pill ${hallBandClass(h.risk_band)}`;
  $('hallProbabilityStatus').textContent=tr('NOT CALIBRATED');
  $('hallProbabilityText').textContent=tr(h.probability_explanation||'PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate.');
  const put=(valueId,labelId,obj,valueKey='score',labelKey='label')=>{if(!$(valueId))return;const n=Number(obj?.[valueKey]);$(valueId).textContent=Number.isFinite(n)?`${Math.round(n)}/100`:'—';$(labelId).textContent=hallLabel(obj?.[labelKey]||'—');};
  put('hallAnswerability','hallAnswerabilityLabel',h.answerability);
  put('hallPressure','hallPressureLabel',h.hallucination_pressure,'score','band');
  put('hallAbstention','hallAbstentionLabel',h.abstention_safety);
  put('hallCurrentDependency','hallCurrentDependencyLabel',h.current_information_dependency,'score','level');
  const gr=h.grounding_requirement||{};$('hallGrounding').textContent=Number.isFinite(Number(gr.score))?`${Math.round(Number(gr.score))}/100`:'—';$('hallGroundingLabel').textContent=hallLabel(gr.level||'—');
  const cmp=h.remediation_comparison||null;
  $('hallRemediation').classList.toggle('is-hidden',!cmp);
  if(cmp){$('hallOriginalRisk').textContent=`${cmp.original_risk_index}/100 · ${hallLabel(cmp.original_band)}`;$('hallRecommendedRisk').textContent=`${cmp.recommended_risk_index}/100 · ${hallLabel(cmp.recommended_band)}`;$('hallReduction').textContent=`${tr('Projected reduction')}: −${cmp.reduction} ${tr('points')}`;}
  const drivers=Array.isArray(h.drivers)?h.drivers:[];
  $('hallDrivers').innerHTML=drivers.length?drivers.slice(0,8).map(d=>`<div class="hall-row"><span>${esc(tr(d.label||d.code))}</span><b>+${Math.round(Number(d.points)||0)}</b></div>`).join(''):`<p class="muted">${esc(tr('No material prompt-level hallucination drivers detected.'))}</p>`;
  const catLabels={factual_fabrication:'Factual fabrication',unsupported_inference:'Unsupported inference',citation_fabrication:'Citation fabrication',temporal_staleness:'Temporal staleness',entity_ambiguity:'Entity ambiguity'};
  $('hallCategories').innerHTML=Object.entries(h.categories||{}).map(([k,v])=>{const n=Math.max(0,Math.min(100,Number(v?.score)||0));return `<div class="hall-category"><div><span>${esc(tr(catLabels[k]||k))}</span><b>${Math.round(n)}</b></div><div class="hall-track"><i class="pct-${Math.round(n)}"></i></div><small>${esc(hallLabel(v?.band||'low'))}</small></div>`;}).join('');
  const interventions=Array.isArray(h.interventions)?h.interventions:[];
  $('hallInterventions').innerHTML=interventions.length?interventions.slice(0,6).map(x=>`<div class="hall-row hall-intervention"><span>${esc(tr(x.label||x.code))}<small>${esc(tr('Projected risk'))}: ${x.projected_risk_index}/100 · ${esc(hallLabel(x.projected_band))}</small></span><b>−${Math.round(Number(x.reduction)||0)}</b></div>`).join(''):`<p class="muted">${esc(tr('No additional risk-reduction intervention is indicated by the deterministic layer.'))}</p>`;
  const scenarios=Array.isArray(h.execution_scenarios)?h.execution_scenarios:[];
  $('hallScenarios').innerHTML=scenarios.map(x=>`<div class="hall-row hall-scenario"><span>${esc(tr(x.label||x.scenario))}<small>${esc(tr(x.assumption||''))}</small></span><b class="${hallBandClass(x.risk_band)}">${x.risk_index}</b></div>`).join('');
  $('hallDisclaimer').textContent=tr(h.disclaimer||'Risk index and projected reductions are engineering decision-support signals, not empirical probabilities or guarantees of model behavior.');
}

function renderResult(r) {
  if (!r) return;
  const score=r.overall_score ?? '—';
  const risk=(r.hallucination_risk || '—').toUpperCase();
  $('score').textContent=score;
  $('scoreCard').textContent=score;
  $('quality').textContent=(r.quality_level || 'ready').replaceAll('-',' ').toUpperCase();
  $('risk').textContent=risk;
  $('riskCard').textContent=risk;
  $('riskCard').className=`risk-${riskClass(r.hallucination_risk)}`;
  renderHallucinationAnalysis(r);
  $('scoreCardSub').textContent=r.score_range?.length===2 ? `Expected range ${r.score_range[0]}–${r.score_range[1]}` : 'Current instruction';
  $('riskCardSub').textContent=Number.isFinite(Number(r.hallucination_analysis?.risk_index))?`${tr('Risk index')} ${Math.round(Number(r.hallucination_analysis.risk_index))}/100 · ${(r.risk_indicators||[]).length} ${tr('drivers')}`:`${(r.risk_indicators||[]).length} detected risk indicator${(r.risk_indicators||[]).length===1?'':'s'}`;
  const evidenceStrength=r.analysis_evidence_strength||{};
  $('confidenceCard').textContent=pct(evidenceStrength.value);
  $('confidenceCardSub').textContent=tr('Structural evidence coverage');
  $('scoreRange').textContent=r.score_range?.length===2 ? `${r.score_range[0]}–${r.score_range[1]}` : tr('Not calibrated');
  $('scoreConfidence').textContent=pct(evidenceStrength.value);
  $('evaluationMode').textContent=(r.evaluation_mode||'—').replaceAll('-',' ');
  const sev=$('severityBadge'); sev.className=`severity ${riskClass(r.hallucination_risk)}`; sev.textContent=severityLabel(r.hallucination_risk);
  $('judge').textContent=r.judge?.model || 'Not configured';
  $('judgeLatency').textContent=fmtMs(r.judge?.duration_ms);
  $('dimensions').innerHTML=Object.values(r.dimensions || {}).map(d=>{const applicable=d.applicable!==false&&Number.isFinite(Number(d.score));const score=applicable?Number(d.score):0;return `<div class="dim ${applicable?'':'dim-na'}"><div class="dimline"><span>${esc(d.label)}</span><b>${applicable?Math.round(score):'N/A'}</b></div><div class="bar"><i class="pct-${applicable?Math.round(Math.max(0,Math.min(100,score))):0}"></i></div></div>`;}).join('');
  list($('issues'),r.weaknesses,'No major reliability gaps identified.');
  list($('recs'),r.recommendations,'No recommendations.');
  list($('strengths'),r.strengths,'No explicit protective controls detected.');
  list($('riskIndicators'),r.risk_indicators,'No material risk indicators detected.');
  chips($('reasonCodes'),r.reason_codes||[]);
  $('improved').value=r.improved_prompt || '';
  $('reanalyze').disabled=!r.improved_prompt;
  $('disclaimer').textContent=(r.disclaimer || '') + (r.judge?.error ? ` Judge fallback: ${r.judge.error}` : '');
  $('auditEngine').textContent=`v${r.version||'3.0.0'}`;
  $('auditRubric').textContent=r.rubric_version || '—';
  $('auditRiskModel').textContent=r.calibration?.risk_model || 'evidence-tiered-v3';
  $('auditProfile').textContent=r.scoring_profile || r.calibration?.profile || '—';
  if (r.judge_response) { $('judgeResponse').textContent=JSON.stringify(r.judge_response,null,2); $('copyJudge').disabled=false; }
  else { $('judgeResponse').textContent=r.judge?.error ? `No Gemini response.\nFallback reason: ${r.judge.error_category || 'judge_unavailable'}\n${r.judge.error}` : 'Gemini judge has not completed. Deterministic analysis is available.'; }
}

function renderEvents(tx) {
  $('liveLog').textContent=(tx?.events || []).map(e=>`${new Date(e.timestamp).toLocaleTimeString()} [${e.stage}] ${e.message}`).join('\n') || 'No events yet.';
  $('liveLog').scrollTop=$('liveLog').scrollHeight;
}

async function renderTransaction(tx) {
  if (!tx) return;
  lastRenderedUpdate=tx.updated_at || Date.now();
  const p=await getEstimatedProgress(tx);
  $('requestId').textContent=tx.id.slice(0,8);
  $('auditRequest').textContent=tx.id;
  $('auditUpdated').textContent=new Date(tx.updated_at || tx.created_at || Date.now()).toLocaleString();
  $('stage').textContent=stateLabel(tx.stage || tx.state);
  $('progressBar').className=`pct-${Math.round(Math.max(0,Math.min(100,p.progress)))}`;
  $('progressText').textContent=`${p.progress}%`;
  $('eta').textContent=['judge_submitting','judge_polling'].includes(tx.state) ? fmtMs(p.eta_ms) : tx.state==='retry_wait' ? `retry ${fmtMs(p.eta_ms)}` : TERMINAL_STATES.has(tx.state) ? '—' : fmtMs(p.eta_ms);
  $('attempts').textContent=`${tx.attempts || 0}/3`;
  $('dbState').textContent=stateLabel(tx.state);
  renderEvents(tx);
  renderResult(tx.final_result || tx.deterministic_result);
  $('cancel').disabled=TERMINAL_STATES.has(tx.state);
  if (TERMINAL_STATES.has(tx.state)) { maybeRecordSavings(tx); btn.disabled=false; btn.textContent='Analyze Prompt'; }
}

async function renderTrend(txs) {
  const scored=txs.filter(t=>Number.isFinite(Number((t.final_result||t.deterministic_result)?.overall_score))).slice().reverse();
  $('trendCount').textContent=`${scored.length} ${scored.length===1?'analysis':'analyses'}`;
  $('trendEmpty').classList.toggle('is-hidden',Boolean(scored.length));
  if(!scored.length){$('trendLine').setAttribute('points','');$('trendDots').innerHTML='';$('trendValue').textContent='—';$('trendSub').textContent='Recent browser analyses';return;}
  const vals=scored.map(t=>Number((t.final_result||t.deterministic_result).overall_score));
  const w=800,h=150,pad=12;
  const points=vals.map((v,i)=>{const x=vals.length===1?w/2:pad+i*(w-pad*2)/(vals.length-1);const y=pad+(100-v)*(h-pad*2)/100;return [x,y,v];});
  $('trendLine').setAttribute('points',points.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '));
  $('trendDots').innerHTML=points.map(p=>`<circle class="trend-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"><title>${p[2]}</title></circle>`).join('');
  const current=vals.at(-1), first=vals[0], delta=current-first;
  $('trendValue').textContent=current;
  $('trendSub').textContent=vals.length>1?`${delta>=0?'+':''}${delta} vs oldest visible analysis`:'First measured analysis';
}

async function refreshHistory() {
  const txs=await listTransactions(24);
  await renderTrend(txs);
  $('history').innerHTML=txs.length ? txs.map(t=>{const r=t.final_result||t.deterministic_result||{};const risk=r.hallucination_risk||'unknown';return `<button class="history-item" data-id="${t.id}"><span><b>${esc(t.payload?.intendedUse || 'General')}</b><small>${new Date(t.created_at).toLocaleString()}</small></span><span><span class="history-score">${r.overall_score??'—'}</span><small class="history-risk ${riskClass(risk)}">${esc(risk)}</small></span><span class="history-state">${esc(stateLabel(t.state))}</span></button>`}).join('') : '<p class="privacy">No local transactions yet. Run an analysis to create an auditable local history.</p>';
  $('history').querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',async()=>{ activeId=b.dataset.id; await renderTransaction(await getTransaction(activeId)); }));
}

async function pollActive() {
  if (!activeId) return;
  const tx=await getTransaction(activeId);
  if (!tx) return;
  await renderTransaction(tx);
  if (TERMINAL_STATES.has(tx.state)) await refreshHistory();
}

function startPolling() {
  clearInterval(pollTimer); clearInterval(elapsedTimer);
  pollTimer=setInterval(()=>pollActive().catch(console.error),500);
  elapsedTimer=setInterval(async()=>{
    if (!activeId) { $('elapsed').textContent='0.0s'; return; }
    const tx=await getTransaction(activeId);
    if (!tx?.started_at) return;
    const end=tx.completed_at || Date.now();
    $('elapsed').textContent=fmtMs(end-tx.started_at);
  },250);
}

async function startAnalysis(promptOverride) {
  const prompt=promptOverride ?? $('prompt').value;
  if (!prompt.trim()) return alert('Paste a prompt first.');
  const guard=renderGuard(prompt);
  if(guard.findings?.length){try{const rr=await fetch('/api/security-preflight',{method:'POST',headers:{'content-type':'application/json','x-pqa-client-id':getCommunityClientId()},body:JSON.stringify({prompt,context:$('context').value,ui_language:getLanguage()})});const j=await rr.json().catch(()=>({}));const rem=j?.security?.remaining_before_block??j?.remaining_before_block;alert(trf?trf('PQA Guard detected suspicious input. The request will not be processed. Remaining attempts before network block: {count}',{count:rem??'—'}):tr('PQA Guard detected suspicious input. The request will not be processed.'));}catch{alert(tr('PQA Guard detected suspicious input. The request will not be processed.'));}return;}
  btn.disabled=true; btn.textContent='Queued…';
  const payload={ prompt, context:$('context').value, intendedUse:$('useCase').value, requiresCurrentFacts:$('current').checked, ui_language:getLanguage(), ui_locale:getLocale(), response_language_instruction:languageInstruction() };
  const tx=await createAnalysisTransaction(payload);
  activeId=tx.id;
  await renderTransaction(tx); await refreshHistory();
  btn.textContent='Running asynchronously…';
  // Intentionally do not await. UI correctness comes from IndexedDB polling.
  void executeTransaction(tx.id);
}

$('pickCommunityFile')?.addEventListener('click',()=>$('communityFile')?.click());$('communityFile')?.addEventListener('change',e=>handleCommunityFile(e.target.files?.[0]));$('prompt')?.addEventListener('input',()=>renderGuard());renderGuard();
btn.addEventListener('click',()=>startAnalysis().catch(e=>alert(e.message)));
$('reanalyze').addEventListener('click',()=>{ $('prompt').value=$('improved').value; startAnalysis($('improved').value).catch(e=>alert(e.message)); });
$('cancel').addEventListener('click',async()=>{ if(activeId){ await cancelTransaction(activeId); await pollActive(); }});
$('clearLog').addEventListener('click',async()=>{ if(!activeId)return; const tx=await getTransaction(activeId); if(tx){ tx.events=[]; const { putTransaction }=await import('./idb.js'); await putTransaction(tx); await pollActive(); }});
$('fetchServerLogs').addEventListener('click',async()=>{ if(!activeId)return alert('Select a transaction first.'); const token=window.prompt('Administrator API token for server logs. The token is used for this request only and is not stored by the app.'); if(!token)return; const b=$('fetchServerLogs'); b.disabled=true; b.textContent='Loading…'; try{ const res=await fetch(`/api/logs?request_id=${encodeURIComponent(activeId)}&limit=200`,{headers:{authorization:`Bearer ${token}`}}); const d=await res.json(); if(!res.ok) throw new Error(d.detail||d.error||`HTTP ${res.status}`); const lines=(d.logs||[]).map(e=>`${new Date(e.timestamp).toLocaleTimeString()} [SERVER:${e.stage||'event'}] ${e.message||''}`); const tx=await getTransaction(activeId); $('liveLog').textContent=[...(tx?.events||[]).map(e=>`${new Date(e.timestamp).toLocaleTimeString()} [BROWSER:${e.stage}] ${e.message}`),'',...lines].join('\n'); }catch(e){ alert(e.message); }finally{ b.disabled=false;b.textContent='Server Logs'; }});
$('walletPeriod').addEventListener('change',renderWallet);
$('walletReset').addEventListener('click',()=>{if(confirm('Reset the visible Efficiency Wallet? This does not change prior analysis history.')){resetWallet();renderWallet();}});
$('walletMethod').addEventListener('click',()=>alert(`${MODEL_VERSION}\n\nEstimated tokens = prompt/output token model × expected retry reduction. Token count uses ~4 characters/token. Retry probability is modeled from PQA quality score and risk level. Dollar savings use the configured planning price profile and are not provider billing records.`));
renderWallet();
$('clearHistory').addEventListener('click',async()=>{ if(confirm('Clear browser transaction history?')){ await clearTransactions(); activeId=null; await refreshHistory(); $('liveLog').textContent='History cleared.'; }});
$('copyJudge').addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText($('judgeResponse').textContent); $('copyJudge').textContent='Copied'; setTimeout(()=>$('copyJudge').textContent='Copy JSON',1200);}catch{} });
$('testJudge').addEventListener('click',async()=>{ const b=$('testJudge'); b.disabled=true; b.textContent='Testing…'; try { const res=await fetch('/api/test-judge',{method:'POST'}); const d=await res.json(); alert(d.ok?`Gemini connection OK • ${d.model} • ${fmtMs(d.duration_ms)}`:`Gemini unavailable • ${d.category || d.status}`); } catch(e){ alert(e.message); } finally{ b.disabled=false;b.textContent='Test Gemini'; }});

subscribeTransactionUpdates(async msg=>{ if(msg?.id===activeId) await pollActive(); await refreshHistory(); });
startPolling();
await resumePendingTransactions();
const recent=await listTransactions(1); if(recent[0]) { activeId=recent[0].id; await renderTransaction(recent[0]); }
await refreshHistory();
