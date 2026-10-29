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
let activeStorageId: string | null = null;

export function setMemoryEnabled(on: boolean): void { memoryEnabled = on; }
export function isMemoryEnabled(): boolean { return memoryEnabled; }
export function onMemorySaved(cb: ((id: string) => void) | null): void { onSavedCb = cb; }
/** Setzt das aktive, pro Spiel genamespacete localStorage-Ziel (z. B. "gomoku9x9.1"); null = keins. */
export function setActiveMemory(storageId: string | null): void { activeStorageId = storageId; }

/** "agentmemory_1.json" -> "1" (defensiv: Ziffern vor ".json"). */
export function idFromFilename(filename: string): string {
  const m = /agentmemory_(\d+)\.json/.exec(filename);
  return m ? m[1] : filename;
}

/** localStorage-ID: aktives Spielziel, sonst (defensiv) die aus dem Dateinamen abgeleitete ID. */
function storageIdFor(key: string): string { return activeStorageId ?? idFromFilename(key); }

function readStored(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + storageIdFor(key));
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

/** Vom `saveAs`-Shim aufgerufen: aktualisierte Erinnerung unter dem aktiven Ziel in localStorage ablegen. */
export function saveMemory(filename: string, text: string): void {
  const storageId = activeStorageId ?? idFromFilename(filename);
  try { localStorage.setItem(LS_PREFIX + storageId, text); } catch { /* ignore */ }
  try { cache.set(filename, JSON.parse(text)); } catch { /* ignore */ }
  onSavedCb?.(storageId);
}

/** Gibt es für das aktive Ziel eine gespeicherte Erinnerung? */
export function hasStoredMemory(): boolean {
  if (activeStorageId === null) { return false; }
  try { return localStorage.getItem(LS_PREFIX + activeStorageId) !== null; } catch { return false; }
}

/** Lädt die gespeicherte Erinnerung des aktiven Ziels als Datei herunter (Nutzeraktion im eigenen Dev-App). */
export function exportMemory(): void {
  if (activeStorageId === null) { return; }
  let text: string | null = null;
  try { text = localStorage.getItem(LS_PREFIX + activeStorageId); } catch { /* ignore */ }
  if (text === null) { return; }
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agentmemory_1.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch { /* ignore */ }
}

/** Entfernt die gespeicherte Version des aktiven Ziels; nächstes Laden nimmt wieder das Asset. */
export function resetMemory(): void {
  if (activeStorageId !== null) { try { localStorage.removeItem(LS_PREFIX + activeStorageId); } catch { /* ignore */ } }
  cache.delete('agentmemory_1.json');
}
