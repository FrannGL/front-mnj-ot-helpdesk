import type { Task } from '../interfaces';
import type { TaskStatus, TaskPriority } from '../enums';

export function filterTasks(
  tasks: Task[],
  selectedStatuses: TaskStatus[],
  selectedPriorities: TaskPriority[]
): Task[] {
  return tasks.filter((task) => {
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.estado);
    const priorityMatch =
      selectedPriorities.length === 0 || selectedPriorities.includes(task.prioridad);
    return statusMatch && priorityMatch;
  });
}
