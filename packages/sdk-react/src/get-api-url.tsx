export function getApiUrl(endpoint: null | string, path: string) {
  if (!endpoint) {
    return null
  }
  const result = new URL(endpoint)
  result.pathname = path
  return result.toString()
}
