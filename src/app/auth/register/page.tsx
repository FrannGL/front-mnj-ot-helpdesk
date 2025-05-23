// ----------------------------------------------------------------------

import { CONFIG } from 'src/config';
import { RegisterView } from 'src/modules/auth/components/RegisterView';

export const metadata = { title: `Sign up | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return <RegisterView />;
}
