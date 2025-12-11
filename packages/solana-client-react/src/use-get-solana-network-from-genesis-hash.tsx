import { mutationOptions, useMutation } from '@tanstack/react-query'
import { createSolanaClient } from '@workspace/solana-client/create-solana-client'
import { getSolanaNetworkFromGenesisHash } from '@workspace/solana-client/get-solana-network-from-genesis-hash'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

export function getSolanaNetworkFromGenesisHashMutationOptions() {
  return mutationOptions({
    mutationFn: async (endpoint: string) => {
      const client = createSolanaClient({ url: endpoint })
      const hash = await getGenesisHash(client)
      return getSolanaNetworkFromGenesisHash(hash)
    },
  })
}

export function useGetSolanaNetworkFromGenesisHash() {
  return useMutation(getSolanaNetworkFromGenesisHashMutationOptions())
}

export async function getGenesisHash(client: SolanaClient) {
  return client.rpc.getGenesisHash().send()
}
