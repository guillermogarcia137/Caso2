// Los datos vinculados a la identidad usan la nueva versión genérica de la demo.
// El progreso, los exámenes y las preferencias existentes se conservan.
const IDENTITY_KEYS = new Set(['session', 'threads', 'messages', 'certificates']);

/** Separa los ejemplos públicos de los datos de identidad de la primera versión. */
function storageKey(key: string): string {
  return IDENTITY_KEYS.has(key) ? `skilltech:class-demo:${key}` : `skilltech:${key}`;
}

/** Recupera un dato local y devuelve un valor seguro ante errores o datos inválidos. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(storageKey(key));
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}
/** Persiste exclusivamente datos de la demostración, nunca contraseñas. */
export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    /* Modo privado o almacenamiento lleno: continuar en memoria. */
  }
}
