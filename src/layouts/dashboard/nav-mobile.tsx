import type { NavSectionProps } from 'src/components/nav-section';
import type { TaskStatus, TaskPriority } from 'src/modules/tasks/enums';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack, useTheme } from '@mui/material';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { SearchBar, TaskFilterMenu } from 'src/modules/tasks/components';

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
  tasks = [],
  isNavMini,
  data,
  open,
  onClose,
  slots,
  sx,
  ...other
}: NavMobileProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);

  // const filteredTasks = filterTasks(tasks, selectedStatuses, selectedPriorities);

  const pathname = usePathname();
  const theme = useTheme();

  const handleStatusChange = (statuses: number[]) => {
    setSelectedStatuses(statuses);
  };

  const handlePriorityChange = (priorities: number[]) => {
    setSelectedPriorities(priorities);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedPriorities([]);
  };

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
        <>
          <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
            {theme.palette.mode === 'dark' ? (
              <Image src="/assets/images/logos/logo-white.png" alt="Logo" width={180} height={40} />
            ) : (
              <Image src="/assets/images/logos/logo-dark.png" alt="Logo" width={180} height={40} />
            )}
          </Box>
          <Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 1, mb: 1 }}
          >
            <SearchBar />
            <TaskFilterMenu
              selectedStatuses={selectedStatuses}
              selectedPriorities={selectedPriorities}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onClear={handleClearFilters}
            />
          </Stack>
        </>
      )}

      <Scrollbar fillContent>
        {/* <TaskList tasks={filteredTasks ?? []} isNavMini={isNavMini ?? false} /> */}
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
