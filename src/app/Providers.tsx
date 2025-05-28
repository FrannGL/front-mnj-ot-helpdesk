'use client';

import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from 'src/shared/theme/theme-provider';
import { SettingsProvider } from 'src/shared/components/minimal/settings';
import { MotionLazy } from 'src/shared/components/minimal/animate/motion-lazy';

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
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MotionLazy>
      </ThemeProvider>
    </SettingsProvider>
  );
}
