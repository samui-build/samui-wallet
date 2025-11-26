import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { useSolanaClient } from './use-solana-client.tsx'

export function useGetSignaturesForAddress({ network, address }: { network: Network; address: Address }) {
  const client = useSolanaClient({ network })
  return useQuery({
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
    queryKey: ['getSignaturesForAddress', network.endpoint, address],
  })
}
