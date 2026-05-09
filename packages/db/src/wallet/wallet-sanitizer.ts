import type { WalletProtectionMode } from '@workspace/vault/encrypted-value-schema'
import { walletProtectionSchema } from '@workspace/vault/wallet-protection-schema'
import type { Wallet } from './wallet.ts'
import type { WalletInternal } from './wallet-internal.ts'
import { walletBaseSchema, walletSchema } from './wallet-schema.ts'

export function walletSanitizer(internal: WalletInternal): Wallet {
  return walletSchema.parse({
    ...walletBaseSchema.parse(internal),
    protectionMode: parseWalletProtectionMode(internal.secret),
  })
}

function parseWalletProtectionMode(value: string): WalletProtectionMode {
  try {
    return walletProtectionSchema.parse(JSON.parse(value)).mode
  } catch {
    return 'password'
  }
}
