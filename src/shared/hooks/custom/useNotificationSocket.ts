import { useRef, useEffect } from 'react';

import { CONFIG } from 'src/config';
import { buildWebSocketUrl } from 'src/shared/utils/buildWebsocketUrl';

type NotificationType = 'orden_create' | 'orden_update' | 'orden_delete' | 'mensaje_new';

interface NotificationMessage {
  type: NotificationType;
  payload: any;
}

interface UseNotificationsSocketProps {
  onMessage: (message: NotificationMessage) => void;
}

export function useNotificationsSocket({ onMessage }: UseNotificationsSocketProps) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (socketRef.current) return undefined;

    const wsUrl = buildWebSocketUrl(CONFIG.site.serverJST, undefined, true);
    console.log('[Socket] Intentando conectar a:', wsUrl);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      // console.log('[Socket abierto] Conectado a notificaciones de órdenes');
    };

    socket.onmessage = (event) => {
      // console.log('[Socket mensaje recibido]', event.data);
      try {
        const rawData = JSON.parse(event.data);

        if (rawData?.message?.type) {
          // console.log(
          //   '[Socket] Tipo de mensaje:',
          //   rawData.message.type,
          //   'Payload:',
          //   rawData.message.data
          // );
          onMessage(rawData.message);
        } else {
          console.warn('[Socket] Mensaje recibido sin "type":', rawData);
        }
      } catch (error) {
        console.error(
          '[Socket] Error al parsear mensaje del socket:',
          error,
          'Contenido:',
          event.data
        );
      }
    };

    socket.onerror = (error) => {
      // console.error('[Socket error]', error);
    };

    socket.onclose = (event) => {
      // console.log(
      //   `[Socket cerrado] Código: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`
      // );

      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        // console.log('[Socket] Cerrando conexión');
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [onMessage]);
}
