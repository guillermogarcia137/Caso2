import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  FileCode2,
  ListChecks,
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { VideoPlayer } from '../components/VideoPlayer';
import { useApp } from '../utils/useApp';
/** Aula con lecciones, progreso persistente y acceso a ambas evaluaciones. */
export default function Classroom() {
  const { id } = useParams();
  const course = COURSES.find((c) => c.id === id);
  const [lesson, setLesson] = useState(0);
  const { progress, complete, enroll } = useApp();
  if (!course)
    return (
      <div className="empty-state">
        <h1>Curso no encontrado</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </div>
    );
  const done = progress[course.id] ?? [];
  return (
    <>
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> Mi aprendizaje
      </Link>
      <div className="page-heading">
        <div>
          <span className={`tag ${course.color}`}>
            {course.category} · {course.level}
          </span>
          <h1>{course.title}</h1>
          <p>
            con {course.tutor} · {course.hours} horas de aprendizaje
          </p>
        </div>
        <span className="tag teal">
          {done.length} / {course.lessons.length} lecciones completadas
        </span>
      </div>
      <div className="classroom-grid">
        <aside className="panel lesson-panel">
          <h3>Contenido del curso</h3>
          <p className="muted text-sm">Tu siguiente paso empieza aquí.</p>
          <div className="progress-bar">
            <span style={{ width: `${(done.length / course.lessons.length) * 100}%` }} />
          </div>
          {course.lessons.map((name, i) => (
            <button
              className={`lesson ${lesson === i ? 'active' : ''}`}
              key={name}
              onClick={() => setLesson(i)}
            >
              {done.includes(i) ? (
                <CheckCircle2 size={18} className="teal-text" />
              ) : (
                <PlayCircle size={18} />
              )}
              <span>
                <small>LECCIÓN {i + 1}</small>
                {name}
              </span>
              <small>{8 + i * 3} min</small>
            </button>
          ))}
          <Link className="lesson" to={`/examen/${course.id}`}>
            <ListChecks size={18} />
            <span>Examen tipo test</span>
            <ArrowRight size={15} />
          </Link>
          <Link className="lesson" to={`/codigo/${course.id}`}>
            <FileCode2 size={18} />
            <span>Entrega de código</span>
            <ArrowRight size={15} />
          </Link>
        </aside>
        <section>
          <VideoPlayer lessonKey={`${course.id}:${lesson}`} />
          <div className="lesson-heading">
            <div>
              <p className="eyebrow">LECCIÓN {lesson + 1}</p>
              <h2>{course.lessons[lesson]}</h2>
            </div>
            <button
              className="button"
              onClick={() => {
                enroll(course.id);
                complete(course.id, lesson);
              }}
            >
              {done.includes(lesson) ? (
                <>
                  <CheckCircle2 size={17} /> Completada
                </>
              ) : (
                'Marcar como completada'
              )}
            </button>
          </div>
          <div className="panel lesson-notes">
            <h3>De la teoría a la práctica</h3>
            <p>
              En esta lección darás un paso más en tu aprendizaje. Toma notas, prueba tus ideas y
              pregunta a tu tutor cuando lo necesites.
            </p>
            <div className="demo-note">
              El vídeo de dominio público demuestra el reproductor. Para contenido de programación:{' '}
              <a href="https://www.youtube.com/@mouredev" target="_blank" rel="noreferrer">
                MoureDev ↗
              </a>{' '}
              ·{' '}
              <a href="https://www.youtube.com/@NateGentile7" target="_blank" rel="noreferrer">
                Nate Gentile ↗
              </a>
            </div>
            <Link className="button secondary" to="/foro">
              Resolver dudas en la comunidad <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
