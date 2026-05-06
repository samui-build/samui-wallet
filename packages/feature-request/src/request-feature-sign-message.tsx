import type { SolanaSignMessageInput } from '@solana/wallet-standard-features'
import { useRouteLoaderData } from 'react-router'

import { RequestUiSignMessage } from './ui/request-ui-sign-message.tsx'

export function RequestFeatureSignMessage() {
  const data = useRouteLoaderData('request') as SolanaSignMessageInput[]

  return <RequestUiSignMessage data={data} />
}
