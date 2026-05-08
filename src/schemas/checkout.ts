import { z } from 'zod'

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Ingresá un nombre valido.')
    .max(80, 'El nombre es demasiado largo.'),
  customerPhone: z
    .string()
    .min(8, 'Ingresá un telefono valido.')
    .max(20, 'El telefono es demasiado largo.'),
  customerMessage: z
    .string()
    .max(240, 'El mensaje no puede superar los 240 caracteres.')
    .optional()
    .or(z.literal('')),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>
