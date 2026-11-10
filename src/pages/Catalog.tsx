import { useState, type FormEvent } from 'react';
import { Search, X, ShieldCheck, CheckCircle2, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COURSES, type Course } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { useApp } from '../utils/useApp';
/** Catálogo con búsqueda, filtros combinables y matriculación en tres pasos. */
export default function Catalog() {
  const { enroll, progress } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [level, setLevel] = useState('Todos');
  const [course, setCourse] = useState<Course | null>(null);
  const [step, setStep] = useState(1);
  const filtered = COURSES.filter(
    (c) =>
      `${c.title} ${c.category}`.toLowerCase().includes(query.toLowerCase()) &&
      (category === 'Todos' || c.category === category) &&
      (level === 'Todos' || c.level === level),
  );
  /** Confirma la matrícula local sin efectuar ningún cobro. */
  const pay = (e: FormEvent) => {
    e.preventDefault();
    if (course) enroll(course.id);
    setStep(3);
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DA EL SIGUIENTE PASO</p>
          <h1>Explora tu próxima habilidad</h1>
          <p>Cursos prácticos para construir el futuro que imaginas.</p>
        </div>
        <span className="tag violet">8 caminos para crecer</span>
      </div>
      <div className="catalog-banner">
        <div>
          <span className="tag teal">APRENDE HACIENDO</span>
          <h2>Menos «algún día». Más «hoy».</h2>
          <p>Encuentra tu curso y empieza a transformar ideas en proyectos.</p>
        </div>
        <span aria-hidden="true">{'{ aprende(); }'}</span>
      </div>
      <div className="filter-bar">
        <label className="search-field">
          <Search size={19} />
          <input
            aria-label="Buscar cursos"
            placeholder="¿Qué quieres aprender?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="level-filter">
          <SlidersHorizontal size={16} />
          <select
            aria-label="Filtrar por nivel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {['Todos', 'Inicial', 'Intermedio', 'Avanzado'].map((item) => (
              <option key={item} value={item}>
                {item === 'Todos' ? 'Todos los niveles' : item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-tabs">
        {['Todos', 'Programación', 'Ciberseguridad', 'Cloud', 'Datos'].map((item) => (
          <button
            key={item}
            className={category === item ? 'active' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
        <span>{filtered.length} cursos</span>
      </div>
      <div className="course-grid catalog-grid">
        {filtered.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            onEnroll={
              c.id in progress
                ? undefined
                : () => {
                    setCourse(c);
                    setStep(1);
                  }
            }
          />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search size={32} />
          <h2>No encontramos cursos</h2>
          <p>Prueba otro término o cambia los filtros.</p>
        </div>
      )}
      {course && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setCourse(null);
            }}
          >
            <button
              className="modal-close icon-button"
              aria-label="Cerrar pago"
              onClick={() => setCourse(null)}
            >
              <X />
            </button>
            <span className="eyebrow">MATRICULACIÓN · PASO {step} DE 3</span>
            <h2 id="payment-title">
              {step === 3
                ? '¡Ya estás dentro!'
                : step === 2
                  ? 'Pago de demostración'
                  : 'Tu próximo gran paso'}
            </h2>
            {step === 1 ? (
              <>
                <h3>{course.title}</h3>
                <p>
                  {course.hours} horas · {course.level} · Acceso a tu ritmo
                </p>
                <div className="payment-total">
                  <span>Total</span>
                  <b>{course.price} €</b>
                </div>
                <button className="button full" onClick={() => setStep(2)}>
                  Continuar <ArrowRight size={16} />
                </button>
              </>
            ) : step === 2 ? (
              <form onSubmit={pay}>
                <div className="demo-note">
                  <ShieldCheck />
                  <p>No se cobra dinero. No introduzcas datos bancarios reales.</p>
                </div>
                <label>
                  Método de pago
                  <select>
                    <option>Tarjeta de prueba ···· 4242</option>
                    <option>PayPal de demostración</option>
                  </select>
                </label>
                <label>
                  <input type="checkbox" required /> Entiendo que es una compra simulada.
                </label>
                <button className="button full" type="submit">
                  Confirmar matrícula simulada
                </button>
              </form>
            ) : (
              <>
                <CheckCircle2 className="success-icon" size={48} />
                <p>Tu curso ya aparece en Mi aprendizaje.</p>
                <Link className="button full" to={`/aula/${course.id}`}>
                  Entrar al aula <ArrowRight size={16} />
                </Link>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
