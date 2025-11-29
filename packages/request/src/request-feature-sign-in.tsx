import type { SolanaSignInInput } from '@solana/wallet-standard-features'
import { useRouteLoaderData } from 'react-router'

import { RequestUiSignIn } from './ui/request-ui-sign-in.tsx'

export function RequestFeatureSignIn() {
  const data = useRouteLoaderData('request') as SolanaSignInInput[]

  return <RequestUiSignIn data={data} />
}
