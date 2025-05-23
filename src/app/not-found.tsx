import { CONFIG } from 'src/config/config-global';
import { NotFoundView } from 'src/shared/components/minimal/error';

// ----------------------------------------------------------------------

export const metadata = { title: `404 page not found! | Error - ${CONFIG.site.name}` };

export default function Page() {
  return <NotFoundView />;
}
