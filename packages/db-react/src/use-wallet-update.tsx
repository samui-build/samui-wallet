import { useMutation } from '@tanstack/react-query'
import type { WalletUpdateMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useWalletUpdate(props: WalletUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.update(ctx, props))
}
