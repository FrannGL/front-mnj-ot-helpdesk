import { TaskRow } from './TaskRow';

import type { Task } from '../interfaces';

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (id: number) => void;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  return (
    <>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
      ))}
    </>
  );
}
