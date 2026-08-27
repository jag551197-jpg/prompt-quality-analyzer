const MAX = 500;
const entries = [];

export function logEvent(entry = {}) {
  const record = { timestamp: new Date().toISOString(), ...entry };
  entries.push(record);
  if (entries.length > MAX) entries.splice(0, entries.length - MAX);
  const level = record.level || 'INFO';
  const request = record.request_id ? ` request_id=${record.request_id}` : '';
  const stage = record.stage ? ` stage=${record.stage}` : '';
  const elapsed = Number.isFinite(record.elapsed_ms) ? ` elapsed_ms=${record.elapsed_ms}` : '';
  const fallback = record.fallback ? ` fallback=${record.fallback}` : '';
  console.log(`${level} ${record.message || 'event'}${request}${stage}${elapsed}${fallback}`);
  return record;
}

export function getLogs({ limit = 100, requestId = null } = {}) {
  const filtered = requestId ? entries.filter(e => e.request_id === requestId) : entries;
  return filtered.slice(-Math.min(Math.max(Number(limit) || 100, 1), 500));
}
