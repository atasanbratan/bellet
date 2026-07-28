import { useI18n } from '../i18n/LocaleContext';
import { LOCALES, LOCALE_NAMES } from '../i18n/translations';
import { cn } from '../lib/cn';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center rounded bg-white/70 dark:bg-slate-800/70 p-0.5 text-xs font-semibold shadow-sm">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            'rounded px-2 py-1 transition',
            locale === l
              ? 'bg-teal-600 text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400',
          )}
        >
          {LOCALE_NAMES[l]}
        </button>
      ))}
    </div>
  );
}
