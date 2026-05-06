import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useGetTokenBalances } from './use-get-token-balances.ts'

export function usePortfolioTokenMint({
  address,
  network,
  token = '',
}: {
  address: Address
  network: Network
  token?: string | undefined
}) {
  const balances = useGetTokenBalances({ address, network })

  return balances.find((item) => item.mint === token)
}
