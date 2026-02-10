import type { User } from 'src/modules/users/interfaces';
import type { CreateUserType, UpdateUserType } from 'src/modules/users/schemas/user.schema';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { request } from 'src/services/request';
import {
  updateUserInClerk,
  createUserInClerk,
  deleteUserFromClerk,
  toggleUserStatusInClerk,
} from 'src/modules/users/actions/clerkActions';

async function createUser(newUser: CreateUserType): Promise<User> {
  const clerkResult = await createUserInClerk({
    email: newUser.email,
    password: newUser.password,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  });

  if (!clerkResult.success) {
    throw new Error(clerkResult.error || 'Error creating user in Clerk');
  }

  const dataToSend = {
    clerk_id: clerkResult.user?.id,
    username: newUser.username,
    email: newUser.email,
    groups: newUser.groups,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    password: newUser.password,
  };

  const response = await request('usuarios', 'POST', dataToSend);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function updateUser({
  userId,
  clerkId,
  updatedUser,
}: {
  userId: number;
  clerkId: string;
  updatedUser: UpdateUserType;
}): Promise<User> {
  const clerkData = {
    username: updatedUser.username,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
  };

  await updateUserClerk(clerkId, clerkData);

  const dataToSend = {
    username: updatedUser.username,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    groups: updatedUser.groups,
  };

  const response = await request(`usuarios/${userId}`, 'PATCH', dataToSend);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

async function updateUserClerk(clerkId: string, userData: Partial<User>) {
  // Only send Clerk-specific fields, exclude email and other non-updatable fields
  const clerkData = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
  };

  const result = await updateUserInClerk(clerkId, clerkData);
  if (!result.success) {
    throw new Error(result.error || 'Error updating user in Clerk');
  }
  return result;
}

async function deleteUserClerk(clerkId: string) {
  const result = await deleteUserFromClerk(clerkId);
  if (!result.success) {
    throw new Error(result.error || 'Error deleting user from Clerk');
  }
  return result;
}

async function toggleUserStatus(clerkId: string, isActive: boolean) {
  const result = await toggleUserStatusInClerk(clerkId, isActive);
  if (!result.success) {
    throw new Error(result.error || 'Error toggling user status in Clerk');
  }
  return result;
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

  const updateClerkMutation = useMutation({
    mutationFn: ({ clerkId, userData }: { clerkId: string; userData: Partial<User> }) =>
      updateUserClerk(clerkId, userData),
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

  const deleteClerkMutation = useMutation({
    mutationFn: deleteUserClerk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ clerkId, isActive }: { clerkId: string; isActive: boolean }) =>
      toggleUserStatus(clerkId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    updateClerkMutation,
    deleteMutation,
    deleteClerkMutation,
    toggleStatusMutation,
  };
}
