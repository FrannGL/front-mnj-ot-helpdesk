import { AuthSplitLayout } from 'src/shared/layouts/auth-split';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthSplitLayout
      section={{
        title: 'Hi, Welcome back',
        subtitle: 'Sistema de gestión de tickets y mesa de ayuda',
      }}
    >
      {children}
    </AuthSplitLayout>
  );
}
