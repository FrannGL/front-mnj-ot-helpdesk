import {
  Warning,
  SignalCellular1Bar,
  SignalCellular2Bar,
  SignalCellular3Bar,
} from '@mui/icons-material';

import { OrderPriorityEnum } from '../enums';

export const getPriorityIcon = (priority: OrderPriorityEnum) => {
  switch (priority) {
    case OrderPriorityEnum.BAJA:
      return <SignalCellular1Bar fontSize="small" />;
    case OrderPriorityEnum.MEDIA:
      return <SignalCellular2Bar fontSize="small" />;
    case OrderPriorityEnum.ALTA:
      return <SignalCellular3Bar fontSize="small" />;
    case OrderPriorityEnum.CRITICA:
      return <Warning fontSize="small" />;
    default:
      return undefined;
  }
};
