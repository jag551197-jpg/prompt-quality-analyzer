import {getLanguage,getLocale,languageInstruction,installLanguageUI} from './i18n.js';
import { estimateSavings, recordSavings, walletSummary, resetWallet, loadPricing, MODEL_VERSION } from './savings.js';
import { clearTransactions, getTransaction, listTransactions } from './idb.js';
import { cancelTransaction, createAnalysisTransaction, executeTransaction, getEstimatedProgress, resumePendingTransactions, subscribeTransactionUpdates, TERMINAL_STATES } from './job-manager.js';

const $ = id => document.getElementById(id);
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
  $('scoreCardSub').textContent=r.score_range?.length===2 ? `Expected range ${r.score_range[0]}–${r.score_range[1]}` : 'Current instruction';
  $('riskCardSub').textContent=`${(r.risk_indicators||[]).length} detected risk indicator${(r.risk_indicators||[]).length===1?'':'s'}`;
  $('confidenceCard').textContent=pct(r.score_confidence);
  $('confidenceCardSub').textContent=`Risk confidence ${pct(r.risk_confidence)}`;
  $('scoreRange').textContent=r.score_range?.length===2 ? `${r.score_range[0]}–${r.score_range[1]}` : '—';
  $('scoreConfidence').textContent=pct(r.score_confidence);
  $('evaluationMode').textContent=(r.evaluation_mode||'—').replaceAll('-',' ');
  const sev=$('severityBadge'); sev.className=`severity ${riskClass(r.hallucination_risk)}`; sev.textContent=severityLabel(r.hallucination_risk);
  $('judge').textContent=r.judge?.model || 'Not configured';
  $('judgeLatency').textContent=fmtMs(r.judge?.duration_ms);
  $('dimensions').innerHTML=Object.values(r.dimensions || {}).map(d=>`<div class="dim"><div class="dimline"><span>${esc(d.label)}</span><b>${d.score}</b></div><div class="bar"><i class="pct-${Math.round(Math.max(0,Math.min(100,d.score)))}"></i></div></div>`).join('');
  list($('issues'),r.weaknesses,'No major reliability gaps identified.');
  list($('recs'),r.recommendations,'No recommendations.');
  list($('strengths'),r.strengths,'No explicit protective controls detected.');
  list($('riskIndicators'),r.risk_indicators,'No material risk indicators detected.');
  chips($('reasonCodes'),r.reason_codes||[]);
  $('improved').value=r.improved_prompt || '';
  $('reanalyze').disabled=!r.improved_prompt;
  $('disclaimer').textContent=(r.disclaimer || '') + (r.judge?.error ? ` Judge fallback: ${r.judge.error}` : '');
  $('auditEngine').textContent=`v${r.version||'1.8.1'}`;
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
  btn.disabled=true; btn.textContent='Queued…';
  const payload={ prompt, context:$('context').value, intendedUse:$('useCase').value, requiresCurrentFacts:$('current').checked, ui_language:getLanguage(), ui_locale:getLocale(), response_language_instruction:languageInstruction() };
  const tx=await createAnalysisTransaction(payload);
  activeId=tx.id;
  await renderTransaction(tx); await refreshHistory();
  btn.textContent='Running asynchronously…';
  // Intentionally do not await. UI correctness comes from IndexedDB polling.
  void executeTransaction(tx.id);
}

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
