import type { ButtonProps } from '@mui/material/Button';

import Link from 'next/link';

import Button from '@mui/material/Button';

import { CONFIG } from 'src/config';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  return (
    <Button component={Link} href={CONFIG.auth.redirectPath} variant="outlined" sx={sx} {...other}>
      Sign in
    </Button>
  );
}
