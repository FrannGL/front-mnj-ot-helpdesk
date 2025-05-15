import type { TaskStatus, TaskPriority } from '../enums';

export interface TaskFilters {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  assignedTo: string | null;
}
