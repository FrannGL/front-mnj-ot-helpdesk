import { TaskStatus, TaskPriority } from '../enums';

import type { Task } from '../interfaces';
import type { TaskFilters } from '../types';

export const applyFilters = (tasks: Task[], filters: TaskFilters): Task[] =>
  tasks.filter((task) => {
    const searchTerm = filters.searchTerm?.toLowerCase() || '';

    const matchesStatus = !filters.status || task.estado === filters.status;
    const matchesPriority = !filters.priority || task.prioridad === filters.priority;
    const matchesAssignedTo =
      !filters.assignedTo || task.agentes.some((agente) => agente.username === filters.assignedTo);

    const matchesSearch =
      !searchTerm ||
      task.titulo.toLowerCase().includes(searchTerm) ||
      task.agentes.some(
        (agente) =>
          agente.username.toLowerCase().includes(searchTerm) ||
          agente.username?.toLowerCase().includes(searchTerm)
      ) ||
      Object.entries(TaskPriority)
        .find(([key, value]) => value === task.prioridad)?.[0]
        .toLowerCase()
        .includes(searchTerm) ||
      Object.entries(TaskStatus)
        .find(([key, value]) => value === task.estado)?.[0]
        .toLowerCase()
        .includes(searchTerm);

    return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch;
  });
