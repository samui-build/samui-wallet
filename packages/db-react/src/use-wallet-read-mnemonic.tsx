import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { optionsWallet, type WalletReadMnemonicMutateOptions } from './options-wallet.tsx'

export function useWalletReadMnemonic(props: WalletReadMnemonicMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.readMnemonic(ctx, props))
}
