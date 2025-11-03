import { useMutation } from '@tanstack/react-query'
import type { DbClusterUpdateMutateOptions } from './db-cluster-options.tsx'
import { dbClusterOptions } from './db-cluster-options.tsx'

export function useDbClusterUpdate(props: DbClusterUpdateMutateOptions = {}) {
  return useMutation(dbClusterOptions.update(props))
}
