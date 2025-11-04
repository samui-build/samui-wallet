import { z } from 'zod'

import { walletSchema } from './wallet-schema.ts'

export const accountSchema = z.object({
  createdAt: z.date(),
  derivationPath: z.string(),
  id: z.string(),
  mnemonic: z.string(),
  name: z.string(),
  order: z.number(),
  secret: z.string(),
  updatedAt: z.date(),
  wallets: z.array(walletSchema).optional().default([]),
})
