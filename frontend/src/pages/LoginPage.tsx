import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/LocaleContext';
import AuthShell, { buttonClass, inputClass } from '../components/AuthShell';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(phone, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('login.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={
        <div className="flex justify-between">
          <Link to="/forgot-password" className="hover:text-teal-600 dark:hover:text-teal-400">
            {t('login.forgot')}
          </Link>
          <Link to="/register" className="hover:text-teal-600 dark:hover:text-teal-400">
            {t('home.create_account')}
          </Link>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <input
          className={inputClass}
          placeholder={t('common.phone_ph')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          className={inputClass}
          placeholder={t('common.password_ph')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button disabled={busy} className={buttonClass}>
          {busy ? t('login.submitting') : t('login.submit')}
        </button>
      </form>
    </AuthShell>
  );
}
