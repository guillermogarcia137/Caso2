import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock3, CheckCircle2, ShieldCheck, XCircle, RotateCcw } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { COURSES } from '../data/courses';
import { QuizQuestion } from '../components/QuizQuestion';
import { readStorage, writeStorage } from '../utils/storage';
import { issueCertificate } from '../utils/crypto';
interface Attempt {
  ids: number[];
  answers: Record<number, number>;
  deadline: number;
  finished: boolean;
}
/** Baraja Fisher-Yates para seleccionar diez preguntas sin repeticiones. */
function newAttempt(): Attempt {
  const ids = QUESTIONS.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return {
    ids: ids.slice(0, 10),
    answers: {},
    deadline: Date.now() + 15 * 60 * 1000,
    finished: false,
  };
}
/** Examen recuperable, guardado periódico, temporizador y corrección explicada. */
export default function Quiz() {
  const { id = 'java' } = useParams();
  const course = COURSES.find((c) => c.id === id);
  const [attempt, setAttempt] = useState<Attempt>(() => readStorage(`quiz:${id}`, newAttempt()));
  const [seconds, setSeconds] = useState(() =>
    Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000)),
  );
  const [saved, setSaved] = useState(false);
  const [certificateState, setCertificateState] = useState('');
  const latest = useRef(attempt);
  useEffect(() => {
    latest.current = attempt;
  }, [attempt]);
  const questions = attempt.ids.map((qid) => QUESTIONS.find((q) => q.id === qid)!);
  const grade = questions.filter((q) => attempt.answers[q.id] === q.correct).length;
  useEffect(() => {
    writeStorage(`quiz:${id}`, latest.current);
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((latest.current.deadline - Date.now()) / 1000));
      setSeconds(left);
      if (!left && !latest.current.finished) {
        const result = { ...latest.current, finished: true };
        setAttempt(result);
        writeStorage(`quiz:${id}`, result);
      }
    }, 1000);
    const autosave = window.setInterval(() => {
      writeStorage(`quiz:${id}`, latest.current);
      setSaved(true);
    }, 10000);
    return () => {
      clearInterval(timer);
      clearInterval(autosave);
      writeStorage(`quiz:${id}`, latest.current);
    };
  }, [id]);
  /** Cierra el intento y persiste las respuestas para mostrar la corrección. */
  const finish = () => {
    const next = { ...attempt, finished: true };
    setAttempt(next);
    writeStorage(`quiz:${id}`, next);
  };
  if (!course)
    return (
      <p>
        Curso no encontrado. <Link to="/catalogo">Volver</Link>
      </p>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PON A PRUEBA LO QUE SABES</p>
          <h1>Evaluación de conocimientos</h1>
          <p>{course.title} · 10 preguntas · Aprueba con 5 / 10</p>
        </div>
        <span className="timer">
          <Clock3 size={19} />
          {attempt.finished
            ? 'Finalizado'
            : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}
        </span>
      </div>
      {!attempt.finished ? (
        <>
          <div className="quiz-status panel">
            <span>{Object.keys(attempt.answers).length} / 10 respondidas</span>
            <span aria-live="polite" className="teal-text">
              <ShieldCheck size={16} />
              {saved ? 'Guardado' : 'Autoguardado cada 10 segundos'}
            </span>
          </div>
          {questions.map((q, i) => (
            <QuizQuestion
              key={q.id}
              question={q}
              index={i}
              answer={attempt.answers[q.id]}
              onAnswer={(answer) => {
                setAttempt({ ...attempt, answers: { ...attempt.answers, [q.id]: answer } });
                setSaved(false);
              }}
            />
          ))}
          <button className="button" onClick={finish}>
            Entregar examen ({Object.keys(attempt.answers).length}/10)
          </button>
          <p className="muted text-sm">Las preguntas sin responder cuentan como incorrectas.</p>
        </>
      ) : (
        <>
          <div className={`result-panel panel ${grade >= 5 ? 'passed' : ''}`}>
            <span className="result-grade">
              {grade}
              <small>/10</small>
            </span>
            <h2>{grade >= 5 ? '¡Un paso más en tu camino!' : 'Cada intento es aprendizaje'}</h2>
            <p>
              {grade >= 5
                ? 'Has aprobado la evaluación. Ya puedes emitir tu certificado de demostración.'
                : 'Revisa las explicaciones y vuelve a intentarlo.'}
            </p>
            <div className="button-row">
              {grade >= 5 && (
                <button
                  disabled={certificateState !== ''}
                  className="button"
                  onClick={async () => {
                    setCertificateState('Generando…');
                    try {
                      await issueCertificate(course.title, grade);
                      setCertificateState('Certificado generado');
                    } catch {
                      setCertificateState('');
                    }
                  }}
                >
                  {certificateState || 'Generar certificado'}
                </button>
              )}
              <Link className="button secondary" to="/certificados">
                Mis certificados
              </Link>
              <button
                className="button secondary"
                onClick={() => {
                  const next = newAttempt();
                  setAttempt(next);
                  writeStorage(`quiz:${id}`, next);
                  setCertificateState('');
                }}
              >
                <RotateCcw size={15} /> Nuevo intento
              </button>
            </div>
            <p aria-live="polite">{certificateState}</p>
          </div>
          <h2 className="section-title">Revisión de respuestas</h2>
          {questions.map((q, i) => {
            const correct = attempt.answers[q.id] === q.correct;
            return (
              <div className="panel review-item" key={q.id}>
                {correct ? (
                  <CheckCircle2 className="teal-text" size={21} />
                ) : (
                  <XCircle className="error-text" size={21} />
                )}
                <div>
                  <h3>
                    {i + 1}. {q.text}
                  </h3>
                  <p>Tu respuesta: {q.options[attempt.answers[q.id]] ?? 'Sin responder'}</p>
                  {!correct && (
                    <p>
                      <b>Respuesta correcta: {q.options[q.correct]}</b>
                      <br />
                      {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
