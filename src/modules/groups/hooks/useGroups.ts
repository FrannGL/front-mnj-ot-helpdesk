import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Group } from '../interfaces/group.interface';

async function fetchTags(): Promise<Group[]> {
  const response = await request(`/api/grupos`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  const { data } = response;

  return data.results;
}

export function useGroups() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchTags,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    data,
    isLoading,
    error,
  };
}
