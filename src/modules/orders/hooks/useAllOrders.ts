import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { isAdmin, isSuperAdmin } from 'src/shared/utils/verifyUserRole';

import { fetchAllOrders } from '../services/order.service';

import type { Order } from '../interfaces';
import type { OrderFilters } from '../types';

interface UseAllOrdersOptions {
  filters?: OrderFilters;
  enabled?: boolean;
}

export function useAllOrders(options?: UseAllOrdersOptions) {
  const { user } = useUser();
  const { filters = {} as OrderFilters, enabled = true } = options || {};

  const publicMetadata = user?.publicMetadata ?? {};

  const userIsAdmin = isAdmin(publicMetadata);
  const userIsSuperAdmin = isSuperAdmin(publicMetadata);

  const queryParams: Record<string, any> = {};

  if (filters.cliente) queryParams.cliente = filters.cliente;
  if (filters.status) queryParams.estado = filters.status;
  if (filters.priority) queryParams.prioridad = filters.priority;
  if (filters.assignedTo) queryParams.agente = filters.assignedTo;
  if (filters.searchTerm) queryParams.titulo_contains = filters.searchTerm;
  if (filters.tags) queryParams.tags = filters.tags;

  if (!userIsAdmin && !userIsSuperAdmin && user?.id) {
    queryParams.cliente_clerk_id = user.id;
  }

  const { data, isLoading, error } = useQuery<Order[]>({
    queryKey: ['allOrders', queryParams],
    queryFn: () => fetchAllOrders(queryParams),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 3,
    retryDelay: 2000,
    refetchOnWindowFocus: false,
  });

  return {
    data: data || [],
    isLoading,
    error: error as Error | null,
    isAdmin: userIsAdmin,
    isSuperAdmin: userIsSuperAdmin,
  };
}
