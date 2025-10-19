import { z } from 'zod'

import { walletTypeSchema } from './wallet-type-schema'

export const walletSchema = z.object({
  accountId: z.string(),
  createdAt: z.date(),
  derivationIndex: z.number(),
  id: z.string(),
  name: z.string(),
  publicKey: z.string(),
  secretKey: z.string().optional(),
  type: walletTypeSchema,
  updatedAt: z.date(),
})
