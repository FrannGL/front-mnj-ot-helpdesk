import { z } from 'zod';

import { OrderStatusEnum, OrderPriorityEnum } from '../enums';

export const createOrderSchema = z.object({
  cliente: z.union([z.literal(undefined), z.number()]).refine((val) => typeof val === 'number', {
    message: 'El cliente es requerido',
  }),
  titulo: z
    .string({
      required_error: 'El título es requerido',
    })
    .min(3, 'El título debe tener al menos 3 caracteres'),
  estado: z.nativeEnum(OrderStatusEnum, {
    required_error: 'El estado es requerido',
  }),
  prioridad: z.nativeEnum(OrderPriorityEnum, {
    required_error: 'La prioridad es requerida',
  }),
  tags: z.array(z.number()).optional(),
  agentes: z.array(z.number()).optional(),
});

export type CreateOrderType = z.infer<typeof createOrderSchema>;
