import { useRef, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config';

import { buildWebSocketUrl } from '../utils';

interface MessagePayload {
  type: string;
  mensaje: {
    id: number;
    texto: string;
    usuario: { id: number };
    created_at: string;
  };
}

export function useOrderSocket(
  orderId: number | null,
  onNewMessage: (message: MessagePayload['mensaje']) => void
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!orderId) {
      console.log('🚫 No orderId provided, skipping WebSocket connection.');
      return undefined;
    }

    const wsUrl = buildWebSocketUrl(CONFIG.site.serverJST, orderId);
    console.log(`🌐 Attempting WebSocket connection to: ${wsUrl}`);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(`📡 WebSocket connected for orden_${orderId}`);
    };

    socket.onmessage = (event) => {
      console.log('📩 WebSocket message received:', event.data);
      try {
        const data = JSON.parse(event.data);

        console.log(data);

        if (data.type === 'mensaje_new' && data.mensaje) {
          console.log('🆕 New message detected, invoking callback.', data.mensaje);
          onNewMessage(data.mensaje);
        } else if (data.message) {
          console.log(`ℹ️ Server message: ${data.message}`);
        } else {
          console.log('⚠️ Mensaje con formato desconocido:', data);
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
      }
    };

    socket.onclose = (event) => {
      console.log(`📡 WebSocket closed for orden_${orderId}`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    };

    socket.onerror = (err) => {
      console.error('⚠️ WebSocket error', err);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log(`🔒 Closing WebSocket for orden_${orderId}`);
        socket.close();
      } else {
        console.log(`ℹ️ WebSocket already closed or closing for orden_${orderId}`);
      }
    };
  }, [orderId, onNewMessage]);

  const sendSocketMessage = useCallback((msg: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
      console.log('📤 Sent message via WebSocket:', msg);
    } else {
      console.warn('⚠️ WebSocket is not open. Cannot send message:', msg);
    }
  }, []);

  return { socketRef, sendSocketMessage };
}
