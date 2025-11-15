import { balanceToNumber } from './balance-to-number.ts'
import { formatUsdValue } from './format-usd-value.ts'

export function formatBalanceUsd({
  balance,
  decimals,
  usdPrice,
}: {
  balance: bigint | number | undefined
  decimals: number
  usdPrice: number | undefined
}) {
  if (!balance || balance === 0n || balance === 0 || !usdPrice) {
    return '$0.00'
  }

  if (typeof balance === 'bigint') {
    const tokenValue = balanceToNumber({ balance, decimals })
    return formatUsdValue(tokenValue * usdPrice)
  }
  return formatUsdValue(balance * usdPrice)
}
