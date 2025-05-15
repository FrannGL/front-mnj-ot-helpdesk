import type { Task } from 'src/modules/tasks/interfaces';

import { useQuery } from '@tanstack/react-query';

import { CONFIG } from 'src/config-global';

interface TaskResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

async function fetchTasks(): Promise<TaskResponse> {
  const response = await fetch(`${CONFIG.site.serverJST}/ordenes`);
  if (!response.ok) {
    throw new Error('Error al obtener las tareas');
  }
  return response.json();
}

export function useTasks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
  };
}
