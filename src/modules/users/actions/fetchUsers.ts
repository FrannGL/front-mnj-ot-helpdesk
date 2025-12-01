'use server';

import type { User } from 'src/modules/users/interfaces';

import { fetchServer } from 'src/shared/actions/fetchServer';

interface UsersServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export async function fetchUsersServer(page: number = 1): Promise<UsersServerResponse> {
  return fetchServer<UsersServerResponse>('/usuarios/', {
    params: {
      is_active: true,
      page,
    },
  });
}
