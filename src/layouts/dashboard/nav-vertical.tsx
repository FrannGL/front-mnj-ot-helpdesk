import type { Task } from 'src/types/interfaces';
import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import Image from 'next/image';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { varAlpha, hideScrollY } from 'src/theme/styles';

import { TaskList } from 'src/components/TaskList';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchBar } from 'src/components/TaskSearchBar';
import TaskFilterMenu from 'src/components/TaskFilterMenu';
import { NavSectionMini } from 'src/components/nav-section';

import { NavToggleButton } from '../components/nav-toggle-button';

// ----------------------------------------------------------------------

export type NavVerticalProps = NavSectionProps & {
  tasks: Task[];
  isNavMini: boolean;
  layoutQuery: Breakpoint;
  onToggleNav: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavVertical({
  tasks,
  sx,
  data,
  slots,
  isNavMini,
  layoutQuery,
  onToggleNav,
  ...other
}: NavVerticalProps) {
  const theme = useTheme();

  const renderNavVertical = (
    <>
      {slots?.topArea ?? (
        <Box
          sx={{
            pt: 2.5,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* <Logo /> */}
          {theme.palette.mode === 'dark' ? (
            <Image
              src="/assets/images/logos/logo-white.png"
              alt="Logo"
              width={isNavMini ? 100 : 180}
              height={40}
            />
          ) : (
            <Image
              src="/assets/images/logos/logo-dark.png"
              alt="Logo"
              width={isNavMini ? 100 : 180}
              height={40}
            />
          )}
          <Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 1 }}
          >
            <SearchBar />
            <TaskFilterMenu />
          </Stack>
        </Box>
      )}

      <Scrollbar fillContent>
        <TaskList tasks={tasks} isNavMini={isNavMini} />
        {/* <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />

        {slots?.bottomArea ?? <NavUpgrade />} */}
      </Scrollbar>
    </>
  );

  const renderNavMini = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          {theme.palette.mode === 'dark' ? (
            <Image
              src="/assets/images/logos/logo-white-mini.png"
              alt="Logo"
              width={50}
              height={40}
            />
          ) : (
            <Image
              src="/assets/images/logos/logo-dark-mini.png"
              alt="Logo"
              width={50}
              height={40}
            />
          )}
        </Box>
      )}

      <NavSectionMini
        tasks={tasks}
        isNavMini={isNavMini}
        data={[]}
        sx={{ pb: 2, px: 0.5, ...hideScrollY, flex: '1 1 auto', overflowY: 'auto' }}
        {...other}
      />

      {slots?.bottomArea}
    </>
  );

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        transition: theme.transitions.create(['width'], {
          easing: 'var(--layout-transition-easing)',
          duration: 'var(--layout-transition-duration)',
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={{
          display: 'none',
          [theme.breakpoints.up(layoutQuery)]: {
            display: 'inline-flex',
          },
        }}
      />
      {isNavMini ? renderNavMini : renderNavVertical}
    </Box>
  );
}
