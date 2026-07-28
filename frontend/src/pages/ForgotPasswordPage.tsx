import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useI18n } from '../i18n/LocaleContext';
import AuthShell, { buttonClass, inputClass } from '../components/AuthShell';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<'phone' | 'verify' | 'reset'>('phone');
  const [verificationId, setVerificationId] = useState('');
  const [sendSmsTo, setSendSmsTo] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const request = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { phone });
      setVerificationId(res.data.verificationId);
      setSendSmsTo(res.data.sendSmsTo);
      setStage('verify');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('forgot.failed'));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (stage !== 'verify' || !verificationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/auth/status/${verificationId}`);
        if (res.data.status === 'VERIFIED' && res.data.resetToken) {
          clearInterval(interval);
          setResetToken(res.data.resetToken);
          setStage('reset');
        } else if (res.data.status === 'EXPIRED') {
          clearInterval(interval);
          setError(t('verify.expired'));
          setStage('phone');
        }
      } catch {
        /* keep polling */
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [stage, verificationId, t]);

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword });
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('forgot.reset_failed'));
    } finally {
      setBusy(false);
    }
  };

  const simulateSms = async () => {
    await api.post('/auth/dev/simulate-sms', { phone });
  };

  return (
    <AuthShell title={t('forgot.title')}>
      {stage === 'phone' && (
        <form onSubmit={request} className="space-y-3">
          <input
            className={inputClass}
            placeholder={t('common.phone_ph')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button disabled={busy} className={buttonClass}>
            {busy ? t('forgot.sending') : t('common.continue')}
          </button>
        </form>
      )}

      {stage === 'verify' && (
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">
            {t('verify.instruction', { phone })}
          </p>
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
        </div>
      )}

      {stage === 'reset' && (
        <form onSubmit={doReset} className="space-y-3">
          <p className="text-sm text-teal-700 dark:text-teal-300">{t('forgot.verified')}</p>
          <input
            type="password"
            className={inputClass}
            placeholder={t('forgot.new_password_ph')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button disabled={busy} className={buttonClass}>
            {busy ? t('forgot.saving') : t('forgot.submit')}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
