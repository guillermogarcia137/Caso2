import { createContext, useContext, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from './storage';
import { INITIAL_PROGRESS } from '../data/users';
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
const Context = createContext<AppState | null>(null);
/** Estado compartido con persistencia tolerante a fallos. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStorage('session', null));
  const [progress, setProgress] = useState(() => readStorage('progress', INITIAL_PROGRESS));
  const [theme, setTheme] = useState(() => readStorage('theme', 'dark'));
  const [language, setLanguage] = useState(() => readStorage('language', 'ES'));
  const saveProgress = (next: Record<string, number[]>) => {
    setProgress(next);
    writeStorage('progress', next);
  };
  return (
    <Context.Provider
      value={{
        session,
        progress,
        theme,
        language,
        login: (role, email) => {
          const next = { role, email };
          setSession(next);
          writeStorage('session', next);
        },
        logout: () => {
          setSession(null);
          writeStorage('session', null);
        },
        complete: (course, lesson) =>
          saveProgress({
            ...progress,
            [course]: [...new Set([...(progress[course] ?? []), lesson])],
          }),
        enroll: (course) => {
          if (!(course in progress)) saveProgress({ ...progress, [course]: [] });
        },
        toggleTheme: () => {
          const next = theme === 'dark' ? 'light' : 'dark';
          setTheme(next);
          writeStorage('theme', next);
        },
        toggleLanguage: () => {
          const next = language === 'ES' ? 'EN' : 'ES';
          setLanguage(next);
          writeStorage('language', next);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
/** Acceso tipado al estado de la aplicación. */
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider requerido');
  return value;
}
