'use client';

import { useRouter } from 'next/navigation';
import { Fira_Sans } from 'next/font/google';
import { useQueryClient } from '@tanstack/react-query';

import { Close } from '@mui/icons-material';
import {
  Chip,
  Stack,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';

import { fDate } from 'src/shared/utils/format-time';

import { useOrderById } from '../../hooks';
import { OrderChatInput } from './OrderChatInput';
import { OrderChatContent } from './OrderChatContent';

import type { Tag } from '../../interfaces';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

type Props = {
  orderId: number;
  open: boolean;
  onClose: () => void;
};

const OrderChat = ({ orderId, open, onClose }: Props) => {
  const { data } = useOrderById(orderId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const order = data?.data;

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    router.refresh();
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 0, pt: isMobile ? 3 : 2 }}>
        <IconButton
          onClick={handleClose}
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
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Typography
              variant="h4"
              sx={{
                fontFamily: `${firaSans.style.fontFamily} !important`,
                lineHeight: 1.3,
                fontSize: isMobile ? '1.3rem' : '2rem',
              }}
            >
              {`#OT${order.id}`} | {order.titulo ?? 'Sin título'}
            </Typography>

            {order.tags?.length > 0 &&
              order.tags.map((tag: Tag, i: number) => (
                <Chip
                  key={`${tag.id}-${i}`}
                  label={`# ${tag.tag}`}
                  variant="soft"
                  color="secondary"
                  sx={{ width: 'fit-content' }}
                />
              ))}
          </Stack>

          {order.detalle && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
              Detalle: {order.detalle}
            </Typography>
          )}

          <Typography variant="caption" color="textSecondary" sx={{ pt: isMobile ? 0.8 : 0 }}>
            Solicitado por <strong>{order.cliente?.username ?? 'Desconocido'}</strong> el{' '}
            {fDate(order.created_at, 'DD-MM-YYYY h:mm a')}
          </Typography>
        </Stack>
      </DialogTitle>

      <OrderChatContent orderId={order.id} />

      <OrderChatInput orderId={order.id} />
    </Dialog>
  );
};

export default OrderChat;
