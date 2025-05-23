import { CONFIG } from 'src/config/config-global';
import { DashboardLayout } from 'src/shared/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
