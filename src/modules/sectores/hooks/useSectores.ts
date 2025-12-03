import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Sector } from '../interfaces/sector.interface';

interface PaginatedSectoresResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sector[];
}

interface UseSectoresOptions {
  initialData?: PaginatedSectoresResponse;
}

async function fetchSectores(page: number): Promise<PaginatedSectoresResponse> {
  const response = await request(`sectores?page=${page}`, 'GET');

  if (response.error || response.status >= 400) {
    throw new Error(response.error || `Error ${response.status}`);
  }

  return response.data;
}

export function useSectores(page: number = 1, options?: UseSectoresOptions) {
  const { data, isLoading, error, isFetching } = useQuery<PaginatedSectoresResponse>({
    queryKey: ['sectores', page],
    queryFn: () => fetchSectores(page),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    sectores: data?.results || [],
    count: data?.count ?? 0,
    isLoading,
    isFetching,
    error,
  };
}
