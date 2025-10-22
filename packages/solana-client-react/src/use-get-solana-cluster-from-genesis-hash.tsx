import { useMutation } from '@tanstack/react-query'
import { createSolanaClient } from '@workspace/solana-client/create-solana-client'
import { getSolanaClusterFromGenesisHash } from '@workspace/solana-client/get-solana-cluster-from-genesis-hash'

export function useGetSolanaClusterFromGenesisHash() {
  return useMutation({
    mutationFn: async (endpoint: string) => {
      const client = createSolanaClient({ url: endpoint })
      const hash = await client.rpc.getGenesisHash().send()
      return getSolanaClusterFromGenesisHash(hash)
    },
  })
}
