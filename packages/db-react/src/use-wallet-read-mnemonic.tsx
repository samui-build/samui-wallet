import { useMutation } from '@tanstack/react-query'
import { optionsWallet, type WalletReadMnemonicMutateOptions } from './options-wallet.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useWalletReadMnemonic(props: WalletReadMnemonicMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.readMnemonic(ctx, props))
}
