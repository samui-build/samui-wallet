// cspell:words Reprotect reprotect

import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { WalletReprotectMutateOptions } from './options-vault.tsx'
import { optionsVault } from './options-vault.tsx'

export function useWalletReprotect(props: WalletReprotectMutateOptions = {}) {
  const context = useAppContext()
  return useMutation(optionsVault.reprotect(context, props))
}
