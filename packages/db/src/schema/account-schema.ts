import { z } from 'zod'

export const accountSchema = z.object({
  createdAt: z.date(),
  id: z.string(),
  mnemonic: z.string(),
  name: z.string(),
  secret: z.string(),
  updatedAt: z.date(),
})
