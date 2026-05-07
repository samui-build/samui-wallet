import { useMutation } from '@tanstack/react-query'
import type { WalletCreateMutateOptions } from './options-wallet.tsx'
import { optionsWallet } from './options-wallet.tsx'
import { useAppContext } from './use-app-context.tsx'

export function useWalletCreate(props: WalletCreateMutateOptions = {}) {
  const ctx = useAppContext()
  return useMutation(optionsWallet.create(ctx, props))
}
