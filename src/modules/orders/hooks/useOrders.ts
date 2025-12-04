import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { isAdmin, isSuperAdmin } from 'src/shared/utils/verifyUserRole';

import {
  createOrder,
  deleteOrder,
  fetchOrders,
  updateOrder,
  sendMessageToOrder,
} from '../services/order.service';

import type { OrderFilters } from '../types';
import type { ServerResponse } from '../interfaces';
import type { CreateOrderType } from '../schemas/order.schema';

interface UseOrdersOptions {
  initialData?: ServerResponse;
}

export function useOrders(
  page: number = 1,
  filters: OrderFilters = {
    cliente: undefined,
    status: undefined,
    priority: undefined,
    assignedTo: undefined,
    searchTerm: undefined,
    tags: undefined,
  },
  options?: UseOrdersOptions
) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const publicMetadata = user?.publicMetadata ?? {};

  const userIsAdmin = isAdmin(publicMetadata);
  const userIsSuperAdmin = isSuperAdmin(publicMetadata);

  const queryParams = {
    page,
    cliente: filters.cliente,
    estado: filters.status,
    prioridad: filters.priority,
    agente: filters.assignedTo,
    titulo_contains: filters.searchTerm,
    tags: filters.tags,
  };

  if (!userIsAdmin && !userIsSuperAdmin && user?.id) {
    (queryParams as any).cliente_clerk_id = user.id;
  }

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => fetchOrders(queryParams),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
    refetchOnWindowFocus: false,
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
    isAdmin: userIsAdmin,
    isSuperAdmin: userIsSuperAdmin,
  };
}
