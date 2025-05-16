import type { OrderStatusEnum, OrderPriorityEnum } from '../enums';

export interface OrderFilters {
  cliente: number | undefined;
  status: OrderStatusEnum | undefined;
  priority: OrderPriorityEnum | undefined;
  assignedTo: number | undefined;
  searchTerm: string | undefined;
}
