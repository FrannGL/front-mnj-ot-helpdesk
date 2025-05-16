import type { ChipProps } from '@mui/material';

import { OrderPriorityEnum } from '../enums';

export const priorityColorMap: Record<OrderPriorityEnum, string> = {
  [OrderPriorityEnum.BAJA]: '#FFC107',
  [OrderPriorityEnum.MEDIA]: '#2196F3',
  [OrderPriorityEnum.ALTA]: '#4CAF50',
  [OrderPriorityEnum.CRITICA]: '#F44336',
};

export const priorityChipColorMap: Record<OrderPriorityEnum, ChipProps['color']> = {
  [OrderPriorityEnum.BAJA]: 'success',
  [OrderPriorityEnum.MEDIA]: 'info',
  [OrderPriorityEnum.ALTA]: 'warning',
  [OrderPriorityEnum.CRITICA]: 'error',
};
