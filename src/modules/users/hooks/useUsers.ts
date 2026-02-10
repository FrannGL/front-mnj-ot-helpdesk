import type { ServerResponse } from 'src/modules/users/interfaces';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { fetchUsersServer } from 'src/modules/users/actions/fetchUsers';

interface UseUsersOptions {
  initialData?: ServerResponse;
}

export function useUsers(page: number = 1, options?: UseUsersOptions) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsersServer(page),
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
