import { CONFIG } from 'src/config/config-global';
import DashboardView from 'src/modules/dashboard/components/DashboardView';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <DashboardView />;
}
