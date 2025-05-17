'use client';

import { Fira_Sans } from 'next/font/google';

import { Close } from '@mui/icons-material';
import { Stack, Dialog, IconButton, Typography, DialogTitle, useMediaQuery } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { OrderChatInput } from './OrderChatInput';
import { OrderChatContent } from './OrderChatContent';

import type { Order } from '../../interfaces';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

type Props = {
  order: Order;
  open: boolean;
  onClose: () => void;
};

export function OrderChat({ order, open, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 0, pt: isMobile ? 3 : 2 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>

        <Stack direction="column" sx={{ mb: isMobile ? 1 : 2, mt: isMobile ? 3 : 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: `${firaSans.style.fontFamily} !important`,
              lineHeight: 1.3,
              fontSize: isMobile ? '1.3rem' : '2rem',
            }}
          >
            {order.titulo ?? 'Sin título'}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ pt: isMobile ? 0.8 : 0 }}>
            Creado por <strong>{order.cliente?.username ?? 'Desconocido'}</strong> el{' '}
            {fDate(order.created_at, 'DD-MM-YYYY h:mm a')}
          </Typography>
        </Stack>
      </DialogTitle>

      <OrderChatContent order={order} />

      <OrderChatInput order={order} />
    </Dialog>
  );
}
