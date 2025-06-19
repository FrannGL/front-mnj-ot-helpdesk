import { useRef, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config';
import { buildWebSocketUrl } from 'src/shared/utils/buildWebsocketUrl';

import type { Message } from '../interfaces';

export function useOrderSocket(orderId: number | null, onNewMessage: (message: Message) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const wsUrl = buildWebSocketUrl(CONFIG.site.serverJST, orderId);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.message) {
          onNewMessage(data.message);
        }
      } catch (err) {
        console.error('❌ Error al parsear mensaje del WS', err);
      }
    };

    // eslint-disable-next-line consistent-return
    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, [orderId, onNewMessage]);

  const sendSocketMessage = useCallback((msg: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
      console.log('📤 Mensaje enviado:', msg);
    } else {
      console.warn('⚠️ WebSocket no abierto:', msg);
    }
  }, []);

  const sendNotification = useCallback(() => {
    sendSocketMessage({ type: 'mensaje_new' });
  }, [sendSocketMessage]);

  return { socketRef, sendSocketMessage, sendNotification };
}
