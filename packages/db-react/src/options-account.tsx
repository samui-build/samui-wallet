import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { accountCreate } from '@workspace/db/account/account-create'
import type { AccountCreateInput } from '@workspace/db/account/account-create-input'
import { accountDelete } from '@workspace/db/account/account-delete'
import { accountFindMany } from '@workspace/db/account/account-find-many'
import type { AccountFindManyInput } from '@workspace/db/account/account-find-many-input'
import { accountReadSecretKey } from '@workspace/db/account/account-read-secret-key'
import { accountSetActive } from '@workspace/db/account/account-set-active'
import { accountUpdateOrder } from '@workspace/db/account/account-update-order'
import type { AccountUpdateOrderInput } from '@workspace/db/account/account-update-order-input'
import type { DbContext } from '@workspace/db/db-context'
import { optionsSetting } from './options-setting.tsx'
import { queryClient } from './query-client.tsx'

export type AccountCreateMutateOptions = MutateOptions<string, Error, { input: AccountCreateInput }>
export type AccountDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type AccountReadSecretKeyMutateOptions = MutateOptions<string | undefined, Error, { id: string }>
export type AccountSetActiveMutateOptions = MutateOptions<void, Error, { id: string }>
export type AccountUpdateOrderMutateOptions = MutateOptions<void, Error, { input: AccountUpdateOrderInput }>

export const optionsAccount = {
  create: (ctx: DbContext, props: AccountCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: AccountCreateInput }) => accountCreate(ctx, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.findMany(ctx, {}))
        queryClient.invalidateQueries(optionsAccount.findMany(ctx, {}))
      },
      ...props,
    }),
  delete: (ctx: DbContext, props: AccountDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountDelete(ctx, id),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsAccount.findMany(ctx, {}))
      },
      ...props,
    }),
  findMany: (ctx: DbContext, input: AccountFindManyInput) =>
    queryOptions({
      queryFn: () => accountFindMany(ctx, input),
      queryKey: ['accountFindMany', input],
    }),
  readSecretKey: (ctx: DbContext, props: AccountReadSecretKeyMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountReadSecretKey(ctx, id),
      ...props,
    }),
  setActive: (ctx: DbContext, props: AccountSetActiveMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => accountSetActive(ctx, id),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsSetting.findMany(ctx, {}))
      },
      ...props,
    }),
  updateOrder: (ctx: DbContext, props: AccountUpdateOrderMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: AccountUpdateOrderInput }) => accountUpdateOrder(ctx, input),
      onSuccess: () => {
        queryClient.invalidateQueries(optionsAccount.findMany(ctx, {}))
      },
      ...props,
    }),
}
