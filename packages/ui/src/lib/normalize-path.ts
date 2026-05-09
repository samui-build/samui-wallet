export function normalizePath(path: string) {
  const normalizedPath = path.replace(/\/+$/, '')

  return normalizedPath || '/'
}
