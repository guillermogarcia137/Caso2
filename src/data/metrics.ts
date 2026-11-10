/** Series ficticias para visualizar una convocatoria académica. */
export const CONNECTED = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${String(hour).padStart(2, '0')}:00`,
  users: Math.round(
    150 + Math.sin(((hour - 6) / 24) * Math.PI * 2) * 120 + (hour > 7 && hour < 23 ? 420 : 0),
  ),
}));
export const EXAMS = Array.from({ length: 8 }, (_, i) => ({
  hour: `${9 + i}:00`,
  exams: [120, 260, 480, 720, 1250, 970, 650, 340][i],
}));
