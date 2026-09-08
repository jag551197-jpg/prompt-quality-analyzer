import { createHash } from 'node:crypto';

const buckets=new Map(), concurrent=new Map();
const now=()=>Date.now();
function keyHash(v){return createHash('sha256').update(String(v||'unknown')).digest('hex').slice(0,24);}
export function clientKey(req){
  const fwd=String(req.headers['x-forwarded-for']||'').split(',')[0].trim();
  const ip=fwd||req.socket?.remoteAddress||'unknown';
  const ua=String(req.headers['user-agent']||'').slice(0,160);
  return keyHash(`${ip}|${ua}`);
}
function bucketKey(key,scope,windowMs){return `${key}:${scope}:${Math.floor(now()/windowMs)}`;}
export function rateLimit(key,scope,limit,windowMs){
  const k=bucketKey(key,scope,windowMs), n=(buckets.get(k)||0)+1;buckets.set(k,n);
  if(buckets.size>10000){for(const [x] of buckets){if(Math.random()<.15)buckets.delete(x);}}
  return {ok:n<=limit,remaining:Math.max(0,limit-n),retry_after_ms:windowMs-(now()%windowMs)};
}
export function dailyLimit(key,scope,limit){return rateLimit(key,scope,limit,86400000);}
export function acquire(key,limit=1){
  const n=concurrent.get(key)||0;if(n>=limit)return false;concurrent.set(key,n+1);return true;
}
export function release(key){const n=concurrent.get(key)||0;if(n<=1)concurrent.delete(key);else concurrent.set(key,n-1);}
export function securityHeaders(extra={}){
  return {
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'no-referrer',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()',
    'X-Frame-Options':'DENY',
    'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    'Strict-Transport-Security':'max-age=31536000; includeSubDomains',
    ...extra
  };
}
