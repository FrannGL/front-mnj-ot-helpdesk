export interface Group {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  groups: Group[];
  clerk_id: string;
}
