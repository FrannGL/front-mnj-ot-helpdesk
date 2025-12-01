import { AdminUser } from 'src/modules/users/components/AdminUser';
import { fetchUsersServer } from 'src/modules/users/actions/fetchUsers';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialData = await fetchUsersServer(1);

  return <AdminUser initialData={initialData} />;
}
