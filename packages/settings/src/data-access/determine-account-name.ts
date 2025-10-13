export function determineAccountName(items: { name: string }[]): string {
  const numbers = items
    .map((account) => {
      const match = account.name.match(/^Account (\d+)$/)
      if (match && match[1]) {
        return parseInt(match[1], 10)
      }
      return null
    })
    .filter((num): num is number => num !== null)

  if (numbers.length === 0) {
    return `Account 1`
  }

  return `Account ${Math.max(...numbers) + 1}`
}
