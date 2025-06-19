import type { User } from 'src/modules/users/interfaces';
import type { CreateUserType } from 'src/modules/users/schemas/user.schema';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from 'src/services/request';

async function createUser(newUser: CreateUserType): Promise<User> {
  const dataToSend = {
    username: newUser.username,
    password: 'admin123',
    email: newUser.email,
    groups: newUser.groups,
  };
  const response = await request('usuarios', 'POST', dataToSend);
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
  const response = await request(`usuarios/${userId}`, 'PATCH', dataToSend);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function deleteUser(userId: number) {
  const response = await request(`usuarios/${userId}`, 'DELETE');
  if (response.error) {
    throw new Error(response.error);
  }
  return response;
}

export function useUsersMutations() {
  const queryClient = useQueryClient();

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
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
