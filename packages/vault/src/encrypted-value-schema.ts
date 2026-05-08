import { z } from 'zod'

export const PASSWORD_KDF_MIN_ITERATIONS = 600_000
export const VAULT_PASSWORD_MAX_LENGTH = 128
export const VAULT_PASSWORD_MIN_LENGTH = 8
export const VAULT_PIN_MAX_LENGTH = 8
export const VAULT_PIN_MIN_LENGTH = 4

export const walletProtectionModeSchema = z.enum(['password', 'pin', 'unsecured'])

export const vaultCredentialPolicySchema = z
  .discriminatedUnion('mode', [
    z.object({
      maxLength: z.number().int().min(VAULT_PASSWORD_MIN_LENGTH).max(VAULT_PASSWORD_MAX_LENGTH),
      minLength: z.number().int().min(VAULT_PASSWORD_MIN_LENGTH).max(VAULT_PASSWORD_MAX_LENGTH),
      mode: z.literal('password'),
    }),
    z.object({
      maxLength: z.number().int().min(VAULT_PIN_MIN_LENGTH).max(VAULT_PIN_MAX_LENGTH),
      minLength: z.number().int().min(VAULT_PIN_MIN_LENGTH).max(VAULT_PIN_MAX_LENGTH),
      mode: z.literal('pin'),
    }),
    z.object({
      mode: z.literal('unsecured'),
    }),
  ])
  .superRefine((policy, context) => {
    if (policy.mode !== 'unsecured' && policy.minLength > policy.maxLength) {
      context.addIssue({
        code: 'custom',
        message: 'minLength must be less than or equal to maxLength',
        path: ['minLength'],
      })
    }
  })

const encryptedValueBaseSchema = z.object({
  auth_tag: z.string(),
  cipher: z.literal('aes-256-gcm'),
  cipherparams: z.object({
    iv: z.string(),
  }),
  ciphertext: z.string(),
  version: z.literal(1),
})

export const encryptedValueSchema = z.discriminatedUnion('kdf', [
  encryptedValueBaseSchema.extend({
    kdf: z.literal('direct'),
    kdfparams: z.never().optional(),
  }),
  encryptedValueBaseSchema.extend({
    kdf: z.literal('pbkdf2-sha256'),
    kdfparams: z.object({
      dklen: z.literal(32),
      hash: z.literal('sha256'),
      iterations: z.number().int().min(PASSWORD_KDF_MIN_ITERATIONS),
      salt: z.string(),
    }),
  }),
])

export type EncryptedValue = z.infer<typeof encryptedValueSchema>
export type WalletProtectionMode = z.infer<typeof walletProtectionModeSchema>
