import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from './use-solana-client.tsx'

export function getSignaturesForAddressQueryOptions({
  network,
  address,
  client,
}: {
  network: Network
  address: Address
  client: SolanaClient
}) {
  return queryOptions({
    queryFn: () => getSignaturesForAddress(client, address),
    queryKey: ['getSignaturesForAddress', network.endpoint, address],
  })
}

export function useGetSignaturesForAddress({ network, address }: { network: Network; address: Address }) {
  const client = useSolanaClient({ network })

  return useQuery(getSignaturesForAddressQueryOptions({ address, client, network }))
}

async function getSignaturesForAddress(client: SolanaClient, address: Address) {
  return client.rpc.getSignaturesForAddress(address).send()
}
