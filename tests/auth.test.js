import test from 'node:test';
import assert from 'node:assert/strict';
import { bearerAuthorized, requireBearer } from '../src/server/auth.js';

const cfg={pqaApiToken:'test-secret-token'};

test('bearer token authorizes exact token',()=>{
  assert.equal(bearerAuthorized({authorization:'Bearer test-secret-token'},cfg),true);
  assert.equal(bearerAuthorized({authorization:'Bearer wrong'},cfg),false);
  assert.equal(bearerAuthorized({},cfg),false);
});

test('requireBearer fails closed when token is not configured',()=>{
  const r=requireBearer({authorization:'Bearer anything'},{pqaApiToken:''});
  assert.equal(r.ok,false); assert.equal(r.status,503);
});

test('requireBearer returns 401 for missing or invalid bearer token',()=>{
  assert.equal(requireBearer({},cfg).status,401);
  assert.equal(requireBearer({authorization:'Bearer wrong'},cfg).status,401);
});
