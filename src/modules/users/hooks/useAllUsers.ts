import type { User, ServerResponse } from 'src/modules/users/interfaces';

import { useQuery } from '@tanstack/react-query';

import { request } from 'src/services/request';

async function fetchAllUsers(): Promise<User[]> {
  const firstResponse = await request('usuarios/?is_active=true&page=1', 'GET');

  if (firstResponse.error || firstResponse.status >= 400) {
    throw new Error(firstResponse.error || `Error ${firstResponse.status}`);
  }

  const firstData: ServerResponse = firstResponse.data;
  const allUsers: User[] = [...firstData.results];

  if (!firstData.next) {
    return allUsers;
  }

  const totalPages = Math.ceil(firstData.count / firstData.results.length);

  const pagePromises = [];
  for (let page = 2; page <= totalPages; page += 1) {
    pagePromises.push(request(`usuarios/?is_active=true&page=${page}`, 'GET'));
  }

  const responses = await Promise.all(pagePromises);

  responses.forEach((response) => {
    if (response.error || response.status >= 400) {
      throw new Error(response.error || `Error ${response.status}`);
    }
    const { data } = response;
    allUsers.push(...data.results);
  });

  return allUsers;
}

export function useAllUsers() {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ['users', 'all'],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: 2000,
  });

  return {
    users: data || [],
    isLoading,
    error,
  };
}
