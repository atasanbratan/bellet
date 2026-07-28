import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/LocaleContext';
import AuthShell, { buttonClass, inputClass } from '../components/AuthShell';
import VerifyStep from '../features/auth/VerifyStep';
import RoleSelector, { type SignupRole } from '../features/auth/RoleSelector';

export default function RegisterPage() {
  const { applyTokens } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '', name: '' });
  const [role, setRole] = useState<SignupRole>('CLIENT');
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [verificationId, setVerificationId] = useState('');
  const [sendSmsTo, setSendSmsTo] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { ...form, role });
      setVerificationId(res.data.verificationId);
      setSendSmsTo(res.data.sendSmsTo);
      setStage('verify');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('register.failed'));
    } finally {
      setBusy(false);
    }
  };

  // Poll until the reverse SMS arrives, then log in and go home.
  useEffect(() => {
    if (stage !== 'verify' || !verificationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/auth/status/${verificationId}`);
        if (res.data.status === 'VERIFIED' && res.data.accessToken) {
          clearInterval(interval);
          applyTokens(res.data);
          navigate('/');
        } else if (res.data.status === 'EXPIRED') {
          clearInterval(interval);
          setError(t('verify.expired'));
          setStage('form');
        }
      } catch {
        /* keep polling */
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [stage, verificationId, applyTokens, navigate, t]);

  if (stage === 'verify') {
    return <VerifyStep phone={form.phone} sendSmsTo={sendSmsTo} error={error} />;
  }

  return (
    <AuthShell
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      footer={
        <span>
          {t('register.have_account')}{' '}
          <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:underline">
            {t('login.submit')}
          </Link>
        </span>
      }
    >
      <form onSubmit={register} className="space-y-3">
        <RoleSelector role={role} onChange={setRole} />
        <input
          className={inputClass}
          placeholder={t('register.name_ph')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder={t('common.phone_ph')}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="password"
          className={inputClass}
          placeholder={t('register.password_ph')}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button disabled={busy} className={buttonClass}>
          {busy ? t('register.submitting') : t('common.continue')}
        </button>
      </form>
    </AuthShell>
  );
}
