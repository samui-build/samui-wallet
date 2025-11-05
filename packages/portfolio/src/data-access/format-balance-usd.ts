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

  // Handle undefined explicitly to avoid unnecessary BigInt creation
  const balanceNum = typeof balance === 'bigint' ? balance : balance ? BigInt(balance) : 0n

  if (balanceNum === 0n) {
    return '$0.00'
  }

  // Use string manipulation for large bigints to avoid precision loss
  const tokenValue = balanceToNumber(balanceNum, decimals)
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

// Convert bigint balance to number considering decimals
function balanceToNumber(balance: bigint, decimals: number): number {
  // Convert bigint to string for manipulation
  const balanceStr = balance.toString()
  const isNegative = balance < 0n
  const absStr = isNegative ? balanceStr.slice(1) : balanceStr

  if (absStr.length <= decimals) {
    // Pad with leading zeros if necessary
    const padded = absStr.padStart(decimals, '0')
    const result = `0.${padded}`
    return Number(isNegative ? `-${result}` : result)
  }

  // Split into integer and fractional parts
  const intPart = absStr.slice(0, absStr.length - decimals) || '0'
  const fracPart = absStr.slice(absStr.length - decimals)
  const result = `${intPart}.${fracPart}`
  return Number(isNegative ? `-${result}` : result)
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
