import type { SolanaSignTransactionInput } from '@solana/wallet-standard-features'
import { useRouteLoaderData } from 'react-router'

import { RequestUiSignTransaction } from './ui/request-ui-sign-transaction.tsx'

export function RequestFeatureSignTransaction() {
  const data = useRouteLoaderData('request') as SolanaSignTransactionInput[]

  return <RequestUiSignTransaction data={data} />
}
