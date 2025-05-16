import 'src/global.css';

import type { Viewport } from 'next';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/theme/core/palette';
import { getInitColorSchemeScript } from 'src/theme/color-scheme-script';

import { ProgressBar } from 'src/components/progress-bar';
import { detectSettings } from 'src/components/settings/server';
import { SettingsDrawer, defaultSettings } from 'src/components/settings';

import { Providers } from './Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
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
  );
}
