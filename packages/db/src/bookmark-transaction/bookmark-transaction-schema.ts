import { z } from 'zod'
import { solanaSignatureSchema } from '../solana/solana-signature-schema.ts'

export const bookmarkTransactionSchema = z.object({
  createdAt: z.date(),
  id: z.string(),
  label: z.string().max(50).optional(),
  signature: solanaSignatureSchema,
  updatedAt: z.date(),
})
