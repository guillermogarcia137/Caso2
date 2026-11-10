import type { Question } from '../data/questions';
/** Pregunta accesible de respuesta única mediante radio buttons nativos. */
export function QuizQuestion({
  question,
  answer,
  onAnswer,
  index,
}: {
  question: Question;
  answer?: number;
  onAnswer: (answer: number) => void;
  index: number;
}) {
  return (
    <fieldset className="quiz-question panel">
      <legend>
        <span className="question-number">{String(index + 1).padStart(2, '0')}</span>
        {question.text}
      </legend>
      <div>
        {question.options.map((option, i) => (
          <label className={answer === i ? 'answer selected' : 'answer'} key={option}>
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={answer === i}
              onChange={() => onAnswer(i)}
            />
            <span>{String.fromCharCode(65 + i)}</span>
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
