export function buildWebSocketUrl(
  baseHttpUrl: string,
  orderId?: number,
  useSecondFrontend = false
): string {
  const protocol = baseHttpUrl.startsWith('https') ? 'wss' : 'ws';
  const host = baseHttpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (orderId !== undefined) {
    return `${protocol}://${host}/ws/chat/orden_${orderId}/`;
  }

  const path = useSecondFrontend ? '/ws/notif/ordenes2/?frontend=2' : '/ws/notif/ordenes/';
  return `${protocol}://${host}${path}`;
}