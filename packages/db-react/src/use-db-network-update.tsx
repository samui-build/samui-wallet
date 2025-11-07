import { useMutation } from '@tanstack/react-query'
import type { DbNetworkUpdateMutateOptions } from './db-network-options.tsx'
import { dbNetworkOptions } from './db-network-options.tsx'

export function useDbNetworkUpdate(props: DbNetworkUpdateMutateOptions = {}) {
  return useMutation(dbNetworkOptions.update(props))
}
