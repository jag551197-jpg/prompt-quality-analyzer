import { timingSafeEqual } from 'node:crypto';

function normalizeBearer(value='') {
  const match = String(value).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

export function tokenConfigured(cfg) {
  return Boolean(cfg?.pqaApiToken);
}

export function bearerAuthorized(headers, cfg) {
  if (!tokenConfigured(cfg)) return false;
  const raw = typeof headers?.get === 'function'
    ? headers.get('authorization')
    : headers?.authorization || headers?.Authorization || '';
  const supplied = normalizeBearer(raw);
  if (!supplied) return false;
  const expected = String(cfg.pqaApiToken);
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function requireBearer(headers, cfg) {
  if (!tokenConfigured(cfg)) {
    return { ok: false, status: 503, body: { error: 'api_token_not_configured', detail: 'PQA_API_TOKEN must be configured for this protected endpoint.' } };
  }
  if (!bearerAuthorized(headers, cfg)) {
    return { ok: false, status: 401, body: { error: 'unauthorized', detail: 'A valid Authorization: Bearer token is required.' } };
  }
  return { ok: true };
}
