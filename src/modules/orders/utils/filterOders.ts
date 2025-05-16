import { OrderStatusEnum, OrderPriorityEnum } from '../enums';

import type { Order } from '../interfaces';
import type { OrderFilters } from '../types';

export const applyFilters = (orders: Order[], filters: OrderFilters): Order[] =>
  orders.filter((order) => {
    const searchTerm = filters.searchTerm?.toLowerCase() || '';

    const matchesStatus = !filters.status || order.estado === filters.status;
    const matchesPriority = !filters.priority || order.prioridad === filters.priority;
    const matchesAssignedTo =
      !filters.assignedTo || order.agentes.some((agente) => agente.username === filters.assignedTo);

    const matchesSearch =
      !searchTerm ||
      order.titulo.toLowerCase().includes(searchTerm) ||
      order.agentes.some((agente) => agente.username.toLowerCase().includes(searchTerm)) ||
      Object.entries(OrderPriorityEnum)
        .find(([key, value]) => value === order.prioridad)?.[0]
        .toLowerCase()
        .includes(searchTerm) ||
      Object.entries(OrderStatusEnum)
        .find(([key, value]) => value === order.estado)?.[0]
        .toLowerCase()
        .includes(searchTerm) ||
      order.mensajes?.some((mensaje) => mensaje.texto?.toLowerCase().includes(searchTerm));

    return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch;
  });
