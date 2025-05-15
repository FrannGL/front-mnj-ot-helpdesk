import { z } from 'zod';

import { TaskStatus, TaskPriority } from '../enums';

export const createTaskSchema = z.object({
  cliente: z.number({
    required_error: 'El cliente es requerido',
  }),
  agentes: z.array(z.number(), {
    required_error: 'Debe seleccionar al menos un agente',
  }),
  titulo: z
    .string({
      required_error: 'El título es requerido',
    })
    .min(3, 'El título debe tener al menos 3 caracteres'),
  estado: z.nativeEnum(TaskStatus, {
    required_error: 'El estado es requerido',
  }),
  prioridad: z.nativeEnum(TaskPriority, {
    required_error: 'La prioridad es requerida',
  }),
});

export type CreateTaskType = z.infer<typeof createTaskSchema>;
