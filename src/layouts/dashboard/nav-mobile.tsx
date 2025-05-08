import type { NavSectionProps } from 'src/components/nav-section';

import Image from 'next/image';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { TaskList } from 'src/components/TaskList';
import { Scrollbar } from 'src/components/scrollbar';

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
  tasks,
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
            <Image src="/assets/images/logos/logo-white.png" alt="Logo" width={180} height={40} />
          ) : (
            <Image src="/assets/images/logos/logo-dark.png" alt="Logo" width={180} height={40} />
          )}
        </Box>
      )}

      <Scrollbar fillContent>
        <TaskList tasks={tasks ?? []} isNavMini={isNavMini ?? false} />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
