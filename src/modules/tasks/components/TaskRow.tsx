import { useState } from 'react';
import { m } from 'framer-motion';

import { MoreVert } from '@mui/icons-material';
import { Box, Menu, alpha, useTheme, MenuItem, Typography, IconButton } from '@mui/material';

import { useTaskActions, useSelectedTask } from 'src/store/useTaskStore';

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
  const { setSelectedTask } = useTaskActions();
  const selectedTask = useSelectedTask();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const color = statusColorMap[task.estado];
  const isSelected = selectedTask?.id === task.id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Lógica para editar la tarea
    handleMenuClose();
  };

  const handleDelete = () => {
    // Lógica para eliminar la tarea
    handleMenuClose();
  };

  return (
    <Box
      component="button"
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
        color: isSelected ? '#fff' : 'inherit',
        borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        bgcolor: isSelected ? theme.palette.primary.main : 'transparent',
        borderRadius: 1,
        '&:hover': {
          bgcolor: isSelected
            ? alpha(theme.palette.primary.main, 0.2)
            : theme.vars.palette.action.hover,
        },
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shortest,
        }),
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

      <Typography
        variant="body2"
        sx={{
          pl: 2,
          fontWeight: isSelected ? 600 : 'normal',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 250,
        }}
      >
        {task.titulo}
      </Typography>

      <IconButton onClick={handleMenuOpen} sx={{ ml: 'auto' }}>
        <MoreVert />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
      </Menu>
    </Box>
  );
}
