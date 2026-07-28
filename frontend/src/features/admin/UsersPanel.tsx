import { useUsers } from './useUsers';
import UsersTable from './UsersTable';

// Container: wires the useUsers hook to the presentational table.
export default function UsersPanel() {
  const { data, loading, page, setPage } = useUsers(10);
  return (
    <UsersTable
      items={data.items}
      page={page}
      totalPages={data.totalPages}
      total={data.total}
      loading={loading}
      onPage={setPage}
    />
  );
}
