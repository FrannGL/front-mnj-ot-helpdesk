import type { User } from 'src/modules/users/interfaces';

import { useQuery } from '@tanstack/react-query';

import { request } from 'src/services/request';

interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

async function fetchUsers(): Promise<ServerResponse> {
  const response = await request(`/usuarios`, 'GET');

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

export function useUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
  };
}
