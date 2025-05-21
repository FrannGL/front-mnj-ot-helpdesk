import { useRef, useEffect } from 'react';

import { SupportAgent } from '@mui/icons-material';
import {
  Box,
  Grid,
  Chip,
  Stack,
  Paper,
  Avatar,
  Tooltip,
  useTheme,
  Typography,
  useMediaQuery,
  DialogContent,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import {
  getStatusIcon,
  getPriorityIcon,
  statusChipColorMap,
  priorityChipColorMap,
} from '../../utils';

import type { Order } from '../../interfaces';
import type { OrderStatusEnum, OrderPriorityEnum } from '../../enums';

type Props = {
  order: Order;
};

export function OrderChatContent({ order }: Props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [order.mensajes]);

  return (
    <>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        flexWrap="wrap"
        sx={{
          mb: 2,
          mt: 2,
          px: 2,

          gap: isMobile ? 1 : 0,
        }}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          sx={{
            my: 1,
            width: '100%',
          }}
        >
          <Grid container spacing={2} sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <Grid item xs={isMobile ? 6 : 'auto'}>
              <Tooltip title="Estado de la orden" arrow>
                <Chip
                  label={order.estado_display ?? 'N/A'}
                  color={statusChipColorMap[order.estado as OrderStatusEnum] ?? 'default'}
                  icon={getStatusIcon(order.estado as OrderStatusEnum)}
                  variant="outlined"
                  sx={{ minWidth: '150px' }}
                />
              </Tooltip>
            </Grid>

            <Grid item xs={isMobile ? 6 : 'auto'}>
              <Tooltip title="Prioridad de la orden" arrow>
                <Chip
                  label={`Prioridad ${order.prioridad_display ?? 'N/A'}`}
                  color={priorityChipColorMap[order.prioridad as OrderPriorityEnum] ?? 'default'}
                  icon={getPriorityIcon(order.prioridad as OrderPriorityEnum)}
                  variant="outlined"
                  sx={{ minWidth: '150px' }}
                />
              </Tooltip>
            </Grid>

            {order.agentes && order.agentes.length > 0 ? (
              order.agentes.map((agente) => (
                <Grid item xs={isMobile ? 6 : 'auto'} key={agente.id}>
                  <Tooltip title="Agente asignado" arrow>
                    <Chip
                      label={agente.username ?? 'N/A'}
                      icon={<SupportAgent />}
                      color="secondary"
                      variant="outlined"
                      sx={{ minWidth: '150px' }}
                    />
                  </Tooltip>
                </Grid>
              ))
            ) : (
              <Grid item xs={isMobile ? 12 : 'auto'}>
                <Chip
                  label="Sin agentes asignados"
                  variant="outlined"
                  color="default"
                  sx={{ minWidth: '150px' }}
                />
              </Grid>
            )}
          </Grid>
        </Stack>
      </Stack>

      <DialogContent sx={{ position: 'relative', pb: 0, px: 2 }}>
        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 1 : 2,
            pb: 0,
            height: isMobile ? 'calc(100vh - 475px)' : '53vh',
            bgcolor: theme.vars.palette.background.paper,
            borderRadius: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: `1px solid ${
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }`,
            justifyContent: order.mensajes?.length ? 'flex-start' : 'center',
            alignItems: order.mensajes?.length ? 'stretch' : 'center',
          }}
        >
          {order.mensajes?.length ? (
            <>
              {' '}
              {order.mensajes.map((msg) => {
                const isClient = msg.usuario.id === order.cliente.id;

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: isClient ? 'row' : 'row-reverse',
                      alignItems: 'flex-end',
                      gap: 1.5,
                      '& .MuiPaper-root': {
                        maxWidth: isMobile ? '100%' : 400,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Tooltip
                        title={
                          isClient ? order.cliente.username : order.agentes[0]?.username ?? 'Agente'
                        }
                        arrow
                      >
                        <Avatar
                          sx={{
                            width: isMobile ? 25 : 50,
                            height: isMobile ? 25 : 50,
                            fontSize: isMobile ? 13 : 15,
                          }}
                        >
                          {isClient
                            ? order.cliente.username.charAt(0).toUpperCase()
                            : order.agentes[0]?.username?.charAt(0).toUpperCase() ?? 'A'}
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
                            pb: 2,
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
              })}
              <div ref={messagesEndRef} />
            </>
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
