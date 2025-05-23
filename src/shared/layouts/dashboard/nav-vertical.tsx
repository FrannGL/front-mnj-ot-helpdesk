import type { Breakpoint } from '@mui/material/styles';
import type { Order } from 'src/modules/orders/interfaces';
import type { NavSectionProps } from 'src/shared/components/minimal/nav-section';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { varAlpha, hideScrollY } from 'src/shared/theme/styles';
import { Scrollbar } from 'src/shared/components/minimal/scrollbar';
import { NavSectionMini, NavSectionVertical } from 'src/shared/components/minimal/nav-section';

import { NavToggleButton } from '../components/nav-toggle-button';

// ----------------------------------------------------------------------

export type NavVerticalProps = NavSectionProps & {
  orders: Order[];
  isNavMini: boolean;
  layoutQuery: Breakpoint;
  onToggleNav: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavVertical({
  orders,
  sx,
  data,
  slots,
  isNavMini,
  layoutQuery,
  onToggleNav,
  ...other
}: NavVerticalProps) {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          {mounted &&
            (theme.palette.mode === 'dark' ? (
              <Image
                src="/logo/logo-white.png"
                alt="Logo"
                width={isNavMini ? 100 : 180}
                height={40}
              />
            ) : (
              <Image
                src="/logo/logo-dark.png"
                alt="Logo"
                width={isNavMini ? 100 : 180}
                height={40}
              />
            ))}
          <Stack
            width="100%"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 1, mb: 1 }}
          >
            {/* <SearchBar /> */}
            {/* <OrderFilterMenu
              selectedStatuses={selectedStatuses}
              selectedPriorities={selectedPriorities}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onClear={handleClearFilters}
            /> */}
          </Stack>
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} sx={{ px: 2, flex: '1 1 auto' }} {...other} />

        {/* {slots?.bottomArea ?? <NavUpgrade />} */}
      </Scrollbar>
    </>
  );

  const renderNavMini = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          {mounted &&
            (theme.palette.mode === 'dark' ? (
              <Image
                src={isNavMini ? '/logo/logo-white-mini.png' : '/logo/logo-white.png'}
                alt="Logo"
                width={isNavMini ? 50 : 180}
                height={40}
              />
            ) : (
              <Image
                src={isNavMini ? '/logo/logo-dark-mini.png' : '/logo/logo-dark.png'}
                alt="Logo"
                width={isNavMini ? 50 : 180}
                height={40}
              />
            ))}
        </Box>
      )}

      <NavSectionMini
        orders={orders}
        isNavMini={isNavMini}
        data={data}
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
