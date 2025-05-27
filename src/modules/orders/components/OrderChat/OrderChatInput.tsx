import { toast } from 'sonner';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Send, AttachFile, AutoAwesome } from '@mui/icons-material';
import { Box, useTheme, InputBase, IconButton, useMediaQuery, DialogActions } from '@mui/material';

import { useOrders, useOrderById, useOrderSocket } from '../../hooks';

type Props = {
  orderId: number;
};

export function OrderChatInput({ orderId }: Props) {
  const { data } = useOrderById(orderId);

  const order = data?.data;

  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const { sendMessageMutation } = useOrders();

  const clearFile = () => setArchivo(null);

  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const { sendSocketMessage } = useOrderSocket(orderId, (nuevoMensaje) => {
    queryClient.setQueryData(['order', orderId], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        data: {
          ...oldData.data,
          mensajes: [...oldData.data.mensajes, nuevoMensaje],
        },
      };
    });
  });

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() && !archivo) return;

    const msgPayload = {
      type: 'mensaje_new',
      mensaje: {
        texto: mensaje,
        usuario: order.cliente.id,
        adjuntos: archivo ? [archivo.name] : [],
      },
    };

    sendSocketMessage(msgPayload);

    sendMessageMutation.mutate(
      {
        orderId: order.id,
        message: {
          texto: mensaje,
          usuario: order.cliente.id,
          adjuntos: archivo ? [archivo] : [],
        },
      },
      {
        onSuccess: () => {
          setMensaje('');
          setArchivo(null);
        },
        onError: () => {
          toast.error('Error al enviar el mensaje');
        },
      }
    );
  };

  return (
    <DialogActions sx={{ pt: 1, px: 2 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          p: isMobile ? 0.5 : 1,
          mt: isMobile ? 1 : 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 2,
          bgcolor: theme.vars.palette.background.paper,
          boxShadow: theme.shadows[1],
          border: `1px solid ${
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }`,
          height: isMobile ? 60 : 80,
          position: 'relative',
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

        {archivo && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              background: theme.palette.primary.main,
              p: 1,
              borderRadius: 1,
              boxShadow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#fff',
            }}
          >
            <AttachFile fontSize="small" />
            <span>{archivo.name}</span>
            <IconButton size="small" onClick={() => clearFile()} color="inherit">
              ×
            </IconButton>
          </Box>
        )}

        <IconButton
          onClick={() => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.onchange = (event) => {
              const { files } = event.target as HTMLInputElement;
              if (files && files.length > 0) {
                setArchivo(files[0]);
                toast.success('Archivo adjuntado correctamente');
              }
            };
            fileInput.click();
          }}
          color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
        >
          <AttachFile />
        </IconButton>

        <IconButton type="submit" color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}>
          <Send />
        </IconButton>

        <IconButton
          color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
          onClick={() => {
            console.log('IA clicked');
          }}
        >
          <AutoAwesome />
        </IconButton>
      </Box>
    </DialogActions>
  );
}
