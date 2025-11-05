const tokenFormatters = new Map<string, Intl.NumberFormat>()

export function formatBalance({ balance, decimals }: { balance: bigint; decimals: number }): string {
  if (balance === 0n) {
    return '0'
  }

  if (balance < 0n) {
    return `-${formatBalance({ balance: -balance, decimals })}`
  }

  const value = balanceToNumber(balance, decimals)

  // Show threshold for very small amounts instead of 0
  if (value < 0.00001 && value > 0) {
    return '<0.00001'
  }

  // Use standard suffixes for large numbers eg 1.23M, 4.56B, 7.89T
  if (value >= 1_000_000_000_000) {
    const scaled = value / 1_000_000_000_000
    return `${getTokenFormatter({ maximumFractionDigits: 2 }).format(scaled)}T`
  }

  if (value >= 1_000_000_000) {
    const scaled = value / 1_000_000_000
    return `${getTokenFormatter({ maximumFractionDigits: 2 }).format(scaled)}B`
  }

  if (value >= 1_000_000) {
    const scaled = value / 1_000_000
    return `${getTokenFormatter({ maximumFractionDigits: 2 }).format(scaled)}M`
  }

  // Standard token formatting with up to 5 decimals
  return getTokenFormatter({
    maximumFractionDigits: 5,
    minimumFractionDigits: 0,
  }).format(value)
}

// Convert balance from raw units to decimal number with precision handling
function balanceToNumber(balance: bigint, decimals: number): number {
  // Use string manipulation for large bigints to avoid precision loss
  const balanceStr = balance.toString()
  const isNegative = balance < 0n
  const absStr = isNegative ? balanceStr.slice(1) : balanceStr

  if (absStr.length <= decimals) {
    // Small number, pad with zeros
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

function getTokenFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  // Build efficient cache key from the options we actually use
  const key = `${options.maximumFractionDigits ?? ''}-${options.minimumFractionDigits ?? ''}`
  let formatter = tokenFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', options)
    tokenFormatters.set(key, formatter)
  }
  return formatter
}
