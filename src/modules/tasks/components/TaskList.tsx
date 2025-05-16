import { Box } from '@mui/material';

import { TaskRow } from './TaskRow';

import type { Task } from '../interfaces';

interface TaskListProps {
  tasks: Task[];
  open: boolean;
}

export function TaskList({ tasks, open }: TaskListProps) {
  return (
    <Box sx={{ px: 2 }}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} open={open} />
      ))}
    </Box>
  );
}
