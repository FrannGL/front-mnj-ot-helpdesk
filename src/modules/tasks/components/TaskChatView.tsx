'use client';

import { Fira_Sans } from 'next/font/google';

import { Send, Close, AutoAwesome, SupportAgent } from '@mui/icons-material';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Avatar,
  Dialog,
  Tooltip,
  Divider,
  useTheme,
  InputBase,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTaskActions } from 'src/store/useTaskStore';

import { getStatusIcon, getPriorityIcon, statusChipColorMap, priorityChipColorMap } from '../utils';

import type { Task } from '../interfaces';
import type { TaskStatus, TaskPriority } from '../enums';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

type Props = {
  task: Task;
  open: boolean;
  onClose: () => void;
};

export function TaskChatView({ task, open, onClose }: Props) {
  const theme = useTheme();

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
            Creado por {task.cliente?.username ?? 'Desconocido'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" sx={{ mb: 2, mt: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Estado de la orden" arrow>
              <Chip
                label={task.estado_display ?? 'N/A'}
                color={statusChipColorMap[task.estado as TaskStatus] ?? 'default'}
                icon={getStatusIcon(task.estado as TaskStatus)}
                variant="outlined"
              />
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            <Tooltip title="Prioridad de la orden" arrow>
              <Chip
                label={`Prioridad ${task.prioridad_display ?? 'N/A'}`}
                color={priorityChipColorMap[task.prioridad as TaskPriority] ?? 'default'}
                icon={getPriorityIcon(task.prioridad as TaskPriority)}
                variant="outlined"
              />
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            {task.agentes && task.agentes.length > 0 ? (
              task.agentes.map((agente) => (
                <Tooltip key={agente.id} title="Agente asignado" arrow>
                  <Chip
                    label={agente.username ?? 'N/A'}
                    icon={<SupportAgent />}
                    color="secondary"
                    variant="outlined"
                  />
                </Tooltip>
              ))
            ) : (
              <Chip label="Sin agentes asignados" variant="outlined" color="default" />
            )}
          </Stack>

          <Stack direction="column" justifyContent="flex-end">
            <Typography variant="caption" color="textSecondary">
              Creado el {fDate(task.created_at, 'DD-MM-YYYY h:mm a')}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ position: 'relative', p: 3, pb: 0 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            pb: 0,
            height: '53vh',
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
                    <Tooltip
                      title={
                        isClient ? task.cliente.username : task.agentes[0]?.username ?? 'Agente'
                      }
                      arrow
                    >
                      <Avatar>
                        {isClient
                          ? task.cliente.username.charAt(0).toUpperCase()
                          : task.agentes[0]?.username?.charAt(0).toUpperCase() ?? 'A'}
                      </Avatar>
                    </Tooltip>

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
      </DialogContent>

      <DialogActions sx={{ pt: 1 }}>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            width: '100%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: 2,
            bgcolor: theme.vars.palette.background.paper,
            boxShadow: theme.shadows[1],
            border: '1px solid rgba(81, 81, 81, 0.1)',
            height: 80,
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

          <IconButton type="submit" color="primary">
            <Send />
          </IconButton>

          <IconButton color="default" onClick={() => console.log('IA clicked')}>
            <AutoAwesome />
          </IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
