import type { DefaultSession } from 'next-auth';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { UserGroups } from './modules/users/enums';

declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
    email: string;
    groups: UserGroups[];
  }

  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      groups: UserGroups[];
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Se requieren credenciales');
        }

        if (credentials.email === 'demouser@jst.gob.ar' && credentials.password === '@demo1') {
          return {
            id: 1,
            username: 'demo',
            email: credentials.email,
            groups: [UserGroups.DIRECTOR],
          };
        }

        throw new Error('Credenciales inválidas');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          email: user.email,
          groups: user.groups,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as number,
          username: token.username as string,
          email: token.email as string,
          groups: token.groups as UserGroups[],
        },
      };
    },
  },
});
