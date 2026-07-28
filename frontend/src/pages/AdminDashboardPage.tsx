import { useState } from 'react';
import { useI18n } from '../i18n/LocaleContext';
import AdminSidebar, { type AdminSection } from '../features/admin/AdminSidebar';
import AdminOverview from '../features/admin/AdminOverview';
import BusinessesReview from '../features/admin/BusinessesReview';
import UsersPanel from '../features/admin/UsersPanel';
import PaymentsPanel from '../features/payments/PaymentsPanel';
import GatewaysPanel from '../features/admin/GatewaysPanel';
import { adminApi } from '../api/admin';

const TITLE_KEY: Record<AdminSection, string> = {
  overview: 'admin.nav_overview',
  businesses: 'admin.tab_businesses',
  users: 'admin.tab_users',
  payments: 'admin.tab_payments',
  gateways: 'admin.tab_gateways',
};

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [section, setSection] = useState<AdminSection>('overview');

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <AdminSidebar active={section} onSelect={setSection} />
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t('admin.title')}
          </h1>
          <p className="text-sm text-slate-400">{t(TITLE_KEY[section])}</p>
        </div>
        {section === 'overview' && <AdminOverview onGo={setSection} />}
        {section === 'businesses' && <BusinessesReview />}
        {section === 'users' && <UsersPanel />}
        {section === 'payments' && (
          <PaymentsPanel fetchPage={adminApi.listPayments} showBusiness />
        )}
        {section === 'gateways' && <GatewaysPanel />}
      </div>
    </div>
  );
}
