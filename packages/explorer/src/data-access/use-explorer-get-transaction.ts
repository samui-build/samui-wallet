import type { Signature } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function explorerGetTransactionQueryOptions({
  network,
  signature,
  client,
}: {
  network: Network
  signature: Signature
  client: SolanaClient
}) {
  return queryOptions({
    queryFn: () => getTransaction(client, signature),
    queryKey: ['explorerGetTransaction', network.endpoint, signature],
  })
}

export function useExplorerGetTransaction({ network, signature }: { network: Network; signature: Signature }) {
  const client = useSolanaClient({ network })

  return useQuery(explorerGetTransactionQueryOptions({ client, network, signature }))
}

export type ExplorerGetTransactionResult = NonNullable<Awaited<ReturnType<typeof getTransaction>>>
export type ExplorerGetTransactionResultInstruction =
  // biome-ignore lint/suspicious/noExplicitAny: ongoing type confusion
  ExplorerGetTransactionResult['transaction']['message']['instructions'][number] & { parsed?: any }
async function getTransaction(client: SolanaClient, signature: Signature) {
  return client.rpc
    .getTransaction(signature, {
      encoding: 'jsonParsed',
      maxSupportedTransactionVersion: 0,
    })
    .send()
}
