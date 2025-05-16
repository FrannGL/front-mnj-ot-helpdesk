import type { User } from 'src/modules/users/interfaces';

import { toast } from 'sonner';
import { useState } from 'react';
import { m } from 'framer-motion';

import { Edit, Delete, MoreVert } from '@mui/icons-material';
import { Box, Menu, useTheme, MenuItem, Typography, IconButton } from '@mui/material';

import { useTasks } from 'src/hooks/useTasks';

import { useTaskActions } from 'src/store/useTaskStore';

import { ConfirmationModal } from 'src/components/ConfirmationModal';

import { TaskModal } from './TaskModal';
import { statusColorMap } from '../utils/statusColorsMap';

import type { Task } from '../interfaces';
import type { CreateTaskType } from '../schemas/task.schema';

interface TaskRowProps {
  task: Task;
  open: boolean;
}

export function TaskRow({ task, open }: TaskRowProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Partial<CreateTaskType> | null>(null);

  const { setSelectedTask } = useTaskActions();
  const { deleteMutation } = useTasks();

  const theme = useTheme();

  const color = statusColorMap[task.estado];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditTaskData({
      ...task,
      cliente: task.cliente.id,
      agentes: task.agentes.map((agente: User) => agente.id),
      titulo: task.titulo,
      estado: task.estado,
      prioridad: task.prioridad,
    });
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(task.id, {
      onSuccess: (response) => {
        if (response.status === 200) {
          toast.success('Orden eliminada exitosamente.');
        }
      },
    });
    setConfirmationOpen(false);
    handleMenuClose();
  };

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

      <Typography
        variant="body2"
        sx={{
          pl: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '70%',
        }}
      >
        {task.titulo}
      </Typography>

      <IconButton onClick={handleMenuOpen} sx={{ ml: 'auto' }}>
        <MoreVert />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} color="error" />
          Eliminar
        </MenuItem>
      </Menu>

      <TaskModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        defaultValues={editTaskData ?? undefined}
        taskId={task.id}
        type="edit"
      />

      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
