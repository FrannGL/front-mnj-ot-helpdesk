import { useRef, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config';
import { buildWebSocketUrl } from 'src/shared/utils/buildWebsocketUrl';

import type { Message } from '../interfaces';

type IncomingWSMessage = { message: string } | Partial<Message>;

export function useOrderSocket(
  orderId: number | null,
  onNewMessage: (message: IncomingWSMessage) => void
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    const wsUrl = buildWebSocketUrl(CONFIG.site.serverJST, orderId, true);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    const handleOpen = () => {
      console.log(`📡 WebSocket connected for order_${orderId}`);
    };

    const handleMessage = (event: MessageEvent) => {
      console.log('📩 Mensaje recibido:', event.data);

      try {
        const data = JSON.parse(event.data);

        if (data.message) {
          onNewMessage(data);
        } else {
          console.warn('⚠️ Mensaje con formato desconocido:', data);
        }
      } catch (err) {
        console.error('❌ Error al parsear el mensaje del WebSocket:', err);
      }
    };

    const handleClose = (event: CloseEvent) => {
      console.log(`📴 WebSocket cerrado para order_${orderId}`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    };

    socket.onopen = handleOpen;
    socket.onmessage = handleMessage;
    socket.onclose = handleClose;

    socket.onerror = (err) => {
      console.error('⚠️ WebSocket error', err);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [orderId, onNewMessage]);

  const sendSocketMessage = useCallback((msg: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
      console.log('📤 Mensaje enviado:', msg);
    } else {
      console.warn('⚠️ WebSocket is not open. Cannot send message:', msg);
    }
  }, []);

  const sendNotification = useCallback(() => {
    sendSocketMessage({ type: 'mensaje_new' });
  }, [sendSocketMessage]);

  return { socketRef, sendSocketMessage, sendNotification };
}
