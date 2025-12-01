'use server';

import type { Group } from 'src/modules/groups/interfaces/group.interface';

import { fetchServer } from 'src/shared/actions/fetchServer';

interface GroupsServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Group[];
}

export async function fetchGroupsServer(): Promise<GroupsServerResponse> {
  return fetchServer<GroupsServerResponse>('/grupos');
}
