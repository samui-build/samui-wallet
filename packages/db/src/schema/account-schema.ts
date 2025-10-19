import { z } from 'zod'

export const accountSchema = z.object({
  createdAt: z.date(),
  derivationPath: z.string(),
  id: z.string(),
  mnemonic: z.string(),
  name: z.string(),
  secret: z.string(),
  updatedAt: z.date(),
})
