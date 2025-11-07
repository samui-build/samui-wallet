import { useMutation } from '@tanstack/react-query'
import type { DbNetworkCreateMutateOptions } from './db-network-options.tsx'
import { dbNetworkOptions } from './db-network-options.tsx'

export function useDbNetworkCreate(props: DbNetworkCreateMutateOptions = {}) {
  return useMutation(dbNetworkOptions.create(props))
}
