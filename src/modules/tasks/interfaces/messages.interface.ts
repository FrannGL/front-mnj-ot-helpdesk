import type { User } from 'src/modules/users/interfaces/user';

export interface Message {
  id: string;
  texto: string;
  usuario: User;
  createdAt: string;
  updatedAt: string;
  adjuntos: string[];
}
