import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import type { DbContext } from '@workspace/db/db-context'
import { networkCreate } from '@workspace/db/network/network-create'
import type { NetworkCreateInput } from '@workspace/db/network/network-create-input'
import { networkDelete } from '@workspace/db/network/network-delete'
import { networkFindMany } from '@workspace/db/network/network-find-many'
import type { NetworkFindManyInput } from '@workspace/db/network/network-find-many-input'
import { networkUpdate } from '@workspace/db/network/network-update'
import type { NetworkUpdateInput } from '@workspace/db/network/network-update-input'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'
import { queryClient } from './query-client.tsx'

export type NetworkCreateMutateOptions = MutateOptions<string, Error, { input: NetworkCreateInput }>
export type NetworkDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type NetworkUpdateMutateOptions = MutateOptions<number, Error, { input: NetworkUpdateInput }>

export const optionsNetwork = {
  create: (ctx: DbContext, props: NetworkCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: NetworkCreateInput }) => networkCreate(ctx, input),
      onError: () => toastError('Error creating network'),
      onSuccess: () => {
        toastSuccess('Network created')
        queryClient.invalidateQueries(optionsNetwork.findMany(ctx, {}))
      },
      ...props,
    }),
  delete: (ctx: DbContext, props: NetworkDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => networkDelete(ctx, id),
      onError: () => toastError('Error deleting network'),
      onSuccess: () => {
        toastSuccess('Network deleted')
        queryClient.invalidateQueries(optionsNetwork.findMany(ctx, {}))
      },
      ...props,
    }),
  findMany: (ctx: DbContext, input: NetworkFindManyInput) =>
    queryOptions({
      queryFn: () => networkFindMany(ctx, input),
      queryKey: ['networkFindMany', input],
    }),
  update: (ctx: DbContext, props: NetworkUpdateMutateOptions) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: NetworkUpdateInput }) => networkUpdate(ctx, id, input),
      onError: () => toastError('Error updating network'),
      onSuccess: () => {
        toastSuccess('Network updated')
        queryClient.invalidateQueries(optionsNetwork.findMany(ctx, {}))
      },
      ...props,
    }),
}
