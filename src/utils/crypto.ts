import { readStorage, writeStorage } from './storage';
export interface Certificate {
  id: string;
  name: string;
  course: string;
  date: string;
  grade: number;
  hash: string;
}
/** Huella SHA-256 canónica; prueba de integridad local, no firma de un emisor confiable. */
export async function fingerprint(data: Omit<Certificate, 'hash'>): Promise<string> {
  const canonical = JSON.stringify([data.id, data.name, data.course, data.date, data.grade]);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
/** Emite un certificado de demostración y lo conserva en este navegador. */
export async function issueCertificate(course: string, grade: number): Promise<Certificate> {
  const data = {
    id: `STA-${crypto.randomUUID()}`,
    name: 'Guillermo García',
    course,
    date: new Date().toISOString().slice(0, 10),
    grade,
  };
  const certificate = { ...data, hash: await fingerprint(data) };
  writeStorage('certificates', [...readStorage<Certificate[]>('certificates', []), certificate]);
  return certificate;
}
/** Comprueba estructura y huella sin confiar en datos pegados por el usuario. */
export async function verifyCertificate(value: unknown): Promise<boolean> {
  if (!value || typeof value !== 'object') return false;
  const c = value as Certificate;
  if (
    ![c.id, c.name, c.course, c.date, c.hash].every((v) => typeof v === 'string') ||
    typeof c.grade !== 'number'
  )
    return false;
  return (await fingerprint(c)) === c.hash;
}
