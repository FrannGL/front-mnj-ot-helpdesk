import { toast } from 'sonner';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Send, AttachFile, AutoAwesome } from '@mui/icons-material';
import { Box, useTheme, InputBase, IconButton, useMediaQuery, DialogActions } from '@mui/material';

import { useOrders } from '../../hooks/useOrders';

import type { Order } from '../../interfaces';

type Props = {
  order: Order;
};

export function OrderChatInput({ order }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const clearFile = () => setArchivo(null);

  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const { sendMessageMutation } = useOrders();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setArchivo(acceptedFiles[0]);
      toast.success('Archivo adjuntado correctamente');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() && !archivo) return;

    const adjuntos = archivo ? [archivo] : [];

    sendMessageMutation.mutate(
      {
        orderId: order.id,
        message: {
          texto: mensaje,
          usuario: order.cliente.id,
          adjuntos,
        },
      },
      {
        onSuccess: () => {
          setMensaje('');
          clearFile();
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
        {...getRootProps()}
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
            isDragActive
              ? theme.palette.primary.main
              : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)'
          }`,
          height: isMobile ? 60 : 80,
          cursor: 'text',
          position: 'relative',
        }}
      >
        <input {...getInputProps()} />

        <InputBase
          placeholder={isDragActive ? 'Suelta el archivo aquí...' : 'Escribe un mensaje...'}
          fullWidth
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onClick={(e) => e.stopPropagation()}
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
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              color="inherit"
            >
              ×
            </IconButton>
          </Box>
        )}

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
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

        <IconButton
          type="submit"
          color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
          onClick={(e) => e.stopPropagation()}
        >
          <Send />
        </IconButton>

        <IconButton
          color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
          onClick={(e) => {
            e.stopPropagation();
            console.log('IA clicked');
          }}
        >
          <AutoAwesome />
        </IconButton>
      </Box>
    </DialogActions>
  );
}
