import api from '../../api/client';
import AuthShell from '../../components/AuthShell';
import { useI18n } from '../../i18n/LocaleContext';

/** "Send an empty SMS to X" waiting screen with the dev simulate button. */
export default function VerifyStep({
  phone,
  sendSmsTo,
  error,
}: {
  phone: string;
  sendSmsTo: string;
  error?: string;
}) {
  const { t } = useI18n();

  const simulateSms = async () => {
    await api.post('/auth/dev/simulate-sms', { phone });
  };

  return (
    <AuthShell title={t('verify.title')}>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-300">{t('verify.instruction', { phone })}</p>
        <p className="my-3 text-2xl font-extrabold tracking-tight text-teal-600 dark:text-teal-400">
          {sendSmsTo}
        </p>
        <div className="my-6 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="h-3 w-3 animate-ping rounded-full bg-teal-500" />
          {t('verify.waiting')}
        </div>
        {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          onClick={simulateSms}
          className="rounded border border-dashed border-slate-400 dark:border-slate-500 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
        >
          {t('verify.simulate')}
        </button>
        <p className="mt-2 text-xs text-slate-400">{t('verify.simulate_note')}</p>
      </div>
    </AuthShell>
  );
}
