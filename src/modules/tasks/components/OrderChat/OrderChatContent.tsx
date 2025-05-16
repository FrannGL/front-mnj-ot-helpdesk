import { SupportAgent } from '@mui/icons-material';
import {
  Box,
  Chip,
  Stack,
  Paper,
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  Typography,
  DialogContent,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import {
  getStatusIcon,
  getPriorityIcon,
  statusChipColorMap,
  priorityChipColorMap,
} from '../../utils';

import type { Task } from '../../interfaces';
import type { TaskStatus, TaskPriority } from '../../enums';

type Props = {
  task: Task;
};

export function OrderChatContent({ task }: Props) {
  const theme = useTheme();

  return (
    <>
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
      </Stack>

      <DialogContent sx={{ position: 'relative', pb: 0, px: 0 }}>
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
            border: `1px solid ${
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }`,
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
    </>
  );
}
