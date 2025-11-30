import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useGetTokenBalances } from './use-get-token-metadata.ts'

export function usePortfolioTokenMint({ token = '' }: { token?: string | undefined }) {
  const account = useAccountActive()
  const network = useNetworkActive()
  const balances = useGetTokenBalances({ address: account.publicKey, network })

  return balances.find((item) => item.mint === token)
}
