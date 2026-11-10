import { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Video,
  ClipboardCheck,
  Clock3,
  Zap,
  Server,
  CheckCircle2,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { useApp } from '../utils/useApp';
const CONNECTED = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${String(hour).padStart(2, '0')}:00`,
  users: Math.round(
    150 + Math.sin(((hour - 6) / 24) * Math.PI * 2) * 120 + (hour > 7 && hour < 23 ? 420 : 0),
  ),
}));
const EXAMS = Array.from({ length: 8 }, (_, i) => ({
  hour: `${9 + i}:00`,
  exams: [120, 260, 480, 720, 1250, 970, 650, 340][i],
}));
/** Observabilidad simulada: convocatoria de treinta segundos sin carga de servidor real. */
export default function AdminPanel() {
  const { session } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(
      () =>
        setElapsed((value) => {
          if (value >= 29) {
            clearInterval(interval);
            setRunning(false);
            setFinished(true);
            return 30;
          }
          return value + 1;
        }),
      1000,
    );
    return () => clearInterval(interval);
  }, [running]);
  if (session?.role !== 'Coordinador') return <Navigate to="/" replace />;
  const factor = running || finished ? elapsed / 30 : 0;
  const users = Math.round(1248 + factor * 13752);
  const exams = Math.round(48 + factor * 14952);
  const data = CONNECTED.map((point, i) => (i === 23 ? { ...point, users } : point));
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">COORDINACIÓN ACADÉMICA</p>
          <h1>Todo conectado. Todo bajo control.</h1>
          <p>Una vista del reto de rendimiento de SkillTech Academy.</p>
        </div>
        <span className="tag teal">
          <Activity size={15} /> Métricas simuladas
        </span>
      </div>
      <section className="simulation-banner">
        <div>
          <span className="eyebrow">15.000 ALUMNOS · UNA CONVOCATORIA</span>
          <h2>¿Qué pasa cuando todos llegan a la vez?</h2>
          <p>Simula durante 30 segundos la demanda de vídeos y correcciones.</p>
        </div>
        <button
          className="button"
          disabled={running}
          onClick={() => {
            setElapsed(0);
            setFinished(false);
            setRunning(true);
          }}
        >
          <Zap size={17} />
          {running ? `Simulando… ${30 - elapsed} s` : 'Simular convocatoria'}
        </button>
      </section>
      {(running || finished) && (
        <div className="simulation-status" role="status">
          <div className="progress-bar">
            <span style={{ width: `${(elapsed / 30) * 100}%` }} />
          </div>
          <p>
            {finished
              ? 'Simulación completada. Se alcanzaron 15.000 alumnos concurrentes.'
              : `Convocatoria en curso · ${elapsed} / 30 segundos`}
          </p>
        </div>
      )}
      <section className="stats-grid">
        <StatCard
          icon={Users}
          value={users.toLocaleString('es-ES')}
          label="Alumnos activos"
          detail="Ahora · Simulado"
        />
        <StatCard
          icon={Video}
          value={Math.round(386 + factor * 7614).toLocaleString('es-ES')}
          label="Vídeos reproduciéndose"
          detail="Streaming"
          color="blue"
        />
        <StatCard
          icon={ClipboardCheck}
          value={exams.toLocaleString('es-ES')}
          label="Exámenes en curso"
          detail="Convocatoria"
          color="teal"
        />
        <StatCard
          icon={Clock3}
          value={`${(1.2 + factor * 3.6).toFixed(1)} s`}
          label="Tiempo medio de corrección"
          detail="Cola de trabajos"
          color="orange"
        />
      </section>
      <div className="charts-grid">
        <section className="panel chart-panel">
          <div className="section-heading">
            <div>
              <h3>Alumnos conectados</h3>
              <p>Últimas 24 horas · Datos simulados</p>
            </div>
            <span className="tag violet">En directo</span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B7CF8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8B7CF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#69738633" />
                <XAxis dataKey="hour" stroke="#94A0BA" minTickGap={30} fontSize={11} />
                <YAxis stroke="#94A0BA" fontSize={11} width={45} />
                <Tooltip
                  contentStyle={{
                    background: '#151C30',
                    border: '1px solid #39415B',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Alumnos"
                  stroke="#9A8AFF"
                  fill="url(#chartGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="section-heading">
            <div>
              <h3>Exámenes corregidos por hora</h3>
              <p>Periodo de convocatoria · Datos simulados</p>
            </div>
            <span className="tag teal">Corrección</span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={EXAMS.map((p, i) => ({
                  ...p,
                  exams: p.exams + Math.round(factor * (i + 1) * 90),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#69738633" />
                <XAxis dataKey="hour" stroke="#94A0BA" fontSize={11} />
                <YAxis stroke="#94A0BA" fontSize={11} width={45} />
                <Tooltip
                  contentStyle={{
                    background: '#151C30',
                    border: '1px solid #39415B',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="exams"
                  name="Exámenes"
                  fill="#00BFA6"
                  radius={[5, 5, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="panel architecture">
        <Server size={25} />
        <div>
          <h3>El reto que representa este prototipo</h3>
          <p>
            40.000 alumnos, 150 tutores y picos de 15.000 exámenes en 2 horas. Una implementación
            real necesitaría CDN para vídeo, colas de corrección, workers aislados y escalado de
            servicios.
          </p>
          <span>
            <CheckCircle2 size={15} /> Esta simulación solo cambia datos en el navegador. No mide
            capacidad real.
          </span>
        </div>
      </section>
    </>
  );
}
