import { Cancel, CheckCircle, HourglassEmpty } from '@mui/icons-material';

import { TaskStatus } from '../enums';

export const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.ABIERTO:
      return <HourglassEmpty fontSize="small" />;
    case TaskStatus.RESUELTO:
      return <CheckCircle fontSize="small" />;
    case TaskStatus.CANCELADO:
      return <Cancel fontSize="small" />;
    default:
      return undefined;
  }
};
