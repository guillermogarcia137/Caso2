import { useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from './storage';
import { INITIAL_PROGRESS } from '../data/users';
import { Context, type Role } from './useApp';
export type { Role } from './useApp';
/** Estado compartido con persistencia tolerante a fallos. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ role: Role; email: string } | null>(() =>
    readStorage('session', null),
  );
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
