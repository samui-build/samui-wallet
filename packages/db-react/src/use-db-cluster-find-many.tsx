import type { DbClusterFindManyInput } from '@workspace/db/db-cluster-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbClusterOptions } from './db-cluster-options'

export function useDbClusterFindMany({ input }: { input: DbClusterFindManyInput }) {
  return useQuery(dbClusterOptions.findMany(input))
}
