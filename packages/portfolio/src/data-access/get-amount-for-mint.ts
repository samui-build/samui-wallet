import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { uiAmountToBigInt } from '@workspace/solana-client/ui-amount-to-big-int'
import type { TokenBalance } from './use-get-token-metadata.ts'

export function getAmountForMint({ amount, mint }: { amount: string; mint: TokenBalance }) {
  if (mint.mint === NATIVE_MINT) {
    return uiAmountToBigInt(amount, 9)
  }
  return uiAmountToBigInt(amount, mint.decimals)
}
