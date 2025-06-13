import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Tag } from '../interfaces/tag.interface';

async function fetchTags(): Promise<Tag[]> {
  const response = await request(`tags`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  const { data } = response;

  return data.results;
}

export function useTags() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags'],
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
