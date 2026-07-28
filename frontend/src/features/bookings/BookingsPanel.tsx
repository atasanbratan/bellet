import { ownerApi } from '../../api/owner';
import { useBookings } from './useBookings';
import BookingsStats from './BookingsStats';
import BookingsTable from './BookingsTable';

/**
 * Full bookings data table for the owner dashboard: stats + column filters +
 * pagination, scoped to the owner's business on the server.
 */
export default function BookingsPanel() {
  const { data, loading, page, setPage, filters, setFilters } = useBookings(
    ownerApi.listBookings,
  );

  return (
    <div>
      <BookingsStats stats={data.stats} />
      <BookingsTable
        items={data.items}
        page={page}
        totalPages={data.totalPages}
        total={data.total}
        loading={loading}
        filters={filters}
        onPage={setPage}
        onFilters={setFilters}
      />
    </div>
  );
}
