import type { User } from 'src/modules/users/interfaces/user';

export interface Message {
  id: string;
  texto: string;
  usuario: User;
  created_at: string;
  updated_at: string;
  adjuntos: string[];
}
