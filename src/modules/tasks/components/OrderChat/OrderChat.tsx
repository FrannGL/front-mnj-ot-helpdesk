'use client';

import { Fira_Sans } from 'next/font/google';

import { Close } from '@mui/icons-material';
import { Stack, Dialog, IconButton, Typography, DialogTitle } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTaskActions } from 'src/store/useTaskStore';

import { OrderChatInput } from './OrderChatInput';
import { OrderChatContent } from './OrderChatContent';

import type { Task } from '../../interfaces';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

type Props = {
  task: Task;
  open: boolean;
  onClose: () => void;
};

export function OrderChat({ task, open, onClose }: Props) {
  const { setSelectedTask } = useTaskActions();

  const handleClose = () => {
    setSelectedTask(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 0 }}>
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

        <Stack direction="column" sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3 }}
          >
            {task.titulo ?? 'Sin título'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Creado por <strong>{task.cliente?.username ?? 'Desconocido'}</strong> el{' '}
            {fDate(task.created_at, 'DD-MM-YYYY h:mm a')}
          </Typography>
        </Stack>

        <OrderChatContent task={task} />
      </DialogTitle>

      <OrderChatInput task={task} />
    </Dialog>
  );
}
