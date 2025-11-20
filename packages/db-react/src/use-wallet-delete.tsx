import { useMutation } from '@tanstack/react-query'
import type { WalletDeleteMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletDelete(props: WalletDeleteMutateOptions = {}) {
  return useMutation(optionsWallet.delete(props))
}
