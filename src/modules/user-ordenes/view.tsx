'use client';

import type { TaskFilters } from 'src/modules/tasks/types';

import { useMemo, useState } from 'react';
import { Fira_Sans } from 'next/font/google';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { useTasks, useTaskById } from 'src/hooks/useTasks';

import { applyFilters } from 'src/modules/tasks/utils';
import { TaskList } from 'src/modules/tasks/components/TaskList';
import { FiltersContainer } from 'src/modules/tasks/components/FiltersContainer';

import { CreateButton } from 'src/components/CreateButton';

import { OrderChat } from '../tasks/components';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
});

// ----------------------------------------------------------------------

export function OrdenesView() {
  const { data, isLoading } = useTasks();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: null,
    priority: null,
    assignedTo: null,
    searchTerm: '',
  });

  const { data: selectedTask } = useTaskById(selectedTaskId);

  const filteredTasks = useMemo(
    () => (data?.results ? applyFilters(data.results, filters) : []),
    [data?.results, filters]
  );

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setOpenDialog(true);
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

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

  return (
    <Stack direction="row" spacing={2} sx={{ px: 4 }}>
      <Stack direction="column" sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: `${firaSans.style.fontFamily} !important`,
            lineHeight: 1.3,
            pl: 1,
            mb: 2,
          }}
          gutterBottom
        >
          Listado de Ordenes
        </Typography>
        <FiltersContainer tasks={data.results} onFiltersChange={handleFiltersChange} />
        <Box sx={{ width: '100%', pt: 1 }}>
          <TaskList tasks={filteredTasks ?? []} onTaskClick={handleTaskClick} />
        </Box>

        {selectedTask && (
          <OrderChat
            task={selectedTask.data}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />
        )}
      </Stack>
      <CreateButton type="task" />
    </Stack>
  );
}
