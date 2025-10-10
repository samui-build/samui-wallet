import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbWalletCreate, type DbWalletCreateInput } from '@workspace/db/db-wallet-create'
import { dbWalletDelete } from '@workspace/db/db-wallet-delete'
import { dbWalletFindMany, type DbWalletFindManyInput } from '@workspace/db/db-wallet-find-many'
import { dbWalletFindUnique } from '@workspace/db/db-wallet-find-unique'
import { dbWalletUpdate, type DbWalletUpdateInput } from '@workspace/db/db-wallet-update'

export type DbWalletCreateMutateOptions = MutateOptions<string, Error, { input: DbWalletCreateInput }>
export type DbWalletDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbWalletUpdateMutateOptions = MutateOptions<number, Error, { input: DbWalletUpdateInput }>

export const dbWalletOptions = {
  create: (props: DbWalletCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: DbWalletCreateInput }) => dbWalletCreate(db, input),
      ...props,
    }),
  delete: (props: DbWalletDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbWalletDelete(db, id),
      ...props,
    }),
  findMany: (input: DbWalletFindManyInput) =>
    queryOptions({
      queryFn: () => dbWalletFindMany(db, input),
      queryKey: ['dbWalletFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => dbWalletFindUnique(db, id),
      queryKey: ['dbWalletFindUnique', id],
    }),
  update: (props: DbWalletUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: DbWalletUpdateInput }) => dbWalletUpdate(db, id, input),
      ...props,
    }),
}
