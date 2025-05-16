import { m } from 'framer-motion';

import { Box, Chip, Stack, Divider, useTheme, Typography } from '@mui/material';

import { useTaskActions } from 'src/store/useTaskStore';

import { priorityChipColorMap } from '../utils';
import { statusColorMap } from '../utils/statusColorsMap';

import type { Task } from '../interfaces';

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const { setSelectedTask } = useTaskActions();
  const theme = useTheme();
  const color = statusColorMap[task.estado];

  return (
    <Box
      onClick={() => setSelectedTask(task)}
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
        borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        borderRadius: 1,
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shortest,
        }),
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

      <Stack width="100%" direction="row" spacing={1} alignItems="center">
        <Typography
          variant="caption"
          sx={{
            color,
            fontWeight: 'medium',
            width: 70,
            pl: 1.5,
          }}
        >
          {task.estado_display}
        </Typography>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderStyle: 'dashed',
            mx: 1,
          }}
        />

        <Stack width="100%" direction="column" spacing={0.5}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '70%',
            }}
          >
            {task.titulo}
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
              {task.cliente?.username ?? 'Desconocido'}
            </Typography>
            <Chip
              label={`Prioridad ${task.prioridad_display}`}
              color={priorityChipColorMap[task.prioridad]}
              // icon={getPriorityIcon(task.prioridad)}
              size="small"
              variant="soft"
              sx={{ fontSize: 10 }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
