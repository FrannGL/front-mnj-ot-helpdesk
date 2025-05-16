import type { Order } from 'src/modules/orders/interfaces';
import type { CreateOrderType } from 'src/modules/orders/schemas/order.schema';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services/request';

import type { OrderFilters } from '../types';

interface OrderQueryParams {
  page?: number;
  cliente?: number;
  estado?: number;
  prioridad?: number;
  agente?: number;
  search?: string;
}

interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

interface SendMessagePayload {
  orderId: number;
  message: {
    texto: string;
    usuario: number;
  };
}

async function fetchOrders(params: OrderQueryParams = {}): Promise<ServerResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const url = `/ordenes${queryString ? `?${queryString}` : ''}`;

  const response = await request(url, 'GET');

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

async function createOrder(newOrder: CreateOrderType): Promise<Order> {
  const response = await request('/ordenes', 'POST', newOrder);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function updateOrder({
  orderId,
  updatedOrder,
}: {
  orderId: number;
  updatedOrder: CreateOrderType;
}): Promise<Order> {
  const response = await request(`/ordenes/${orderId}`, 'PUT', updatedOrder);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function deleteOrder(orderId: number) {
  const response = await request(`/ordenes/${orderId}`, 'DELETE');
  if (response.error) {
    throw new Error(response.error);
  }
  return response;
}

async function sendMessageToOrder({ orderId, message }: SendMessagePayload) {
  const response = await request(`/ordenes/${orderId}/mensajes/`, 'POST', message);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

export function useOrderById(orderId: number | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => request(`ordenes/${orderId}`, 'GET'),
    enabled: !!orderId,
  });
}

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

  const queryParams: OrderQueryParams = {
    page,
    cliente: filters.cliente,
    estado: filters.status,
    prioridad: filters.priority,
    agente: filters.assignedTo,
    search: filters.searchTerm,
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => fetchOrders(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'page' && value !== null && value !== undefined && value !== ''
  );

  if (data?.next && !hasActiveFilters) {
    const nextPage = page + 1;
    queryClient.prefetchQuery({
      queryKey: ['orders', { ...queryParams, page: nextPage }],
      queryFn: () => fetchOrders({ ...queryParams, page: nextPage }),
      staleTime: 1000 * 60 * 5,
    });
  }

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageToOrder,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
