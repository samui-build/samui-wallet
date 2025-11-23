import { z } from 'zod'

import { accountSchema } from '../account/account-schema.ts'

export const walletSchema = z.object({
  accounts: z.array(accountSchema).optional().default([]),
  createdAt: z.date(),
  derivationPath: z.string(),
  id: z.string(),
  mnemonic: z.string(),
  name: z.string(),
  order: z.number(),
  secret: z.string(),
  updatedAt: z.date(),
})
