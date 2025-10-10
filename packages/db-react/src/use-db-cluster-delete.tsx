import { useMutation } from '@tanstack/react-query'

import type { DbClusterDeleteMutateOptions } from './db-cluster-options'

import { dbClusterOptions } from './db-cluster-options'

export function useDbClusterDelete(props: DbClusterDeleteMutateOptions = {}) {
  return useMutation(dbClusterOptions.delete(props))
}
