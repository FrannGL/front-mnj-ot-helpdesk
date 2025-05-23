import 'src/shared/styles/global.css';

import type { Viewport } from 'next';

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
