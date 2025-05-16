import type { ChipProps } from '@mui/material';

import { OrderStatusEnum } from '../enums';

export const statusColorMap: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.ABIERTO]: '#FFC107',
  [OrderStatusEnum.RESUELTO]: '#4CAF50',
  [OrderStatusEnum.CANCELADO]: '#F44336',
};

export const statusChipColorMap: Record<OrderStatusEnum, ChipProps['color']> = {
  [OrderStatusEnum.ABIERTO]: 'warning',
  [OrderStatusEnum.RESUELTO]: 'success',
  [OrderStatusEnum.CANCELADO]: 'error',
};
