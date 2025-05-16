import { TaskStatus } from '../enums';

export const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.PENDIENTE]: '#FFC107',
  [TaskStatus['EN PROCESO']]: '#2196F3',
  [TaskStatus.RESUELTO]: '#4CAF50',
  [TaskStatus.CANCELADO]: '#F44336',
};
