import { createContext, useContext } from 'react';
export type Role = 'Alumno' | 'Tutor' | 'Coordinador';
interface Session {
  role: Role;
  email: string;
}
interface AppState {
  session: Session | null;
  login: (role: Role, email: string) => void;
  logout: () => void;
  progress: Record<string, number[]>;
  complete: (course: string, lesson: number) => void;
  enroll: (course: string) => void;
  theme: string;
  toggleTheme: () => void;
  language: string;
  toggleLanguage: () => void;
}
export const Context = createContext<AppState | null>(null);
/** Acceso tipado al estado de la aplicación. */
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider requerido');
  return value;
}
