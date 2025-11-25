import type { Wallet } from './wallet.ts'
import type { WalletInternal } from './wallet-internal.ts'
import { walletSchema } from './wallet-schema.ts'

export function walletSanitizer(internal: WalletInternal): Wallet {
  return walletSchema.parse(internal)
}
