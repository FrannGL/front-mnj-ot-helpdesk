'use server';

import type { Edificio } from 'src/modules/edificios/interfaces/edificio.interface';

import { fetchServer } from 'src/shared/actions/fetchServer';

interface EdificiosServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Edificio[];
}

export async function fetchEdificiosServer(page: number = 1): Promise<EdificiosServerResponse> {
  return fetchServer<EdificiosServerResponse>('/edificios', {
    params: { page },
  });
}
