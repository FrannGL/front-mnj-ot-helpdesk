import SectoresView from 'src/modules/sectores/components/SectoresView';
import { fetchSectoresServer } from 'src/modules/sectores/actions/fetchSectores';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialData = await fetchSectoresServer(1);

  return <SectoresView initialData={initialData} />;
}
