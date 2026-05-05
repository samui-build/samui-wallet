import { queryOptions, useQuery } from '@tanstack/react-query'
import { getTokenMetadataJupiter } from '@workspace/solana-client/get-token-metadata-jupiter'

export function getTokenMetadataJupiterQueryOptions(mints: string[]) {
  return queryOptions({
    enabled: !!mints.length,
    networkMode: 'offlineFirst',
    queryFn: () => getTokenMetadataJupiter(mints),
    queryKey: ['getTokenMetadataJupiter', mints],
    retry: false,
    staleTime: Infinity,
  })
}

export function useGetTokenMetadataJupiter(mints: string[]) {
  return useQuery(getTokenMetadataJupiterQueryOptions(mints))
}
