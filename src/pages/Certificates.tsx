import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { readStorage } from '../utils/storage';
import type { Certificate } from '../utils/crypto';
import { CertificateCard } from '../components/CertificateCard';
/** Colección de certificados emitidos al aprobar un examen en este navegador. */
export default function Certificates() {
  const certificates = readStorage<Certificate[]>('certificates', []);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">EL ESFUERZO TIENE RECONOCIMIENTO</p>
          <h1>Pequeños pasos. Grandes logros.</h1>
          <p>Tus habilidades, listas para compartir.</p>
        </div>
        <Link className="button secondary" to="/validar">
          <ShieldCheck size={17} /> Validar certificado
        </Link>
      </div>
      <div className="demo-note">
        Los certificados de este prototipo se crean al aprobar una evaluación. El QR contiene datos
        y huella SHA-256; el ID se puede validar en este navegador. No equivalen a una credencial
        real.
      </div>
      {certificates.length ? (
        <div className="certificates-grid">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      ) : (
        <div className="empty-state panel">
          <GraduationCap size={48} />
          <h2>Tu primer logro te espera</h2>
          <p>Aprueba un examen y pulsa «Generar certificado» para verlo aquí.</p>
          <Link className="button" to="/examen/java">
            Hacer examen de Java →
          </Link>
        </div>
      )}
    </>
  );
}
