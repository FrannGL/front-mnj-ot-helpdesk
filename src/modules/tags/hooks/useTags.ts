import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Tag } from '../interfaces/tag.interface';

interface PaginatedTagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

interface UseTagsOptions {
  initialData?: PaginatedTagsResponse;
}

async function fetchTags(page: number): Promise<PaginatedTagsResponse> {
  const response = await request(`tags?page=${page}`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  return response.data;
}

export function useTags(page: number = 1, options?: UseTagsOptions) {
  const { data, isLoading, error, isFetching } = useQuery<PaginatedTagsResponse>({
    queryKey: ['tags', page],
    queryFn: () => fetchTags(page),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    tags: data?.results || [],
    count: data?.count ?? 0,
    isLoading,
    isFetching,
    error,
  };
}
