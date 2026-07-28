import { useI18n } from '../../i18n/LocaleContext';

export type SignupRole = 'CLIENT' | 'OWNER';

/** Client / Business-owner choice cards on the signup form. */
export default function RoleSelector({
  role,
  onChange,
}: {
  role: SignupRole;
  onChange: (r: SignupRole) => void;
}) {
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        {t('register.as_label')}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(['CLIENT', 'OWNER'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={`rounded border p-3 text-left transition ${
              role === r
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 ring-2 ring-teal-200 dark:ring-teal-800'
                : 'border-slate-300 dark:border-slate-600 hover:border-teal-300 dark:hover:border-teal-600'
            }`}
          >
            <div className="text-sm font-semibold">
              {r === 'CLIENT' ? t('register.as_client') : t('register.as_owner')}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {r === 'CLIENT'
                ? t('register.client_hint')
                : t('register.owner_hint')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
