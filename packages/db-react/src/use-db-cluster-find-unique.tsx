import { useQuery } from '@tanstack/react-query'

import { dbClusterOptions } from './db-cluster-options.tsx'

export function useDbClusterFindUnique({ id }: { id: string }) {
  return useQuery(dbClusterOptions.findUnique(id))
}
