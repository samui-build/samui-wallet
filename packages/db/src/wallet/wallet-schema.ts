import { walletInternalSchema } from './wallet-internal-schema.ts'

export const walletSchema = walletInternalSchema.omit({
  mnemonic: true,
})
