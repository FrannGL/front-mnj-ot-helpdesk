import type { NavSectionProps } from 'src/shared/components/minimal/nav-section';

import Image from 'next/image';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { Scrollbar } from 'src/shared/components/minimal/scrollbar';
import { NavSectionVertical } from 'src/shared/components/minimal/nav-section';

// ----------------------------------------------------------------------

type NavMobileProps = NavSectionProps & {
  open: boolean;
  onClose: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavMobile({
  orders = [],
  isNavMini,
  data,
  open,
  onClose,
  slots,
  sx,
  ...other
}: NavMobileProps) {
  const pathname = usePathname();
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          {theme.palette.mode === 'dark' ? (
            <Image src="/assets/images/logo/logo-white.png" alt="Logo" width={299} height={70} />
          ) : (
            <Image src="/assets/images/logo/logo-dark.png" alt="Logo" width={299} height={70} />
          )}
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
