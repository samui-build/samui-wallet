import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbNetworkCreate } from '@workspace/db/db-network-create'
import { dbNetworkDelete } from '@workspace/db/db-network-delete'
import { dbNetworkFindMany } from '@workspace/db/db-network-find-many'
import { dbNetworkFindUnique } from '@workspace/db/db-network-find-unique'
import { dbNetworkUpdate } from '@workspace/db/db-network-update'
import type { NetworkInputCreate } from '@workspace/db/dto/network-input-create'
import type { NetworkInputFindMany } from '@workspace/db/dto/network-input-find-many'
import type { NetworkInputUpdate } from '@workspace/db/dto/network-input-update'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export type DbNetworkCreateMutateOptions = MutateOptions<string, Error, { input: NetworkInputCreate }>
export type DbNetworkDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbNetworkUpdateMutateOptions = MutateOptions<number, Error, { input: NetworkInputUpdate }>

export const dbNetworkOptions = {
  create: (props: DbNetworkCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: NetworkInputCreate }) => dbNetworkCreate(db, input),
      onError: () => toastError('Error creating network'),
      onSuccess: () => toastSuccess('Network created'),
      ...props,
    }),
  delete: (props: DbNetworkDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbNetworkDelete(db, id),
      onError: () => toastError('Error deleting network'),
      onSuccess: () => toastSuccess('Network deleted'),
      ...props,
    }),
  findMany: (input: NetworkInputFindMany) =>
    queryOptions({
      queryFn: () => dbNetworkFindMany(db, input),
      queryKey: ['dbNetworkFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => dbNetworkFindUnique(db, id),
      queryKey: ['dbNetworkFindUnique', id],
    }),
  update: (props: DbNetworkUpdateMutateOptions) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: NetworkInputUpdate }) => dbNetworkUpdate(db, id, input),
      onError: () => toastError('Error updating network'),
      onSuccess: () => toastSuccess('Network updated'),
      ...props,
    }),
}
