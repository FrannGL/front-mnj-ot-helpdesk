'use client';

import { useState, useEffect } from 'react';

import { Box, Stack } from '@mui/material';

import { useTaskStore } from 'src/store/useTaskStore';
import { mockTasks } from 'src/modules/tasks/data/mock';
import { TaskList } from 'src/modules/tasks/components/TaskList';
import { TaskChatView } from 'src/modules/tasks/components/TaskChatView';
import { FiltersContainer } from 'src/modules/tasks/components/FiltersContainer';

// ----------------------------------------------------------------------

export function OrdenesView() {
  const [openDialog, setOpenDialog] = useState(false);

  const { selectedTask } = useTaskStore();

  useEffect(() => {
    if (selectedTask) setOpenDialog(true);
  }, [selectedTask]);

  return (
    <Stack direction="row" spacing={2} sx={{ px: 4 }}>
      <Stack direction="column" sx={{ flex: 1 }}>
        <FiltersContainer tasks={mockTasks} />
        <Box sx={{ width: '100%', pt: 4 }}>
          <TaskList tasks={mockTasks} open={openDialog} />
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
