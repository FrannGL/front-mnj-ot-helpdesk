import type { User } from './user';

export interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
