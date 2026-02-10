'use server';

import { clerkClient } from '@clerk/nextjs/server';

// Interface for Clerk user updates - only includes fields Clerk accepts
export interface ClerkUserUpdate {
  firstName?: string;
  lastName?: string;
  username?: string;
}

// Simplified function for debugging
export async function simpleUpdateUser(
  clerkId: string,
  firstName: string,
  lastName: string,
  username: string
) {
  console.log('[simpleUpdateUser] ========== INICIO ==========');
  console.log('[simpleUpdateUser] clerkId:', clerkId);
  console.log('[simpleUpdateUser] params:', { firstName, lastName, username });

  try {
    console.log('[simpleUpdateUser] Antes de clerkClient()');
    const client = await clerkClient();
    console.log('[simpleUpdateUser] Despues de clerkClient()');

    const updateData = {
      firstName: String(firstName),
      lastName: String(lastName),
      username: String(username),
    };

    console.log('[simpleUpdateUser] updateData:', JSON.stringify(updateData, null, 2));
    console.log('[simpleUpdateUser] Antes de updateUser...');

    const updatedUser = await client.users.updateUser(clerkId, updateData);

    console.log('[simpleUpdateUser] Despues de updateUser');
    console.log('[simpleUpdateUser] SUCCESS:', updatedUser.id);

    return { success: true };
  } catch (error: any) {
    console.error('[simpleUpdateUser] CATCH ERROR:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message || 'Error' };
  }

  console.log('[simpleUpdateUser] FIN - nunca llega aquí');
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

export async function updateUserInClerk(clerkId: string, userData: ClerkUserUpdate) {
  console.log('[updateUserInClerk] ========== INICIO ==========');
  console.log('[updateUserInClerk] clerkId:', clerkId);
  console.log('[updateUserInClerk] userData:', JSON.stringify(userData, null, 2));
  console.log('[updateUserInClerk] userData keys:', Object.keys(userData));
  console.log('[updateUserInClerk] userData has email?:', 'email' in userData);

  try {
    const client = await clerkClient();
    console.log('[updateUserInClerk] Client initialized');

    const updateData: ClerkUserUpdate = {};

    console.log('[updateUserInClerk] build updateData:');
    console.log(
      '[updateUserInClerk] userData.firstName:',
      userData.firstName,
      typeof userData.firstName
    );
    console.log(
      '[updateUserInClerk] userData.lastName:',
      userData.lastName,
      typeof userData.lastName
    );
    console.log(
      '[updateUserInClerk] userData.username:',
      userData.username,
      typeof userData.username
    );

    // Only include fields that are explicitly provided
    if (userData.firstName !== undefined) updateData.firstName = userData.firstName;
    if (userData.lastName !== undefined) updateData.lastName = userData.lastName;
    if (userData.username !== undefined) updateData.username = userData.username;

    console.log('[updateUserInClerk] updateData built:', JSON.stringify(updateData, null, 2));
    console.log('[updateUserInClerk] updateData type:', typeof updateData);
    console.log('[updateUserInClerk] Array.isArray(updateData):', Array.isArray(updateData));
    console.log('[updateUserInClerk] Object.keys(updateData):', Object.keys(updateData));

    if (Object.keys(updateData).length === 0) {
      return { success: true, user: null };
    }

    console.log('[updateUserInClerk] Calling client.users.updateUser...');
    const updatedUser = await client.users.updateUser(clerkId, updateData);

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('[Clerk] Full error:', JSON.stringify(error, null, 2));
    console.error('[Clerk] Error code:', error?.errors?.[0]?.code);
    console.error('[Clerk] Error meta:', error?.errors?.[0]?.meta);

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
    console.error('Error toggling user status in Clerk:', error);
    return { success: false, error: 'Error toggling user status in Clerk' };
  }
}
