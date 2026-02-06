'use client';

import type { BoxProps } from '@mui/material/Box';

import { UserButton } from '@clerk/nextjs';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export type AccountDrawerProps = BoxProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  return (
    <Box sx={{ display: 'inline-flex', ...sx }} {...other}>
      <Box sx={{ position: 'relative' }}>
        <UserButton showName />
      </Box>
    </Box>
  );
}
