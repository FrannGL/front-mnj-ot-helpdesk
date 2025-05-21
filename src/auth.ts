import type { DefaultSession } from 'next-auth';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { request } from './services/request';
import { hashPassword } from './utils/hashPassword';

import type { UserGroups } from './modules/users/enums';

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
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        username: {},
        groups: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Se requieren credenciales');
        }

        try {
          if (credentials.username && credentials.groups) {
            const hashedPassword = await hashPassword(credentials.password as string);

            const registerResponse = await request('usuarios', 'POST', {
              username: credentials.username,
              email: credentials.email,
              password: hashedPassword,
              groups: JSON.parse(credentials.groups as string),
            });

            if (registerResponse.error || registerResponse.status >= 400) {
              throw new Error(registerResponse.error || 'Error al registrar usuario');
            }

            return {
              id: registerResponse.data.id,
              username: registerResponse.data.username,
              email: registerResponse.data.email,
              groups: registerResponse.data.groups,
            };
          }

          // LOGIN DE USUARIO
          // Para el login, generalmente NO hasheas la contraseña aquí,
          // sino que envías la contraseña en texto plano al backend
          // y el backend la compara con el hash almacenado
          const loginResponse = await request('auth/login', 'POST', {
            email: credentials.email,
            password: credentials.password, // Texto plano para login
          });

          if (loginResponse.error || loginResponse.status >= 400) {
            throw new Error(loginResponse.error || 'Credenciales inválidas');
          }

          return {
            id: loginResponse.data.id,
            username: loginResponse.data.username,
            email: loginResponse.data.email,
            groups: loginResponse.data.groups,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Error en la autenticación');
        }
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
