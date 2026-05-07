import { useMutation } from '@tanstack/react-query'
import type { WalletDeleteMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useWalletDelete(props: WalletDeleteMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.delete(ctx, props))
}
