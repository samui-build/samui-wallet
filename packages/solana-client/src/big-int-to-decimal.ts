export function bigIntToDecimal(value: bigint | number | undefined, decimals: number): number {
  if (value == null) {
    return 0
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error(`Decimals must be a non-negative integer: ${decimals}`)
  }
  return Number(value) / 10 ** decimals
}
