import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { VaultUnlockMutateOptions } from './options-vault.tsx'
import { optionsVault } from './options-vault.tsx'

export function useVaultUnlock(props: VaultUnlockMutateOptions = {}) {
  const context = useAppContext()
  return useMutation(optionsVault.unlock(context, props))
}
