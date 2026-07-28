import { useEffect, useState } from 'react';
import type { Subject } from '../../types';
import { subjectsApi } from '../../api/subjects';
import { useI18n } from '../../i18n/LocaleContext';
import { subjectName } from '../../lib/i18nContent';
import { cn } from '../../lib/cn';
import { SubjectIcon } from '../../components/visuals';

/** Toggle chips for the subjects a course covers; a course can span several. */
export default function SubjectPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (subjectIds: string[]) => void;
}) {
  const { t, locale } = useI18n();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    subjectsApi.list().then(setSubjects);
  }, []);

  const toggle = (id: string) =>
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );

  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t('subject.title')}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {subjects.map((s) => {
          const on = selected.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              aria-pressed={on}
              className={cn(
                'inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium transition',
                on
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:border-teal-400 dark:border-slate-600 dark:text-slate-300',
              )}
            >
              <SubjectIcon icon={s.icon} className="h-3 w-3" />
              {subjectName(s, locale)}
            </button>
          );
        })}
      </div>
      <p className="mt-1 text-[11px] text-slate-400">{t('subject.hint')}</p>
    </div>
  );
}
