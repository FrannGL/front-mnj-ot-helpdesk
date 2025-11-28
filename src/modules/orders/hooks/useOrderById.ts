import { useQuery } from '@tanstack/react-query';

import { request } from 'src/services/request';

export function useOrderById(orderId: number | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => request(`/api/ordenes/${orderId}`, 'GET'),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
}
