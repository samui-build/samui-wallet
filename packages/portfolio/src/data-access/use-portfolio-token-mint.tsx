import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useGetTokenBalances } from './use-get-token-metadata.ts'

export function usePortfolioTokenMint({ token = '' }: { token?: string | undefined }) {
  const { publicKey: address } = useAccountActive()
  const network = useNetworkActive()
  const balances = useGetTokenBalances({ address, network })

  return balances.find((item) => item.mint === token)
}
