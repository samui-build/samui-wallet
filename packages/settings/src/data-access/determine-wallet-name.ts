export function determineWalletName(items: { name: string }[]): string {
  const numbers = items
    .map((wallet) => {
      const match = wallet.name.match(/^Wallet (\d+)$/)
      if (match?.[1]) {
        return parseInt(match[1], 10)
      }
      return null
    })
    .filter((num): num is number => num !== null)

  if (numbers.length === 0) {
    return `Wallet 1`
  }

  return `Wallet ${Math.max(...numbers) + 1}`
}
