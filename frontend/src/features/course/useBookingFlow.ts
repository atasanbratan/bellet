import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n/LocaleContext';
import type { Group } from '../../types';

export type BookingStep = 'idle' | 'confirm' | 'pay' | 'done';

/** Backend booking rejection codes → translation keys. */
const ERROR_KEY: Record<string, string> = {
  GROUP_FULL: 'group.full',
  ENROLL_NOT_OPEN: 'group.enroll_not_open',
  ENROLL_CLOSED: 'group.enroll_closed',
};

/** Book-a-group state machine: pick → confirm booking → pay advance → done. */
export function useBookingFlow(offeringId: string | undefined) {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<Group | null>(null);
  const [step, setStep] = useState<BookingStep>('idle');
  const [paymentId, setPaymentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = (g: Group) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelected(g);
    setError('');
    setStep('confirm');
  };

  const createBooking = async () => {
    if (!offeringId || !selected) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/bookings', {
        offeringId,
        groupId: selected.id,
      });
      setPaymentId(res.data.payment.id);
      setStep('pay');
    } catch (err) {
      const code = (err as { response?: { data?: { code?: string } } })?.response
        ?.data?.code;
      const key = code ? ERROR_KEY[code] : undefined;
      setError(key ? t(key) : 'Could not create the booking.');
    } finally {
      setBusy(false);
    }
  };

  const pay = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post('/payments/dev/simulate', { paymentId, outcome: 'PAID' });
      setStep('done');
    } catch {
      setError('Payment failed.');
    } finally {
      setBusy(false);
    }
  };

  return { selected, step, busy, error, pick, createBooking, pay };
}
