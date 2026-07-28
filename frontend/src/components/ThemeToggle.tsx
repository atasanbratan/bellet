import { useState } from 'react';
import { getTheme, toggleTheme, type Theme } from '../lib/theme';

/** Sun/moon button in the nav that flips the site theme. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme);

  return (
    <button
      onClick={() => setTheme(toggleTheme())}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="rounded p-2 text-slate-600 hover:bg-white/70 hover:text-teal-600 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-teal-400"
    >
      {theme === 'dark' ? (
        // Sun
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
      ) : (
        // Moon
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
          />
        </svg>
      )}
    </button>
  );
}
