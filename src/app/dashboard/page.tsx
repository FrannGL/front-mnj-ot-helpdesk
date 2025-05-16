import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <h1>Dashboard Page</h1>;
}
