export function determineNextName(items: { name: string }[], prefix: string): string {
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
    return `${prefix} 1`
  }

  const maxNumber = Math.max(...numbers)
  return `${prefix} ${maxNumber + 1}`
}
