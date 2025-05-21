import { request } from 'src/services/request';

import type { CreateOrderType } from '../schemas/order.schema';
import type { Order, ServerResponse, OrderQueryParams, SendMessagePayload } from '../interfaces';

export async function fetchOrders(params: OrderQueryParams = {}): Promise<ServerResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const url = `ordenes${searchParams.toString() ? `?${searchParams}` : ''}`;
  const response = await request(url, 'GET');

  if (response.error || response.status >= 400)
    throw new Error(response.error || `Error ${response.status}`);
  return response.data;
}

export async function createOrder(newOrder: CreateOrderType): Promise<Order> {
  const response = await request('ordenes', 'POST', newOrder);
  if (response.error) throw new Error(response.error);
  return response.data;
}

export async function updateOrder(orderId: number, updatedOrder: CreateOrderType): Promise<Order> {
  const response = await request(`ordenes/${orderId}`, 'PUT', updatedOrder);
  if (response.error) throw new Error(response.error);
  return response.data;
}

export async function deleteOrder(orderId: number) {
  const response = await request(`ordenes/${orderId}`, 'DELETE');
  if (response.error) throw new Error(response.error);
  return response;
}

export async function sendMessageToOrder({ orderId, message }: SendMessagePayload) {
  const response = await request(`ordenes/${orderId}/mensajes/`, 'POST', message);
  if (response.error) throw new Error(response.error);
  return response.data;
}
