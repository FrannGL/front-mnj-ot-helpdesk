import type { User } from 'src/modules/users/interfaces';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services/request';

interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

async function fetchUsers(): Promise<ServerResponse> {
  const response = await request('usuarios', 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  return response.data;
}

export function useUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
  };
}
