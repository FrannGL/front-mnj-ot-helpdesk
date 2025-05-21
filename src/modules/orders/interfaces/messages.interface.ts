import type { User } from 'src/modules/users/interfaces/user';

interface Attachment {
  id: string;
  archivo: string;
}

export interface Message {
  id: number;
  texto: string;
  usuario: User;
  created_at: string;
  updated_at: string;
  adjuntos: Attachment[];
}
