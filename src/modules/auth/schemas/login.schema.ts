import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
