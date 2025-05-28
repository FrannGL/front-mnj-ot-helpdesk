// ----------------------------------------------------------------------

import { CONFIG } from 'src/config';
import { RegisterView } from 'src/modules/auth/components/RegisterView';

export const metadata = { title: `Register | ${CONFIG.site.name}` };

export default function Page() {
  return <RegisterView />;
}
