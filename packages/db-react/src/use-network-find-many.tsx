import { useQuery } from '@tanstack/react-query'
import type { NetworkFindManyInput } from '@workspace/db/network/network-find-many-input'

import { optionsNetwork } from './options-network.tsx'

export function useNetworkFindMany({ input }: { input: NetworkFindManyInput }) {
  return useQuery(optionsNetwork.findMany(input))
}
