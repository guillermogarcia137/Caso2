export interface Thread {
  id: string;
  course: string;
  title: string;
  author: string;
  body: string;
  solved: boolean;
  replies: string[];
}
export const THREADS: Thread[] = [
  {
    id: '1',
    course: 'java',
    title: '¿Cuándo usar un bucle for o un while?',
    author: 'María López',
    body: 'Entiendo cómo funcionan, pero no sé cuál elegir en cada caso. ¿Algún consejo?',
    solved: true,
    replies: [
      'Lucía · Usa for cuando sabes cuántas iteraciones necesitas; while cuando dependes de una condición.',
    ],
  },
  {
    id: '2',
    course: 'java',
    title: 'Compartimos nuestros primeros proyectos 🚀',
    author: 'Pablo Sánchez',
    body: 'He terminado mi calculadora en Java. ¿Qué estáis construyendo?',
    solved: false,
    replies: ['Alumno · ¡Yo estoy haciendo un gestor de tareas!'],
  },
  {
    id: '3',
    course: 'python',
    title: 'Recursos para practicar lógica',
    author: 'Ana Torres',
    body: 'Empieza por retos pequeños: palíndromos, números primos y búsqueda en listas.',
    solved: false,
    replies: [],
  },
];
export const MESSAGES = [
  {
    id: '1',
    from: 'tutor',
    text: '¡Hola, Alumno! 👋 Soy Lucía, tu tutora. ¿Cómo llevas el curso?',
    time: '10:30',
  },
  {
    id: '2',
    from: 'student',
    text: '¡Hola! Tengo una duda con la entrega de números primos.',
    time: '10:32',
  },
  {
    id: '3',
    from: 'tutor',
    text: 'Prueba a dividir desde 2 hasta la raíz cuadrada de n. Si encuentras un divisor, no es primo.',
    time: '10:33',
  },
];
