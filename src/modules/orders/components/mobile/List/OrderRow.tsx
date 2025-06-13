import type { Order } from 'src/modules/orders/interfaces';

import { m } from 'framer-motion';

import { Box, Chip, Stack, Divider, useTheme, Typography, Grid } from '@mui/material';

import { statusColorMap, priorityChipColorMap } from 'src/modules/orders/utils';

interface OrderRowProps {
  order: Order;
  onOrderClick?: (id: number) => void;
  index?: number;
}

const MotionBox = m(Box);

const OrderRow = ({ order, onOrderClick, index = 0 }: OrderRowProps) => {
  const theme = useTheme();
  const color = statusColorMap[order.estado];

  return (
    <MotionBox
      onClick={() => onOrderClick?.(order.id)}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1,
        width: '100%',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        color: 'inherit',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        borderRadius: 1,
        '&:hover': {
          bgcolor: theme.vars.palette.action.hover,
        },
      }}
    >
      <Box position="relative" width={16} height={16} flexShrink={0}>
        <Box
          component={m.div}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'circIn' }}
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(4px)',
            zIndex: 0,
          }}
        />

        <Box
          component={m.div}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '100%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: color,
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        />
      </Box>

      <Grid container>
        <Grid item xs={3.5} alignSelf="center">
          <Typography
            variant="caption"
            sx={{
              color,
              fontWeight: 'medium',
              pl: 1.5,
            }}
          >
            {order.estado_display}
          </Typography>
        </Grid>

        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderStyle: 'dashed',
              height: '100%',
            }}
          />
        </Grid>

        <Grid item xs={7.5}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {order.titulo}
          </Typography>

          <Stack
            width="100%"
            direction="row"
            spacing={1}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.vars.palette.text.secondary,
              }}
            >
              {order.cliente?.username ?? 'Desconocido'}
            </Typography>
            <Chip
              label={`Prioridad ${order.prioridad_display}`}
              color={priorityChipColorMap[order.prioridad]}
              size="small"
              variant="soft"
              sx={{ fontSize: 10 }}
            />
          </Stack>
        </Grid>
      </Grid>
    </MotionBox>
  );
};

export default OrderRow;
