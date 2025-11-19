import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { networkCreate } from '@workspace/db/network/network-create'
import type { NetworkCreateInput } from '@workspace/db/network/network-create-input'
import { networkDelete } from '@workspace/db/network/network-delete'
import { networkFindMany } from '@workspace/db/network/network-find-many'
import type { NetworkFindManyInput } from '@workspace/db/network/network-find-many-input'
import { networkFindUnique } from '@workspace/db/network/network-find-unique'
import { networkUpdate } from '@workspace/db/network/network-update'
import type { NetworkUpdateInput } from '@workspace/db/network/network-update-input'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export type DbNetworkCreateMutateOptions = MutateOptions<string, Error, { input: NetworkCreateInput }>
export type DbNetworkDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbNetworkUpdateMutateOptions = MutateOptions<number, Error, { input: NetworkUpdateInput }>

export const dbNetworkOptions = {
  create: (props: DbNetworkCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: NetworkCreateInput }) => networkCreate(db, input),
      onError: () => toastError('Error creating network'),
      onSuccess: () => toastSuccess('Network created'),
      ...props,
    }),
  delete: (props: DbNetworkDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => networkDelete(db, id),
      onError: () => toastError('Error deleting network'),
      onSuccess: () => toastSuccess('Network deleted'),
      ...props,
    }),
  findMany: (input: NetworkFindManyInput) =>
    queryOptions({
      queryFn: () => networkFindMany(db, input),
      queryKey: ['networkFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => networkFindUnique(db, id),
      queryKey: ['networkFindUnique', id],
    }),
  update: (props: DbNetworkUpdateMutateOptions) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: NetworkUpdateInput }) => networkUpdate(db, id, input),
      onError: () => toastError('Error updating network'),
      onSuccess: () => toastSuccess('Network updated'),
      ...props,
    }),
}
