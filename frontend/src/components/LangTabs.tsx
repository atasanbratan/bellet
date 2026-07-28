import { LOCALES, type Locale } from '../i18n/translations';
import { cn } from '../lib/cn';

/** TK / EN / RU switcher for multilingual content inputs. */
export default function LangTabs({
  active,
  onChange,
  filled,
}: {
  active: Locale;
  onChange: (l: Locale) => void;
  filled?: Set<Locale>;
}) {
  return (
    <div className="flex gap-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={cn(
            'relative rounded px-2 py-0.5 text-[11px] font-semibold uppercase transition',
            active === l
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
          )}
        >
          {l}
          {filled?.has(l) && (
            <span
              className={cn(
                'absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full',
                active === l ? 'bg-white dark:bg-slate-900' : 'bg-teal-500',
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
}
