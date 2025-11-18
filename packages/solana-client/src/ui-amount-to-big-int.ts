export function uiAmountToBigInt(amount: string, decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error(`Decimals must be a non-negative integer: ${decimals}`)
  }
  const parsedAmount = parseFloat(amount)
  if (Number.isNaN(parsedAmount)) {
    throw new Error(`Could not parse amount: ${String(amount)}`)
  }
  if (parsedAmount < 0) {
    throw new Error(`Amount cannot be negative: ${String(amount)}`)
  }
  const formatter = new Intl.NumberFormat('en-US', { useGrouping: false })
  return BigInt(
    // @ts-expect-error - scientific notation is supported by `Intl.NumberFormat` but the types are wrong
    formatter.format(`${amount}E${decimals}`).split('.')[0],
  )
}
