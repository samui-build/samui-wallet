import type { Signature } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/entity/network'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from '@workspace/solana-client-react/use-solana-client'

export function useExplorerGetTransaction({ network, signature }: { network: Network; signature: Signature }) {
  const client = useSolanaClient({ network })

  return useQuery({
    queryFn: () => getTransaction(client, signature),
    queryKey: ['explorerGetTransaction', network.endpoint, signature],
  })
}

// TODO: Figure out how to properly type this.
// I want to be able to determine the type *if it succeeds*
// I want to have a return type for a 'found tx' that I can use to build my UI.
export type ExplorerGetTransactionResult = Awaited<ReturnType<typeof getTransaction>>

async function getTransaction(client: SolanaClient, signature: Signature) {
  return client.rpc
    .getTransaction(signature, {
      encoding: 'json',
      maxSupportedTransactionVersion: 0,
    })
    .send()
}
