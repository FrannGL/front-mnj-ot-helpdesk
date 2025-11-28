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

  // const { id } = evt.data;
  const eventType = evt.type;

  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

  if (eventType === 'user.created') {
    const { email_addresses, username } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (email) {
      try {
        const checkResponse = await request(`usuarios?email=${email}`, 'GET');

        const users = checkResponse.data?.results || checkResponse.data || [];
        const userExists = Array.isArray(users) && users.length > 0;

        if (!userExists) {
          // console.log(`User with email ${email} not found, creating...`);

          const finalUsername = username || email.split('@')[0];

          const newUser = {
            username: finalUsername,
            email,
            password: 'admin123',
            groups: [],
          };

          const createResponse = await request('usuarios', 'POST', newUser);

          if (createResponse.status >= 400) {
            console.error('Error creating user in DB:', createResponse.error);
            return new Response('Error creating user', { status: 500 });
          }

          // console.log('User created in DB:', createResponse.data);
        }
        // } else {
        //   console.log(`User with email ${email} already exists.`);
        // }
      } catch (error) {
        console.error('Error syncing user:', error);
        return new Response('Error syncing user', { status: 500 });
      }
    }
  }

  return new Response('', { status: 200 });
}
