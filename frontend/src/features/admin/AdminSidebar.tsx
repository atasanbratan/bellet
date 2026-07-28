import DashboardSidebar, {
  sidebarIconProps as ico,
  type SidebarItem,
} from '../../components/DashboardSidebar';

export type AdminSection =
  | 'overview'
  | 'businesses'
  | 'users'
  | 'payments'
  | 'gateways';

const ITEMS: SidebarItem<AdminSection>[] = [
  {
    key: 'overview',
    labelKey: 'admin.nav_overview',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    key: 'businesses',
    labelKey: 'admin.tab_businesses',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <path d="M4 21V6l8-3v18M12 21V9l7 3v9M3 21h18" />
      </svg>
    ),
  },
  {
    key: 'users',
    labelKey: 'admin.tab_users',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0112 0M16 5.5a3 3 0 010 5M21 20a6 6 0 00-4-5.7" />
      </svg>
    ),
  },
  {
    key: 'payments',
    labelKey: 'admin.tab_payments',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19M6.5 15h4" />
      </svg>
    ),
  },
  {
    key: 'gateways',
    labelKey: 'admin.tab_gateways',
    icon: (
      <svg viewBox="0 0 24 24" {...ico}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
        <path d="M9.5 8.5a3.5 3.5 0 015 0M8 6.5a6 6 0 018 0" />
      </svg>
    ),
  },
];

export default function AdminSidebar({
  active,
  onSelect,
}: {
  active: AdminSection;
  onSelect: (s: AdminSection) => void;
}) {
  return <DashboardSidebar items={ITEMS} active={active} onSelect={onSelect} />;
}
