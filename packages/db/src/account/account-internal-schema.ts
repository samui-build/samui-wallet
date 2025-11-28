import { z } from 'zod'
import { solanaAddressSchema } from '../solana/solana-address-schema.ts'
import { accountTypeSchema } from './account-type-schema.ts'

export const accountInternalSchema = z.object({
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
