import { getUsdFormatter } from './get-usd-formatter.ts'

export function formatUsdValue(usdValue: number): string {
  if (!Number.isFinite(usdValue) || usdValue === 0) {
    return '$0.00'
  }

  // Handle negative values by working with absolute amount then applying sign
  const isNegative = usdValue < 0
  const absoluteValue = Math.abs(usdValue)

  // Show threshold for sub-cent amounts instead of $0.00
  if (absoluteValue < 0.01 && absoluteValue > 0) {
    return '<$0.01'
  }

  // Format to 2 decimal places like traditional currency eg $123.45, $0.99
  const formatted = getUsdFormatter({
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(absoluteValue)

  return isNegative ? `-${formatted}` : formatted
}
