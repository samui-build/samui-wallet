import { type MutateOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import { db } from '@workspace/db/db'
import { dbClusterCreate, type DbClusterCreateInput } from '@workspace/db/db-cluster-create'
import { dbClusterDelete } from '@workspace/db/db-cluster-delete'
import { dbClusterFindMany, type DbClusterFindManyInput } from '@workspace/db/db-cluster-find-many'
import { dbClusterFindUnique } from '@workspace/db/db-cluster-find-unique'
import { dbClusterUpdate, type DbClusterUpdateInput } from '@workspace/db/db-cluster-update'

export type DbClusterCreateMutateOptions = MutateOptions<string, Error, { input: DbClusterCreateInput }>
export type DbClusterDeleteMutateOptions = MutateOptions<void, Error, { id: string }>
export type DbClusterUpdateMutateOptions = MutateOptions<number, Error, { input: DbClusterUpdateInput }>

export const dbClusterOptions = {
  create: (props: DbClusterCreateMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ input }: { input: DbClusterCreateInput }) => dbClusterCreate(db, input),
      ...props,
    }),
  delete: (props: DbClusterDeleteMutateOptions = {}) =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => dbClusterDelete(db, id),
      ...props,
    }),
  findMany: (input: DbClusterFindManyInput) =>
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
      mutationFn: ({ id, input }: { id: string; input: DbClusterUpdateInput }) => dbClusterUpdate(db, id, input),
      ...props,
    }),
}
