export function buildWebSocketUrl(baseHttpUrl: string, orderId: number): string {
  const protocol = baseHttpUrl.startsWith('https') ? 'wss' : 'ws';
  const host = baseHttpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `${protocol}://${host}/ws/chat/orden_${orderId}/`;
}
