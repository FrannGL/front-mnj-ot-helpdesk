import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import {
  createOrder,
  deleteOrder,
  fetchOrders,
  updateOrder,
  sendMessageToOrder,
} from '../services/order.service';

import type { OrderFilters } from '../types';
import type { CreateOrderType } from '../schemas/order.schema';

export function useOrders(
  page: number = 1,
  filters: OrderFilters = {
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
  }
) {
  const queryClient = useQueryClient();

  const queryParams = {
    page,
    cliente: filters.cliente,
    estado: filters.status,
    prioridad: filters.priority,
    agente: filters.assignedTo,
    titulo_contains: filters.searchTerm,
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => fetchOrders(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  const hasActiveFilters = Object.values(filters).some((value) => value != null && value !== '');

  if (data?.next && !hasActiveFilters) {
    queryClient.prefetchQuery({
      queryKey: ['orders', { ...queryParams, page: page + 1 }],
      queryFn: () => fetchOrders({ ...queryParams, page: page + 1 }),
      staleTime: 1000 * 60 * 5,
    });
  }

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, updatedOrder }: { orderId: number; updatedOrder: CreateOrderType }) =>
      updateOrder(orderId, updatedOrder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageToOrder,
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });

  return {
    data,
    isLoading,
    isFetching,
    error: error as Error | null,
    createMutation,
    updateMutation,
    deleteMutation,
    sendMessageMutation,
    hasActiveFilters,
  };
}
