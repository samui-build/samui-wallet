import { useMutation } from '@tanstack/react-query'
import type { WalletUpdateOrderMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useWalletUpdateOrder(props: WalletUpdateOrderMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.updateOrder(ctx, props))
}
