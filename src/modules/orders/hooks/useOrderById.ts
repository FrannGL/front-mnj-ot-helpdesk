import { useQuery } from '@tanstack/react-query';

import { request } from 'src/shared/services/request';

export function useOrderById(orderId: number | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => request(`ordenes/${orderId}`, 'GET'),
    enabled: !!orderId,
  });
}
