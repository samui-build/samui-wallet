import { useMutation } from '@tanstack/react-query'
import { createSolanaClient } from '@workspace/solana-client/create-solana-client'
import { getSolanaNetworkFromGenesisHash } from '@workspace/solana-client/get-solana-network-from-genesis-hash'

export function useGetSolanaNetworkFromGenesisHash() {
  return useMutation({
    mutationFn: async (endpoint: string) => {
      const client = createSolanaClient({ url: endpoint })
      const hash = await client.rpc.getGenesisHash().send()
      return getSolanaNetworkFromGenesisHash(hash)
    },
  })
}
