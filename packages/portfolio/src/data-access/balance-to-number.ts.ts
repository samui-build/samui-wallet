export function balanceToNumber(balance: bigint, decimals: number): number {
  // Convert bigint to string for manipulation
  const balanceString = balance.toString()
  const isNegative = balance < 0n
  const absoluteString = isNegative ? balanceString.slice(1) : balanceString

  if (absoluteString.length <= decimals) {
    // Pad with leading zeros if necessary
    const padded = absoluteString.padStart(decimals, '0')
    const result = `0.${padded}`
    return Number(isNegative ? `-${result}` : result)
  }

  // Split into integer and fractional parts
  const intPart = absoluteString.slice(0, absoluteString.length - decimals) || '0'
  const fracPart = absoluteString.slice(absoluteString.length - decimals)
  const result = `${intPart}.${fracPart}`
  return Number(isNegative ? `-${result}` : result)
}
