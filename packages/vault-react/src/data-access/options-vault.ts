import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import type { AppContext } from '@workspace/context/app-context'

export type VaultLockMutateOptions = MutateOptions<void, Error, void>
export type VaultStatus = { isConfigured: boolean; isUnlocked: boolean }

export const vaultStatusQueryKey = ['vaultStatus'] as const

export const optionsVault = {
  lock: (context: AppContext, props: VaultLockMutateOptions = {}) =>
    mutationOptions({
      ...props,
      mutationFn: async () => {
        context.vault.lock()
      },
    }),
  status: (context: AppContext) =>
    queryOptions({
      queryFn: async (): Promise<VaultStatus> => ({
        isConfigured: await context.vault.isConfigured(),
        isUnlocked: context.vault.isUnlocked(),
      }),
      queryKey: vaultStatusQueryKey,
    }),
}
