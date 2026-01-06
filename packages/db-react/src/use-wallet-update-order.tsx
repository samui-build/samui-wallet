import { useMutation } from '@tanstack/react-query'
import type { WalletUpdateOrderMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletUpdateOrder(props: WalletUpdateOrderMutateOptions = {}) {
  return useMutation(optionsWallet.updateOrder(props))
}
