import { useState, type FormEvent } from 'react';
import { MessagesSquare, CheckCircle2, Send, Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { THREADS, type Thread } from '../data/forum';
import { COURSES } from '../data/courses';
import { readStorage, writeStorage } from '../utils/storage';
import { useApp } from '../utils/useApp';
/** Comunidad por curso con hilos y respuestas persistentes. */
export default function Forum() {
  const { session } = useApp();
  const [threads, setThreads] = useState(() => readStorage<Thread[]>('threads', THREADS));
  const [course, setCourse] = useState('Todos');
  const [selected, setSelected] = useState<string | null>('1');
  const [reply, setReply] = useState('');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [newCourse, setNewCourse] = useState('java');
  const save = (next: Thread[]) => {
    setThreads(next);
    writeStorage('threads', next);
  };
  const active = threads.find((t) => t.id === selected);
  const add = (e: FormEvent) => {
    e.preventDefault();
    const thread = {
      id: crypto.randomUUID(),
      course: newCourse,
      title: title.trim(),
      body: body.trim(),
      author: 'Guillermo García',
      solved: false,
      replies: [],
    };
    if (!thread.title || !thread.body) return;
    save([thread, ...threads]);
    setSelected(thread.id);
    setCourse('Todos');
    setCreating(false);
    setTitle('');
    setBody('');
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">JUNTOS LLEGAMOS MÁS LEJOS</p>
          <h1>Una comunidad que construye.</h1>
          <p>Pregunta, comparte y aprende con otras personas.</p>
        </div>
        <button className="button" onClick={() => setCreating(!creating)}>
          <Plus size={17} /> Nuevo hilo
        </button>
      </div>
      {creating && (
        <form className="panel new-thread" onSubmit={add}>
          <h2>Comparte tu pregunta</h2>
          <label>
            Curso
            <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)}>
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Título
            <input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Tu mensaje
            <textarea required value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
          <button className="button" type="submit">
            Publicar hilo
          </button>
        </form>
      )}
      <div className="forum-toolbar">
        <label>
          Curso{' '}
          <select
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setSelected(null);
            }}
          >
            <option value="Todos">Todos los cursos</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <Link to="/chat">
          ¿Prefieres hablar con tu tutor? <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="forum-grid">
        <section className="thread-list">
          {threads
            .filter((t) => course === 'Todos' || t.course === course)
            .map((thread) => (
              <button
                key={thread.id}
                className={`panel thread-card ${selected === thread.id ? 'selected' : ''}`}
                onClick={() => setSelected(thread.id)}
              >
                <span className="tag violet">
                  {COURSES.find((c) => c.id === thread.course)?.category}
                </span>
                {thread.solved && (
                  <span className="tag teal">
                    <CheckCircle2 size={13} /> Resuelto
                  </span>
                )}
                <h3>{thread.title}</h3>
                <p>
                  {thread.author} · {thread.replies.length} respuestas
                </p>
                <span className="thread-course">
                  {COURSES.find((c) => c.id === thread.course)?.title}
                </span>
              </button>
            ))}
        </section>
        <section className="panel discussion">
          {active ? (
            <>
              <div className="section-heading">
                <span className="avatar">
                  {active.author
                    .split(' ')
                    .map((s) => s[0])
                    .join('')}
                </span>
                {(session?.role !== 'Alumno' || active.author === 'Guillermo García') && (
                  <button
                    className="button secondary small"
                    onClick={() =>
                      save(
                        threads.map((t) => (t.id === active.id ? { ...t, solved: !t.solved } : t)),
                      )
                    }
                  >
                    {active.solved ? 'Reabrir' : 'Marcar resuelto'}
                  </button>
                )}
              </div>
              <h2>{active.title}</h2>
              <p className="muted text-sm">{active.author}</p>
              <p className="thread-body">{active.body}</p>
              <h3>Conversación</h3>
              {active.replies.map((text, i) => (
                <div className="forum-reply" key={i}>
                  {text}
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reply.trim()) return;
                  save(
                    threads.map((t) =>
                      t.id === active.id
                        ? {
                            ...t,
                            replies: [
                              ...t.replies,
                              `${session?.role === 'Tutor' ? 'Lucía (tutora)' : 'Guillermo'} · ${reply.trim()}`,
                            ],
                          }
                        : t,
                    ),
                  );
                  setReply('');
                }}
              >
                <label>
                  Tu respuesta
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    required
                    placeholder="Comparte lo que sabes…"
                  />
                </label>
                <button type="submit" className="button">
                  <Send size={16} /> Responder
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <MessagesSquare size={36} />
              <h3>Selecciona una conversación</h3>
              <p>Todas las preguntas son un buen comienzo.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
