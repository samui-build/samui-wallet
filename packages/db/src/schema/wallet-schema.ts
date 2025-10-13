import { z } from 'zod'

import { accountSchema } from './account-schema'
import { walletTypeSchema } from './wallet-type-schema'

export const walletSchema = z.object({
  accountId: accountSchema.shape.id,
  createdAt: z.date(),
  derivationIndex: z.number().default(0),
  id: z.string(),
  name: z.string(),
  publicKey: z.string(),
  secretKey: z.string().optional(),
  type: walletTypeSchema,
  updatedAt: z.date(),
})
