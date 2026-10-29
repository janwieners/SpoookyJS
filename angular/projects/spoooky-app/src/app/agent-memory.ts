// projects/spoooky-app/src/app/agent-memory.ts
/**
 * App-seitiger Speicher für die Agentenerinnerungen der Engine (SP3c).
 *
 * Die Engine lädt `agentmemory_<ID>.json` synchron über den globalen `$.ajax` (siehe engine-runtime.ts).
 * Dieses Modul hält die vorgeladenen Daten in einem Cache, den der `$.ajax`-Shim synchron ausliest.
 * Eine in localStorage gespeicherte (selbst erlernte/exportierte) Version hat Vorrang vor dem Asset.
 */

const LS_PREFIX = 'spoooky.agentmemory.';

/** Cache: Engine-URL-String ("agentmemory_1.json") -> geparste Erinnerungsdaten. */
const cache = new Map<string, unknown>();
let memoryEnabled = false;
let onSavedCb: ((id: string) => void) | null = null;

export function setMemoryEnabled(on: boolean): void { memoryEnabled = on; }
export function isMemoryEnabled(): boolean { return memoryEnabled; }
export function onMemorySaved(cb: ((id: string) => void) | null): void { onSavedCb = cb; }

/** "agentmemory_1.json" -> "1" (defensiv: Ziffern vor ".json"). */
export function idFromFilename(filename: string): string {
  const m = /agentmemory_(\d+)\.json/.exec(filename);
  return m ? m[1] : filename;
}

function readStored(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + idFromFilename(key));
    return raw === null ? null : JSON.parse(raw);
  } catch { return null; }
}

/** Lädt die Erinnerungen in den Cache (localStorage-Version bevorzugt, sonst Asset per fetch). */
export async function preloadMemory(entries: Array<{ key: string; assetUrl: string }>): Promise<void> {
  await Promise.all(entries.map(async ({ key, assetUrl }) => {
    const stored = readStored(key);
    if (stored !== null) { cache.set(key, stored); return; }
    try {
      const res = await fetch(assetUrl);
      if (!res.ok) { return; }
      cache.set(key, await res.json());
    } catch { /* stiller Fallback: ohne Eintrag -> Standard-Agenten */ }
  }));
}

/** Synchron vom `$.ajax`-Shim aufgerufen. Liefert die Daten oder null (Memory aus / kein Eintrag). */
export function getMemory(key: string): unknown | null {
  if (!memoryEnabled) { return null; }
  const stored = readStored(key);
  if (stored !== null) { return stored; }
  return cache.has(key) ? cache.get(key)! : null;
}

/** Anzahl gelernter Spielzustände im (ggf. localStorage-)Eintrag; 0 wenn keiner. */
export function gameStatesCount(key: string): number {
  const data: any = readStored(key) ?? cache.get(key) ?? null;
  const gs = data?.learnModule?.gameStates;
  return gs && typeof gs === 'object' ? Object.keys(gs).length : 0;
}

/** Vom `saveAs`-Shim aufgerufen: aktualisierte Erinnerung in localStorage ablegen. */
export function saveMemory(filename: string, text: string): void {
  const id = idFromFilename(filename);
  try { localStorage.setItem(LS_PREFIX + id, text); } catch { /* ignore */ }
  try { cache.set(filename, JSON.parse(text)); } catch { /* ignore */ }
  onSavedCb?.(id);
}

export function hasStoredMemory(id: string): boolean {
  try { return localStorage.getItem(LS_PREFIX + id) !== null; } catch { return false; }
}

/** Lädt die gespeicherte Erinnerung als Datei herunter (Nutzeraktion im eigenen Dev-App). */
export function exportMemory(id: string): void {
  let text: string | null = null;
  try { text = localStorage.getItem(LS_PREFIX + id); } catch { /* ignore */ }
  if (text === null) { return; }
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentmemory_${id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch { /* ignore */ }
}

/** Entfernt die gespeicherte Version; nächstes Laden nimmt wieder das Asset. */
export function resetMemory(id: string): void {
  try { localStorage.removeItem(LS_PREFIX + id); } catch { /* ignore */ }
  cache.delete(`agentmemory_${id}.json`);
}
