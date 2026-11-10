import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, XCircle, ArrowLeft } from 'lucide-react';
import { Brand } from '../components/Layout';
import { useApp } from '../utils/context';
import { readStorage } from '../utils/storage';
import { verifyCertificate, type Certificate } from '../utils/crypto';
/** Página pública para verificar IDs locales o el JSON contenido en un QR. */
export default function VerifyCertificate() {
  const { theme } = useApp();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const raw = input.trim();
      const value = raw.startsWith('{')
        ? JSON.parse(raw)
        : readStorage<Certificate[]>('certificates', []).find((c) => c.id === raw);
      const valid = await verifyCertificate(value);
      setResult(valid);
      setCertificate(valid ? value : null);
    } catch {
      setResult(false);
      setCertificate(null);
    }
  };
  return (
    <div className={`public-page ${theme}`}>
      <header className="public-header">
        <Brand />
        <Link className="button secondary small" to="/">
          <ArrowLeft size={15} /> Volver a Academy
        </Link>
      </header>
      <section className="verification-panel panel">
        <span className="verify-icon">
          <ShieldCheck size={34} />
        </span>
        <p className="eyebrow">VALIDACIÓN DE CERTIFICADOS</p>
        <h1>El talento deja huella.</h1>
        <p>Introduce el ID o pega el texto JSON leído del QR de un certificado de esta demo.</p>
        <form onSubmit={submit}>
          <label>
            ID o contenido del QR
            <textarea
              required
              rows={5}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setResult(null);
              }}
              placeholder="STA-… o { ... }"
            />
          </label>
          <button type="submit" className="button full">
            Comprobar certificado <ShieldCheck size={17} />
          </button>
        </form>
        {result !== null && (
          <div className={`validation-result ${result ? 'valid' : 'invalid'}`} role="status">
            {result ? <ShieldCheck size={29} /> : <XCircle size={29} />}
            <h2>{result ? 'Certificado auténtico' : 'Certificado no válido o modificado'}</h2>
            {certificate && (
              <p>
                {certificate.name}
                <br />
                {certificate.course}
                <br />
                {certificate.date} · {certificate.grade}/10
              </p>
            )}
          </div>
        )}
        <div className="demo-note">
          Verificación de integridad de demostración. Una huella SHA-256 sin clave puede
          recalcularse: no demuestra quién emitió el certificado. La validación por ID solo consulta
          los certificados de este navegador; puedes pegar un QR para comprobarlo en otro
          dispositivo.
        </div>
      </section>
    </div>
  );
}
