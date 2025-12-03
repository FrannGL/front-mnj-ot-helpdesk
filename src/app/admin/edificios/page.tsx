import EdificiosView from 'src/modules/edificios/components/EdificiosView';
import { fetchEdificiosServer } from 'src/modules/edificios/actions/fetchEdificios';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialData = await fetchEdificiosServer(1);

  return <EdificiosView initialData={initialData} />;
}
