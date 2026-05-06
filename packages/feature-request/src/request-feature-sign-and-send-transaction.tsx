import type { SolanaSignAndSendTransactionInput } from '@solana/wallet-standard-features'
import { useRouteLoaderData } from 'react-router'

import { RequestUiSignAndSendTransaction } from './ui/request-ui-sign-and-send-transaction.tsx'

export function RequestFeatureSignAndSendTransaction() {
  const data = useRouteLoaderData('request') as SolanaSignAndSendTransactionInput[]

  return <RequestUiSignAndSendTransaction data={data} />
}
