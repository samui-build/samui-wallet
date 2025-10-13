import type { ClusterInputFindMany } from '@workspace/db/dto/cluster-input-find-many'

import { useQuery } from '@tanstack/react-query'

import { dbClusterOptions } from './db-cluster-options'

export function useDbClusterFindMany({ input }: { input: ClusterInputFindMany }) {
  return useQuery(dbClusterOptions.findMany(input))
}
