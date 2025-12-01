import GroupsView from 'src/modules/groups/components/GroupsView';
import { fetchGroupsServer } from 'src/modules/groups/actions/fetchGroups';

export default async function Page() {
  const initialData = await fetchGroupsServer();

  return <GroupsView initialData={initialData} />;
}
