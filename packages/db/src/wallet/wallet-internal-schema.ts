import { z } from 'zod'

import { accountSchema } from '../account/account-schema.ts'

export const walletInternalSchema = z.object({
  accounts: z.array(accountSchema).optional().default([]),
  createdAt: z.date(),
  derivationPath: z.string(),
  description: z.string().max(50).optional(),
  id: z.string(),
  mnemonic: z.string(),
  name: z.string().max(20),
  order: z.number(),
  secret: z.string(),
  updatedAt: z.date(),
})
