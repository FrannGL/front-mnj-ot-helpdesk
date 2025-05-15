import type { Task } from 'src/modules/tasks/interfaces';
import type { CreateTaskType } from 'src/modules/tasks/schemas/task.schema';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from 'src/services/request';

interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

async function fetchTasks(): Promise<ServerResponse> {
  const response = await request(`/ordenes`, 'GET');

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

async function createTask(newTask: CreateTaskType): Promise<Task> {
  const response = await request('/ordenes', 'POST', newTask);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function updateTask({
  taskId,
  updatedTask,
}: {
  taskId: number;
  updatedTask: Partial<Task>;
}): Promise<Task> {
  const response = await request(`/ordenes/${taskId}`, 'PUT', updatedTask);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function deleteTask(taskId: number): Promise<void> {
  const response = await request(`/ordenes/${taskId}`, 'DELETE');
  if (response.error) {
    throw new Error(response.error);
  }
}

export function useTasks() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
