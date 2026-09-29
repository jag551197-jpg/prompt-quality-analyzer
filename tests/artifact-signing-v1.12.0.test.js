import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac, randomUUID } from 'node:crypto';
import handler from '../netlify/functions/api.mjs';

function receiptFor({filename,content,requestId,secret}){
  const sha256=createHash('sha256').update(content,'utf8').digest('hex');
  const payload={canonical_version:'pqa-artifact-manifest-v1',request_id:requestId,issued_at:'2026-09-28T12:00:00.000Z',files:[{filename,sha256}]};
  return {...payload,signature:createHmac('sha256',secret).update(JSON.stringify(payload)).digest('hex')};
}
async function post(path,body){return handler(new Request(`https://example.test/api${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));}

test('generated artifact signing requires an authorized manifest and verifies content integrity',async()=>{
  const previous=process.env.PQA_ARTIFACT_SIGNING_SECRET;const secret='test-only-artifact-signing-secret-32-bytes-minimum';process.env.PQA_ARTIFACT_SIGNING_SECRET=secret;
  try{
    const filename='IMPROVED_REQUIREMENTS.md',content='# Improved Requirements\n\nPreserved rule.',analysisId=randomUUID();
    const receipt=receiptFor({filename,content,requestId:analysisId,secret});
    const signed=await post('/artifact-sign',{filename,analysis_id:analysisId,content,receipt});
    assert.equal(signed.status,200);const meta=await signed.json();assert.equal(meta.algorithm,'HMAC-SHA256');assert.match(meta.signature,/^[0-9a-f]{64}$/);
    const verified=await post('/artifact-verify',{filename,analysis_id:analysisId,authored_at:meta.authored_at,signature:meta.signature,content});
    assert.equal(verified.status,200);assert.equal((await verified.json()).valid,true);
    const tampered=await post('/artifact-verify',{filename,analysis_id:analysisId,authored_at:meta.authored_at,signature:meta.signature,content:content+' tampered'});
    assert.equal((await tampered.json()).valid,false);
    const denied=await post('/artifact-sign',{filename:'OTHER.md',analysis_id:analysisId,content,receipt});assert.equal(denied.status,403);
  }finally{if(previous==null)delete process.env.PQA_ARTIFACT_SIGNING_SECRET;else process.env.PQA_ARTIFACT_SIGNING_SECRET=previous;}
});
