'use client';

import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SettingsProvider } from 'src/components/settings';
import { MotionLazy } from 'src/components/animate/motion-lazy';

import { AuthProvider } from 'src/auth/context/jwt';

interface ProvidersProps {
  children: React.ReactNode;
  settings: any;
  caches: 'localStorage' | 'cookie';
}

const queryClient = new QueryClient();

export function Providers({ children, settings, caches }: ProvidersProps) {
  return (
    <AuthProvider>
      <SettingsProvider settings={settings} caches={caches}>
        <ThemeProvider>
          <MotionLazy>
            <Toaster />
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
