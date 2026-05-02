import { serialize } from 'superjson'

export function stringify(data: unknown | string): string {
  return typeof data === 'string' ? data : JSON.stringify(serialize(data).json, null, 2)
}
