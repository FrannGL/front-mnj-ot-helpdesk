export function buildWebSocketUrl(baseHttpUrl: string, orderId?: number): string {
  const protocol = baseHttpUrl.startsWith('https') ? 'wss' : 'ws';
  const host = baseHttpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (orderId !== undefined) {
    return `${protocol}://${host}/ws/chat/orden_${orderId}/`;
  }

  return `${protocol}://${host}/ws/notif/ordenes/`;
}
