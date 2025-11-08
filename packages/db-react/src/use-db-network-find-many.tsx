import { useQuery } from '@tanstack/react-query'
import type { NetworkInputFindMany } from '@workspace/db/dto/network-input-find-many'

import { dbNetworkOptions } from './db-network-options.tsx'

export function useDbNetworkFindMany({ input }: { input: NetworkInputFindMany }) {
  return useQuery(dbNetworkOptions.findMany(input))
}
