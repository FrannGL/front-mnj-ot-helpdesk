'use client';

import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from 'src/theme/theme-provider';

import { SettingsProvider } from 'src/components/settings';
import { MotionLazy } from 'src/components/animate/motion-lazy';

interface ProvidersProps {
  children: React.ReactNode;
  settings: any;
  caches: 'localStorage' | 'cookie';
}

const queryClient = new QueryClient();

export function Providers({ children, settings, caches }: ProvidersProps) {
  return (
    <SettingsProvider settings={settings} caches={caches}>
      <ThemeProvider>
        <MotionLazy>
          <Toaster />
          <SessionProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </SessionProvider>
        </MotionLazy>
      </ThemeProvider>
    </SettingsProvider>
  );
}
