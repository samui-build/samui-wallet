import type { Signature } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { getTransactionBase64 } from '@workspace/solana-client/get-transaction-base64'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function getTransactionBase64QueryOptions({
  client,
  network,
  signature,
}: {
  client: SolanaClient
  network: Network
  signature: Signature
}) {
  return queryOptions({
    queryFn: () => getTransactionBase64(client, { signature }),
    queryKey: ['getTransactionBase64', network.endpoint, signature],
  })
}

export function useGetTransactionBase64({ network, signature }: { network: Network; signature: Signature }) {
  const client = useSolanaClient({ network })

  return useQuery(getTransactionBase64QueryOptions({ client, network, signature }))
}
