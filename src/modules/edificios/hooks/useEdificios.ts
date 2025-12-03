import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Edificio } from '../interfaces/edificio.interface';

interface PaginatedEdificiosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Edificio[];
}

interface UseEdificiosOptions {
  initialData?: PaginatedEdificiosResponse;
}

async function fetchEdificios(page: number): Promise<PaginatedEdificiosResponse> {
  const response = await request(`edificios?page=${page}`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  return response.data;
}

export function useEdificios(page: number = 1, options?: UseEdificiosOptions) {
  const { data, isLoading, error, isFetching } = useQuery<PaginatedEdificiosResponse>({
    queryKey: ['edificios', page],
    queryFn: () => fetchEdificios(page),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    edificios: data?.results || [],
    count: data?.count ?? 0,
    isLoading,
    isFetching,
    error,
  };
}
