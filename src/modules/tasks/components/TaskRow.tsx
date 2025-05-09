import { m } from 'framer-motion';

import { Box, Typography } from '@mui/material';

import { TaskStatus } from '../enums';

import type { Task } from '../interfaces';

interface TaskRowProps {
  task: Task;
  isNavMini: boolean;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.PENDIENTE]: '#FFC107',
  [TaskStatus['EN PROCESO']]: '#2196F3',
  [TaskStatus.RESUELTO]: '#4CAF50',
  [TaskStatus.CANCELADO]: '#F44336',
};

export function TaskRow({ task, isNavMini }: TaskRowProps) {
  const color = statusColorMap[task.status];

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
      py={1}
      sx={{ borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}` }}
    >
      <Box position="relative" width={16} height={16} flexShrink={0}>
        <Box
          component={m.div}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'circIn',
          }}
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
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
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

      <Typography
        variant="body2"
        sx={{
          pl: 2,
          ...(isNavMini && {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 100,
          }),
        }}
      >
        {task.title}
      </Typography>
    </Box>
  );
}
