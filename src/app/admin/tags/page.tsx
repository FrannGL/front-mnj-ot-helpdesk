import TagsView from 'src/modules/tags/components/TagsView';
import { fetchTagsServer } from 'src/modules/tags/actions/fetchTags';

export default async function Page() {
  const initialData = await fetchTagsServer(1);

  return <TagsView initialData={initialData} />;
}
