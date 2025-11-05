export function balanceToNumber(balance: bigint, decimals: number): number {
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
