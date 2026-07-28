import DashboardSidebar, {
  sidebarIconProps as ico,
  type SidebarItem,
} from '../../components/DashboardSidebar';

export type OwnerSection =
  | 'overview'
  | 'business'
  | 'teachers'
  | 'courses'
  | 'bookings'
  | 'payments';

const ITEMS: SidebarItem<OwnerSection>[] = [
  {
    key: 'overview',
    labelKey: 'admin.nav_overview',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
      </svg>
    ),
  },
  {
    key: 'business',
    labelKey: 'dash.nav_business',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <path d="M4 21V6l8-3v18M12 21V9l7 3v9M3 21h18" />
      </svg>
    ),
  },
  {
    key: 'teachers',
    labelKey: 'dash.nav_teachers',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5M21 20a6 6 0 00-4-5.7" />
      </svg>
    ),
  },
  {
    key: 'courses',
    labelKey: 'dash.nav_courses',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" />
      </svg>
    ),
  },
  {
    key: 'bookings',
    labelKey: 'dash.nav_bookings',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4M8.5 14.5l2.5 2.5 4.5-4.5" />
      </svg>
    ),
  },
  {
    key: 'payments',
    labelKey: 'dash.nav_payments',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19M6.5 15h4" />
      </svg>
    ),
  },
];

export default function OwnerSidebar({
  active,
  onSelect,
}: {
  active: OwnerSection;
  onSelect: (s: OwnerSection) => void;
}) {
  return <DashboardSidebar items={ITEMS} active={active} onSelect={onSelect} />;
}
