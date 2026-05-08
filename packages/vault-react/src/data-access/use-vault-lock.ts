import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppContext } from '@workspace/context-react/use-app-context'
import { optionsVault, type VaultLockMutateOptions, vaultStatusQueryKey } from './options-vault.ts'

export function useVaultLock(props: VaultLockMutateOptions = {}) {
  const context = useAppContext()
  const queryClient = useQueryClient()

  return useMutation(
    optionsVault.lock(context, {
      ...props,
      onSuccess: async (data, variables, onMutateResult, mutationContext) => {
        await queryClient.invalidateQueries({ queryKey: vaultStatusQueryKey })
        await props.onSuccess?.(data, variables, onMutateResult, mutationContext)
      },
    }),
  )
}
