import type { Signature } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { getTransaction } from '@workspace/solana-client/get-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function getTransactionQueryOptions({
  network,
  signature,
  client,
}: {
  network: Network
  signature: Signature
  client: SolanaClient
}) {
  return queryOptions({
    queryFn: () => getTransaction(client, { signature }),
    queryKey: ['getTransaction', network.endpoint, signature],
  })
}

export function useGetTransaction({ network, signature }: { network: Network; signature: Signature }) {
  const client = useSolanaClient({ network })

  return useQuery(getTransactionQueryOptions({ client, network, signature }))
}
