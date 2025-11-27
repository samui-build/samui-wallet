import { useMutation } from '@tanstack/react-query'

import { optionsWallet, type WalletReadMnemonicMutateOptions } from './options-wallet.tsx'

export function useWalletReadMnemonic(props: WalletReadMnemonicMutateOptions = {}) {
  return useMutation(optionsWallet.readMnemonic(props))
}
