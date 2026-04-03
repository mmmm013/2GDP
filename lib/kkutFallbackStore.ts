type KutRecord = {
  code: string;
  destination: string;
  item_type: 'STI' | 'BTI' | 'FP';
  item_id: string;
};

type GlobalWithStore = typeof globalThis & {
  __kkutFallbackStore?: Map<string, KutRecord>;
};

function getStore(): Map<string, KutRecord> {
  const g = globalThis as GlobalWithStore;
  if (!g.__kkutFallbackStore) g.__kkutFallbackStore = new Map<string, KutRecord>();
  return g.__kkutFallbackStore;
}

export function upsertFallbackKut(record: KutRecord): KutRecord {
  const store = getStore();
  store.set(record.code, record);
  return record;
}

export function getFallbackKut(code: string): KutRecord | null {
  const store = getStore();
  return store.get(code) ?? null;
}
