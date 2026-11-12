import { handleApi } from '../../src/server/api-core.js';
export default async req => {
  const route = new URL(req.url).pathname.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '') || '/';
  const out = await handleApi(req.method, route, req.method === 'POST' ? await req.text() : '');
  return new Response(JSON.stringify(out.body), { status: out.status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
};
