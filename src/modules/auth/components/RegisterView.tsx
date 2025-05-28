'use client';

import { dark } from '@clerk/themes';
import { SignUp } from '@clerk/nextjs';

import { useTheme } from '@mui/material';

export function RegisterView() {
  const theme = useTheme();

  return (
    <SignUp
      appearance={{
        baseTheme: theme.palette.mode === 'dark' ? dark : undefined,
        layout: {
          logoImageUrl:
            theme.palette.mode === 'dark' ? '/logo/logo-white.png' : '/logo/logo-dark.png',
        },
      }}
    />
  );
}
