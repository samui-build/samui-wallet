import { useQuery } from '@tanstack/react-query'

import { optionsNetwork } from './options-network.tsx'

export function useNetworkFindUnique({ id }: { id: string }) {
  return useQuery(optionsNetwork.findUnique(id))
}
