'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/shared/components/minimal/label';
import { Iconify } from 'src/shared/components/minimal/iconify';
import { varHover } from 'src/shared/components/minimal/animate';
import { useBoolean } from 'src/shared/hooks/minimal/use-boolean';
import { Scrollbar } from 'src/shared/components/minimal/scrollbar';
import { CustomTabs } from 'src/shared/components/minimal/custom-tabs';
import { useNotificationsSocket } from 'src/shared/hooks/custom/useNotificationSocket';

import { NotificationItem } from './notification-item';

import type { NotificationItemProps } from './notification-item';

// ----------------------------------------------------------------------

type TabValue = 'all' | 'unread';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
];

// ----------------------------------------------------------------------

export type NotificationsDrawerProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

export function NotificationsDrawer({ data = [], sx, ...other }: NotificationsDrawerProps) {
  const drawer = useBoolean();

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const [notifications, setNotifications] = useState(data);

  const onMessage = useCallback((noti: any) => {
    if (noti?.type === 'mensaje_new') {
      const orden = noti.data?.orden_id;
      const mensaje = noti.data?.mensaje;
      const usuario = mensaje?.usuario;

      const newNotification: NotificationItemProps = {
        id: `${mensaje?.id}`,
        type: 'mensaje_new',
        title: `Nuevo mensaje en orden #${orden}`,
        category: usuario?.username || 'Usuario desconocido',
        isUnRead: true,
        avatarUrl: null,
        createdAt: mensaje?.created_at ?? new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    } else if (noti?.type === 'orden_create') {
      const orden = noti.data;
      const cliente = orden?.cliente;

      const newNotification: NotificationItemProps = {
        id: `${orden?.id}`,
        type: 'orden_create',
        title: `Nueva orden creada: "${orden?.titulo}"`,
        category: cliente?.username || 'Usuario desconocido',
        isUnRead: true,
        avatarUrl: null,
        createdAt: orden?.created_at ?? new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    } else if (noti?.type === 'orden_update') {
      const orden = noti.data;

      const newNotification: NotificationItemProps = {
        id: `${orden?.id}`,
        type: 'orden_update',
        title: `Orden actualizada: "${orden?.titulo}"`,
        category: `Estado: ${orden?.estado ?? 'Desconocido'}`,
        isUnRead: true,
        avatarUrl: null,
        createdAt: orden?.updated_at ?? new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    } else if (noti?.type === 'orden_delete') {
      const orden = noti.data;
      const cliente = orden?.cliente;

      const newNotification: NotificationItemProps = {
        id: `${orden?.id}`,
        type: 'orden_delete',
        title: `Orden eliminada: "${orden?.titulo}"`,
        category: cliente?.username || 'Usuario desconocido',
        isUnRead: true,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    } else {
      const newNotification: NotificationItemProps = {
        id: `${Date.now()}-${noti?.type}`,
        type: noti?.type ?? 'general',
        title: `Notificación desconocida`,
        category: noti?.category ?? 'default',
        isUnRead: true,
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    }
  }, []);

  useNotificationsSocket({ onMessage });

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const counts: Record<TabValue, number> = {
    all: notifications.length,
    unread: notifications.filter((n) => n.isUnRead).length,
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isUnRead: false })));
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton
            color="primary"
            onClick={() => {
              drawer.onTrue();
              handleMarkAllAsRead();
            }}
          >
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={drawer.onFalse} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:settings-bold-duotone" />
      </IconButton>
    </Stack>
  );

  const renderTabs = (
    <CustomTabs variant="fullWidth" value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={tab.value === 'unread' ? 'info' : 'default'}
            >
              {counts[tab.value as 'all' | 'unread'] ?? 0}
            </Label>
          }
        />
      ))}
    </CustomTabs>
  );

  const renderList = (
    <Scrollbar>
      <Box component="ul">
        {notifications?.map((notification) => (
          <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
            <NotificationItem notification={notification} />
          </Box>
        ))}
      </Box>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={drawer.onTrue}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <SvgIcon>
            {/* https://icon-sets.iconify.design/solar/bell-bing-bold-duotone/ */}
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
      >
        {renderHead}

        {renderTabs}

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            View all
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
