import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbAccountCreate, type DbAccountCreateInput } from '@workspace/db/db-account-create'
import { dbAccountDelete } from '@workspace/db/db-account-delete'
import { dbAccountFindMany, type DbAccountFindManyInput } from '@workspace/db/db-account-find-many'
import { dbAccountFindUnique } from '@workspace/db/db-account-find-unique'
import { dbAccountUpdate, type DbAccountUpdateInput } from '@workspace/db/db-account-update'

export type DbAccountCreateMutateOptions = MutateOptions<string, Error, { input: DbAccountCreateInput }>
export type DbAccountDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbAccountUpdateMutateOptions = MutateOptions<number, Error, { input: DbAccountUpdateInput }>

export const dbAccountOptions = {
  create: (props: DbAccountCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: DbAccountCreateInput }) => dbAccountCreate(db, input),
      ...props,
    }),
  delete: (props: DbAccountDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbAccountDelete(db, id),
      ...props,
    }),
  findMany: (input: DbAccountFindManyInput) =>
    queryOptions({
      queryFn: () => dbAccountFindMany(db, input),
      queryKey: ['dbAccountFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => dbAccountFindUnique(db, id),
      queryKey: ['dbAccountFindUnique', id],
    }),
  update: (props: DbAccountUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: DbAccountUpdateInput }) => dbAccountUpdate(db, id, input),
      ...props,
    }),
}
