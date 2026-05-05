export function formatSimulationFailure(error: unknown, logs: string[] = []): string {
  const formattedError = formatUnknownError(error)
  const parts = formattedError ? [formattedError] : []
  parts.push(...logs)
  return parts.join('\n')
}

function formatUnknownError(error: unknown): string {
  if (!error) {
    return ''
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }

  try {
    return JSON.stringify(error, (_key, value) => (typeof value === 'bigint' ? value.toString() : value), 2)
  } catch {
    return `${error}`
  }
}
