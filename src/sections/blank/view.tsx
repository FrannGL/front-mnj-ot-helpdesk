'use client';

import { Box, Stack, Typography } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { useTaskStore } from 'src/store/useTaskStore';
import { mockTasks } from 'src/modules/tasks/data/mock';
import { TaskChatView } from 'src/modules/tasks/components/TaskChatView';
import { FiltersContainer } from 'src/modules/tasks/components/FiltersContainer';

// ----------------------------------------------------------------------

export function BlankView() {
  const { selectedTask } = useTaskStore();

  return (
    <Stack direction="column" sx={{ px: 5 }}>
      <FiltersContainer tasks={mockTasks} />
      {selectedTask ? (
        <TaskChatView task={selectedTask} />
      ) : (
        <Box
          sx={{
            mt: 2,
            width: '100%',
            height: '72vh',
            borderRadius: 2,
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
            border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            px: 5,
          }}
        >
          <Typography>Selecciona una tarea para ver el chat.</Typography>
        </Box>
      )}
    </Stack>
  );
}
