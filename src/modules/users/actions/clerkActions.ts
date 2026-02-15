'use server';

import { clerkClient } from '@clerk/nextjs/server';

export interface ClerkUserUpdate {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export async function simpleUpdateUser(
  clerkId: string,
  firstName: string,
  lastName: string,
  username: string
) {
  try {
    const client = await clerkClient();

    const updateData = {
      firstName: String(firstName),
      lastName: String(lastName),
      username: String(username),
    };

    await client.users.updateUser(clerkId, updateData);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error updating user in Clerk' };
  }
}

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
      password: 'Admin123',
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
    return { success: false, error: 'Error deleting user from Clerk' };
  }
}

export async function updateUserInClerk(clerkId: string, userData: ClerkUserUpdate) {
  try {
    const client = await clerkClient();

    const updateData: ClerkUserUpdate = {};

    if (userData.firstName !== undefined) updateData.firstName = userData.firstName;
    if (userData.lastName !== undefined) updateData.lastName = userData.lastName;
    if (userData.username !== undefined) updateData.username = userData.username;

    if (Object.keys(updateData).length === 0) {
      return { success: true, user: null };
    }

    const updatedUser = await client.users.updateUser(clerkId, updateData);

    return { success: true, user: updatedUser };
  } catch (error: any) {
    if (error.errors && Array.isArray(error.errors)) {
      const errorMessages = error.errors.map((e: any) => {
        if (e.code === 'form_identifier_exists') {
          if (e.meta?.paramName === 'email_address' || e.meta?.paramName === 'email') {
            return 'El email ya está en uso por otro usuario';
          }
          if (e.meta?.paramName === 'username') {
            return 'El nombre de usuario ya está en uso';
          }
        }
        if (e.code === 'username_taken' || e.code === 'identifier_exists') {
          return 'El identificador ya está en uso';
        }
        return e.longMessage || e.message;
      });
      return { success: false, error: errorMessages.join(', ') };
    }

    if (error.status === 422 || error.code === 'form_identifier_exists') {
      return { success: false, error: 'El email o nombre de usuario ya está en uso' };
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
    return { success: false, error: 'Error toggling user status in Clerk' };
  }
}
