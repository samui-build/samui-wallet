// cspell:words Reprotect reprotect

import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import type { DbContext } from '@workspace/db/db-context'
import { type WalletReprotectInput, walletReprotect } from '@workspace/db/wallet/wallet-reprotect'
import { optionsWallet } from '@workspace/db-react/options-wallet'
import { queryClient } from '@workspace/db-react/query-client'
import {
  submitVaultPassword,
  type VaultPasswordSubmitInput,
  type VaultPasswordSubmitResult,
} from './data-access/vault-password-submit.ts'

export type VaultLockMutateOptions = MutateOptions<void, Error, void>
export type VaultPasswordSubmitMutateOptions = MutateOptions<VaultPasswordSubmitResult, Error, VaultPasswordSubmitInput>
export type VaultStatus = { isConfigured: boolean; isUnlocked: boolean }
export type VaultUnlockMutateOptions = MutateOptions<void, Error, { password: string }>
export type WalletReprotectMutateOptions = MutateOptions<void, Error, WalletReprotectInput>
export type WalletUnlockMutateOptions = MutateOptions<void, Error, { credential: string; walletId: string }>

export const vaultStatusQueryKey = ['vaultStatus'] as const

export const optionsVault = {
  lock: (context: DbContext, props: VaultLockMutateOptions = {}) =>
    mutationOptions({
      ...props,
      mutationFn: async () => {
        context.vault.lock()
      },
      onSuccess: async (data, variables, onMutateResult, mutationContext) => {
        await queryClient.invalidateQueries({ queryKey: vaultStatusQueryKey })
        await props.onSuccess?.(data, variables, onMutateResult, mutationContext)
      },
    }),
  reprotect: (context: DbContext, props: WalletReprotectMutateOptions = {}) =>
    mutationOptions({
      ...props,
      mutationFn: (input: WalletReprotectInput) => walletReprotect(context, input),
      onSuccess: async (data, variables, onMutateResult, mutationContext) => {
        await queryClient.invalidateQueries(optionsWallet.findMany(context, {}))
        await props.onSuccess?.(data, variables, onMutateResult, mutationContext)
      },
    }),
  status: (context: DbContext) =>
    queryOptions({
      queryFn: async (): Promise<VaultStatus> => ({
        isConfigured: await context.vault.isConfigured(),
        isUnlocked: context.vault.isUnlocked(),
      }),
      queryKey: vaultStatusQueryKey,
    }),
  submitPassword: (context: DbContext, props: VaultPasswordSubmitMutateOptions = {}) =>
    mutationOptions({
      ...props,
      mutationFn: (input) => submitVaultPassword(context.vault, input),
      onSuccess: async (data, variables, onMutateResult, mutationContext) => {
        await queryClient.invalidateQueries({ queryKey: vaultStatusQueryKey })
        await props.onSuccess?.(data, variables, onMutateResult, mutationContext)
      },
    }),
  unlock: (context: DbContext, props: VaultUnlockMutateOptions = {}) =>
    mutationOptions({
      ...props,
      mutationFn: async ({ password }: { password: string }) => {
        await context.vault.unlock({ password })
      },
      onSuccess: async (data, variables, onMutateResult, mutationContext) => {
        await queryClient.invalidateQueries({ queryKey: vaultStatusQueryKey })
        await props.onSuccess?.(data, variables, onMutateResult, mutationContext)
      },
    }),
  unlockWallet: (context: DbContext, props: WalletUnlockMutateOptions = {}) =>
    mutationOptions({
      mutationFn: async ({ credential, walletId }: { credential: string; walletId: string }) => {
        await context.vault.unlockWallet({ credential, walletId })
      },
      ...props,
    }),
}
