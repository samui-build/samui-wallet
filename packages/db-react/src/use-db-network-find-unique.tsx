import { useQuery } from '@tanstack/react-query'

import { dbNetworkOptions } from './db-network-options.tsx'

export function useDbNetworkFindUnique({ id }: { id: string }) {
  return useQuery(dbNetworkOptions.findUnique(id))
}
