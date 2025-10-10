import { useMutation } from '@tanstack/react-query'

import type { DbClusterUpdateMutateOptions } from './db-cluster-options'

import { dbClusterOptions } from './db-cluster-options'

export function useDbClusterUpdate(props: DbClusterUpdateMutateOptions = {}) {
  return useMutation(dbClusterOptions.update(props))
}
