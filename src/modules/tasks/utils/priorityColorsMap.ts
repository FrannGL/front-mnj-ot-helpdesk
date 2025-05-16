import type { ChipProps } from '@mui/material';

import { TaskPriority } from '../enums';

export const priorityColorMap: Record<TaskPriority, string> = {
  [TaskPriority.BAJA]: '#FFC107',
  [TaskPriority.MEDIA]: '#2196F3',
  [TaskPriority.ALTA]: '#4CAF50',
  [TaskPriority.CRITICA]: '#F44336',
};

export const priorityChipColorMap: Record<TaskPriority, ChipProps['color']> = {
  [TaskPriority.BAJA]: 'success',
  [TaskPriority.MEDIA]: 'info',
  [TaskPriority.ALTA]: 'warning',
  [TaskPriority.CRITICA]: 'error',
};
