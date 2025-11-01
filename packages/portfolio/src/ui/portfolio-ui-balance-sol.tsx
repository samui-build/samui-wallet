import type { Lamports } from '@solana/kit'

import { lamportsToSol } from '@workspace/solana-client/lamports-to-sol'

export function PortfolioUiBalanceSol({ balance }: { balance: Lamports }) {
  return <span>{lamportsToSol(balance)}</span>
}
