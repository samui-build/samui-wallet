import { z } from 'zod'
import { accountTypeSchema } from './account-type-schema.ts'
import { solanaAddressSchema } from './solana-address-schema.ts'

export const accountSchema = z.object({
  createdAt: z.date(),
  derivationIndex: z.number(),
  id: z.string(),
  name: z.string(),
  order: z.number(),
  publicKey: solanaAddressSchema,
  secretKey: z.string().optional(),
  type: accountTypeSchema,
  updatedAt: z.date(),
  walletId: z.string(),
})
