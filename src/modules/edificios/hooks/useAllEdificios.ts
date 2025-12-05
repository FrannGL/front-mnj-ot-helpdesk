import { useQuery } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Edificio } from '../interfaces/edificio.interface';

interface PaginatedEdificiosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Edificio[];
}

async function fetchAllEdificios(): Promise<Edificio[]> {
  const firstResponse = await request('edificios?page=1', 'GET');

  if (firstResponse.error || firstResponse.status >= 400) {
    throw new Error(firstResponse.error || `Error ${firstResponse.status}`);
  }

  const firstData: PaginatedEdificiosResponse = firstResponse.data;
  const allEdificios: Edificio[] = [...firstData.results];

  if (!firstData.next) {
    return allEdificios;
  }

  const totalPages = Math.ceil(firstData.count / firstData.results.length);

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page += 1) {
    pagePromises.push(request(`edificios?page=${page}`, 'GET'));
  }

  const responses = await Promise.all(pagePromises);

  responses.forEach((response) => {
    if (response.error || response.status >= 400) {
      throw new Error(response.error || `Error ${response.status}`);
    }
    const { data } = response;
    allEdificios.push(...data.results);
  });

  return allEdificios;
}

export function useAllEdificios() {
  const { data, isLoading, error } = useQuery<Edificio[]>({
    queryKey: ['edificios', 'all'],
    queryFn: fetchAllEdificios,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    edificios: data || [],
    isLoading,
    error,
  };
}
