import type { Dispatch, SetStateAction } from 'react';

import type { NotificationItemProps } from './notification-item';

function buildNotification(noti: any): NotificationItemProps {
  switch (noti?.type) {
    case 'mensaje_new': {
      const { orden_id: orden } = noti.data;
      const { usuario, id, created_at } = noti.data.mensaje;
      return {
        id: `${id}`,
        type: 'mensaje_new',
        title: `Nuevo mensaje en orden #${orden}`,
        category: usuario?.username || 'Usuario desconocido',
        avatarUrl: null,
        isUnRead: true,
        createdAt: created_at ?? new Date().toISOString(),
      };
    }
    case 'orden_create': {
      const orden = noti.data;
      return {
        id: `${orden?.id}`,
        type: 'orden_create',
        title: `Nueva orden creada: "${orden?.titulo}"`,
        category: orden?.cliente?.username || 'Usuario desconocido',
        avatarUrl: null,
        isUnRead: true,
        createdAt: orden?.created_at ?? new Date().toISOString(),
      };
    }
    case 'orden_update': {
      const orden = noti.data;
      return {
        id: `${orden?.id}`,
        type: 'orden_update',
        title: `Orden actualizada: "${orden?.titulo}"`,
        category: `Estado: ${orden?.estado ?? 'Desconocido'}`,
        avatarUrl: null,
        isUnRead: true,
        createdAt: orden?.updated_at ?? new Date().toISOString(),
      };
    }
    case 'orden_delete': {
      const orden = noti.data;
      return {
        id: `${orden?.id}`,
        type: 'orden_delete',
        title: `Orden eliminada: "${orden?.titulo}"`,
        category: orden?.cliente?.username || 'Usuario desconocido',
        avatarUrl: null,
        isUnRead: true,
        createdAt: new Date().toISOString(),
      };
    }
    default:
      return {
        id: `${Date.now()}-${noti?.type}`,
        type: noti?.type ?? 'general',
        title: 'Notificación desconocida',
        category: noti?.category ?? 'default',
        avatarUrl: null,
        isUnRead: true,
        createdAt: new Date().toISOString(),
      };
  }
}

export function handleSocketMessage(
  noti: any,
  setNotifications: Dispatch<SetStateAction<NotificationItemProps[]>>
) {
  setNotifications((prev) => [buildNotification(noti), ...prev]);
}

export function markNotificationAsRead(
  id: string,
  setNotifications: Dispatch<SetStateAction<NotificationItemProps[]>>
) {
  setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isUnRead: false } : n)));
}

export function markAllAsRead(setNotifications: Dispatch<SetStateAction<NotificationItemProps[]>>) {
  setNotifications((prev) => prev.map((n) => ({ ...n, isUnRead: false })));
}
