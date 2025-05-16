import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  email: z.string().email('Email inválido').optional(),
  groups: z.array(z.number()).optional(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserType = z.infer<typeof updateUserSchema>;
