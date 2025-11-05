import { balanceToNumber } from './utils.ts'

const usdFormatters = new Map<string, Intl.NumberFormat>()

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

export function formatUsdValue(usdValue: number): string {
  if (!Number.isFinite(usdValue) || usdValue === 0) {
    return '$0.00'
  }

  // Handle negative values by working with absolute amount then applying sign
  const isNegative = usdValue < 0
  const absValue = Math.abs(usdValue)

  // Show threshold for sub-cent amounts instead of $0.00
  if (absValue < 0.01 && absValue > 0) {
    return '<$0.01'
  }

  // Format to 2 decimal places like traditional currency eg $123.45, $0.99
  const formatted = getUsdFormatter({
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(absValue)

  return isNegative ? `-${formatted}` : formatted
}

function getUsdFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  // Create a unique key for the formatter based on options
  const key = `max:${options.maximumFractionDigits ?? ''}|min:${options.minimumFractionDigits ?? ''}`
  let formatter = usdFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      currency: 'USD',
      style: 'currency',
      ...options,
    })
    usdFormatters.set(key, formatter)
  }
  return formatter
}
