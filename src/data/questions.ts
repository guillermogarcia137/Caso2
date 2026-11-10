export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}
const BANK: [string, string[], number, string][] = [
  [
    '¿Qué tipo guarda un entero en Java?',
    ['int', 'String', 'boolean', 'char'],
    0,
    'int representa números enteros.',
  ],
  ['¿Qué símbolo compara igualdad?', ['=', '==', '!=', '=>'], 1, '== compara valores; = asigna.'],
  [
    '¿Qué bucle se ejecuta al menos una vez?',
    ['for', 'while', 'do-while', 'Ninguno'],
    2,
    'do-while comprueba la condición al final.',
  ],
  [
    '¿Cuál es el primer índice de un array?',
    ['1', '-1', '0', 'Depende'],
    2,
    'Los arrays empiezan en el índice 0.',
  ],
  [
    '¿Qué significa boolean?',
    ['Texto', 'Decimal', 'Verdadero o falso', 'Entero'],
    2,
    'boolean solo admite true y false.',
  ],
  [
    '¿Qué palabra crea un objeto en Java?',
    ['make', 'create', 'new', 'object'],
    2,
    'new crea una instancia.',
  ],
  ['¿Qué devuelve 7 % 3?', ['1', '2', '3', '0'], 0, 'El módulo obtiene el resto de la división.'],
  [
    '¿Qué hace break?',
    ['Reinicia el programa', 'Sale del bucle', 'Omite una variable', 'Define un método'],
    1,
    'break termina el bucle actual.',
  ],
  [
    '¿Cómo se escribe un comentario de una línea?',
    ['// comentario', '<!-- -->', '# comentario', '** comentario'],
    0,
    'En Java se usa // para comentarios de una línea.',
  ],
  [
    '¿Cuál es un tipo de referencia?',
    ['int', 'double', 'boolean', 'String'],
    3,
    'String es una clase.',
  ],
  [
    '¿Qué estructura toma decisiones?',
    ['if', 'import', 'package', 'return'],
    0,
    'if ejecuta código si se cumple una condición.',
  ],
  [
    '¿Qué hace return?',
    ['Imprime', 'Devuelve un resultado', 'Importa clases', 'Repite'],
    1,
    'return termina el método y puede devolver un valor.',
  ],
  [
    '¿Qué modificador impide reasignar una variable?',
    ['static', 'public', 'final', 'void'],
    2,
    'final impide una nueva asignación.',
  ],
  [
    '¿Qué indica void?',
    ['Método sin valor de retorno', 'Variable nula', 'Texto vacío', 'Entero'],
    0,
    'void indica que el método no devuelve un valor.',
  ],
  [
    '¿Qué operador representa AND lógico?',
    ['||', '&&', '!', '%'],
    1,
    '&& exige que ambas condiciones sean verdaderas.',
  ],
  [
    '¿Qué devuelve 5 / 2 con enteros en Java?',
    ['2.5', '3', '2', '0'],
    2,
    'La división de enteros descarta la parte decimal.',
  ],
  [
    '¿Qué es un algoritmo?',
    ['Un lenguaje', 'Una secuencia de pasos para resolver un problema', 'Un error', 'Una variable'],
    1,
    'Un algoritmo define pasos ordenados y finitos.',
  ],
  [
    '¿Qué método imprime una línea en Java?',
    ['console.log', 'print.line', 'System.out.println', 'echo'],
    2,
    'System.out.println imprime y añade un salto de línea.',
  ],
  [
    '¿Qué es la encapsulación?',
    [
      'Ocultar detalles internos y controlar el acceso',
      'Copiar código',
      'Ordenar arrays',
      'Eliminar clases',
    ],
    0,
    'La encapsulación protege el estado interno.',
  ],
  [
    '¿Qué indica una condición de parada?',
    [
      'Cuándo termina un bucle',
      'El nombre del archivo',
      'El tipo de clase',
      'La cantidad de imports',
    ],
    0,
    'Evita que la repetición continúe indefinidamente.',
  ],
];
export const QUESTIONS: Question[] = BANK.map(([text, options, correct, explanation], id) => ({
  id,
  text,
  options,
  correct,
  explanation,
}));
