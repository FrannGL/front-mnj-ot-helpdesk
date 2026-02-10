import type { WebhookEvent } from '@clerk/nextjs/server';

import { Webhook } from 'svix';
import { headers } from 'next/headers';

import { request } from 'src/services/request';

export async function POST(req: Request) {
  const { WEBHOOK_SECRET } = process.env;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  const { id: clerkId } = evt.data;
  const eventType = evt.type;

  console.log('[WEBHOOK] ========== EVENTO RECIBIDO ==========');
  console.log('[WEBHOOK] eventType:', eventType);
  console.log('[WEBHOOK] clerkId:', clerkId);

  if (eventType === 'user.created') {
    const { email_addresses, username } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      try {
        const checkResponse = await request(`usuarios?email=${email}`, 'GET');

        const users = checkResponse.data?.results || checkResponse.data || [];
        const userExists = Array.isArray(users) && users.length > 0;

        if (!userExists) {
          const finalUsername = username || email.split('@')[0];

          const newUser = {
            username: finalUsername,
            email,
            password: 'admin123',
            groups: [],
            clerk_id: clerkId,
          };

          const createResponse = await request('usuarios', 'POST', newUser);

          if (createResponse.status >= 400) {
            console.error('Error creating user in DB:', createResponse.error);
            return new Response('Error creating user', { status: 500 });
          }
        }
      } catch (error) {
        console.error('Error syncing user:', error);
        return new Response('Error syncing user', { status: 500 });
      }
    }
  }

  if (eventType === 'user.updated') {
    console.log('[WEBHOOK] Entrando en user.updated...');
    console.log('[WEBHOOK] evt.data:', JSON.stringify(evt.data, null, 2));

    const { email_addresses, username, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    console.log('[WEBHOOK] email:', email);
    console.log('[WEBHOOK] username:', username);
    console.log('[WEBHOOK] first_name:', first_name);
    console.log('[WEBHOOK] last_name:', last_name);

    if (email) {
      try {
        const checkResponse = await request(`usuarios?clerk_id=${clerkId}`, 'GET');
        const users = checkResponse.data?.results || checkResponse.data || [];
        const existingUser = Array.isArray(users) && users.length > 0 ? users[0] : null;

        if (existingUser) {
          const hasChanges =
            username !== existingUser.username ||
            first_name !== existingUser.first_name ||
            last_name !== existingUser.last_name ||
            email !== existingUser.email;

          if (hasChanges) {
            // Only update local database, NOT Clerk (since this webhook is triggered BY Clerk)
            const updatedUser = {
              username: username || existingUser.username,
              first_name: first_name || existingUser.first_name,
              last_name: last_name || existingUser.last_name,
              email, // Always include email from Clerk since it's the source of truth
            };

            const updateResponse = await request(
              `usuarios/${existingUser.id}`,
              'PATCH',
              updatedUser
            );

            if (updateResponse.status >= 400) {
              console.error('Error updating user in DB:', updateResponse.error);
              return new Response('Error updating user', { status: 500 });
            }
          }
        }
      } catch (error) {
        console.error('Error updating user:', error);
        return new Response('Error updating user', { status: 500 });
      }
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const checkResponse = await request(`usuarios?clerk_id=${clerkId}`, 'GET');
      const users = checkResponse.data?.results || checkResponse.data || [];
      const existingUser = Array.isArray(users) && users.length > 0 ? users[0] : null;

      if (existingUser) {
        const deleteResponse = await request(`usuarios/${existingUser.id}`, 'DELETE');

        if (deleteResponse.status >= 400) {
          console.error('Error deleting user from DB:', deleteResponse.error);
          return new Response('Error deleting user', { status: 500 });
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
