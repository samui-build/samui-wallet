import { useMutation } from '@tanstack/react-query'
import type { DbClusterDeleteMutateOptions } from './db-cluster-options.tsx'
import { dbClusterOptions } from './db-cluster-options.tsx'

export function useDbClusterDelete(props: DbClusterDeleteMutateOptions = {}) {
  return useMutation(dbClusterOptions.delete(props))
}
