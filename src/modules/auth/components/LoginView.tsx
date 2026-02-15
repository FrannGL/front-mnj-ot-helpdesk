'use client';

import { dark } from '@clerk/themes';
import { SignIn } from '@clerk/nextjs';

import { useTheme } from '@mui/material';

import { paths, CONFIG } from 'src/config';

export function LoginView() {
  const theme = useTheme();

  return (
    <SignIn
      fallbackRedirectUrl={CONFIG.auth.redirectPath}
      signUpUrl={paths.auth.jwt.signUp}
      appearance={{
        baseTheme: theme.palette.mode === 'dark' ? dark : undefined,
        layout: {
          logoImageUrl:
            theme.palette.mode === 'dark'
              ? '/assets/images/logo/logo-white.png'
              : '/assets/images/logo/logo-dark.png',
        },
        elements: {
          logoImage: {
            width: '220px',
            height: 'auto',
          },
        },
      }}
    />
  );
}
