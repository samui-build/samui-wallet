import { useQuery } from '@tanstack/react-query'
import type { ClusterInputFindMany } from '@workspace/db/dto/cluster-input-find-many'

import { dbClusterOptions } from './db-cluster-options.tsx'

export function useDbClusterFindMany({ input }: { input: ClusterInputFindMany }) {
  return useQuery(dbClusterOptions.findMany(input))
}
