import type { Teacher } from '../../types';
import { Avatar } from '../../components/visuals';
import { useI18n } from '../../i18n/LocaleContext';

/** Compact staff list for the overview; managing them lives in its own section. */
export default function TeachersSummary({
  teachers,
  onManage,
}: {
  teachers: Teacher[];
  onManage: () => void;
}) {
  const { t } = useI18n();

  return (
    <section className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <h3 className="font-bold">{t('detail.teachers')}</h3>
        <span className="text-xs text-slate-400">{teachers.length}</span>
      </header>

      {teachers.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-400">
          {t('detail.no_teachers')}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {teachers.slice(0, 6).map((tc) => (
            <li key={tc.id} className="flex items-center gap-2.5 px-4 py-2.5">
              {tc.photo ? (
                <img
                  src={tc.photo}
                  alt=""
                  className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <Avatar name={tc.name} />
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{tc.name}</div>
                {tc.bio && (
                  <div className="truncate text-xs text-slate-400">{tc.bio}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <button
          onClick={onManage}
          className="w-full rounded border border-slate-300 dark:border-slate-600 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {t('overview.manage_staff')}
        </button>
      </div>
    </section>
  );
}
