import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { TaskList } from 'src/components/TaskList';

import { NavUl } from '../styles';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';

import type { NavSectionProps } from '../types';

// ----------------------------------------------------------------------

export function NavSectionMini({
  tasks,
  isNavMini,
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: NavSectionProps) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.mini(theme),
    ...overridesVars,
  };

  return (
    <Stack component="nav" className={navSectionClasses.mini.root} sx={{ ...cssVars, ...sx }}>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        <TaskList tasks={tasks ?? []} isNavMini={isNavMini ?? false} />
      </NavUl>
    </Stack>
  );
}
