import { ArrowUpRight, Clock3, Star, Play, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '../data/courses';
/** Portada tipográfica generada con CSS, sin dependencias de imágenes remotas. */
export function CourseArt({ course }: { course: Course }) {
  return (
    <div className={`course-art ${course.color}`}>
      <div className="art-grid" />
      <span className="art-label">SKILLTECH / {course.category.toUpperCase()}</span>
      <strong>{course.symbol}</strong>
      <span className="art-bottom">
        APRENDE CONSTRUYENDO <ArrowUpRight size={16} />
      </span>
      <i className="art-orbit" />
    </div>
  );
}
/** Tarjeta de curso reutilizada en el catálogo y el panel. */
export function CourseCard({
  course,
  progress,
  onEnroll,
}: {
  course: Course;
  progress?: number;
  onEnroll?: () => void;
}) {
  return (
    <article className="course-card">
      <Link to={`/aula/${course.id}`} aria-label={`Abrir ${course.title}`}>
        <CourseArt course={course} />
      </Link>
      <div className="course-body">
        <div className="course-meta">
          <span className={`category ${course.color}`}>{course.category}</span>
          <span>{course.level}</span>
        </div>
        <Link to={`/aula/${course.id}`}>
          <h3>{course.title}</h3>
        </Link>
        <p className="course-tutor">con {course.tutor}</p>
        {progress !== undefined ? (
          <>
            <div className="progress-meta">
              <span>Tu progreso</span>
              <b>{progress}%</b>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${progress}%` }} />
            </div>
            <Link className="continue-link" to={`/aula/${course.id}`}>
              <Play size={14} fill="currentColor" /> Continuar aprendiendo{' '}
              <ArrowUpRight size={16} />
            </Link>
          </>
        ) : (
          <>
            <div className="course-details">
              <span>
                <Clock3 size={14} /> {course.hours} horas
              </span>
              <span>
                <Star size={14} className="star" fill="currentColor" /> {course.rating}{' '}
                <small>(128)</small>
              </span>
            </div>
            <div className="course-price">
              <b>{course.price} €</b>
              <button className="button small secondary" onClick={onEnroll}>
                {onEnroll ? (
                  <>
                    Matricularme <ArrowUpRight size={14} />
                  </>
                ) : (
                  <>
                    <Check size={14} /> Matriculado
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
