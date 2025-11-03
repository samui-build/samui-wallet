import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbWalletCreate } from '@workspace/db/db-wallet-create'
import { dbWalletDelete } from '@workspace/db/db-wallet-delete'
import { dbWalletFindMany } from '@workspace/db/db-wallet-find-many'
import { dbWalletFindUnique } from '@workspace/db/db-wallet-find-unique'
import { dbWalletSetActive } from '@workspace/db/db-wallet-set-active'
import { dbWalletUpdate } from '@workspace/db/db-wallet-update'
import type { WalletInputCreate } from '@workspace/db/dto/wallet-input-create'
import type { WalletInputFindMany } from '@workspace/db/dto/wallet-input-find-many'
import type { WalletInputUpdate } from '@workspace/db/dto/wallet-input-update'

export type DbWalletCreateMutateOptions = MutateOptions<string, Error, { input: WalletInputCreate }>
export type DbWalletDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletUpdateMutateOptions = MutateOptions<number, Error, { input: WalletInputUpdate }>

export const dbWalletOptions = {
  create: (props: DbWalletCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: WalletInputCreate }) => dbWalletCreate(db, input),
      ...props,
    }),
  delete: (props: DbWalletDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbWalletDelete(db, id),
      ...props,
    }),
  findMany: (input: WalletInputFindMany) =>
    queryOptions({
      queryFn: () => dbWalletFindMany(db, input),
      queryKey: ['dbWalletFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => dbWalletFindUnique(db, id),
      queryKey: ['dbWalletFindUnique', id],
    }),
  setActive: (props: DbWalletSetActiveMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbWalletSetActive(db, id),
      ...props,
    }),
  update: (props: DbWalletUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: WalletInputUpdate }) => dbWalletUpdate(db, id, input),
      ...props,
    }),
}
