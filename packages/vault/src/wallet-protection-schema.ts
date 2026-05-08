import { z } from 'zod'
import { encryptedValueSchema } from './encrypted-value-schema.ts'

export const walletProtectionSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('password'),
    version: z.literal(1),
  }),
  z.object({
    keyEnvelope: encryptedValueSchema,
    mode: z.literal('pin'),
    version: z.literal(1),
  }),
  z.object({
    keyMaterial: z.string(),
    mode: z.literal('unsecured'),
    version: z.literal(1),
  }),
])
