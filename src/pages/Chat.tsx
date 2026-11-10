import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, Code2, ShieldCheck, MessageCircle } from 'lucide-react';
import { ChatBubble, type Message } from '../components/ChatBubble';
import { MESSAGES } from '../data/forum';
import { readStorage, writeStorage } from '../utils/storage';
import { useApp } from '../utils/useApp';
/** Chat local con fragmentos de código y respuesta automática explícitamente simulada. */
export default function Chat() {
  const { session } = useApp();
  const [messages, setMessages] = useState(() => readStorage<Message[]>('messages', MESSAGES));
  const [text, setText] = useState('');
  const [code, setCode] = useState(false);
  const [typing, setTyping] = useState(false);
  const timer = useRef<number | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'nearest' });
  }, [messages, typing]);
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || typing) return;
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const next = [
      ...messages,
      {
        id: crypto.randomUUID(),
        from: session?.role === 'Tutor' ? 'tutor' : 'student',
        text: text.trim(),
        time,
        code,
      },
    ];
    setMessages(next);
    writeStorage('messages', next);
    setText('');
    setCode(false);
    if (session?.role === 'Tutor') return;
    setTyping(true);
    timer.current = window.setTimeout(() => {
      const replied = [
        ...next,
        {
          id: crypto.randomUUID(),
          from: 'tutor',
          text: 'Respuesta simulada: ¡Vamos paso a paso! Prueba primero con n = 2 y n = 9, y revisa qué devuelve tu función en cada iteración. Puedes compartir tu código aquí.',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(replied);
      writeStorage('messages', replied);
      setTyping(false);
    }, 1600);
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">EL APOYO TAMBIÉN ES PARTE DEL CAMINO</p>
          <h1>Una conversación. Una nueva idea.</h1>
          <p>Tu espacio de tutoría privada · Demostración local</p>
        </div>
      </div>
      <div className="chat-layout panel">
        <aside className="chat-sidebar">
          <h3>Tus conversaciones</h3>
          <div className="chat-contact active">
            <span className="avatar tutor-avatar">LM</span>
            <div>
              <b>Lucía Martín</b>
              <p>Tutora de programación</p>
              <small>
                <i /> Disponible · Simulado
              </small>
            </div>
          </div>
          <div className="chat-tip">
            <MessageCircle size={25} />
            <h3>Pregunta sin miedo.</h3>
            <p>Comparte tus dudas o un fragmento de código. Aprender es una conversación.</p>
          </div>
        </aside>
        <section className="chat-main">
          <header className="chat-header">
            <span className="avatar tutor-avatar">LM</span>
            <div>
              <h3>{session?.role === 'Tutor' ? 'Guillermo García · Alumno' : 'Lucía Martín'}</h3>
              <p>Tutoría de Java y programación</p>
            </div>
            <ShieldCheck size={20} />
          </header>
          <div className="chat-history">
            <span className="chat-date">CONVERSACIÓN DE DEMOSTRACIÓN</span>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {typing && (
              <div className="typing" role="status">
                Lucía está escribiendo<span>…</span>
              </div>
            )}
            <div ref={bottom} />
          </div>
          <form className="chat-compose" onSubmit={send}>
            <button
              type="button"
              className={`icon-button ${code ? 'active' : ''}`}
              aria-label="Enviar como código"
              aria-pressed={code}
              onClick={() => setCode(!code)}
            >
              <Code2 size={21} />
            </button>
            <textarea
              aria-label={code ? 'Fragmento de código' : 'Escribe tu mensaje'}
              rows={2}
              placeholder={code ? 'Pega tu fragmento de código…' : 'Escribe tu mensaje…'}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="button"
              type="submit"
              disabled={typing || !text.trim()}
              aria-label="Enviar mensaje"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="chat-disclaimer">
            {code ? 'Modo código activado · ' : ''}Mensajes guardados en este navegador. No se
            envían a una persona real.
          </p>
        </section>
      </div>
    </>
  );
}
