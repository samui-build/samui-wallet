import { VAULT_PIN_MAX_LENGTH, VAULT_PIN_MIN_LENGTH } from '@workspace/vault/encrypted-value-schema'
import { z } from 'zod'
import { walletInternalSchema } from './wallet-internal-schema.ts'

const pinDigitsRegex = /^\d+$/

export const walletCreateSchema = walletInternalSchema
  .omit({
    accounts: true,
    createdAt: true,
    id: true,
    order: true,
    secret: true,
    updatedAt: true,
  })
  .extend({
    protection: z
      .discriminatedUnion('mode', [
        z.object({ mode: z.literal('password') }),
        z.object({
          mode: z.literal('pin'),
          pin: z
            .string()
            .regex(pinDigitsRegex, 'PIN must contain only digits')
            .min(VAULT_PIN_MIN_LENGTH, `PIN must be at least ${VAULT_PIN_MIN_LENGTH} digits`)
            .max(VAULT_PIN_MAX_LENGTH, `PIN must be at most ${VAULT_PIN_MAX_LENGTH} digits`),
        }),
        z.object({ mode: z.literal('unsecured') }),
      ])
      .optional(),
  })
