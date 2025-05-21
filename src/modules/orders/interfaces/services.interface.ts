import type { Order } from '.';

export interface OrderQueryParams {
  page?: number;
  cliente?: number;
  estado?: number;
  prioridad?: number;
  agente?: number;
  search?: string;
}

export interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface SendMessagePayload {
  orderId: number;
  message: {
    texto: string;
    usuario: number;
  };
}
