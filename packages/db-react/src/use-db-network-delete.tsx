import { useMutation } from '@tanstack/react-query'
import type { DbNetworkDeleteMutateOptions } from './db-network-options.tsx'
import { dbNetworkOptions } from './db-network-options.tsx'

export function useDbNetworkDelete(props: DbNetworkDeleteMutateOptions = {}) {
  return useMutation(dbNetworkOptions.delete(props))
}
