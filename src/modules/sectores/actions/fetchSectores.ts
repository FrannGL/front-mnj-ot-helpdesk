'use server';

import type { Sector } from 'src/modules/sectores/interfaces/sector.interface';

import { fetchServer } from 'src/shared/actions/fetchServer';

interface SectoresServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sector[];
}

export async function fetchSectoresServer(page: number = 1): Promise<SectoresServerResponse> {
  return fetchServer<SectoresServerResponse>('/sectores', {
    params: { page },
  });
}
