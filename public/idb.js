const DB_NAME = 'prompt-quality-analyzer';
const DB_VERSION = 1;
const TX_STORE = 'transactions';
const META_STORE = 'meta';

function requestToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function openDb() {
  return await new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TX_STORE)) {
        const store = db.createObjectStore(TX_STORE, { keyPath: 'id' });
        store.createIndex('updated_at', 'updated_at');
        store.createIndex('state', 'state');
      }
      if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putTransaction(tx) {
  const db = await openDb();
  const t = db.transaction(TX_STORE, 'readwrite');
  t.objectStore(TX_STORE).put(tx);
  await new Promise((resolve, reject) => { t.oncomplete = resolve; t.onerror = () => reject(t.error); t.onabort = () => reject(t.error); });
  db.close();
  return tx;
}

export async function getTransaction(id) {
  const db = await openDb();
  const t = db.transaction(TX_STORE, 'readonly');
  const result = await requestToPromise(t.objectStore(TX_STORE).get(id));
  db.close();
  return result || null;
}

export async function listTransactions(limit = 20) {
  const db = await openDb();
  const t = db.transaction(TX_STORE, 'readonly');
  const all = await requestToPromise(t.objectStore(TX_STORE).getAll());
  db.close();
  return all.sort((a,b) => (b.updated_at || 0) - (a.updated_at || 0)).slice(0, limit);
}

export async function updateTransaction(id, mutator) {
  const db = await openDb();
  const t = db.transaction(TX_STORE, 'readwrite');
  const store = t.objectStore(TX_STORE);
  const current = await requestToPromise(store.get(id));
  if (!current) { db.close(); throw new Error(`transaction ${id} not found`); }
  const next = await mutator(structuredClone(current));
  next.updated_at = Date.now();
  store.put(next);
  await new Promise((resolve, reject) => { t.oncomplete = resolve; t.onerror = () => reject(t.error); t.onabort = () => reject(t.error); });
  db.close();
  return next;
}

export async function getMeta(key) {
  const db = await openDb();
  const t = db.transaction(META_STORE, 'readonly');
  const out = await requestToPromise(t.objectStore(META_STORE).get(key));
  db.close();
  return out?.value ?? null;
}

export async function setMeta(key, value) {
  const db = await openDb();
  const t = db.transaction(META_STORE, 'readwrite');
  t.objectStore(META_STORE).put({ key, value, updated_at: Date.now() });
  await new Promise((resolve, reject) => { t.oncomplete = resolve; t.onerror = () => reject(t.error); });
  db.close();
}

export async function clearTransactions() {
  const db = await openDb();
  const t = db.transaction(TX_STORE, 'readwrite');
  t.objectStore(TX_STORE).clear();
  await new Promise((resolve, reject) => { t.oncomplete = resolve; t.onerror = () => reject(t.error); });
  db.close();
}
