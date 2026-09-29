import { createHash } from 'node:crypto';
const clean=(v,n=400)=>String(v??'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,n);
const firstIp=v=>String(v||'').split(',')[0].trim().replace(/^::ffff:/,'');
export function clientHeaders(req){
  const h=req.headers,out={};const ip=firstIp(h.get('x-nf-client-connection-ip')||h.get('cf-connecting-ip')||h.get('x-forwarded-for'));
  if(ip)out['x-pqa-origin-ip']=ip;for(const [src,dst,n] of [['x-country','x-pqa-origin-country',8],['x-region','x-pqa-origin-region',120],['x-city','x-pqa-origin-city',120],['user-agent','x-pqa-origin-user-agent',500],['x-pqa-client-id','x-pqa-origin-client-id',160]]){const v=clean(h.get(src),n);if(v)out[dst]=v;}
  const nf=h.get('x-nf-geo');if(nf){try{const g=JSON.parse(nf);if(!out['x-pqa-origin-country']&&g.country?.code)out['x-pqa-origin-country']=clean(g.country.code,8);if(!out['x-pqa-origin-region']&&g.subdivision?.name)out['x-pqa-origin-region']=clean(g.subdivision.name,120);if(!out['x-pqa-origin-city']&&g.city)out['x-pqa-origin-city']=clean(g.city,120);}catch{}}
  return out;
}
export async function securityPreflight(req,{requestId,prompt='',context='',file=null,endpoint='',uiLanguage=''}={}){
  const base=String(process.env.PQA_CONTROL_PLANE_URL||'').replace(/\/$/,'');const secret=String(process.env.PQA_COMMUNITY_SHARED_SECRET||'');
  if(!base||!secret){if(process.env.PQA_ALLOW_LOCAL_SECURITY_FALLBACK==='true')return {ok:true,safe:true,degraded:true};throw Object.assign(new Error('central_security_not_configured'),{status:503,publicDetail:'Community security scanning is temporarily unavailable. The request was not processed.'});}
  const r=await fetch(`${base}/api/control/community/preflight`,{method:'POST',headers:{'content-type':'application/json','x-pqa-community-secret':secret,...clientHeaders(req)},body:JSON.stringify({request_id:requestId,prompt,context,file,endpoint,ui_language:uiLanguage})});
  let data={};try{data=await r.json()}catch{}
  if(!r.ok)throw Object.assign(new Error(data.error||'security_preflight_failed'),{status:r.status,publicDetail:data.error==='ip_blocked'?'Requests from this network are blocked after repeated suspicious submissions.':data.error==='suspicious_content'?`Suspicious content detected. Request blocked. ${data.remaining_before_block??0} attempt(s) remain before this network is blocked.`:'Community security scanning is temporarily unavailable. The request was not processed.',data});
  return data;
}
export function localRequestId(req){const raw=String(req.headers.get('x-pqa-transaction-id')||'');return /^[0-9a-f-]{36}$/i.test(raw)?raw:createHash('sha256').update(`${Date.now()}|${Math.random()}|${req.url}`).digest('hex').slice(0,36);}

export async function securityResult(req,{requestId,prompt='',context='',uiLanguage='',reliability={},resultStatus='completed'}={}){
  const base=String(process.env.PQA_CONTROL_PLANE_URL||'').replace(/\/$/,'');const secret=String(process.env.PQA_COMMUNITY_SHARED_SECRET||'');if(!base||!secret)return false;
  try{const r=await fetch(`${base}/api/control/community/result`,{method:'POST',headers:{'content-type':'application/json','x-pqa-community-secret':secret,...clientHeaders(req)},body:JSON.stringify({request_id:requestId,prompt,context,ui_language:uiLanguage,reliability,result_status:resultStatus,endpoint:'/finalize'})});return r.ok;}catch{return false;}
}
