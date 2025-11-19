import { useQuery } from '@tanstack/react-query'
import type { NetworkFindManyInput } from '@workspace/db/network/network-find-many-input'

import { dbNetworkOptions } from './db-network-options.tsx'

export function useDbNetworkFindMany({ input }: { input: NetworkFindManyInput }) {
  return useQuery(dbNetworkOptions.findMany(input))
}
