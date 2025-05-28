import 'src/shared/styles/global.css';

import type { Viewport } from 'next';

import { esES } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';

import { CONFIG } from 'src/config/config-global';
import { primary } from 'src/shared/theme/core/palette';
import { ProgressBar } from 'src/shared/components/minimal/progress-bar';
import { detectSettings } from 'src/shared/components/minimal/settings/server';
import { getInitColorSchemeScript } from 'src/shared/theme/color-scheme-script';
import { SettingsDrawer, defaultSettings } from 'src/shared/components/minimal/settings';

import { Providers } from './Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export const customEsLocalization = {
  ...esES,
  signIn: {
    ...esES.signIn,
    start: {
      ...esES.signIn?.start,
      title: 'Por favor, Inicia Sesión',
    },
    formButtonPrimary: 'Continuar',
  },
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <ClerkProvider localization={customEsLocalization}>
      <html lang="es" suppressHydrationWarning>
        <body>
          {getInitColorSchemeScript}

          <Providers settings={settings} caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}>
            <ProgressBar />
            <SettingsDrawer />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
