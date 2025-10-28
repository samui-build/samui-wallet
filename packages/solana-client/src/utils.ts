export const tokenAmountToTransferAmount = (amount: string, decimals: number): bigint => {
  if (Number.isNaN(parseFloat(amount))) {
    throw new Error('Could not parse token quantity: ' + String(amount))
  }
  const formatter = new Intl.NumberFormat('en-US', { useGrouping: false })
  const bigIntAmount = BigInt(
    // @ts-expect-error - scientific notation is supported by `Intl.NumberFormat` but the types are wrong
    formatter.format(`${amount}E${decimals}`).split('.')[0],
  )
  return bigIntAmount
}
