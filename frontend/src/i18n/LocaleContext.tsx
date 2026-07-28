import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { LOCALES, translations, type Locale } from './translations';

type TVars = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: TVars, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue>(null!);

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext);

function detectLocale(): Locale {
  const saved = localStorage.getItem('locale') as Locale | null;
  if (saved && LOCALES.includes(saved)) return saved;
  const nav = navigator.language.slice(0, 2).toLowerCase();
  if (nav === 'tk') return 'tk';
  if (nav === 'ru') return 'ru';
  return 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem('locale', l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string, vars?: TVars, fallback?: string) => {
      let str =
        translations[locale][key] ?? translations.en[key] ?? fallback ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }
      return str;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
