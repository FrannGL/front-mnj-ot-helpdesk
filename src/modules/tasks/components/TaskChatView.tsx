'use client';

import { Send, AutoAwesome } from '@mui/icons-material';
import {
  Box,
  Paper,
  Stack,
  Avatar,
  useTheme,
  InputBase,
  Typography,
  IconButton,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import type { Task } from '../interfaces';

type Props = {
  task: Task;
};

export function TaskChatView({ task }: Props) {
  const theme = useTheme();

  return (
    <Stack>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {task.titulo}
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 2,
          height: '60vh',
          bgcolor: theme.vars.palette.background.paper,
          borderRadius: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: '1px solid rgba(81, 81, 81, 0.1)',
          justifyContent: task.mensajes?.length ? 'flex-start' : 'center',
          alignItems: task.mensajes?.length ? 'stretch' : 'center',
        }}
      >
        {task.mensajes?.length ? (
          task.mensajes.map((msg) => {
            const isClient = msg.usuario.id === task.cliente.id;

            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: isClient ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 1.5,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={isClient ? '/avatars/client.png' : '/avatars/agent.png'}
                    alt={isClient ? 'Cliente' : 'Agente'}
                  />

                  <Box>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        mt: 2,
                        bgcolor: theme.vars.palette.background.neutral,
                        color: theme.vars.palette.text.primary,
                        borderRadius: 2,
                        maxWidth: 400,
                      }}
                    >
                      <Typography variant="body2">{msg.texto}</Typography>
                    </Paper>

                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        ml: isClient ? 1 : 'auto',
                        textAlign: 'right',
                        display: 'block',
                        fontSize: 10,
                        color: theme.vars.palette.text.secondary,
                      }}
                    >
                      {fDate(msg.created_at, 'DD-MM-YYYY h:mm a')}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })
        ) : (
          <Typography variant="body1" color="textSecondary">
            No hay mensajes disponibles.
          </Typography>
        )}
      </Paper>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        sx={{
          mt: 1,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: 2,
          bgcolor: theme.vars.palette.background.paper,
          boxShadow: theme.shadows[1],
          border: '1px solid rgba(81, 81, 81, 0.1)',
          height: '80px',
        }}
      >
        <InputBase
          placeholder="Escribe un mensaje..."
          fullWidth
          sx={{
            pl: 2,
            flexGrow: 1,
          }}
        />

        <IconButton type="submit" color="info">
          <Send />
        </IconButton>

        <IconButton color="default" onClick={() => console.log('IA clicked')}>
          <AutoAwesome />
        </IconButton>
      </Box>
    </Stack>
  );
}
