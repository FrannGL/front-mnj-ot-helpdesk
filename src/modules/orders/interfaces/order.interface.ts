import type { User } from 'src/modules/users/interfaces';

import type { Tag } from './tag.interface';
import type { Message } from './messages.interface';
import type { StatusType, PriorityType } from '../types';
import type { OrderStatusEnum, OrderPriorityEnum } from '../enums';

export interface Order {
  id: number;
  cliente: User;
  agentes: User[];
  titulo: string;
  estado: OrderStatusEnum;
  estado_display: StatusType;
  prioridad: OrderPriorityEnum;
  prioridad_display: PriorityType;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  tags: Tag[];
  mensajes: Message[];
}
