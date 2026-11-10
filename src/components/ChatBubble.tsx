export interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  code?: boolean;
}
/** Mensaje con texto seguro; el código nunca se interpreta como HTML. */
export function ChatBubble({ message }: { message: Message }) {
  return (
    <div className={`chat-message ${message.from === 'student' ? 'outgoing' : ''}`}>
      {message.from !== 'student' && <span className="avatar tutor-avatar">LM</span>}
      <div className="bubble">
        {message.code ? (
          <pre>
            <code>{message.text}</code>
          </pre>
        ) : (
          <p>{message.text}</p>
        )}
        <small>
          {message.time}
          {message.from === 'student' && ' · ✓✓'}
        </small>
      </div>
    </div>
  );
}
