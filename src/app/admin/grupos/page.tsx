import GroupsView from 'src/modules/groups/components/GroupsView';
import { fetchGroupsServer } from 'src/modules/groups/actions/fetchGroups';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialData = await fetchGroupsServer();

  return <GroupsView initialData={initialData} />;
}
