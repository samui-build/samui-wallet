import type { Lamports } from '@workspace/solana-client'

import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'

export function PortfolioUiBalanceSol({ balance }: { balance: Lamports }) {
  return <span>{lamportsToSol(balance)}</span>
}
