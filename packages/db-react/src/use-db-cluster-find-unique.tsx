import { useQuery } from '@tanstack/react-query'

import { dbClusterOptions } from './db-cluster-options'

export function useDbClusterFindUnique({ id }: { id: string }) {
  return useQuery(dbClusterOptions.findUnique(id))
}
