import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Business, BusinessDetail, Category } from '../types';
import { useI18n } from '../i18n/LocaleContext';
import { ownerApi } from '../api/owner';
import OwnerSidebar, { type OwnerSection } from '../features/owner/OwnerSidebar';
import CreateBusinessForm from '../features/owner/CreateBusinessForm';
import BusinessSection from '../features/owner/BusinessSection';
import OverviewSection from '../features/owner/OverviewSection';
import TeachersSection from '../features/owner/TeachersSection';
import OfferingsSection from '../features/owner/OfferingsSection';
import BookingsPanel from '../features/bookings/BookingsPanel';
import PaymentsPanel from '../features/payments/PaymentsPanel';

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
    {children}
  </div>
);

export default function OwnerDashboardPage() {
  const { t } = useI18n();
  const [section, setSection] = useState<OwnerSection>('overview');
  const [loaded, setLoaded] = useState(false);
  const [biz, setBiz] = useState<BusinessDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => {
    const mine = (await api.get<Business | null>('/businesses/mine')).data;
    if (mine && mine.id) {
      setBiz((await api.get<BusinessDetail>(`/businesses/${mine.id}`)).data);
    } else {
      setBiz(null);
      api.get('/categories').then((r) => setCategories(r.data));
    }
    setLoaded(true);
  };
  useEffect(() => {
    load();
  }, []);

  if (!loaded)
    return <div className="h-64 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />;

  // Each owner runs exactly one center — until it exists, only the create form.
  if (!biz) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight">
          {t('dash.title')}
        </h1>
        <CreateBusinessForm categories={categories} onCreated={load} />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <OwnerSidebar active={section} onSelect={setSection} />
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t('dash.title')}
          </h1>
          <p className="text-sm text-slate-400">{biz.name}</p>
        </div>
        {section === 'overview' && (
          <OverviewSection biz={biz} onGo={setSection} />
        )}
        {section === 'business' && (
          <BusinessSection biz={biz} onChange={load} onDeleted={load} />
        )}
        {section === 'teachers' && (
          <TeachersSection
            businessId={biz.id}
            teachers={biz.teachers}
            onChange={load}
          />
        )}
        {section === 'courses' && (
          <Card>
            <OfferingsSection
              businessId={biz.id}
              offerings={biz.offerings}
              teachers={biz.teachers}
              addresses={biz.addresses ?? []}
              onChange={load}
            />
          </Card>
        )}
        {section === 'bookings' && <BookingsPanel />}
        {section === 'payments' && (
          <PaymentsPanel fetchPage={ownerApi.listPayments} />
        )}
      </div>
    </div>
  );
}
