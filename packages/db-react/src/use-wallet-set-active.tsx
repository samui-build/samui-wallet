import { useMutation } from '@tanstack/react-query'
import type { WalletSetActiveMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletSetActive(props: WalletSetActiveMutateOptions = {}) {
  return useMutation(optionsWallet.setActive(props))
}
