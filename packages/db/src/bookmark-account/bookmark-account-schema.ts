import { z } from 'zod'
import { solanaAddressSchema } from '../solana/solana-address-schema.ts'

export const bookmarkAccountSchema = z.object({
  address: solanaAddressSchema,
  createdAt: z.date(),
  id: z.string(),
  label: z.string().max(50).optional(),
  updatedAt: z.date(),
})
