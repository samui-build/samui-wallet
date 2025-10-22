export function formatBalanceUsd({
  balance = 0,
  decimals = 2,
  usdPrice,
}: {
  balance: bigint | number | undefined
  decimals: number
  usdPrice: number
}) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(((usdPrice ?? 0) * Number(balance)) / 10 ** decimals)
}
