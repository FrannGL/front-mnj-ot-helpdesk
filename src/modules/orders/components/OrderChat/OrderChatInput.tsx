import type { User } from 'src/modules/users/interfaces';

import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Send, AttachFile } from '@mui/icons-material';
import { Box, useTheme, InputBase, IconButton, useMediaQuery, DialogActions } from '@mui/material';

import { UserGroups } from 'src/modules/users/enums';
import { useUsers } from 'src/modules/users/hooks/useUsers';

import { useOrders, useOrderById, useOrderSocket } from '../../hooks';

import type { Message } from '../../interfaces';

type Props = {
  orderId: number;
};

type IncomingWSMessage = { message: string } | Partial<Message>;

export function OrderChatInput({ orderId }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const { data } = useOrderById(orderId);
  const order = data?.data;

  const { user } = useUser();
  const { data: users } = useUsers();
  const currentUser = users?.results.find((u) => u.clerk_id === user?.id);

  const queryClient = useQueryClient();
  const { sendMessageMutation } = useOrders();

  const clearFile = () => setArchivo(null);

  const handleNewMessage = useCallback(
    (incoming: IncomingWSMessage) => {
      const defaultUser: User = {
        id: 0,
        username: 'Sistema',
        email: '',
        groups: [{ id: UserGroups.DIRECTOR, name: 'Director' }],
        clerk_id: '',
      };

      const newMessage: Message = {
        id: Date.now(),
        texto: 'message' in incoming ? (incoming.message ?? '') : (incoming.texto ?? ''),
        usuario: defaultUser,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        adjuntos: [],
      };

      queryClient.setQueryData(['order', orderId], (oldData: any) => {
        if (!oldData) return oldData;

        const mensajes = oldData.data.mensajes ?? [];
        const lastMessage = mensajes[mensajes.length - 1];

        if (lastMessage?.texto === newMessage.texto) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            mensajes: [...mensajes, newMessage],
          },
        };
      });
    },
    [orderId, queryClient]
  );

  const { sendSocketMessage, sendNotification } = useOrderSocket(orderId, handleNewMessage);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      toast.success('Archivo adjuntado correctamente');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() && !archivo) return;

    sendSocketMessage({ message: mensaje });

    sendMessageMutation.mutate(
      {
        orderId,
        message: {
          texto: mensaje,
          usuario: currentUser?.id ?? order?.cliente.id,
          adjuntos: archivo ? [archivo] : [],
        },
      },
      {
        onSuccess: () => {
          sendNotification();
          setMensaje('');
          clearFile();
        },
        onError: () => {
          toast.error('Error al enviar el mensaje');
        },
      }
    );
  };

  if (!order) return null;

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
          sx={{ pl: 2, flexGrow: 1 }}
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
            <IconButton size="small" onClick={clearFile} color="inherit">
              ×
            </IconButton>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <IconButton
          onClick={handleAttachClick}
          color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
        >
          <AttachFile />
        </IconButton>

        <IconButton type="submit" color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}>
          <Send />
        </IconButton>

        {/* <IconButton
          color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
          onClick={() => console.log('IA clicked')}
        >
          <AutoAwesome />
        </IconButton> */}
      </Box>
    </DialogActions>
  );
}
