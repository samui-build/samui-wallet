import type { AccountInputCreate } from '@workspace/db/dto/account-input-create'
import type { AccountInputFindMany } from '@workspace/db/dto/account-input-find-many'
import type { AccountInputUpdate } from '@workspace/db/dto/account-input-update'

import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbAccountCreate } from '@workspace/db/db-account-create'
import { dbAccountDelete } from '@workspace/db/db-account-delete'
import { dbAccountFindMany } from '@workspace/db/db-account-find-many'
import { dbAccountFindUnique } from '@workspace/db/db-account-find-unique'
import { dbAccountUpdate } from '@workspace/db/db-account-update'

export type DbAccountCreateMutateOptions = MutateOptions<string, Error, { input: AccountInputCreate }>
export type DbAccountDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbAccountUpdateMutateOptions = MutateOptions<number, Error, { input: AccountInputUpdate }>

export const dbAccountOptions = {
  create: (props: DbAccountCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: AccountInputCreate }) => dbAccountCreate(db, input),
      ...props,
    }),
  delete: (props: DbAccountDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbAccountDelete(db, id),
      ...props,
    }),
  findMany: (input: AccountInputFindMany) =>
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
      mutationFn: ({ id, input }: { id: string; input: AccountInputUpdate }) => dbAccountUpdate(db, id, input),
      ...props,
    }),
}
