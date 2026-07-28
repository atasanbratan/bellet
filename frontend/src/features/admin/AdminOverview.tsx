import type { AdminSection } from './AdminSidebar';
import StatsOverview from './StatsOverview';
import PendingApprovals from './PendingApprovals';
import GatewaysSummary from './GatewaysSummary';

/**
 * Admin landing page: platform numbers, then the two things that actually
 * need a human — centres awaiting approval, and whether an SMS gateway is
 * alive (phone verification silently breaks when none is).
 */
export default function AdminOverview({
  onGo,
}: {
  onGo: (section: AdminSection) => void;
}) {
  return (
    <div className="space-y-6">
      <StatsOverview />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PendingApprovals onSeeAll={() => onGo('businesses')} />
        </div>
        <GatewaysSummary onSeeAll={() => onGo('gateways')} />
      </div>
    </div>
  );
}
