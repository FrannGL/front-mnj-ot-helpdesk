'use server';

import type { User } from 'src/modules/users/interfaces';

import { clerkClient } from '@clerk/nextjs/server';

export async function createUserInClerk(userData: {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const client = await clerkClient();

    const createData: any = {
      emailAddress: [userData.email],
      password: userData.password,
      skipPasswordChecks: true,
    };

    if (userData.username) createData.username = userData.username;
    if (userData.firstName) createData.firstName = userData.firstName;
    if (userData.lastName) createData.lastName = userData.lastName;

    const newUser = await client.users.createUser(createData);

    const plainUser = {
      id: newUser.id,
      emailAddresses: newUser.emailAddresses.map((e) => e.emailAddress),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      imageUrl: newUser.imageUrl,
    };

    return { success: true, user: plainUser };
  } catch (error: any) {
    console.error('Full Clerk error:', JSON.stringify(error, null, 2));

    if (error.errors && Array.isArray(error.errors)) {
      return {
        success: false,
        error: error.errors.map((e: any) => e.longMessage || e.message).join(', '),
      };
    }

    return { success: false, error: error.message || 'Error creating user in Clerk' };
  }
}

export async function deleteUserFromClerk(clerkId: string) {
  try {
    const client = await clerkClient();
    await client.users.deleteUser(clerkId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user from Clerk:', error);
    return { success: false, error: 'Error deleting user from Clerk' };
  }
}

export async function updateUserInClerk(clerkId: string, userData: Partial<User>) {
  try {
    const client = await clerkClient();

    const updateData: any = {};

    if (userData.firstName) updateData.firstName = userData.firstName;
    if (userData.lastName) updateData.lastName = userData.lastName;
    if (userData.username) updateData.username = userData.username;

    const updatedUser = await client.users.updateUser(clerkId, updateData);

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('Full Clerk error:', JSON.stringify(error, null, 2));

    // Better error handling for username/email conflicts
    if (error.errors && Array.isArray(error.errors)) {
      const errorMessages = error.errors.map((e: any) => {
        if (e.code === 'form_identifier_exists' || e.code === 'username_taken') {
          return e.meta?.paramName === 'username'
            ? 'El nombre de usuario ya está en uso'
            : 'El email ya está en uso';
        }
        return e.longMessage || e.message;
      });
      return { success: false, error: errorMessages.join(', ') };
    }

    return { success: false, error: error.message || 'Error updating user in Clerk' };
  }
}

export async function toggleUserStatusInClerk(clerkId: string, isActive: boolean) {
  try {
    const client = await clerkClient();

    if (isActive) {
      await client.users.unbanUser(clerkId);
    } else {
      await client.users.banUser(clerkId);
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling user status in Clerk:', error);
    return { success: false, error: 'Error toggling user status in Clerk' };
  }
}
