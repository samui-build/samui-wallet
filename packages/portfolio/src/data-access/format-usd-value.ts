import { getUsdFormatter } from './get-usd-formatter.ts'

export function formatUsdValue(usdValue: number): string {
  if (!Number.isFinite(usdValue) || usdValue === 0) {
    return '$0.00'
  }

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

  return usdValue < 0 ? `-${formatted}` : formatted
}
