import type { UserGroups } from '../enums';

export interface User {
  id: number;
  username: string;
  email: string;
  groups: UserGroups[];
}
