import type { ChipProps } from '@mui/material';

import { red, green, orange } from '@mui/material/colors';

import { OrderStatusEnum } from '../enums';

export const statusColorMap: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.ABIERTO]: orange[500],
  [OrderStatusEnum.RESUELTO]: green[500],
  [OrderStatusEnum.CANCELADO]: red[500],
};

export const statusChipColorMap: Record<OrderStatusEnum, ChipProps['color']> = {
  [OrderStatusEnum.ABIERTO]: 'warning',
  [OrderStatusEnum.RESUELTO]: 'success',
  [OrderStatusEnum.CANCELADO]: 'error',
};
