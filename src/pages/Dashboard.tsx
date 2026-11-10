import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Flame,
  CalendarDays,
  CheckCircle2,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { useApp } from '../utils/context';
import { CourseCard } from '../components/CourseCard';
import { StatCard } from '../components/StatCard';
import { readStorage } from '../utils/storage';
import type { Certificate } from '../utils/crypto';
/** Inicio del alumno: progreso real de la demo junto a contexto académico simulado. */
export default function Dashboard() {
  const { progress, session } = useApp();
  const enrolled = COURSES.filter((course) => course.id in progress);
  const certs = readStorage<Certificate[]>('certificates', []);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TU FUTURO EMPIEZA AQUÍ</p>
          <h1>
            Hola, Guillermo <span className="wave">✦</span>
          </h1>
          <p>Un paso más cerca de tu próxima gran oportunidad.</p>
        </div>
        <span className="date-chip">
          <CalendarDays size={16} /> Martes, 10 de noviembre
        </span>
      </div>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            <span /> SIGUE ADELANTE
          </span>
          <h2>
            El siguiente nivel
            <br />
            lo construyes tú<span>.</span>
          </h2>
          <p>
            Cada lección cuenta. Retoma donde lo dejaste
            <br className="desktop-break" /> y convierte tu curiosidad en nuevas habilidades.
          </p>
          <Link className="button white" to={`/aula/${enrolled[0]?.id ?? 'java'}`}>
            Continuar aprendiendo <ArrowRight size={17} />
          </Link>
          <div className="hero-social">
            <span className="mini-avatars">
              <i>LM</i>
              <i>CR</i>
              <i>AT</i>
            </span>
            <span>Aprende acompañado de tutores expertos</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="floating-code">
            <div>
              <i />
              <i />
              <i />
              <span>tu-futuro.ts</span>
            </div>
            <pre>
              <em>const</em> futuro = {'{'}
              <br /> curiosidad: <b>true</b>,<br /> aprendizaje: <b>'sin límites'</b>,<br />{' '}
              próximoPaso: <b>'empezar'</b>
              <br />
              {'}'};<br />
              <br />
              <span>// Tú escribes lo que viene.</span>
            </pre>
          </div>
          <span className="float-badge badge-top">✦ Nuevas habilidades</span>
          <span className="float-badge badge-bottom">
            <CheckCircle2 size={18} /> Un reto menos. Un paso más.
          </span>
          <span className="floating-symbol">{'</>'}</span>
        </div>
      </section>
      <section className="stats-grid">
        <StatCard
          icon={BookOpen}
          value={enrolled.length}
          label="Cursos en tu aprendizaje"
          detail="A tu ritmo"
        />
        <StatCard
          icon={Clock3}
          value="12,5 h"
          label="Tiempo de aprendizaje"
          detail="Datos de ejemplo"
          color="blue"
        />
        <StatCard
          icon={GraduationCap}
          value={certs.length}
          label="Certificados obtenidos"
          detail="Tus logros"
          color="teal"
        />
        <StatCard
          icon={Flame}
          value="7 días"
          label="Racha de aprendizaje"
          detail="Datos de ejemplo"
          color="orange"
        />
      </section>
      <div className="dashboard-columns">
        <section>
          <div className="section-heading">
            <div>
              <h2>Continúa donde lo dejaste</h2>
              <p>Pequeños avances, grandes resultados.</p>
            </div>
            <Link to="/catalogo">
              Ver todos <ArrowRight size={15} />
            </Link>
          </div>
          <div className="course-grid dashboard-courses">
            {enrolled.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={Math.round(
                  ((progress[course.id]?.length ?? 0) / course.lessons.length) * 100,
                )}
              />
            ))}
          </div>
          <div className="section-heading">
            <h2>Tu actividad reciente</h2>
            <span className="muted text-sm">EJEMPLO ACADÉMICO</span>
          </div>
          <div className="panel activity-list">
            <div>
              <span className="activity-icon teal">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <b>Una lección más, una habilidad nueva</b>
                <p>Variables y tipos de datos · Java</p>
              </div>
              <small>Ayer</small>
            </div>
            <div>
              <span className="activity-icon violet">
                <Target size={18} />
              </span>
              <div>
                <b>Última evaluación: 8,5 / 10</b>
                <p>Introducción a Python · Nota de ejemplo</p>
              </div>
              <small>8 nov.</small>
            </div>
          </div>
        </section>
        <aside className="right-column">
          <section className="panel agenda">
            <div className="section-heading">
              <h3>En tu agenda</h3>
              <CalendarDays size={18} />
            </div>
            <p className="muted text-sm">Tus próximos desafíos</p>
            <Link className="agenda-item" to="/examen/java">
              <span className="calendar-tile">
                <small>NOV</small>18
              </span>
              <div>
                <b>Evaluación de Java</b>
                <p>10 preguntas · 15 min</p>
                <span className="tag violet">Examen tipo test</span>
              </div>
              <ArrowUpRight size={17} />
            </Link>
            <Link className="agenda-item" to="/codigo/java">
              <span className="calendar-tile">
                <small>NOV</small>20
              </span>
              <div>
                <b>Reto: números primos</b>
                <p>JavaScript · 5 pruebas</p>
                <span className="tag teal">Entrega de código</span>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          </section>
          <section className="panel weekly">
            <span className="weekly-icon">
              <Target size={23} />
            </span>
            <h3>Tu meta de la semana</h3>
            <p>Un poco cada día hace la diferencia.</p>
            <div className="week-days">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                <span key={i} className={i < 2 ? 'done' : ''}>
                  {i < 2 ? <CheckCircle2 size={16} /> : day}
                </span>
              ))}
            </div>
            <div className="progress-meta">
              <span>2 de 5 días · Ejemplo</span>
              <b>40%</b>
            </div>
            <div className="progress-bar">
              <span style={{ width: '40%' }} />
            </div>
          </section>
          <div className="help-card">
            <span>¿Te has atascado?</span>
            <h3>No aprendes solo.</h3>
            <p>Tu tutor está a un mensaje de distancia.</p>
            <Link to="/chat">
              Hablar con mi tutor <ArrowUpRight size={16} />
            </Link>
          </div>
          {session?.role === 'Coordinador' && (
            <Link className="button" to="/coordinacion">
              Ver coordinación <ArrowRight size={16} />
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}
