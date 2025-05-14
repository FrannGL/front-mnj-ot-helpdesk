'use client';

import { Stack, Typography } from '@mui/material';

import { useTaskStore } from 'src/store/useTaskStore';
import { mockTasks } from 'src/modules/tasks/data/mock';
import { TaskChatView } from 'src/modules/tasks/components/TaskChatView';
import { FiltersContainer } from 'src/modules/tasks/components/FiltersContainer';

// ----------------------------------------------------------------------

export function BlankView() {
  const { selectedTask } = useTaskStore();

  if (!selectedTask) return <Typography>Selecciona una tarea para ver el chat.</Typography>;

  return (
    <Stack direction="column" sx={{ px: 5 }}>
      <FiltersContainer tasks={mockTasks} />
      <TaskChatView task={selectedTask} />
    </Stack>
  );
}
