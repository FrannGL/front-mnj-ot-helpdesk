'use server';

import type { ServerResponse, OrderQueryParams } from 'src/modules/orders/interfaces';

import { currentUser } from '@clerk/nextjs/server';

import { fetchServer } from 'src/shared/actions/fetchServer';

export async function fetchOrdersServer(params: OrderQueryParams = {}): Promise<ServerResponse> {
  const user = await currentUser();

  const queryParams: Record<string, string | number | boolean | undefined | null> = { ...params };

  if (!queryParams.order_by) {
    queryParams.order_by = '-created_at';
  }

  const isAdmin = user?.publicMetadata.role === 'admin';
  const isSuperAdmin = user?.publicMetadata.role === 'superadmin';

  if (!isAdmin && !isSuperAdmin && user?.id) {
    queryParams.cliente_clerk_id = user.id;
  }

  return fetchServer<ServerResponse>('/ordenes', {
    params: queryParams,
  });
}
