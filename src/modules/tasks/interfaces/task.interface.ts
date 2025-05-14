import type { TaskStatus, TaskPriority } from '../enums';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

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
  messages: Message[];
}
