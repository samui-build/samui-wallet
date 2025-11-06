import { balanceToNumber } from './balance-to-number.ts'
import { formatUsdValue } from './format-usd-value.ts'

export function formatBalanceUsd({
  balance = 0,
  decimals = 2,
  usdPrice,
}: {
  balance: bigint | number | undefined
  decimals: number
  usdPrice: number | undefined
}) {
  if (!usdPrice) {
    return '$0.00'
  }

  // Handle undefined explicitly to avoid unnecessary BigInt creation or precision loss
  let tokenValue: number
  if (typeof balance === 'bigint') {
    if (balance === 0n) {
      return '$0.00'
    }
    // Use string manipulation for large bigints to avoid precision loss
    tokenValue = balanceToNumber(balance, decimals)
  } else if (typeof balance === 'number') {
    if (balance === 0) {
      return '$0.00'
    }
    // If balance is a number, assume it already represents the correct value (including decimals)
    tokenValue = balance
  } else {
    // balance is undefined or null
    return '$0.00'
  }
  const usdValue = tokenValue * usdPrice

  return formatUsdValue(usdValue)
}
