import type { TaskStatus, TaskPriority } from '../enums';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  closedAt: string | null;
  priority: TaskPriority;
  createdBy: string;
  assignedTo: string;
}
