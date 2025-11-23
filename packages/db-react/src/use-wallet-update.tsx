import { useMutation } from '@tanstack/react-query'
import type { WalletUpdateMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletUpdate(props: WalletUpdateMutateOptions = {}) {
  return useMutation(optionsWallet.update(props))
}
