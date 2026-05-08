import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletCreateMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'

export function useWalletCreate(props: WalletCreateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.create(ctx, props))
}
