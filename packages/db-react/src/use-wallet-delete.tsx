import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletDeleteMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletDelete(props: WalletDeleteMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.delete(ctx, props))
}
