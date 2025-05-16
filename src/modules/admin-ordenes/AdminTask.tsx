'use client';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Edit, Delete, SupportAgent } from '@mui/icons-material';
import {
  Box,
  Chip,
  Table,
  Paper,
  Stack,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Pagination,
  IconButton,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useTasks } from 'src/hooks/useTasks';

import { fDate } from 'src/utils/format-time';

import { CreateButton } from 'src/components/CreateButton';
import { ConfirmationModal } from 'src/components/ConfirmationModal';

import { TaskModal } from '../tasks/components/TaskModal';
import { FiltersContainer } from '../tasks/components/FiltersContainer';
import {
  applyFilters,
  getStatusIcon,
  getPriorityIcon,
  statusChipColorMap,
  priorityChipColorMap,
} from '../tasks/utils';

import type { Task } from '../tasks/interfaces';
import type { TaskStatus } from '../tasks/enums';
import type { TaskFilters } from '../tasks/types';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export function AdminTask() {
  const { data, isLoading, deleteMutation } = useTasks();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({
    status: null,
    priority: null,
    assignedTo: null,
    searchTerm: '',
  });

  const rowsPerPage = 10;

  const theme = useTheme();

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = (taskId: number) => {
    setSelectedTaskId(taskId);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTaskId) {
      deleteMutation.mutate(selectedTaskId, {
        onSuccess: () => {
          toast.success('Tarea eliminada exitosamente');
          setConfirmationOpen(false);
        },
      });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredTasks = useMemo(
    () => (data?.results ? applyFilters(data.results, filters) : []),
    [data?.results, filters]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.results.length) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>No hay tareas disponibles</Typography>
        </Box>
        <CreateButton type="task" />
      </>
    );
  }

  const paginatedTasks = filteredTasks.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

  return (
    <Stack sx={{ px: 3 }} spacing={1}>
      <Typography
        variant="h4"
        sx={{ fontFamily: `${firaSans.style.fontFamily} !important`, lineHeight: 1.3, pl: 1 }}
        gutterBottom
      >
        Administrar Tareas
      </Typography>
      <FiltersContainer tasks={data.results} onFiltersChange={handleFiltersChange} />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Agentes Asignados</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTasks.map((task) => (
              <TableRow
                key={task.id}
                sx={{
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  },
                }}
              >
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {task.titulo}
                </TableCell>
                <TableCell>{task.cliente.username}</TableCell>
                <TableCell>
                  <Chip
                    label={task.estado_display ?? 'N/A'}
                    color={statusChipColorMap[task.estado as TaskStatus] ?? 'default'}
                    icon={getStatusIcon(task.estado as TaskStatus)}
                    size="small"
                    variant="soft"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.prioridad_display}
                    color={priorityChipColorMap[task.prioridad]}
                    icon={getPriorityIcon(task.prioridad)}
                    size="small"
                    variant="soft"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" flexWrap="wrap" spacing={0.5}>
                    {task.agentes.map((agent) => (
                      <Chip
                        key={agent.id}
                        label={agent.username}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        icon={<SupportAgent />}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell> {fDate(task.created_at, 'DD-MM-YYYY h:mm a')} </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(task)}
                    color={theme.palette.mode === 'dark' ? 'inherit' : 'primary'}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <TaskModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        type="edit"
        taskId={selectedTask?.id ?? 0}
        defaultValues={{
          cliente: selectedTask?.cliente.id,
          agentes: selectedTask?.agentes.map((agent) => agent.id) ?? [],
          titulo: selectedTask?.titulo,
          estado: selectedTask?.estado,
          prioridad: selectedTask?.prioridad,
        }}
      />

      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CreateButton type="task" />
    </Stack>
  );
}
