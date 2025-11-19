import { useMutation } from '@tanstack/react-query'
import type { WalletCreateMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletCreate(props: WalletCreateMutateOptions = {}) {
  return useMutation(optionsWallet.create(props))
}
