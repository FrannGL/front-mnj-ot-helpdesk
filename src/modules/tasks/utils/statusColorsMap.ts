import type { ChipProps } from '@mui/material';

import { TaskStatus } from '../enums';

export const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.ABIERTO]: '#FFC107',
  [TaskStatus.RESUELTO]: '#4CAF50',
  [TaskStatus.CANCELADO]: '#F44336',
};

export const statusChipColorMap: Record<TaskStatus, ChipProps['color']> = {
  [TaskStatus.ABIERTO]: 'warning',
  [TaskStatus.RESUELTO]: 'success',
  [TaskStatus.CANCELADO]: 'error',
};
