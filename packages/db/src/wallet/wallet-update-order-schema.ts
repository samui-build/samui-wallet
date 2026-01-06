import { z } from 'zod'

export const walletUpdateOrderSchema = z.object({
  id: z.string(),
  order: z.number(),
})
