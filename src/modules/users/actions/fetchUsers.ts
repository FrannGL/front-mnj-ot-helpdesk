'use server';

import type { User } from 'src/modules/users/interfaces';

import { clerkClient } from '@clerk/nextjs/server';

interface UsersServerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export async function fetchUsersServer(page: number = 1): Promise<UsersServerResponse> {
  try {
    const client = await clerkClient();
    const limit = 10;
    const offset = (page - 1) * limit;

    const userList = await client.users.getUserList({
      limit,
      offset,
      orderBy: '-created_at',
    });

    const users: User[] = userList.data.map((clerkUser) => ({
      id: parseInt(clerkUser.id, 10) || 0,
      username:
        clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || '',
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      groups: [], // Los grupos se manejarán a través de publicMetadata
      clerk_id: clerkUser.id,
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      imageUrl: clerkUser.imageUrl || undefined,
      isActive: !clerkUser.banned,
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : undefined,
      updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : undefined,
    }));

    const totalCount = userList.totalCount || 0;
    const currentPage = page;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      count: totalCount,
      next: currentPage < totalPages ? `/admin/usuarios?page=${page + 1}` : null,
      previous: currentPage > 1 ? `/admin/usuarios?page=${page - 1}` : null,
      results: users,
    };
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}
