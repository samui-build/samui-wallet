import { useMutation } from '@tanstack/react-query'
import type { DbClusterCreateMutateOptions } from './db-cluster-options.tsx'
import { dbClusterOptions } from './db-cluster-options.tsx'

export function useDbClusterCreate(props: DbClusterCreateMutateOptions = {}) {
  return useMutation(dbClusterOptions.create(props))
}
