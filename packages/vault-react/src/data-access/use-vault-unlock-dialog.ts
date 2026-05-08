import { createContext, useContext } from 'react'

export type VaultUnlockMode = 'password' | 'pin' | 'unsecured'

export type VaultUnlockReason =
  | 'createWallet'
  | 'exportAccountSecretKey'
  | 'exportWalletMnemonic'
  | 'generic'
  | 'signRequest'
  | 'walletProtection'

export type VaultUnlockRequest = {
  description?: string | undefined
  mode?: VaultUnlockMode | undefined
  reason?: VaultUnlockReason | undefined
  title?: string | undefined
  walletId?: string | undefined
}

export type VaultUnlockDialogContext = {
  requestUnlock(input?: VaultUnlockRequest): Promise<boolean>
}

export const VaultUnlockDialogReact = createContext<VaultUnlockDialogContext | null>(null)

export function useVaultUnlockDialog(): VaultUnlockDialogContext {
  const value = useContext(VaultUnlockDialogReact)
  if (!value) {
    throw new Error('VaultUnlockProvider is missing')
  }
  return value
}
