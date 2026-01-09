import { z } from 'zod'

export const accountUpdateOrderSchema = z.object({
  id: z.string(),
  order: z.number(),
})
