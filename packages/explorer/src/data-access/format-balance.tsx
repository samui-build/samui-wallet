import { bigIntToDecimal } from '@workspace/solana-client/big-int-to-decimal'

export function formatBalance({ balance = 0, decimals }: { balance: bigint | number | undefined; decimals: number }) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(bigIntToDecimal(balance, decimals))
}
