import { walletProtectionModeSchema } from '@workspace/vault/encrypted-value-schema'
import { walletInternalSchema } from './wallet-internal-schema.ts'

export const walletBaseSchema = walletInternalSchema.omit({
  mnemonic: true,
  secret: true,
})

export const walletSchema = walletBaseSchema.extend({
  protectionMode: walletProtectionModeSchema,
})
