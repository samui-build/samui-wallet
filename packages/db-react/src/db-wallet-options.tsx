import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbWalletDelete } from '@workspace/db/db-wallet-delete'
import { walletCreate } from '@workspace/db/wallet/wallet-create'
import { walletFindMany } from '@workspace/db/wallet/wallet-find-many'
import { walletFindUnique } from '@workspace/db/wallet/wallet-find-unique'
import type { WalletInputCreate } from '@workspace/db/wallet/wallet-input-create'
import type { WalletInputFindMany } from '@workspace/db/wallet/wallet-input-find-many'
import type { WalletInputUpdate } from '@workspace/db/wallet/wallet-input-update'
import { walletSetActive } from '@workspace/db/wallet/wallet-set-active'
import { walletUpdate } from '@workspace/db/wallet/wallet-update'

export type DbWalletCreateMutateOptions = MutateOptions<string, Error, { input: WalletInputCreate }>
export type DbWalletDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletUpdateMutateOptions = MutateOptions<number, Error, { input: WalletInputUpdate }>

export const dbWalletOptions = {
  create: (props: DbWalletCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: WalletInputCreate }) => walletCreate(db, input),
      ...props,
    }),
  delete: (props: DbWalletDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbWalletDelete(db, id),
      ...props,
    }),
  findMany: (input: WalletInputFindMany) =>
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
      ...props,
    }),
  update: (props: DbWalletUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: WalletInputUpdate }) => walletUpdate(db, id, input),
      ...props,
    }),
}
