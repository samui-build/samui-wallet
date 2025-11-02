const usdFormatters = new Map<string, Intl.NumberFormat>()

export function formatBalanceUsd({
  balance = 0,
  decimals = 2,
  usdPrice,
}: {
  balance: bigint | number | undefined
  decimals: number
  usdPrice: number
}): string {
  const usdValue = ((usdPrice ?? 0) * Number(balance)) / 10 ** decimals

  if (usdValue === 0) return '$0'

  if (usdValue >= 1) {
    return getUsdFormatter({
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(usdValue)
  }

  if (usdValue < 0.001) {
    return '<$0.001'
  }

  return getUsdFormatter({
    maximumSignificantDigits: 3,
    minimumFractionDigits: 0,
  }).format(usdValue)
}

function getUsdFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = JSON.stringify(options)
  if (!usdFormatters.has(key)) {
    usdFormatters.set(
      key,
      new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
        ...options,
      }),
    )
  }
  return usdFormatters.get(key)!
}
