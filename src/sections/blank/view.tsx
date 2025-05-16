'use client';

import { useState, useEffect } from 'react';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { useTasks } from 'src/hooks/useTasks';

import { useTaskStore } from 'src/store/useTaskStore';
import { TaskList } from 'src/modules/tasks/components/TaskList';
import { TaskChatView } from 'src/modules/tasks/components/TaskChatView';
import { FiltersContainer } from 'src/modules/tasks/components/FiltersContainer';

// ----------------------------------------------------------------------

export function OrdenesView() {
  const { data, isLoading } = useTasks();

  const [openDialog, setOpenDialog] = useState(false);

  const { selectedTask } = useTaskStore();

  useEffect(() => {
    if (selectedTask) setOpenDialog(true);
  }, [selectedTask]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.results.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography>No hay tareas disponibles</Typography>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={2} sx={{ px: 4 }}>
      <Stack direction="column" sx={{ flex: 1 }}>
        <FiltersContainer tasks={data.results ?? []} />
        <Box sx={{ width: '100%', pt: 4 }}>
          <TaskList tasks={data.results ?? []} open={openDialog} />
        </Box>

        {selectedTask && (
          <TaskChatView
            task={selectedTask}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />
        )}
      </Stack>
    </Stack>
  );
}
