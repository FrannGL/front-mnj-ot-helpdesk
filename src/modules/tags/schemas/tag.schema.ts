import { z } from 'zod';

export const tagSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
});

export type TagFormData = z.infer<typeof tagSchema>;
