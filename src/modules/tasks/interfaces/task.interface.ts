import type { User } from 'src/modules/users/interfaces';

import type { Message } from './messages.interface';
import type { TaskStatus, TaskPriority } from '../enums';
import type { StatusType, PriorityType } from '../types';

export interface Task {
  id: number;
  cliente: User;
  agentes: User[];
  titulo: string;
  estado: TaskStatus;
  estado_display: StatusType;
  prioridad: TaskPriority;
  prioridad_display: PriorityType;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  mensajes: Message[];
}
