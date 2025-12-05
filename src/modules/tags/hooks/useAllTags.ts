import { useQuery } from '@tanstack/react-query';

import { request } from 'src/services';

import type { Tag } from '../interfaces/tag.interface';

interface PaginatedTagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

async function fetchAllTags(): Promise<Tag[]> {
  const firstResponse = await request('tags?page=1', 'GET');

  if (firstResponse.error || firstResponse.status >= 400) {
    throw new Error(firstResponse.error || `Error ${firstResponse.status}`);
  }

  const firstData: PaginatedTagsResponse = firstResponse.data;
  const allTags: Tag[] = [...firstData.results];

  if (!firstData.next) {
    return allTags;
  }

  const totalPages = Math.ceil(firstData.count / firstData.results.length);

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page += 1) {
    pagePromises.push(request(`tags?page=${page}`, 'GET'));
  }

  const responses = await Promise.all(pagePromises);

  responses.forEach((response) => {
    if (response.error || response.status >= 400) {
      throw new Error(response.error || `Error ${response.status}`);
    }
    const { data } = response;
    allTags.push(...data.results);
  });

  return allTags;
}

export function useAllTags() {
  const { data, isLoading, error } = useQuery<Tag[]>({
    queryKey: ['tags', 'all'],
    queryFn: fetchAllTags,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    tags: data || [],
    isLoading,
    error,
  };
}
