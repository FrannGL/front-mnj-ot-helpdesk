import type { Task } from 'src/types/interfaces';

import { Box } from '@mui/material';

import { TaskRow } from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  isNavMini: boolean;
}

export function TaskList({ tasks, isNavMini }: TaskListProps) {
  return (
    <Box sx={{ px: isNavMini ? 1.5 : 2 }}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} isNavMini={isNavMini} />
      ))}
    </Box>
  );
}
