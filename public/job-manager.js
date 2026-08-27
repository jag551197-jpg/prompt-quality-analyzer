import { getMeta, getTransaction, listTransactions, putTransaction, setMeta, updateTransaction } from './idb.js';

export const TERMINAL_STATES = new Set(['complete', 'failed', 'cancelled']);
const LEASE_MS = 12000;
const MAX_ATTEMPTS = 3;
const TAB_ID = crypto.randomUUID();
const activeControllers = new Map();
const channel = 'BroadcastChannel' in globalThis ? new BroadcastChannel('pqa-transactions') : null;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const now = () => Date.now();

function logLine(tx, stage, message, level='INFO', extra={}) {
  tx.events ||= [];
  tx.events.push({ timestamp: new Date().toISOString(), stage, message, level, ...extra });
  if (tx.events.length > 200) tx.events = tx.events.slice(-200);
}

async function notify(tx) {
  channel?.postMessage({ type:'transaction-updated', id:tx.id, state:tx.state, updated_at:tx.updated_at });
}

async function saveStage(id, state, stage, message, extra={}) {
  const tx = await updateTransaction(id, t => {
    t.state = state;
    t.stage = stage;
    Object.assign(t, extra);
    logLine(t, stage, message, 'INFO', extra.log_extra || {});
    return t;
  });
  await notify(tx);
  return tx;
}

async function acquireLease(id) {
  try {
    const tx = await updateTransaction(id, t => {
      const leaseAlive = t.lease_expires_at && t.lease_expires_at > now();
      if (leaseAlive && t.lease_owner && t.lease_owner !== TAB_ID) throw new Error('LEASE_HELD');
      t.lease_owner = TAB_ID;
      t.lease_expires_at = now() + LEASE_MS;
      return t;
    });
    return tx.lease_owner === TAB_ID;
  } catch (e) {
    if (e.message === 'LEASE_HELD') return false;
    throw e;
  }
}

async function renewLease(id) {
  try {
    await updateTransaction(id, t => {
      if (t.lease_owner === TAB_ID) t.lease_expires_at = now() + LEASE_MS;
      return t;
    });
  } catch {}
}

async function releaseLease(id) {
  try {
    await updateTransaction(id, t => {
      if (t.lease_owner === TAB_ID) { t.lease_owner = null; t.lease_expires_at = 0; }
      return t;
    });
  } catch {}
}

async function postJson(url, payload, transactionId, timeoutMs=45000) {
  const controller = new AbortController();
  activeControllers.set(transactionId, controller);
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'X-PQA-Transaction-ID':transactionId },
      body:JSON.stringify(payload),
      signal:controller.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.detail || data.error || `Request failed (${res.status})`);
      err.status = res.status;
      err.category = data.category || (res.status === 429 ? 'rate_limited' : res.status === 401 || res.status === 403 ? 'authentication_failed' : 'http_error');
      throw err;
    }
    return data;
  } finally { clearTimeout(timer); if (activeControllers.get(transactionId) === controller) activeControllers.delete(transactionId); }
}

async function estimatedJudgeMs() {
  const samples = (await getMeta('gemini-duration-samples')) || [];
  if (!samples.length) return 8000;
  const sorted = samples.slice(-20).filter(Number.isFinite).sort((a,b)=>a-b);
  return sorted[Math.floor(sorted.length/2)] || 8000;
}

async function recordJudgeDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  const samples = (await getMeta('gemini-duration-samples')) || [];
  samples.push(ms);
  await setMeta('gemini-duration-samples', samples.slice(-30));
}

function retryDelay(attempt) {
  return Math.min(12000, 1000 * (2 ** Math.max(0, attempt - 1))) + Math.floor(Math.random()*400);
}

export async function createAnalysisTransaction(payload) {
  const id = crypto.randomUUID();
  const created = now();
  const tx = {
    id, type:'prompt-analysis', schema_version:1,
    state:'created', stage:'created', payload,
    created_at:created, updated_at:created,
    started_at:null, completed_at:null,
    deterministic_result:null, final_result:null,
    attempts:0, retry_at:null, error:null,
    judge_started_at:null, judge_expected_ms:await estimatedJudgeMs(),
    lease_owner:null, lease_expires_at:0,
    events:[]
  };
  logLine(tx, 'created', 'Analysis transaction created in browser database');
  await putTransaction(tx); await notify(tx);
  return tx;
}

export async function executeTransaction(id) {
  const gotLease = await acquireLease(id);
  if (!gotLease) return false;
  let leaseTimer = setInterval(() => renewLease(id), Math.floor(LEASE_MS/3));
  try {
    let tx = await getTransaction(id);
    if (!tx || TERMINAL_STATES.has(tx.state)) return true;
    if (!tx.started_at) await updateTransaction(id, t => { t.started_at = now(); return t; });

    if (!tx.deterministic_result) {
      await saveStage(id, 'deterministic_running', 'deterministic', 'Running deterministic prompt checks');
      const deterministic = await postJson('/api/deterministic', tx.payload, id, 10000);
      await updateTransaction(id, t => {
        t.deterministic_result = deterministic;
        t.state='deterministic_complete'; t.stage='deterministic_complete';
        logLine(t, 'deterministic_complete', `Deterministic analysis complete: ${deterministic.overall_score}/100`);
        return t;
      });
      await notify(await getTransaction(id));
    }

    tx = await getTransaction(id);
    if (tx.final_result) {
      await saveStage(id, 'complete', 'complete', 'Analysis already complete', { completed_at: now() });
      return true;
    }

    let attempt = Number(tx.attempts || 0);
    while (attempt < MAX_ATTEMPTS) {
      attempt += 1;
      const expected = await estimatedJudgeMs();
      await updateTransaction(id, t => {
        t.attempts = attempt; t.state='judge_running'; t.stage='judge_running';
        t.judge_started_at=now(); t.judge_expected_ms=expected; t.retry_at=null; t.error=null;
        logLine(t, 'judge_running', `Gemini semantic judge started (attempt ${attempt}/${MAX_ATTEMPTS})`, 'INFO', { attempt });
        return t;
      });
      await notify(await getTransaction(id));

      try {
        // This request runs asynchronously relative to the UI. IndexedDB is the durable browser ledger;
        // the UI polls it and is never blocked on this promise.
        const latest = await getTransaction(id);
        const full = await postJson('/api/analyze', latest.payload, id, Math.max(45000, expected * 4));
        const afterCall = await getTransaction(id);
        if (afterCall?.state === 'cancelled') return false;
        await recordJudgeDuration(full.judge?.duration_ms || full.timing?.gemini_ms);
        const done = await updateTransaction(id, t => {
          t.final_result = full; t.state='complete'; t.stage='complete'; t.completed_at=now();
          t.error=null; t.retry_at=null;
          logLine(t, 'judge_complete', full.judge?.status === 'ok' ? `Gemini judge complete in ${full.judge?.duration_ms ?? '—'} ms` : `Gemini unavailable; deterministic fallback (${full.judge?.error_category || full.judge?.status || 'unknown'})`);
          logLine(t, 'complete', `Analysis complete: ${full.overall_score}/100`);
          return t;
        });
        await notify(done);
        return true;
      } catch (e) {
        const currentAfterError = await getTransaction(id);
        if (currentAfterError?.state === 'cancelled' || e?.name === 'AbortError') return false;
        const permanent = ['authentication_failed'].includes(e.category) || [400,401,403,413].includes(e.status);
        if (permanent || attempt >= MAX_ATTEMPTS) {
          const fallback = await getTransaction(id);
          const deterministic = fallback?.deterministic_result;
          const done = await updateTransaction(id, t => {
            t.state = deterministic ? 'complete' : 'failed'; t.stage = deterministic ? 'complete_fallback' : 'failed';
            t.completed_at=now(); t.error={ message:e.message, category:e.category || 'request_failed', status:e.status || null };
            if (deterministic) t.final_result = { ...deterministic, request_id:id, browser_fallback:true, judge:{ ...(deterministic.judge||{}), status:'fallback', error:e.message, error_category:e.category || 'request_failed', http_status:e.status || null } };
            logLine(t, t.stage, deterministic ? `Gemini request failed; preserving deterministic result (${e.category || 'request_failed'})` : `Analysis failed (${e.category || 'request_failed'})`, deterministic ? 'WARN' : 'ERROR');
            return t;
          });
          await notify(done);
          return Boolean(deterministic);
        }
        const delay = retryDelay(attempt);
        const retry = await updateTransaction(id, t => {
          t.state='retry_wait'; t.stage='retry_wait'; t.retry_at=now()+delay;
          t.error={ message:e.message, category:e.category || 'request_failed', status:e.status || null };
          logLine(t, 'retry_wait', `Gemini request failed; retrying in ${(delay/1000).toFixed(1)}s`, 'WARN', { attempt, category:t.error.category });
          return t;
        });
        await notify(retry);
        let waited=0;
        while (waited < delay) {
          await sleep(Math.min(250, delay-waited)); waited += Math.min(250, delay-waited);
          const current = await getTransaction(id);
          if (current?.state === 'cancelled') return false;
        }
      }
    }
    return false;
  } finally {
    clearInterval(leaseTimer);
    await releaseLease(id);
  }
}

export async function resumePendingTransactions() {
  const all = await listTransactions(30);
  const pending = all.filter(t => !TERMINAL_STATES.has(t.state));
  for (const tx of pending) {
    if (!tx.lease_expires_at || tx.lease_expires_at < now()) void executeTransaction(tx.id);
  }
  return pending;
}

export async function cancelTransaction(id) {
  activeControllers.get(id)?.abort();
  const tx = await updateTransaction(id, t => {
    if (!TERMINAL_STATES.has(t.state)) {
      t.state='cancelled'; t.stage='cancelled'; t.completed_at=now();
      logLine(t, 'cancelled', 'Transaction cancelled by user', 'WARN');
    }
    return t;
  });
  await notify(tx); return tx;
}

export function subscribeTransactionUpdates(fn) {
  if (!channel) return () => {};
  const handler = e => fn(e.data);
  channel.addEventListener('message', handler);
  return () => channel.removeEventListener('message', handler);
}

export async function getEstimatedProgress(tx) {
  if (!tx) return { progress:0, eta_ms:null };
  const fixed = {
    created:2, deterministic_running:10, deterministic_complete:28,
    retry_wait:35, complete:100, complete_fallback:100, failed:100, cancelled:100
  };
  if (tx.state !== 'judge_running') return { progress: fixed[tx.state] ?? 5, eta_ms: tx.retry_at ? Math.max(0, tx.retry_at-now()) : 0 };
  const elapsed = Math.max(0, now() - (tx.judge_started_at || now()));
  const expected = Math.max(1000, tx.judge_expected_ms || 8000);
  // Estimated progress only; cap at 84% until a real Gemini response is received.
  const frac = Math.min(0.96, elapsed / expected);
  return { progress: Math.round(35 + frac * 49), eta_ms: Math.max(0, expected - elapsed), judge_elapsed_ms:elapsed };
}
