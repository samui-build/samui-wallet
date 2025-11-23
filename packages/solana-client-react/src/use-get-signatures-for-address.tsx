import { type Address, assertIsAddress } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { isValidAddress } from '@workspace/solana-client/is-valid-address'
import { useSolanaClient } from './use-solana-client.tsx'

export function useGetSignaturesForAddress({ network, address }: { network: Network; address: Address }) {
  const client = useSolanaClient({ network })
  return useQuery({
    enabled: isValidAddress(address),
    queryFn: () => {
      assertIsAddress(address)
      return client.rpc.getSignaturesForAddress(address).send()
    },
    queryKey: ['getSignaturesForAddress', network.endpoint, address],
  })
}
