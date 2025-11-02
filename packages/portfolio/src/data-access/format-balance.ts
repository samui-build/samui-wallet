const formatters = new Map<string, Intl.NumberFormat>()

export function formatBalance({
  balance = 0,
  decimals,
}: {
  balance: bigint | number | undefined
  decimals: number
}): string {
  const balanceNum = typeof balance === 'bigint' ? balance : BigInt(balance || 0)

  if (balanceNum === 0n) return '0'

  if (balanceNum < 0n) {
    return `-${formatBalance({ balance: -balanceNum, decimals })}`
  }

  const balanceFloat = Number(balanceNum) / 10 ** decimals

  if (balanceFloat >= 1_000_000_000_000) {
    return `${formatTokenValue(balanceFloat / 1_000_000_000_000, 2)}T`
  }

  if (balanceFloat >= 1_000_000_000) {
    return `${formatTokenValue(balanceFloat / 1_000_000_000, 2)}B`
  }

  if (balanceFloat >= 1_000_000) {
    return `${formatTokenValue(balanceFloat / 1_000_000, 2)}M`
  }

  if (balanceFloat < 0.00001) {
    return '<0.00001'
  }

  const maxFractionDigits = Math.min(6, decimals)
  return formatTokenValue(balanceFloat, maxFractionDigits)
}

function formatTokenValue(value: number, maxFractionDigits: number): string {
  const formatter = getFormatter({
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  })
  return formatter.format(value)
}

function getFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = JSON.stringify(options)
  if (!formatters.has(key)) {
    formatters.set(key, new Intl.NumberFormat('en-US', options))
  }
  return formatters.get(key)!
}
