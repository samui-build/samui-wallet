import { useMutation } from '@tanstack/react-query'

import type { DbClusterCreateMutateOptions } from './db-cluster-options'

import { dbClusterOptions } from './db-cluster-options'

export function useDbClusterCreate(props: DbClusterCreateMutateOptions = {}) {
  return useMutation(dbClusterOptions.create(props))
}
