import type { User } from 'src/modules/users/interfaces';
import type { CreateUserType } from 'src/modules/users/schemas/user.schema';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { request } from 'src/services/request';

interface ServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

async function fetchUsers(): Promise<ServerResponse> {
  const response = await request(`/usuarios`, 'GET');

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

async function createUser(newUser: CreateUserType): Promise<User> {
  const dataToSend = {
    username: newUser.username,
    password: 'admin123',
    email: newUser.email,
    groups: newUser.groups,
  };
  const response = await request('/usuarios', 'POST', dataToSend);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function updateUser({
  userId,
  updatedUser,
}: {
  userId: number;
  updatedUser: CreateUserType;
}): Promise<User> {
  const dataToSend = {
    username: updatedUser.username,
    email: updatedUser.email,
  };
  const response = await request(`/usuarios/${userId}`, 'PATCH', dataToSend);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function deleteUser(userId: number) {
  const response = await request(`/usuarios/${userId}`, 'DELETE');
  if (response.error) {
    throw new Error(response.error);
  }
  return response;
}

export function useUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
