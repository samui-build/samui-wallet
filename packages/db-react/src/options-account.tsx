import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { accountCreate } from '@workspace/db/account/account-create'
import type { AccountCreateInput } from '@workspace/db/account/account-create-input'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import type { AccountFindManyInput } from '@workspace/db/account/account-find-many-input'
import { accountReadSecretKey } from '@workspace/db/account/account-read-secret-key'
import { accountSetActive } from '@workspace/db/account/account-set-active'
import { db } from '@workspace/db/db'
import { optionsSetting } from './options-setting.tsx'
import { queryClient } from './query-client.tsx'

export type AccountCreateMutateOptions = MutateOptions<string, Error, { input: AccountCreateInput }>
export type AccountReadSecretKeyMutateOptions = MutateOptions<string | undefined, Error, { id: string }>
export type AccountSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>

export const optionsAccount = {
  create: (props: AccountCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: AccountCreateInput }) => accountCreate(db, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.getAll())
        queryClient.invalidateQueries(optionsAccount.findMany({}))
      },
      ...props,
    }),
  findMany: (input: AccountFindManyInput) =>
    queryOptions({
      queryFn: () => accountFindMany(db, input),
      queryKey: ['accountFindMany', input],
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
      },
      ...props,
    }),
}
