import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Group } from '../interfaces/group.interface';

interface GroupsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Group[];
}

interface UseGroupsOptions {
  initialData?: GroupsResponse;
}

async function fetchGroups(): Promise<GroupsResponse> {
  const response = await request(`grupos`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  return response.data;
}

export function useGroups(options?: UseGroupsOptions) {
  const { data, isLoading, error } = useQuery<GroupsResponse>({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    groups: data?.results || [],
    count: data?.count ?? 0,
    isLoading,
    error,
  };
}
