import { bigIntToDecimal } from '@workspace/solana-client/big-int-to-decimal'

export function formatBalanceUsd({
  balance = 0,
  decimals = 2,
  usdPrice,
}: {
  balance: bigint | number | undefined
  decimals: number
  usdPrice: number
}) {
  const value = bigIntToDecimal(balance, decimals) * (usdPrice ?? 0)

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
}
