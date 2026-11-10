import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { Download, GraduationCap, ShieldCheck } from 'lucide-react';
import type { Certificate } from '../utils/crypto';
/** Descarga un documento PDF vectorial con datos y huella de integridad. */
function downloadCertificate(certificate: Certificate, qrImage?: string) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.setFillColor('#0B1020');
  pdf.rect(0, 0, 297, 210, 'F');
  pdf.setDrawColor('#6C5CE7');
  pdf.rect(10, 10, 277, 190);
  pdf.setTextColor('#00D1B2');
  pdf.setFontSize(14);
  pdf.text('SKILLTECH ACADEMY', 148.5, 37, { align: 'center' });
  pdf.setTextColor('#FFFFFF');
  pdf.setFontSize(30);
  pdf.text('Certificado de superación', 148.5, 61, { align: 'center' });
  pdf.setFontSize(13);
  pdf.text('Se reconoce el aprendizaje de', 148.5, 80, { align: 'center' });
  pdf.setFontSize(27);
  pdf.text(certificate.name, 148.5, 98, { align: 'center' });
  pdf.setFontSize(17);
  pdf.text(certificate.course, 148.5, 116, { align: 'center' });
  pdf.setFontSize(11);
  pdf.text(`Fecha: ${certificate.date} | Nota: ${certificate.grade}/10`, 148.5, 133, {
    align: 'center',
  });
  pdf.setFontSize(8);
  pdf.text(`ID: ${certificate.id}`, 148.5, 151, { align: 'center' });
  pdf.text('Firma digital de demo (huella SHA-256; no firma de un emisor)', 148.5, 163, {
    align: 'center',
  });
  pdf.text(certificate.hash, 148.5, 170, { align: 'center' });
  pdf.text('Prototipo académico. Validación por ID en el mismo navegador.', 148.5, 184, {
    align: 'center',
  });
  if (qrImage) pdf.addImage(qrImage, 'PNG', 247, 153, 28, 28);
  pdf.save(`SkillTech-${certificate.id}.pdf`);
}
/** Certificado visual con QR portable y exportación PDF. */
export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  return (
    <article className="certificate-card">
      <div className="certificate-paper">
        <div className="cert-header">
          <span>
            <GraduationCap size={24} /> SKILLTECH ACADEMY
          </span>
          <ShieldCheck size={27} />
        </div>
        <p className="eyebrow">RECONOCEMOS TU ESFUERZO</p>
        <h2>Certificado de superación</h2>
        <p>Otorgado a</p>
        <h3>{certificate.name}</h3>
        <p>por completar satisfactoriamente</p>
        <h4>{certificate.course}</h4>
        <div className="cert-bottom">
          <div>
            <span>FECHA · {certificate.date}</span>
            <span>CALIFICACIÓN · {certificate.grade} / 10</span>
            <small>{certificate.id}</small>
          </div>
          <div className="qr-box">
            <QRCodeCanvas ref={qrRef} value={JSON.stringify(certificate)} size={96} level="L" />
          </div>
        </div>
      </div>
      <div className="certificate-actions">
        <div>
          <b>Firma digital · Demo SHA-256</b>
          <code>{certificate.hash}</code>
          <small>Prueba de integridad local; no autentica a un emisor.</small>
        </div>
        <button
          className="button small"
          onClick={() => downloadCertificate(certificate, qrRef.current?.toDataURL('image/png'))}
        >
          <Download size={15} /> Descargar PDF
        </button>
      </div>
    </article>
  );
}
