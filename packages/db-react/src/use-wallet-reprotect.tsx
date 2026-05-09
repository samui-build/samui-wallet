import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletReprotectMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletReprotect(props: WalletReprotectMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.reprotect(ctx, props))
}
