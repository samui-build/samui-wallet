import type { ClusterInputCreate } from '@workspace/db/dto/cluster-input-create'
import type { ClusterInputFindMany } from '@workspace/db/dto/cluster-input-find-many'
import type { ClusterInputUpdate } from '@workspace/db/dto/cluster-input-update'

import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbClusterCreate } from '@workspace/db/db-cluster-create'
import { dbClusterDelete } from '@workspace/db/db-cluster-delete'
import { dbClusterFindMany } from '@workspace/db/db-cluster-find-many'
import { dbClusterFindUnique } from '@workspace/db/db-cluster-find-unique'
import { dbClusterUpdate } from '@workspace/db/db-cluster-update'
import { toastError } from '@workspace/ui/lib/toast-error'
import { toastSuccess } from '@workspace/ui/lib/toast-success'

export type DbClusterCreateMutateOptions = MutateOptions<string, Error, { input: ClusterInputCreate }>
export type DbClusterDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbClusterUpdateMutateOptions = MutateOptions<number, Error, { input: ClusterInputUpdate }>

export const dbClusterOptions = {
  create: (props: DbClusterCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: ClusterInputCreate }) => dbClusterCreate(db, input),
      onError: () => toastError('Error creating cluster'),
      onSuccess: () => toastSuccess('Cluster created'),
      ...props,
    }),
  delete: (props: DbClusterDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbClusterDelete(db, id),
      onError: () => toastError('Error deleting cluster'),
      onSuccess: () => toastSuccess('Cluster deleted'),
      ...props,
    }),
  findMany: (input: ClusterInputFindMany) =>
    queryOptions({
      queryFn: () => dbClusterFindMany(db, input),
      queryKey: ['dbClusterFindMany', input],
    }),
  findUnique: (id: string) =>
    queryOptions({
      queryFn: () => dbClusterFindUnique(db, id),
      queryKey: ['dbClusterFindUnique', id],
    }),
  update: (props: DbClusterUpdateMutateOptions) =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: ClusterInputUpdate }) => dbClusterUpdate(db, id, input),
      onError: () => toastError('Error updating cluster'),
      onSuccess: () => toastSuccess('Cluster updated'),
      ...props,
    }),
}
