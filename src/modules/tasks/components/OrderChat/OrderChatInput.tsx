import { toast } from 'sonner';
import { useState } from 'react';

import { Send, AutoAwesome } from '@mui/icons-material';
import { Box, useTheme, InputBase, IconButton, DialogActions } from '@mui/material';

import { useTasks } from 'src/hooks/useTasks';

import type { Task } from '../../interfaces';

type Props = {
  task: Task;
};

export function OrderChatInput({ task }: Props) {
  const theme = useTheme();
  const [mensaje, setMensaje] = useState('');

  const { sendMessageMutation } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    sendMessageMutation.mutate(
      {
        taskId: task.id,
        message: {
          texto: mensaje,
          usuario: task.cliente.id,
        },
      },
      {
        onSuccess: () => {
          setMensaje('');
        },
        onError: () => {
          toast.error('Error al enviar el mensaje');
        },
      }
    );
  };

  return (
    <DialogActions sx={{ pt: 1 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 2,
          bgcolor: theme.vars.palette.background.paper,
          boxShadow: theme.shadows[1],
          border: `1px solid ${
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }`,
          height: 80,
        }}
      >
        <InputBase
          placeholder="Escribe un mensaje..."
          fullWidth
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          sx={{
            pl: 2,
            flexGrow: 1,
          }}
        />

        <IconButton type="submit" color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}>
          <Send />
        </IconButton>

        <IconButton color="default" onClick={() => console.log('IA clicked')}>
          <AutoAwesome />
        </IconButton>
      </Box>
    </DialogActions>
  );
}
