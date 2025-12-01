import TagsView from 'src/modules/tags/components/TagsView';
import { fetchTagsServer } from 'src/modules/tags/actions/fetchTags';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialData = await fetchTagsServer(1);

  return <TagsView initialData={initialData} />;
}
