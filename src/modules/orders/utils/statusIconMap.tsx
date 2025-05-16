import { Cancel, CheckCircle, HourglassEmpty } from '@mui/icons-material';

import { OrderStatusEnum } from '../enums';

export const getStatusIcon = (status: OrderStatusEnum) => {
  switch (status) {
    case OrderStatusEnum.ABIERTO:
      return <HourglassEmpty fontSize="small" />;
    case OrderStatusEnum.RESUELTO:
      return <CheckCircle fontSize="small" />;
    case OrderStatusEnum.CANCELADO:
      return <Cancel fontSize="small" />;
    default:
      return undefined;
  }
};
