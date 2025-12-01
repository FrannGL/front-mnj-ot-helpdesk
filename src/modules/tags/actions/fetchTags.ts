'use server';

import type { Tag } from 'src/modules/tags/interfaces/tag.interface';

import { fetchServer } from 'src/shared/actions/fetchServer';

interface TagsServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

export async function fetchTagsServer(page: number = 1): Promise<TagsServerResponse> {
  return fetchServer<TagsServerResponse>('/tags', {
    params: { page },
  });
}
