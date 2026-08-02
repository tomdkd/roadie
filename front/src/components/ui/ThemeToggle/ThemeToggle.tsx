import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Changer de thème"
      onClick={() => setIsDark((prev) => !prev)}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${isDark ? 'bg-slate-800' : 'bg-slate-200'} `}
    >
      {/* Fond avec les icônes discrètes en arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
        <Sun
          className={`h-3.5 w-3.5 transition-opacity duration-200 ${isDark ? 'text-slate-500 opacity-70' : 'opacity-0'}`}
        />
        <Moon
          className={`h-3.5 w-3.5 transition-opacity duration-200 ${isDark ? 'opacity-0' : 'text-slate-400 opacity-70'}`}
        />
      </div>

      {/* Le curseur blanc/sombre qui glisse (Animation iOS style) */}
      <span
        className={`ease-spring pointer-events-none relative z-10 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-300 dark:bg-slate-950 ${isDark ? 'translate-x-6' : 'translate-x-0'} `}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-blue-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}
