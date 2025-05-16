import { TaskRow } from './TaskRow';

import type { Task } from '../interfaces';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </>
  );
}
