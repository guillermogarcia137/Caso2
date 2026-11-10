/** Recupera un dato local y devuelve un valor seguro ante errores o datos inválidos. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(`skilltech:${key}`);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}
/** Persiste exclusivamente datos de la demostración, nunca contraseñas. */
export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(`skilltech:${key}`, JSON.stringify(value));
  } catch {
    /* Modo privado o almacenamiento lleno: continuar en memoria. */
  }
}
