import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletUpdateMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletUpdate(props: WalletUpdateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.update(ctx, props))
}
