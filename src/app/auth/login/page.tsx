import { CONFIG } from 'src/config/config-global';
import { LoginView } from 'src/modules/auth/components/LoginView';

// ----------------------------------------------------------------------

export const metadata = { title: `Iniciar Sesión - ${CONFIG.site.name}` };

export default function Page() {
  return <LoginView />;
}
