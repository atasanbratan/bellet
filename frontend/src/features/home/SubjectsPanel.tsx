import type { Subject } from '../../types';
import { useI18n } from '../../i18n/LocaleContext';
import { subjectName } from '../../lib/i18nContent';
import { cn } from '../../lib/cn';
import { SubjectIcon } from '../../components/visuals';

const row = (active: boolean) =>
  cn(
    'flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition',
    active
      ? 'border-teal-600 bg-teal-50 font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
      : 'border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60',
  );

/** Browse sidebar: filter centres by the subjects their courses teach. */
export default function SubjectsPanel({
  subjects,
  active,
  onSelect,
  className,
}: {
  subjects: Subject[];
  active: string;
  onSelect: (slug: string) => void;
  className?: string;
}) {
  const { t, locale } = useI18n();

  return (
    <aside className={className}>
      <div className="sticky top-24 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 py-4">
        <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t('panel.subjects')}
        </h2>
        <ul>
          <li>
            <button onClick={() => onSelect('')} className={row(active === '')}>
              <span className="grid h-4 w-4 place-items-center text-teal-600">
                ✦
              </span>
              {t('common.all')}
            </button>
          </li>
          {subjects.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onSelect(s.slug)}
                disabled={s.businessCount === 0}
                className={cn(row(active === s.slug), 'disabled:opacity-40')}
              >
                <SubjectIcon icon={s.icon} className="h-4 w-4" />
                <span className="flex-1 text-left">{subjectName(s, locale)}</span>
                {s.businessCount !== undefined && (
                  <span className="text-xs font-normal text-slate-400">
                    {s.businessCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
