import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { accountCreate } from '@workspace/db/account/account-create'
import type { AccountCreateInput } from '@workspace/db/account/account-create-input'
import { accountDelete } from '@workspace/db/account/account-delete'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import type { AccountFindManyInput } from '@workspace/db/account/account-find-many-input'
import { accountFindUnique } from '@workspace/db/account/account-find-unique'
import { accountReadSecretKey } from '@workspace/db/account/account-read-secret-key'
import { accountSetActive } from '@workspace/db/account/account-set-active'
import { accountUpdate } from '@workspace/db/account/account-update'
import type { AccountUpdateInput } from '@workspace/db/account/account-update-input'
import { db } from '@workspace/db/db'
import { optionsSetting } from './options-setting.tsx'
import { queryClient } from './query-client.tsx'

export type AccountCreateMutateOptions = MutateOptions<string, Error, { input: AccountCreateInput }>
export type AccountDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type AccountReadSecretKeyMutateOptions = MutateOptions<string | undefined, Error, { id: string }>
export type AccountSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type AccountUpdateMutateOptions = MutateOptions<number, Error, { input: AccountUpdateInput }>

export const optionsAccount = {
  create: (props: AccountCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: AccountCreateInput }) => accountCreate(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.getAll())
        queryClient.invalidateQueries(optionsSetting.getValue('activeAccountId'))
      },
      ...props,
    }),
  delete: (props: AccountDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountDelete(db, id),
      ...props,
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
  readSecretKey: (props: AccountReadSecretKeyMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountReadSecretKey(db, id),
      ...props,
    }),
  setActive: (props: AccountSetActiveMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountSetActive(db, id),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.getAll())
        queryClient.invalidateQueries(optionsSetting.getValue('activeWalletId'))
        queryClient.invalidateQueries(optionsSetting.getValue('activeAccountId'))
      },
      ...props,
    }),
  update: (props: AccountUpdateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: AccountUpdateInput }) => accountUpdate(db, id, input),
      ...props,
    }),
}
