import {
  Warning,
  SignalCellular1Bar,
  SignalCellular2Bar,
  SignalCellular3Bar,
} from '@mui/icons-material';

import { TaskPriority } from '../enums';

export const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.BAJA:
      return <SignalCellular1Bar fontSize="small" />;
    case TaskPriority.MEDIA:
      return <SignalCellular2Bar fontSize="small" />;
    case TaskPriority.ALTA:
      return <SignalCellular3Bar fontSize="small" />;
    case TaskPriority.CRITICA:
      return <Warning fontSize="small" />;
    default:
      return undefined;
  }
};
