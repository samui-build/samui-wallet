export function bigIntToDecimal(value: bigint | number, decimals: number): number {
  return Number(value) / 10 ** decimals
}
