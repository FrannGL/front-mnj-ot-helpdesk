import type { ServerResponse } from 'src/modules/users/interfaces';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services/request';

interface UseUsersOptions {
  initialData?: ServerResponse;
}

async function fetchUsers(page: number): Promise<ServerResponse> {
  const response = await request(`usuarios/?is_active=true&page=${page}`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  return response.data;
}

export function useUsers(page: number = 1, options?: UseUsersOptions) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
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
