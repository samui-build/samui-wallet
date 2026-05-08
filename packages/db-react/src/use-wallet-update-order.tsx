import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletUpdateOrderMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletUpdateOrder(props: WalletUpdateOrderMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.updateOrder(ctx, props))
}
