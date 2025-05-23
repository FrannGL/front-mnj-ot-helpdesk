import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(1, { message: '¡El nombre de usuario es requerido!' }),
  email: z
    .string()
    .min(1, { message: '¡El email es requerido!' })
    .email({ message: '¡El email debe ser una dirección válida!' }),
  password: z
    .string()
    .min(1, { message: '¡La contraseña es requerida!' })
    .min(6, { message: '¡La contraseña debe tener al menos 6 caracteres!' }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
