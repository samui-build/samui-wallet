import { useMutation } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import type { VaultPasswordSubmitMutateOptions } from './options-vault.tsx'
import { optionsVault } from './options-vault.tsx'

export function useVaultPasswordSubmit(props: VaultPasswordSubmitMutateOptions = {}) {
  const context = useAppContext()
  return useMutation(optionsVault.submitPassword(context, props))
}
