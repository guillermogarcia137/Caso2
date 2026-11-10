import type { LucideIcon } from 'lucide-react';
/** Métrica con icono, valor y contexto. */
export function StatCard({
  icon: Icon,
  value,
  label,
  detail,
  color = 'violet',
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  detail: string;
  color?: string;
}) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${color}`}>
        <Icon size={21} />
      </span>
      <span className="stat-trend">{detail}</span>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}
