import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, CheckCircle2, XCircle, Terminal, Clock3 } from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { readStorage, writeStorage } from '../utils/storage';
import { COURSES } from '../data/courses';
const STARTER =
  '// Devuelve true si n es primo; false en caso contrario.\nfunction esPrimo(n) {\n  // Escribe aquí tu solución\n  return false;\n}\n';
interface Result {
  input: number;
  expected: boolean;
  actual: string;
  passed: boolean;
}
/** Laboratorio con cinco pruebas reales, cola simulada y límite de ejecución. */
export default function CodeSubmission() {
  const { id = 'java' } = useParams();
  const [code, setCode] = useState(() => readStorage(`code:${id}`, STARTER));
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [queue, setQueue] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(
    () => () => {
      workerRef.current?.terminate();
      timers.current.forEach(clearTimeout);
    },
    [],
  );
  /** Simula la cola y ejecuta pruebas en un Worker cancelable. */
  const run = () => {
    setBusy(true);
    setResults([]);
    setError('');
    setQueue(3);
    timers.current.push(
      window.setTimeout(() => setQueue(2), 400),
      window.setTimeout(() => setQueue(1), 800),
      window.setTimeout(() => {
        setQueue(0);
        const worker = new Worker(new URL('../utils/grader.worker.ts', import.meta.url), {
          type: 'module',
        });
        workerRef.current = worker;
        const timeout = window.setTimeout(() => {
          worker.terminate();
          setError('Tiempo límite superado (2 segundos). Revisa los bucles infinitos.');
          setBusy(false);
        }, 2000);
        timers.current.push(timeout);
        worker.onmessage = (event) => {
          clearTimeout(timeout);
          setResults(event.data.results ?? []);
          setError(event.data.error ?? '');
          setBusy(false);
          worker.terminate();
        };
        worker.onerror = () => {
          clearTimeout(timeout);
          setError('No se pudo ejecutar el código.');
          setBusy(false);
          worker.terminate();
        };
        worker.postMessage(code);
      }, 1200),
    );
  };
  if (!COURSES.some((c) => c.id === id))
    return (
      <p>
        Curso no encontrado. <Link to="/catalogo">Volver</Link>
      </p>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">APRENDER ES CONSTRUIR</p>
          <h1>Tu código. Tu siguiente reto.</h1>
          <p>Escribe, ejecuta y descubre qué puedes mejorar.</p>
        </div>
        <span className="tag orange">
          <Terminal size={15} /> JavaScript
        </span>
      </div>
      <div className="coding-grid">
        <section className="panel challenge">
          <span className="tag violet">RETO 01 · LÓGICA</span>
          <h2>¿Es un número primo?</h2>
          <p>
            Implementa <code>esPrimo(n)</code>, una función que reciba un entero y devuelva{' '}
            <code>true</code> si es primo, o <code>false</code> en caso contrario.
          </p>
          <h3>Ten en cuenta</h3>
          <ul>
            <li>Un primo es mayor que 1.</li>
            <li>Solo es divisible por 1 y por sí mismo.</li>
            <li>Los negativos no son primos.</li>
          </ul>
          <pre className="code-snippet">
            esPrimo(2) // true
            <br />
            esPrimo(9) // false
            <br />
            esPrimo(1) // false
          </pre>
          <p className="demo-note">
            Las 5 pruebas se ejecutan en un Web Worker, con límite de 2 segundos. Usa solo código de
            esta demo; no es un entorno seguro para ejecutar código desconocido.
          </p>
          <Link to="/chat" className="text-link">
            ¿Necesitas una pista? Habla con tu tutor →
          </Link>
        </section>
        <section>
          <div className="editor-toolbar">
            <span>
              <span className="file-dot" /> solucion.js
            </span>
            <span>Guardado local</span>
          </div>
          <CodeEditor
            code={code}
            onChange={(value) => {
              setCode(value);
              writeStorage(`code:${id}`, value);
            }}
          />
          <div className="editor-footer">
            <span>
              {busy ? (
                <>
                  <Clock3 size={15} />
                  {queue ? `Cola simulada: posición ${queue}` : 'Ejecutando pruebas…'}
                </>
              ) : (
                '5 casos de prueba · Límite 2 s'
              )}
            </span>
            <button className="button" disabled={busy} onClick={run}>
              <Play size={16} /> Ejecutar pruebas
            </button>
          </div>
          <div aria-live="polite">
            {error && (
              <div className="panel error-panel">
                <XCircle size={20} />
                {error}
              </div>
            )}
            {results.length > 0 && (
              <div className="panel test-results">
                <div className="section-heading">
                  <h3>Resultados de las pruebas</h3>
                  <span className="tag teal">
                    Nota: {results.filter((r) => r.passed).length * 2} / 10
                  </span>
                </div>
                {results.map((result) => (
                  <div key={result.input}>
                    {result.passed ? (
                      <CheckCircle2 className="teal-text" size={19} />
                    ) : (
                      <XCircle className="error-text" size={19} />
                    )}
                    <code>esPrimo({result.input})</code>
                    <span>Esperado: {String(result.expected)}</span>
                    <span>Obtenido: {result.actual}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
