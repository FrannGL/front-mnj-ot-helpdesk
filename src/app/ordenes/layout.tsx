import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

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
