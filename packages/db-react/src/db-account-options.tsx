import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { accountCreate } from '@workspace/db/account/account-create'
import type { AccountCreateInput } from '@workspace/db/account/account-create-input'
import { accountDelete } from '@workspace/db/account/account-delete'
import { accountFindByWalletId } from '@workspace/db/account/account-find-by-wallet-id'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import type { AccountFindManyInput } from '@workspace/db/account/account-find-many-input'
import { accountFindUnique } from '@workspace/db/account/account-find-unique'
import { accountSetActive } from '@workspace/db/account/account-set-active'
import { accountUpdate } from '@workspace/db/account/account-update'
import type { AccountUpdateInput } from '@workspace/db/account/account-update-input'
import { db } from '@workspace/db/db'
import { queryClient } from './db-query-client.tsx'
import { dbSettingOptions } from './db-setting-options.tsx'

export type DbAccountCreateMutateOptions = MutateOptions<string, Error, { input: AccountCreateInput }>
export type DbAccountDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbAccountSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbAccountUpdateMutateOptions = MutateOptions<number, Error, { input: AccountUpdateInput }>

export const dbAccountOptions = {
  create: (props: DbAccountCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: AccountCreateInput }) => accountCreate(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(dbSettingOptions.getAll())
        queryClient.invalidateQueries(dbSettingOptions.getValue('activeAccountId'))
      },
      ...props,
    }),
  delete: (props: DbAccountDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountDelete(db, id),
      ...props,
    }),
  findByWalletId: (id: string) =>
    queryOptions({
      queryFn: () => accountFindByWalletId(db, id),
      queryKey: ['accountFindByWalletId', id],
    }),
  findMany: (input: AccountFindManyInput) =>
    queryOptions({
      queryFn: () => accountFindMany(db, input),
      queryKey: ['accountFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => accountFindUnique(db, id),
      queryKey: ['accountFindUnique', id],
    }),
  setActive: (props: DbAccountSetActiveMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountSetActive(db, id),
      onSuccess: () => {
        queryClient.invalidateQueries(dbSettingOptions.getAll())
        queryClient.invalidateQueries(dbSettingOptions.getValue('activeWalletId'))
        queryClient.invalidateQueries(dbSettingOptions.getValue('activeAccountId'))
      },
      ...props,
    }),
  update: (props: DbAccountUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: AccountUpdateInput }) => accountUpdate(db, id, input),
      ...props,
    }),
}
