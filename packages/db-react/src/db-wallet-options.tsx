import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import type { WalletCreateInput } from '@workspace/db/wallet/wallet-create-input'
import { walletDelete } from '@workspace/db/wallet/wallet-delete'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import type { WalletFindManyInput } from '@workspace/db/wallet/wallet-find-many-input'
import { walletFindUnique } from '@workspace/db/wallet/wallet-find-unique'
import { walletSetActive } from '@workspace/db/wallet/wallet-set-active'
import { walletUpdate } from '@workspace/db/wallet/wallet-update'
import type { WalletUpdateInput } from '@workspace/db/wallet/wallet-update-input'
import { queryClient } from './db-query-client.tsx'
import { dbSettingOptions } from './db-setting-options.tsx'

export type DbWalletCreateMutateOptions = MutateOptions<string, Error, { input: WalletCreateInput }>
export type DbWalletDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletUpdateMutateOptions = MutateOptions<number, Error, { input: WalletUpdateInput }>

export const dbWalletOptions = {
  create: (props: DbWalletCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: WalletCreateInput }) => walletCreate(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(dbSettingOptions.getAll())
        queryClient.invalidateQueries(dbSettingOptions.getValue('activeWalletId'))
      },
      ...props,
    }),
  delete: (props: DbWalletDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletDelete(db, id),
      ...props,
    }),
  findMany: (input: WalletFindManyInput) =>
    queryOptions({
      queryFn: () => walletFindMany(db, input),
      queryKey: ['walletFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => walletFindUnique(db, id),
      queryKey: ['walletFindUnique', id],
    }),
  setActive: (props: DbWalletSetActiveMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => walletSetActive(db, id),
      onSuccess: () => {
        queryClient.invalidateQueries(dbSettingOptions.getAll())
        queryClient.invalidateQueries(dbSettingOptions.getValue('activeWalletId'))
        queryClient.invalidateQueries(dbSettingOptions.getValue('activeAccountId'))
      },
      ...props,
    }),
  update: (props: DbWalletUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: WalletUpdateInput }) => walletUpdate(db, id, input),
      ...props,
    }),
}
