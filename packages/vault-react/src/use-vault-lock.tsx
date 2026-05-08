import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { VaultLockMutateOptions } from './options-vault.tsx'
import { optionsVault } from './options-vault.tsx'

export function useVaultLock(props: VaultLockMutateOptions = {}) {
  const context = useAppContext()
  return useMutation(optionsVault.lock(context, props))
}
