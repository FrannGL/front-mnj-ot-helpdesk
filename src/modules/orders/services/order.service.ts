import { request } from 'src/shared/services/request';

import type { CreateOrderType } from '../schemas/order.schema';
import type { Order, ServerResponse, OrderQueryParams, SendMessagePayload } from '../interfaces';

export async function fetchOrders(params: OrderQueryParams = {}): Promise<ServerResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  searchParams.set('order_by', '-created_at');

  const url = `ordenes?${searchParams}`;
  const response = await request(url, 'GET');

  if (response.error || response.status >= 400)
    throw new Error(response.error || `Error ${response.status}`);

  return response.data;
}
export async function createOrder(newOrder: CreateOrderType): Promise<Order> {
  const response = await request('ordenes?frontend=2', 'POST', newOrder);
  if (response.error) throw new Error(response.error);
  return response.data;
}

export async function updateOrder(orderId: number, updatedOrder: CreateOrderType): Promise<Order> {
  const response = await request(`ordenes/${orderId}?frontend=2`, 'PUT', updatedOrder);
  if (response.error) throw new Error(response.error);
  return response.data;
}

export async function deleteOrder(orderId: number) {
  const response = await request(`ordenes/${orderId}?frontend=2`, 'DELETE');
  if (response.error) throw new Error(response.error);
  return response;
}

export async function sendMessageToOrder({ orderId, message }: SendMessagePayload) {
  const formData = new FormData();

  if (message.texto) {
    formData.append('texto', message.texto);
  }
  formData.append('usuario', String(message.usuario));

  message.adjuntos.forEach((file) => {
    formData.append('adjuntos', file);
  });

  const response = await request(`ordenes/${orderId}/mensajes/?frontend=2`, 'POST', formData, 'formData');

  if (response.error) throw new Error(response.error);
  return response.data;
}
