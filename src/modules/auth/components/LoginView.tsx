'use client';

import { dark } from '@clerk/themes';
import { SignIn } from '@clerk/nextjs';

import { useTheme } from '@mui/material';

export function LoginView() {
  const theme = useTheme();

  return (
    <SignIn
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
