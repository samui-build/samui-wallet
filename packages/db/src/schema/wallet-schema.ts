import { z } from 'zod'

import { solanaAddressSchema } from './solana-address-schema'
import { walletTypeSchema } from './wallet-type-schema'

export const walletSchema = z.object({
  accountId: z.string(),
  createdAt: z.date(),
  derivationIndex: z.number(),
  id: z.string(),
  name: z.string(),
  publicKey: solanaAddressSchema,
  secretKey: z.string().optional(),
  type: walletTypeSchema,
  updatedAt: z.date(),
})
