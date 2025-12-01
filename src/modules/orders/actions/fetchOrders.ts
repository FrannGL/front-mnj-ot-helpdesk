'use server';

import type { ServerResponse, OrderQueryParams } from 'src/modules/orders/interfaces';

import { fetchServer } from 'src/shared/actions/fetchServer';

export async function fetchOrdersServer(params: OrderQueryParams = {}): Promise<ServerResponse> {
  const queryParams: Record<string, string | number | boolean | undefined | null> = { ...params };

  if (!queryParams.order_by) {
    queryParams.order_by = '-created_at';
  }

  return fetchServer<ServerResponse>('/ordenes', {
    params: queryParams,
  });
}
