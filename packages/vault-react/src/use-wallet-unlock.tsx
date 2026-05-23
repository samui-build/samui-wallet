import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletUnlockMutateOptions } from './options-vault.tsx'
import { optionsVault } from './options-vault.tsx'

export function useWalletUnlock(props: WalletUnlockMutateOptions = {}) {
  const context = useAppContext()
  return useMutation(optionsVault.unlockWallet(context, props))
}
