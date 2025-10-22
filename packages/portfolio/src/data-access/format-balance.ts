export function formatBalance({ balance = 0, decimals }: { balance: bigint | number | undefined; decimals: number }) {
  const balanceString = balance.toString()
  const integerPart = balanceString.length > decimals ? balanceString.slice(0, balanceString.length - decimals) : '0'
  const fractionalPart = balanceString.padStart(decimals, '0').slice(-decimals)
  return `${integerPart}.${fractionalPart}`
}
