import { isSignature, signature } from '@solana/kit'
import { z } from 'zod'

export const solanaSignatureSchema = z
  .string()
  .refine((val) => isSignature(val), { message: 'Invalid Solana signature' })
  .transform((val) => signature(val))
