import { useEffect, useState } from 'react';
import type { BusinessDetail, OwnerStats } from '../../types';
import { ownerApi } from '../../api/owner';
import { useI18n } from '../../i18n/LocaleContext';
import type { OwnerSection } from './OwnerSidebar';
import OverviewTiles from './OverviewTiles';
import RecentBookings from './RecentBookings';
import TeachersSummary from './TeachersSummary';
import CoursesSummary from './CoursesSummary';

/** Owner landing page: headline numbers, then a bento of the live essentials. */
export default function OverviewSection({
  biz,
  onGo,
}: {
  biz: BusinessDetail;
  onGo: (section: OwnerSection) => void;
}) {
  const { t } = useI18n();
  const [stats, setStats] = useState<OwnerStats | null>(null);

  useEffect(() => {
    ownerApi.stats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-5">
      <OverviewTiles stats={stats} />

      {/* Only explain the percentages when some are actually on screen. */}
      {stats &&
        (stats.revenue.deltaPct !== null || stats.bookings.deltaPct !== null) && (
          <p className="text-xs text-slate-400">
            {t('overview.window_note', { days: stats.windowDays })}
          </p>
        )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CoursesSummary
            offerings={biz.offerings}
            onManage={() => onGo('courses')}
          />
          <RecentBookings onSeeAll={() => onGo('bookings')} />
        </div>
        <TeachersSummary
          teachers={biz.teachers}
          onManage={() => onGo('teachers')}
        />
      </div>
    </div>
  );
}
